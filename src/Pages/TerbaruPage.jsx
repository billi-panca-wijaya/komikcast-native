import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../components/SkeletonLoader'
import SEO from '../components/SEO'
import GenreList from '../components/GenreList'

const COMICS_PER_PAGE = 15
const API_PAGES_PER_VIEW = 2 // Fetch 2 API pages per view page

const TerbaruPage = () => {
    const [comics, setComics] = useState([])
    const [loading, setLoading] = useState(true)
    const [isPageLoading, setIsPageLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [hoveredSidebar, setHoveredSidebar] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMorePages, setHasMorePages] = useState(true)
    const [animationKey, setAnimationKey] = useState(0) // Reset animations on page change

    const navigate = useNavigate()

    const fetchComicsForPage = useCallback(async (page) => {
        try {
            // Calculate which API pages to fetch
            // Page 1 → API pages 1-2, Page 2 → API pages 3-4, etc.
            const startApiPage = (page - 1) * API_PAGES_PER_VIEW + 1
            const apiPages = Array.from(
                { length: API_PAGES_PER_VIEW }, 
                (_, i) => startApiPage + i
            )

            const responses = await Promise.all(
                apiPages.map(apiPage => 
                    axios.get(`https://www.sankavollerei.com/comic/terbaru?page=${apiPage}`)
                        .catch(() => ({ data: { comics: [] } }))
                )
            )

            const allRawComics = responses.flatMap(response => response.data.comics || [])

            // Remove duplicates
            const uniqueComics = allRawComics.filter((comic, index, self) =>
                index === self.findIndex(c => c.title === comic.title)
            )

            const filteredComics = uniqueComics.filter(item => 
                !item.title.toLowerCase().includes('apk') && 
                !item.chapter.toLowerCase().includes('download')
            )
            
            const processedComics = filteredComics.map(comic => {
                const slug = comic.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                const link = comic.link.replace('/manga/', '/').replace('/plus/', '/');

                const imageUrl = comic.image && !comic.image.includes('lazy.jpg')
                    ? comic.image
                    : 'https://via.placeholder.com/300x450?text=Cover+Terbaru';
                
                return {
                    ...comic,
                    image: imageUrl,
                    processedLink: link,
                    slug: slug,
                    source: 'Terbaru', 
                    popularity: 'N/A'   
                }
            })

            // Check if there are more pages
            const hasMore = processedComics.length >= COMICS_PER_PAGE
            setHasMorePages(hasMore)

            // Return limited comics for display
            return processedComics.slice(0, COMICS_PER_PAGE)

        } catch (err) {
            console.error("Error fetching terbaru comics:", err)
            throw err
        }
    }, [])

    // Initial load
    useEffect(() => {
        const loadInitialComics = async () => {
            try {
                setLoading(true)
                const initialComics = await fetchComicsForPage(1)
                setComics(initialComics)
                setLoading(false)
            } catch (err) {
                setError(err)
                setLoading(false)
            }
        }
        loadInitialComics()
    }, [fetchComicsForPage])

    // Handle page change
    const handlePageChange = async (newPage) => {
        if (isPageLoading) return
        if (newPage < 1) return
        if (newPage > currentPage && !hasMorePages) return

        setIsPageLoading(true)
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })

        try {
            const newComics = await fetchComicsForPage(newPage)
            setComics(newComics)
            setCurrentPage(newPage)
            setAnimationKey(prev => prev + 1) // Trigger re-animation
        } catch (err) {
            console.error("Error changing page:", err)
        } finally {
            setIsPageLoading(false)
        }
    }

    const handleComicDetail = (comic) => {
        navigate(`/detail-comic/${comic.slug}`, { 
            state: { 
                comic: {
                    title: comic.title,
                    image: comic.image,
                    chapter: comic.chapter,
                    source: comic.source, 
                    popularity: comic.popularity
                },
                processedLink: comic.processedLink 
            } 
        })
    }


    // Filter comics based on search
    const filteredComics = comics.filter(comic =>
        comic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sidebar comics (only from current page when not searching)
    const sidebarComics = searchQuery ? filteredComics.slice(0, 10) : comics.slice(0, 10)

    // Pagination Button Component
    const PaginationButton = ({ direction, onClick, disabled }) => {
        const isNext = direction === 'next'
        
        return (
            <button
                onClick={onClick}
                disabled={disabled || isPageLoading}
                className={`
                    group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                    transition-all duration-300 ease-out
                    ${disabled || isPageLoading
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95'
                    }
                `}
            >
                {/* Shimmer effect on hover */}
                {!disabled && !isPageLoading && (
                    <span className="absolute inset-0 rounded-xl overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </span>
                )}
                
                {!isNext && (
                    <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${!disabled && !isPageLoading ? 'group-hover:-translate-x-1' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                )}
                
                <span className="relative z-10">
                    {isPageLoading 
                        ? 'Loading...' 
                        : isNext ? 'Selanjutnya' : 'Sebelumnya'
                    }
                </span>
                
                {isNext && (
                    <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${!disabled && !isPageLoading ? 'group-hover:translate-x-1' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </button>
        )
    }

    // Loading Spinner for page transitions
    const LoadingOverlay = () => (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-20 transition-opacity duration-300">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Memuat komik...</span>
            </div>
        </div>
    )

    if (loading) {
        return (
            <>
                <SEO
                    title="Komik Terbaru - Komikcast"
                    description="Komikcast menghadirkan komik terbaru update setiap hari. Baca gratis tanpa iklan."
                    keywords="komik terbaru, komik baru, komikcast, update komik"
                    url="https://s1.komikcast00.co.id/terbaru"
                />
                <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative z-10 pt-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-teal-500 rounded-full"></div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                                        Terbaru Hari Ini
                                    </h2>
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
                            </div>
                            <SkeletonLoader count={COMICS_PER_PAGE} type="card" />
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:to-[#121212]">
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center backdrop-blur-sm max-w-md">
                    <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h2>
                    <p className="text-red-300">{error.message}</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <SEO
                title="Komik Terbaru - Komikcast"
                description="Komikcast menghadirkan komik terbaru update setiap hari. Baca gratis tanpa iklan."
                keywords="komik terbaru, komik baru, komikcast, update komik"
                url="https://s1.komikcast00.co.id/terbaru"
            />
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                {/* Background decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-teal-500 rounded-full animate-pulse"></div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                                    Terbaru Hari Ini
                                </h2>
                            </div>
                            <svg className="w-6 h-6 text-green-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                            </svg>
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                ✨ Halaman {currentPage}
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
                        </div>

                        {/* Search Bar */}
                        <div className="mb-8">
                            <div className="relative max-w-2xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari komik terbaru..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {searchQuery && (
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Menampilkan {filteredComics.length} hasil untuk "{searchQuery}"
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Main Grid */}
                            <div className="flex-1">
                                {/* Comic Grid with loading overlay */}
                                <div className="relative min-h-[600px]">
                                    {isPageLoading && <LoadingOverlay />}
                                    
                                    <div 
                                        key={animationKey}
                                        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 transition-opacity duration-300 ${isPageLoading ? 'opacity-30' : 'opacity-100'}`}
                                    >
                                        {filteredComics.map((comic, index) => (
                                            <div
                                                key={`${comic.title}-${animationKey}`}
                                                className="group relative bg-white/80 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 animate-fadeIn"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                {/* NEW Badge - show for first 5 on page 1 */}
                                                {currentPage === 1 && index < 5 && (
                                                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                                        NEW
                                                    </div>
                                                )}

                                                <div className="relative aspect-[2/3] overflow-hidden">
                                                    <img
                                                        src={comic.image}
                                                        alt={comic.title}
                                                        width="300"
                                                        height="450"
                                                        loading={index < 5 ? "eager" : "lazy"}
                                                        decoding="async"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x450?text=Comic+Cover'
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="absolute top-2 right-2 bg-gradient-to-r from-teal-600 to-teal-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                                                        </svg>
                                                        {comic.chapter}
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <p className="text-xs text-gray-300">{comic.source}</p>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-3 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-teal-400 transition-colors min-h-[2.5rem]">
                                                        {comic.title}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleComicDetail(comic)}
                                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        Baca Komik
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination Controls */}
                                {!searchQuery && (
                                    <div className="mt-10 flex flex-col items-center gap-4">
                                        {/* Page Indicator */}
                                        <div className="flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Halaman</span>
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg text-lg min-w-[3rem] text-center">
                                                {currentPage}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                • {comics.length} komik ditampilkan
                                            </span>
                                        </div>

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center gap-4">
                                            <PaginationButton 
                                                direction="prev"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            />
                                            
                                            {/* Quick page numbers for desktop */}
                                            <div className="hidden md:flex items-center gap-2">
                                                {[...Array(Math.min(5, currentPage + 2))].map((_, i) => {
                                                    const pageNum = i + 1
                                                    if (pageNum > currentPage + 2) return null
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            disabled={isPageLoading}
                                                            className={`
                                                                w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-300
                                                                ${pageNum === currentPage 
                                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110' 
                                                                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                                                }
                                                                ${isPageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                                                            `}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    )
                                                })}
                                                {currentPage < 10 && hasMorePages && (
                                                    <span className="text-gray-400 dark:text-gray-500 px-2">...</span>
                                                )}
                                            </div>

                                            <PaginationButton 
                                                direction="next"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={!hasMorePages}
                                            />
                                        </div>

                                        {/* Mobile page info */}
                                        <p className="md:hidden text-sm text-gray-500 dark:text-gray-400">
                                            Geser untuk navigasi
                                        </p>
                                    </div>
                                )}

                                {/* No results */}
                                {filteredComics.length === 0 && searchQuery && (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada komik ditemukan untuk "{searchQuery}"</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                                        >
                                            Reset Pencarian
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            {sidebarComics.length > 0 && (
                                <div className="lg:w-80 xl:w-96">
                                    <div className="sticky top-24">
                                        {/* Sidebar Header */}
                                        <div className="relative mb-6 p-4 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl border border-indigo-500/30 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 animate-pulse"></div>
                                            <div className="relative flex items-center gap-3">
                                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg animate-bounce">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                        Baru Update
                                                    </h3>
                                                    <p className="text-sm text-gray-400">Halaman {currentPage}</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
                                            <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                                        </div>

                                        {/* Sidebar List */}
                                        <div className="space-y-3">
                                            {sidebarComics.map((comic, index) => (
                                                <div
                                                    key={`sidebar-${comic.title}-${animationKey}`}
                                                    className={`group relative flex gap-4 p-3 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                                                        hoveredSidebar === index 
                                                            ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/50 scale-105 shadow-xl shadow-indigo-500/20' 
                                                            : 'bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-indigo-500/30'
                                                    }`}
                                                    onMouseEnter={() => setHoveredSidebar(index)}
                                                    onMouseLeave={() => setHoveredSidebar(null)}
                                                    onClick={() => handleComicDetail(comic)}
                                                >
                                                    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                                        hoveredSidebar === index ? 'bg-gradient-to-r from-blue-700 to-teal-500 text-white scale-125' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                        {index + 1}
                                                    </div>

                                                    <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded-lg ml-4">
                                                        <img
                                                            src={comic.image}
                                                            alt={comic.title}
                                                            className={`w-full h-full object-cover transition-transform duration-500 ${hoveredSidebar === index ? 'scale-110' : ''}`}
                                                            loading="lazy"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0 relative">
                                                        <h4 className={`font-semibold text-sm line-clamp-2 mb-1 transition-colors duration-300 ${
                                                            hoveredSidebar === index ? 'text-teal-400' : 'text-gray-900 dark:text-gray-100'
                                                        }`}>
                                                            {comic.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                                                {comic.chapter}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Stats */}
                                        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:scale-105 transition-transform duration-300">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                                        {comics.length}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Komik Halaman Ini</div>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:scale-105 transition-transform duration-300">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                                                        {currentPage}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Halaman</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Genre List - Navigate to Pustaka */}
                                        <div className="mt-4">
                                            <GenreList navigateToAll={true} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TerbaruPage
