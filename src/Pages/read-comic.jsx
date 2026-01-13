import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight, faHome, faBookOpen, faExpand } from '@fortawesome/free-solid-svg-icons';
import SEO from '../components/SEO';

const ReadComic = () => {
    const navigate = useNavigate();
    const { slug, chapterSlug } = useParams();
    const location = useLocation();
    
    const { 
        chapterLink, 
        comicTitle, 
        chapterNumber,
        comicDetailState
    } = location.state || {};
    
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [currentChapters, setCurrentChapters] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [navigation, setNavigation] = useState({
        previousChapter: null,
        nextChapter: null,
    });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const comicContainerRef = useRef(null);
    
    // Reader UI visibility states
    const [isUIVisible, setIsUIVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [manualOverride, setManualOverride] = useState(false);
    const manualOverrideTimeoutRef = useRef(null);

    const saveHistory = useCallback((comicData) => {
        try {
            const history = JSON.parse(localStorage.getItem('comicHistory')) || {};
            
            history[slug] = {
                title: comicData.comicTitle,
                image: comicDetailState?.comic?.image,
                lastChapter: comicData.chapterNumber,
                lastChapterLink: comicData.chapterLink,
                lastChapterSlug: chapterSlug,
                readDate: new Date().toISOString(),
                comicDataForDetail: comicDetailState,
            };
            localStorage.setItem('comicHistory', JSON.stringify(history));
        } catch (e) {
            console.error("Error saving history to local storage", e);
        }
    }, [slug, chapterSlug, comicDetailState]);

    useEffect(() => {
        const fetchChapterPages = async () => {
            if (!chapterLink) {
                setError(new Error('No chapter link provided'));
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            setPages([]);
            setNavigation({ previousChapter: null, nextChapter: null });
            window.scrollTo(0, 0); 

            try {
                const response = await axios.get(`https://www.sankavollerei.com/comic/chapter${chapterLink}`);
                
                const chapters = response.data.chapters || [];
                const images = response.data.images || [];
                const navData = response.data.navigation || { previousChapter: null, nextChapter: null };

                setPages(images);
                setCurrentChapters(chapters);
                setNavigation(navData);
                
                if (chapters.length > 0) {
                    const chapterIndex = chapters.findIndex(
                        ch => String(ch.chapter) === String(chapterNumber)
                    );

                    setCurrentChapterIndex(chapterIndex !== -1 ? chapterIndex : 0);
                } else {
                    setCurrentChapterIndex(0);
                }
                
                setLoading(false);

                saveHistory({ 
                    chapterLink, 
                    comicTitle, 
                    chapterNumber,
                });

            } catch (err) {
                setError(err);
                setLoading(false);
                setPages([
                    'https://picsum.photos/800/1200?random=1',
                    'https://picsum.photos/800/1200?random=2',
                    'https://picsum.photos/800/1200?random=3',
                    'https://picsum.photos/800/1200?random=4'
                ]);
            }
        };

        fetchChapterPages();
    }, [chapterLink, chapterNumber, comicTitle, saveHistory]);

    // Helper function to extract clean chapter number from API slug
    const extractChapterNumber = (apiSlug) => {
        if (!apiSlug) return null;
        
        // Try to match patterns like:
        // "comic-name-chapter-30" -> "30"
        // "comic-name-chapter-30.5" -> "30.5"
        // "chapter-30" -> "30"
        const chapterMatch = apiSlug.match(/chapter[- ]?(\d+(?:\.\d+)?)/i);
        if (chapterMatch) {
            return chapterMatch[1];
        }
        
        // Fallback: get the last number in the string
        const numbers = apiSlug.match(/\d+(?:\.\d+)?/g);
        if (numbers && numbers.length > 0) {
            return numbers[numbers.length - 1];
        }
        
        return null;
    };

    // Scroll handler for UI visibility
    const handleScrollVisibility = useCallback(() => {
        if (manualOverride) return;
        
        const container = isFullscreen ? comicContainerRef.current : document.documentElement;
        if (!container) return;

        const currentScrollY = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const isAtBottom = currentScrollY + clientHeight >= scrollHeight - 100; // 100px threshold
        const isAtTop = currentScrollY < 50;
        const isScrollingDown = currentScrollY > lastScrollY;
        
        if (isAtBottom || isAtTop) {
            // Show UI when at top or bottom
            setIsUIVisible(true);
        } else if (isScrollingDown && currentScrollY > 100) {
            // Hide UI when scrolling down (after scrolling past 100px)
            setIsUIVisible(false);
        } else if (!isScrollingDown && currentScrollY < lastScrollY - 50) {
            // Show UI when scrolling up significantly
            setIsUIVisible(true);
        }
        
        setLastScrollY(currentScrollY);
    }, [isFullscreen, lastScrollY, manualOverride]);

    useEffect(() => {
        const handleScroll = () => {
            const container = isFullscreen ? comicContainerRef.current : document.documentElement;
            if (!container) return;

            const winScroll = container.scrollTop;
            const height = container.scrollHeight - container.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            setScrollProgress(scrolled);
            
            // Handle UI visibility
            handleScrollVisibility();
        };

        const scrollableElement = isFullscreen ? comicContainerRef.current : window;
        if (scrollableElement) {
            scrollableElement.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (scrollableElement) {
                scrollableElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isFullscreen, handleScrollVisibility]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Cleanup manual override timeout on unmount
    useEffect(() => {
        return () => {
            if (manualOverrideTimeoutRef.current) {
                clearTimeout(manualOverrideTimeoutRef.current);
            }
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            comicContainerRef.current.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Toggle UI visibility on tap/click
    const handleReadingAreaClick = (e) => {
        // Don't toggle if clicking on buttons, links, or other interactive elements
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('[role="button"]')) {
            return;
        }
        
        setIsUIVisible(prev => !prev);
        setManualOverride(true);
        
        // Clear any existing timeout
        if (manualOverrideTimeoutRef.current) {
            clearTimeout(manualOverrideTimeoutRef.current);
        }
        
        // Reset manual override after 3 seconds to allow scroll behavior to take over again
        manualOverrideTimeoutRef.current = setTimeout(() => {
            setManualOverride(false);
        }, 3000);
    };

    const handleBack = () => {
        navigate(`/detail-comic/${slug}`, {
            state: comicDetailState
        });
    };

    const handleNextChapter = () => {
        const nextChapterSlug = navigation.nextChapter;
        if (nextChapterSlug) {
            // Extract clean chapter number from API response
            const newChapterNumber = extractChapterNumber(nextChapterSlug);
            
            if (!newChapterNumber) {
                console.error('Could not extract chapter number from:', nextChapterSlug);
                return;
            }
            
            // Format chapterSlug consistently as "chapter-{number}"
            const formattedChapterSlug = `chapter-${newChapterNumber}`;
            
            // Format chapterLink for API call (needs leading and trailing slashes)
            const apiChapterLink = nextChapterSlug.startsWith('/') ? nextChapterSlug : `/${nextChapterSlug}/`;
            
            navigate(`/read-comic/${slug}/${formattedChapterSlug}`, { 
                state: { 
                    chapterLink: apiChapterLink,
                    comicTitle: comicTitle, 
                    chapterNumber: newChapterNumber,
                    comicDetailState: comicDetailState
                } 
            });
        }
    };

    const handlePrevChapter = () => {
        const prevChapterSlug = navigation.previousChapter;
        if (prevChapterSlug) {
            // Extract clean chapter number from API response
            const newChapterNumber = extractChapterNumber(prevChapterSlug);
            
            if (!newChapterNumber) {
                console.error('Could not extract chapter number from:', prevChapterSlug);
                return;
            }
            
            // Format chapterSlug consistently as "chapter-{number}"
            const formattedChapterSlug = `chapter-${newChapterNumber}`;

            // Format chapterLink for API call (needs leading and trailing slashes)
            const apiChapterLink = prevChapterSlug.startsWith('/') ? prevChapterSlug : `/${prevChapterSlug}/`;

            navigate(`/read-comic/${slug}/${formattedChapterSlug}`, { 
                state: { 
                    chapterLink: apiChapterLink,
                    comicTitle: comicTitle, 
                    chapterNumber: newChapterNumber,
                    comicDetailState: comicDetailState 
                } 
            });
        }
    };

    if (loading) {
        return (
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen flex flex-col justify-center items-center transition-colors">
                <div className="relative mb-4">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">Memuat Chapter...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen transition-colors">
                <div className="flex justify-center items-center min-h-screen p-4">
                    <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-sm max-w-md">
                        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h2>
                        <p className="text-red-300 mb-6">{error.message}</p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasNext = !!navigation.nextChapter;
    const hasPrev = !!navigation.previousChapter;

    return (
        <div 
            ref={comicContainerRef} 
            className={`relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen transition-colors ${isFullscreen ? 'overflow-y-auto' : ''}`}
        >
            <SEO 
                title={`Baca Komik ${comicTitle} Chapter ${chapterNumber} Bahasa Indonesia`}
                description={`Baca manhwa/komik ${comicTitle} Chapter ${chapterNumber} bahasa Indonesia gratis dan berkualitas tinggi di Komikcast.`}
                image={comicDetailState?.comic?.image}
                url={`https://komikcast.co.id/read-comic/${slug}/${chapterSlug}`}
                keywords={`baca komik ${comicTitle}, ${comicTitle} chapter ${chapterNumber}, komikcast ${comicTitle}`}
            />
            
            {/* Top Navigation Bar - Auto-hide on scroll */}
            <div 
                className={`fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                    isFullscreen ? 'hidden' : ''
                } ${
                    isUIVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        {/* Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-semibold p-2 -ml-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span className="hidden sm:inline">Kembali</span>
                        </button>

                        {/* Title */}
                        <div className="flex items-center gap-2 flex-1 justify-center mx-2 sm:mx-4 min-w-0">
                            <FontAwesomeIcon icon={faBookOpen} className="text-indigo-600 dark:text-indigo-400 hidden sm:inline flex-shrink-0" />
                            <h2 className="text-xs sm:text-sm md:text-base font-bold text-center truncate text-gray-900 dark:text-white">
                                <span className="hidden sm:inline">{comicTitle} - </span>
                                <span className="text-indigo-600 dark:text-indigo-400">Ch. {chapterNumber || 'Unknown'}</span>
                            </h2>
                        </div>

                        {/* Right Buttons */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleFullscreen}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-2"
                            >
                                <FontAwesomeIcon icon={faExpand} />
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors p-2"
                            >
                                <FontAwesomeIcon icon={faHome} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 dark:bg-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-150"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>
            </div>

            {/* Comic Pages - Clickable to toggle UI */}
            <div 
                className={`pb-24 ${isFullscreen ? 'pt-0' : 'pt-[72px] sm:pt-[76px]'}`}
                onClick={handleReadingAreaClick}
            >
                <div className="max-w-4xl mx-auto">
                    {pages.map((page, index) => (
                        <div key={index} className="relative">
                            <img
                                src={page}
                                alt={`Halaman ${index + 1}`}
                                width="800"
                                height="1200"
                                loading={index < 2 ? "eager" : "lazy"}
                                decoding="async"
                                className="w-full h-auto object-contain block"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation Bar - Auto-hide on scroll */}
            <div 
                className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl z-50 border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ${
                    isFullscreen ? 'hidden' : ''
                } ${
                    isUIVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-3 sm:py-4 gap-2 sm:gap-4">
                        {/* Previous Chapter Button */}
                        <button
                            onClick={handlePrevChapter}
                            disabled={!hasPrev}
                            className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                                hasPrev
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 hover:scale-105'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <span className="hidden sm:inline">Previous</span>
                        </button>

                        {/* Chapter Info */}
                        <div className="text-center min-w-0">
                            <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">Ch. {chapterNumber}</p>
                        </div>

                        {/* Next Chapter Button */}
                        <button
                            onClick={handleNextChapter}
                            disabled={!hasNext}
                            className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                                hasNext
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50 hover:scale-105'
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Tap hint - shows briefly when UI is hidden */}
            {!isUIVisible && !isFullscreen && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full animate-pulse z-40">
                    Tap to show controls
                </div>
            )}
        </div>
    );
};

export default ReadComic;