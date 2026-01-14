import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../components/SkeletonLoader'
import SEO from '../components/SEO'
import GenreList from '../components/GenreList'

const TrendingPage = () => {
    const [comics, setComics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [hoveredSidebar, setHoveredSidebar] = useState(null)

    const navigate = useNavigate()

    const fetchComics = async () => {
        try {
            // Fetch multiple pages for more comics
            const pages = [1, 2, 3, 4, 5]
            const responses = await Promise.all(
                pages.map(page => 
                    axios.get(`https://www.sankavollerei.com/comic/trending?page=${page}`)
                        .catch(() => ({ data: { trending: [] } }))
                )
            )

            const allRawComics = responses.flatMap(response => response.data.trending || [])

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
                    : 'https://via.placeholder.com/300x450?text=Trending+Cover';
                
                return {
                    ...comic,
                    image: imageUrl,
                    processedLink: link,
                    slug: slug,
                    source: comic.timeframe || '-',
                    popularity: comic.trending_score || 0
                }
            })

            setComics(processedComics.slice(0, 15))
            setLoading(false)

        } catch (err) {
            setError(err)
            setLoading(false)
            console.error("Error fetching trending comics:", err)
        }
    }

    useEffect(() => {
        fetchComics()
    }, [])

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

    // Sidebar comics
    const sidebarComics = filteredComics.slice(0, 10)

    if (loading) {
        return (
            <>
                <SEO
                    title="Komik Trending - Komikcast"
                    description="Komikcast menghadirkan komik trending dan populer. Baca komik terbaik gratis tanpa iklan."
                    keywords="komik trending, komik populer, komikcast, komik hits"
                    url="https://s1.komikcast00.co.id/trending"
                />
                <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative z-10 pt-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                        Trending Hari Ini
                                    </h2>
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
                            </div>
                            <SkeletonLoader count={18} type="card" />
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
                title="Komik Trending - Komikcast"
                description="Komikcast menghadirkan komik trending dan populer. Baca komik terbaik gratis tanpa iklan."
                keywords="komik trending, komik populer, komikcast, komik viral"
                url="https://s1.komikcast00.co.id/trending"
            />
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#1a1a1a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                {/* Background decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                    Trending Hari Ini
                                </h2>
                            </div>
                            <svg className="w-6 h-6 text-orange-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                            </svg>
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-sm rounded-full">
                                🔥 {comics.length} Hot
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
                                    placeholder="Cari komik trending..."
                                    className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl"
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
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                    {filteredComics.map((comic, index) => (
                                        <div
                                            key={comic.title}
                                            className="group relative bg-white/80 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 animate-fadeIn"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            {/* Trending Badge */}
                                            {index < 3 && (
                                                <div className="absolute top-0 left-0 z-10">
                                                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-br-xl rounded-tl-xl text-xs font-bold shadow-lg flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                                        </svg>
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="relative aspect-[2/3] overflow-hidden">
                                                <img
                                                    src={comic.image}
                                                    alt={comic.title}
                                                    width="300"
                                                    height="450"
                                                    loading={index < 10 ? "eager" : "lazy"}
                                                    decoding="async"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/300x450?text=Comic+Cover'
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                                                    </svg>
                                                    {comic.popularity}
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-xs text-gray-300 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {comic.source}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="font-bold text-sm md:text-base line-clamp-2 mb-3 text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors min-h-[2.5rem]">
                                                    {comic.title}
                                                </h3>
                                                <button
                                                    onClick={() => handleComicDetail(comic)}
                                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-orange-500/50 flex items-center justify-center gap-2"
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

                                {/* No results */}
                                {filteredComics.length === 0 && searchQuery && (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada komik ditemukan untuk "{searchQuery}"</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors"
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
                                        <div className="relative mb-6 p-4 bg-gradient-to-r from-orange-600/20 via-red-600/20 to-yellow-600/20 rounded-2xl border border-orange-500/30 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 animate-pulse"></div>
                                            <div className="relative flex items-center gap-3">
                                                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg animate-bounce">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                                        Top 10 Trending
                                                    </h3>
                                                    <p className="text-sm text-gray-400">Paling populer saat ini</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                                            <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                                        </div>

                                        {/* Sidebar List */}
                                        <div className="space-y-3">
                                            {sidebarComics.map((comic, index) => (
                                                <div
                                                    key={`sidebar-${comic.title}`}
                                                    className={`group relative flex gap-4 p-3 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                                                        hoveredSidebar === index 
                                                            ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/50 scale-105 shadow-xl shadow-orange-500/20' 
                                                            : 'bg-white/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 hover:border-orange-500/30'
                                                    }`}
                                                    onMouseEnter={() => setHoveredSidebar(index)}
                                                    onMouseLeave={() => setHoveredSidebar(null)}
                                                    onClick={() => handleComicDetail(comic)}
                                                >
                                                    <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                                                        hoveredSidebar === index ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-125' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
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
                                                            hoveredSidebar === index ? 'text-orange-400' : 'text-gray-900 dark:text-gray-100'
                                                        }`}>
                                                            {comic.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center gap-1">
                                                                🔥 {comic.popularity}
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
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                                                        {comics.length}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Hot</div>
                                                </div>
                                                <div className="text-center p-3 rounded-xl bg-white/50 dark:bg-gray-700/50 hover:scale-105 transition-transform duration-300">
                                                    <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-pulse">
                                                        🔥
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Trending</div>
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

export default TrendingPage
