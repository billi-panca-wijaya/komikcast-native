import { useState, useEffect, useCallback } from 'react';

const BAN_STORAGE_KEY = 'komikcast_ban_info';
const BAN_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

/**
 * Custom hook to protect against DevTools access
 * Blocks: right-click, F12, Ctrl+U, Ctrl+Shift+I/J/C
 */
export function useDevToolsProtection() {
  const [isBanned, setIsBanned] = useState(false);
  const [banEndTime, setBanEndTime] = useState(null);
  const [violations, setViolations] = useState(0);

  // Check if user is currently banned
  const checkBanStatus = useCallback(() => {
    try {
      const banInfo = localStorage.getItem(BAN_STORAGE_KEY);
      if (banInfo) {
        const { endTime } = JSON.parse(banInfo);
        if (Date.now() < endTime) {
          setIsBanned(true);
          setBanEndTime(endTime);
          return true;
        } else {
          // Ban expired, clear it
          localStorage.removeItem(BAN_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Error checking ban status:', e);
    }
    return false;
  }, []);

  // Ban the user
  const banUser = useCallback(() => {
    const endTime = Date.now() + BAN_DURATION_MS;
    const banInfo = { endTime, reason: 'DevTools access attempt' };
    
    try {
      localStorage.setItem(BAN_STORAGE_KEY, JSON.stringify(banInfo));
    } catch (e) {
      console.error('Error setting ban:', e);
    }
    
    setIsBanned(true);
    setBanEndTime(endTime);
  }, []);

  // Handle violation detection
  const handleViolation = useCallback(() => {
    setViolations(prev => {
      const newCount = prev + 1;
      // Ban after 3 violations (give 3 chances)
      if (newCount >= 3) {
        banUser();
      }
      return newCount;
    });
  }, [banUser]);

  // Block right-click
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      handleViolation();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [handleViolation]);

  // Block keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        handleViolation();
        return false;
      }

      // Ctrl + U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        handleViolation();
        return false;
      }

      // Ctrl + Shift + I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        handleViolation();
        return false;
      }

      // Ctrl + Shift + J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        handleViolation();
        return false;
      }

      // Ctrl + Shift + C (Inspector)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        handleViolation();
        return false;
      }

      // Ctrl + S (Save)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleViolation]);

  // Check ban status on mount
  useEffect(() => {
    checkBanStatus();
  }, [checkBanStatus]);

  // Update ban status periodically (check if ban expired)
  useEffect(() => {
    if (!isBanned) return;

    const interval = setInterval(() => {
      if (banEndTime && Date.now() >= banEndTime) {
        setIsBanned(false);
        setBanEndTime(null);
        localStorage.removeItem(BAN_STORAGE_KEY);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBanned, banEndTime]);

  return { isBanned, timeRemaining: banEndTime ? Math.max(0, banEndTime - Date.now()) : 0, violations, maxViolations: 3 };
}

export default useDevToolsProtection;
