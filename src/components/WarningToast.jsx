import { useState, useEffect } from 'react';
import './WarningToast.css';

export default function WarningToast({ violations, maxViolations }) {
  const [show, setShow] = useState(false);
  const [currentViolation, setCurrentViolation] = useState(0);

  useEffect(() => {
    if (violations > 0 && violations < maxViolations) {
      setCurrentViolation(violations);
      setShow(true);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [violations, maxViolations]);

  if (!show) return null;

  const remainingChances = maxViolations - currentViolation;
  const isLastWarning = remainingChances === 1;

  return (
    <div className={`warning-toast ${isLastWarning ? 'warning-toast--critical' : ''}`}>
      <div className="warning-toast__icon">
        {isLastWarning ? '🚨' : '⚠️'}
      </div>
      <div className="warning-toast__content">
        <div className="warning-toast__title">
          {isLastWarning ? 'PERINGATAN TERAKHIR!' : 'PERINGATAN!'}
        </div>
        <div className="warning-toast__message">
          {isLastWarning 
            ? 'Satu pelanggaran lagi dan akses Anda akan diblokir selama 12 jam!'
            : `Aksi terlarang terdeteksi! Sisa kesempatan: ${remainingChances}`
          }
        </div>
        <div className="warning-toast__progress">
          {[...Array(maxViolations)].map((_, i) => (
            <div 
              key={i} 
              className={`warning-toast__dot ${i < currentViolation ? 'warning-toast__dot--filled' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
