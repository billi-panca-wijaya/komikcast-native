import React, { useState, useEffect } from 'react';

const GlobalErrorNotification = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [opacity, setOpacity] = useState("opacity-0");

    useEffect(() => {
        // Fade in
        const fadeInTimer = setTimeout(() => {
            setOpacity("opacity-100");
        }, 100);

        // Fade out
        const fadeOutTimer = setTimeout(() => {
            setOpacity("opacity-0");
        }, 4000);

        // Remove from DOM
        const removeTimer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className={`fixed top-0 left-0 right-0 z-[60] transition-opacity duration-1000 ease-in-out ${opacity}`}>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-start md:items-center justify-between gap-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5 md:mt-0">
                            <svg className="h-5 w-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-sm md:text-base font-medium">
                            <p>
                                Jika Anda mengalami error 403 atau komik tidak muncul, atau jika IP Anda disuspend atau terkunci, harap segera hubungi kami melalui Telegram di{' '}
                                <a 
                                    href="https://t.me/mrbuhuy" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="underline decoration-white/50 hover:decoration-white font-bold hover:text-orange-100 transition-colors"
                                >
                                    https://t.me/mrbuhuy
                                </a>
                            </p>
                            <p className="mt-1 text-xs md:text-sm text-orange-100">
                                Atau bisa cek cara nya di bawah bagian FAQ Kami akan membantu Anda untuk mem-whitelist IP Anda dan memastikan akses kembali lancar.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 -mr-1 p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
                        aria-label="Dismiss"
                    >
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GlobalErrorNotification;
