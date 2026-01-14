import React from 'react';
import GridScan from './GridScan';

/**
 * GridScanBackground - Fixed position background with 3D grid scan effect
 * This component renders the GridScan effect as a full-screen
 * background with proper z-index to stay behind all content.
 */
const GridScanBackground = () => {
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
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(13, 17, 23, 0.95) 50%, rgba(10, 10, 20, 0.95) 100%)',
      }}
    >
      {/* Enable pointer events for the canvas so grid reacts to mouse */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto',
          opacity: 0.9,
        }}
      >
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#0d3d3d"
          gridScale={0.1}
          scanColor="#14b8a6"
          scanOpacity={0.5}
          enablePost={true}
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          scanDuration={2.5}
          scanDelay={1.5}
        />
      </div>
    </div>
  );
};

export default GridScanBackground;
