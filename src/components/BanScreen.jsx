import { useState, useEffect, useRef } from 'react';
import './BanScreen.css';

/**
 * Animated Ban Screen with eyes following cursor
 * Displays when user attempts to access DevTools
 */
function BanScreen({ timeRemaining }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [eyeRotation, setEyeRotation] = useState({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);

  // Format time remaining
  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Calculate eye pupil positions based on mouse
  useEffect(() => {
    const calculateEyePosition = (eyeRef) => {
      if (!eyeRef.current) return { x: 0, y: 0 };

      const eye = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;

      const angle = Math.atan2(mousePos.y - eyeCenterY, mousePos.x - eyeCenterX);
      const distance = Math.min(
        Math.hypot(mousePos.x - eyeCenterX, mousePos.y - eyeCenterY) / 15,
        12
      );

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      };
    };

    setEyeRotation({
      left: calculateEyePosition(leftEyeRef),
      right: calculateEyePosition(rightEyeRef),
    });
  }, [mousePos]);

  // Generate particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="ban-screen">
      {/* Animated background */}
      <div className="ban-bg-grid"></div>
      <div className="ban-bg-glow"></div>
      
      {/* Floating particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="ban-content">
        {/* Mascot with eyes */}
        <div className="mascot-container">
          <div className="mascot-body">
            {/* Face */}
            <div className="mascot-face">
              {/* Eyes */}
              <div className="eyes-container">
                <div className="eye left-eye" ref={leftEyeRef}>
                  <div className="eye-white">
                    <div
                      className="pupil"
                      style={{
                        transform: `translate(${eyeRotation.left.x}px, ${eyeRotation.left.y}px)`,
                      }}
                    >
                      <div className="pupil-shine"></div>
                    </div>
                  </div>
                </div>
                <div className="eye right-eye" ref={rightEyeRef}>
                  <div className="eye-white">
                    <div
                      className="pupil"
                      style={{
                        transform: `translate(${eyeRotation.right.x}px, ${eyeRotation.right.y}px)`,
                      }}
                    >
                      <div className="pupil-shine"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Angry eyebrows */}
              <div className="eyebrows">
                <div className="eyebrow left-eyebrow"></div>
                <div className="eyebrow right-eyebrow"></div>
              </div>
              
              {/* Mouth - angry/disappointed */}
              <div className="mouth">
                <div className="mouth-line"></div>
              </div>
            </div>
            
            {/* Body elements */}
            <div className="mascot-shield">
              <svg viewBox="0 0 24 24" fill="none" className="shield-icon">
                <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" fill="currentColor"/>
                <path d="M10 12L9 13L11 15L15 11L14 10L11 13L10 12Z" fill="#0a0a0a"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Glitch text */}
        <div className="ban-text-container">
          <h1 className="ban-title glitch" data-text="AKSES DIBLOKIR">
            AKSES DIBLOKIR
          </h1>
          <p className="ban-subtitle">
            <span className="warning-icon">⚠️</span>
            Anda telah melanggar aturan keamanan website
          </p>
        </div>

        {/* Timer */}
        <div className="ban-timer-container">
          <p className="timer-label">Akses akan dipulihkan dalam:</p>
          <div className="timer-display">
            <div className="timer-digits">
              {formatTime(timeRemaining).split('').map((char, i) => (
                <span key={i} className={char === ':' ? 'timer-colon' : 'timer-digit'}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Warning message */}
        <div className="ban-message">
          <p>Mengakses developer tools atau mencoba melihat source code</p>
          <p>adalah pelanggaran terhadap ketentuan layanan kami.</p>
        </div>

        {/* Decorative elements */}
        <div className="corner-decoration top-left"></div>
        <div className="corner-decoration top-right"></div>
        <div className="corner-decoration bottom-left"></div>
        <div className="corner-decoration bottom-right"></div>
      </div>

      {/* Scan lines effect */}
      <div className="scan-lines"></div>
    </div>
  );
}

export default BanScreen;
