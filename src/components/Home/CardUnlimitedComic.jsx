import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SkeletonLoader from '../SkeletonLoader'
import GenreList from '../GenreList'

const CardUnlimitedComic = () => {
    const [comics, setComics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortOrder, setSortOrder] = useState('default')
    const [hoveredSidebar, setHoveredSidebar] = useState(null)
    const [searchParams] = useSearchParams()
    const [activeGenre, setActiveGenre] = useState(searchParams.get('genre') || '')

    const navigate = useNavigate()

    // Update activeGenre when URL changes
    useEffect(() => {
        setActiveGenre(searchParams.get('genre') || '')
    }, [searchParams])

    const fetchComics = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axios.get('https://www.sankavollerei.com/comic/unlimited')
            const rawComics = response.data.comics || []
            const filteredComics = rawComics.filter(item => 
                !item.title.toLowerCase().includes('apk') && 
                !item.chapter.toLowerCase().includes('download')
            )
            
            const processedComics = filteredComics.map(comic => {
                const slug = comic.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');

                let cleanLink = comic.link;
                try {
                    const urlObj = new URL(comic.link);
                    cleanLink = urlObj.pathname; 
                    cleanLink = cleanLink
                        .replace('/manga/', '')
                        .replace('/plus/', '')
                        .replace(/^\/+|\/+$/g, ''); 
                } catch {
                    console.log("Error parsing URL", comic.link);
                }

                const imageUrl = comic.image && !comic.image.includes('lazy.jpg')
                    ? comic.image
                    : 'https://via.placeholder.com/300x450?text=Cover+Unlimited';
                
                return {
                    ...comic,
                    image: imageUrl,
                    processedLink: cleanLink,
                    slug: slug,
                    source: 'Unlimited', 
                    popularity: comic.genre || 'N/A'
                }
            })

            setComics(processedComics)
            setLoading(false)

        } catch (err) {
            setError(err)
            setLoading(false)
            console.error("Error fetching unlimited comics:", err)
        }
    }, [])

    useEffect(() => {
        fetchComics()
    }, [fetchComics])

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

    const handleGenreClick = (genre) => {
        setActiveGenre(genre)
        if (genre) {
            navigate(`/unlimited?genre=${encodeURIComponent(genre)}`, { replace: true })
        } else {
            navigate('/unlimited', { replace: true })
        }
    }

    // Filter comics based on search and genre
    const filteredComics = comics.filter(comic => {
        const matchesSearch = comic.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGenre = !activeGenre || 
            comic.title.toLowerCase().includes(activeGenre.toLowerCase()) ||
            (comic.popularity && comic.popularity.toLowerCase().includes(activeGenre.toLowerCase()))
        return matchesSearch && matchesGenre
    })

    // Sort comics
    const sortedComics = [...filteredComics].sort((a, b) => {
        switch (sortOrder) {
            case 'a-z':
                return a.title.localeCompare(b.title)
            case 'z-a':
                return b.title.localeCompare(a.title)
            case 'newest':
                return parseInt(b.chapter) - parseInt(a.chapter) || 0
            default:
                return 0
        }
    })

    // Sidebar comics
    const sidebarComics = sortedComics.slice(0, 10)

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-teal-500 rounded-full"></div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                            {activeGenre ? `Unlimited - ${activeGenre}` : "All Comic / Unlimited Collection"}
                        </h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
                </div>
                <SkeletonLoader count={12} type="card" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[400px] p-4">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-teal-500 rounded-full animate-pulse"></div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                        {activeGenre ? `All Comic - ${activeGenre}` : "All Comic / Unlimited Collection"}
                    </h2>
                </div>
                <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full">
                    📚 {sortedComics.length} Komik
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari komik di unlimited collection..."
                        className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
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

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Urutkan:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer shadow-lg"
                    >
                        <option value="default">Default</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                        <option value="newest">Chapter Terbaru</option>
                    </select>
                </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || activeGenre) && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Filter aktif:</span>
                    {searchQuery && (
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-sm rounded-full flex items-center gap-1">
                            Pencarian: "{searchQuery}"
                            <button onClick={() => setSearchQuery('')} className="hover:text-teal-300">×</button>
                        </span>
                    )}
                    {activeGenre && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full flex items-center gap-1">
                            Genre: {activeGenre}
                            <button onClick={() => handleGenreClick('')} className="hover:text-purple-300">×</button>
                        </span>
                    )}
                    <button
                        onClick={() => { setSearchQuery(''); handleGenreClick(''); }}
                        className="text-sm text-red-400 hover:text-red-300 ml-2"
                    >
                        Hapus semua
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Grid */}
                <div className="flex-1">
                    {sortedComics.length === 0 && (searchQuery || activeGenre) ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium text-center">
                                Manga tidak ditemukan
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); handleGenreClick(''); }}
                                className="mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {sortedComics.map((comic, index) => (
                                <div
                                    key={`${comic.slug}-${index}`}
                                    className="group relative bg-white/80 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 hover:-translate-y-2 cursor-pointer"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <div 
                                        className="relative aspect-[2/3] overflow-hidden cursor-pointer"
                                        onClick={() => handleComicDetail(comic)}
                                    >
                                        <img
                                            src={comic.image}
                                            alt={comic.title}
                                            width="300"
                                            height="450"
                                            loading={index < 6 ? "eager" : "lazy"}
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x450?text=Comic+Cover'
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-700 to-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                            {comic.chapter}
                                        </div>
                                        {index < 10 && (
                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-teal-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                                HOT
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 
                                            className="font-bold text-sm md:text-base line-clamp-2 mb-3 text-gray-900 dark:text-gray-100 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors min-h-[2.5rem] cursor-pointer"
                                            onClick={() => handleComicDetail(comic)}
                                        >
                                            {comic.title}
                                        </h3>
                                        <button
                                            onClick={() => handleComicDetail(comic)}
                                            className="w-full bg-gradient-to-r from-blue-700 to-teal-500 text-white py-2 rounded-lg hover:from-pink-500 hover:to-rose-500 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-teal-500/50 flex items-center justify-center gap-2"
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
                    )}
                </div>

                {/* Sidebar */}
                <div className="lg:w-80 xl:w-96">
                    <div className="sticky top-24">
                        {/* Sidebar Header */}
                        <div className="relative mb-6 p-4 bg-gradient-to-r from-pink-600/20 via-rose-600/20 to-purple-600/20 rounded-2xl border border-teal-500/30 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-rose-600/10 animate-pulse"></div>
                            <div className="relative flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg animate-bounce">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                                        Top 10 Unlimited
                                    </h3>
                                    <p className="text-sm text-gray-400">Komik pilihan terbaik</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Comic List */}
                        {sidebarComics.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {sidebarComics.slice(0, 5).map((comic, index) => (
                                    <div
                                        key={`sidebar-${comic.slug}-${index}`}
                                        className={`group relative flex gap-4 p-3 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                                            hoveredSidebar === index 
                                                ? 'bg-gradient-to-r from-pink-600/20 to-rose-600/20 border-teal-500/50 scale-105 shadow-xl shadow-teal-500/20' 
                                                : 'bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-teal-500/30'
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

                                        <div className="relative w-14 h-20 flex-shrink-0 overflow-hidden rounded-lg ml-4">
                                            <img
                                                src={comic.image}
                                                alt={comic.title}
                                                className={`w-full h-full object-cover transition-transform duration-500 ${hoveredSidebar === index ? 'scale-110' : ''}`}
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-semibold text-sm line-clamp-2 mb-1 transition-colors duration-300 ${
                                                hoveredSidebar === index ? 'text-teal-400' : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                                {comic.title}
                                            </h4>
                                            <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                                                {comic.chapter}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:scale-105 transition-transform duration-300 cursor-default">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                                        {comics.length}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Komik</div>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:scale-105 transition-transform duration-300 cursor-default">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                                        ∞
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Unlimited</div>
                                </div>
                            </div>
                        </div>

                        {/* Genre List */}
                        <GenreList 
                            onGenreClick={handleGenreClick} 
                            activeGenre={activeGenre} 
                            navigateToAll={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardUnlimitedComic
