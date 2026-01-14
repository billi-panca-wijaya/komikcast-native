import React, { useEffect, useRef, useState } from 'react';

const TurnstileWidget = ({ onVerify, theme = 'dark' }) => {
  const containerRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const widgetId = useRef(null);

  useEffect(() => {
    // Check if Turnstile SDK is loaded
    if (window.turnstile) {
      setIsSdkLoaded(true);
    } else {
      // Setup interval to check for SDK
      const interval = setInterval(() => {
        if (window.turnstile) {
          setIsSdkLoaded(true);
          clearInterval(interval);
        }
      }, 100);

      // Timeout after 10 seconds
      const timeout = setTimeout(() => clearInterval(interval), 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(() => {
    if (isSdkLoaded && containerRef.current && !widgetId.current) {
      // Render widget
      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: import.meta.env.VITE_CLOUDFLARE_SITE_KEY,
          theme: theme,
          callback: (token) => {
            console.log('Turnstile verified:', token);
            if (onVerify) onVerify(token);
          },
          'error-callback': (err) => {
            console.error('Turnstile error:', err);
          },
        });
        widgetId.current = id;
      } catch (error) {
        console.error('Error rendering Turnstile:', error);
      }
    }

    // Cleanup
    return () => {
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
          widgetId.current = null;
        } catch (e) {
          // Ignore removal errors
        }
      }
    };
  }, [isSdkLoaded, theme, onVerify]);

  return (
    <div className="flex justify-center my-4">
      <div ref={containerRef} className="min-h-[65px] min-w-[300px]" />
    </div>
  );
};

export default TurnstileWidget;
