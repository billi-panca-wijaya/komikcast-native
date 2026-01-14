import React from 'react';
import Antigravity from './Antigravity';

/**
 * AntigravityBackground - Fixed position background with particle effect
 * This component renders the Antigravity particle effect as a full-screen
 * background with proper z-index to stay behind all content.
 */
const AntigravityBackground = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        // Keep background not too dark - semi-transparent overlay
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.85) 0%, rgba(18, 18, 30, 0.9) 50%, rgba(10, 10, 20, 0.85) 100%)',
      }}
    >
      {/* Enable pointer events only for the canvas so particles react to mouse */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto',
          opacity: 0.8, // Slightly transparent to not be too overwhelming
        }}
      >
        <Antigravity
          magnetRadius={7}
          ringRadius={5}
          waveSpeed={2}
          waveAmplitude={2}
          particleSize={0.5}
          count={2400}
          color="#29fff1"
          fieldStrength={13}
          autoAnimate={true}
        />
      </div>
    </div>
  );
};

export default AntigravityBackground;
