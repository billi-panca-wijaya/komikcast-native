import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faNewspaper, faFire, faBookOpen, faHistory, faInfinity, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import ThemeToggle from './ThemeToggle'
import axios from 'axios'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const searchRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()

    const navLinks = [
        { name: 'Home', path: '/', icon: faHome },
        { name: 'Terbaru', path: '/terbaru', icon: faNewspaper },
        { name: 'Trending', path: '/trending', icon: faFire },
        { name: 'Pustaka', path: '/pustaka', icon: faBookOpen },
        { name: 'All Comic', path: '/unlimited', icon: faInfinity },
        { name: 'History', path: '/history', icon: faHistory },
    ];

    const isActive = (path) => {
        return location.pathname === path
    }

    const isUnlimitedPage = location.pathname === '/unlimited';

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false)
                setSearchResults([])
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // AJAX Search with debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }

        setLoading(true)
        const debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get(`https://www.sankavollerei.com/comic/search?q=${encodeURIComponent(searchQuery)}`)
                const processedResults = response.data.data.slice(0, 6).map(comic => {
                    const slug = comic.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '')
                    return { ...comic, slug }
                })
                setSearchResults(processedResults)
            } catch {
                setSearchResults([])
            } finally {
                setLoading(false)
            }
        }, 400)

        return () => clearTimeout(debounceTimer)
    }, [searchQuery])

    const handleComicClick = (comic) => {
        const processedLink = comic.href.replace('/detail-komik/', '')
        navigate(`/detail-comic/${comic.slug}`, {
            state: {
                comic: {
                    title: comic.title,
                    image: comic.thumbnail,
                    chapter: comic.description || 'Chapter Terbaru',
                    source: comic.type,
                    popularity: comic.genre || '-'
                },
                processedLink: processedLink
            }
        })
        setIsSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-teal-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <img 
                                src="https://cloudassetskita.com/uploads/kclogo-d386495e.png" 
                                alt="Komikcast Logo" 
                                className="relative h-10 w-auto"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                                    relative px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300
                                    ${isActive(link.path)
                                        ? 'text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }
                                `}
                            >
                                {isActive(link.path) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-teal-500 rounded-lg"></div>
                                )}
                                <span className="relative flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={link.icon} className="text-xs" />
                                    {link.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side: Search + Theme + Mobile Menu */}
                    <div className="flex items-center gap-2">
                        {/* Animated Search */}
                        <div ref={searchRef} className="relative">
                            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64 md:w-80' : 'w-10'}`}>
                                {isSearchOpen ? (
                                    <div className="relative w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari komik..."
                                            autoFocus
                                            className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        />
                                        <FontAwesomeIcon 
                                            icon={faSearch} 
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                        />
                                        <button
                                            onClick={() => {
                                                setIsSearchOpen(false)
                                                setSearchQuery('')
                                                setSearchResults([])
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-sm" />
                                        </button>

                                        {/* Search Results Dropdown */}
                                        {(searchQuery && (searchResults.length > 0 || loading || searchQuery.length > 2)) && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                                {loading ? (
                                                    <div className="p-4 text-center text-gray-500">
                                                        <svg className="animate-spin h-5 w-5 mx-auto text-teal-500" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    </div>
                                                ) : searchResults.length > 0 ? (
                                                    searchResults.map((comic, index) => (
                                                        <div
                                                            key={index}
                                                            onClick={() => handleComicClick(comic)}
                                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                                                        >
                                                            <img
                                                                src={comic.thumbnail}
                                                                alt={comic.title}
                                                                className="w-10 h-14 object-cover rounded"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56' }}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{comic.title}</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">{comic.type}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 font-medium">
                                                        Manga tidak ditemukan
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsSearchOpen(true)}
                                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300"
                                    >
                                        <FontAwesomeIcon icon={faSearch} className="text-sm" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        {!isUnlimitedPage && <ThemeToggle />}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                    <div className="px-4 py-3 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`
                                    block px-4 py-3 rounded-lg font-medium transition-all duration-300
                                    ${isActive(link.path)
                                        ? 'bg-gradient-to-r from-blue-700 to-teal-500 text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-3">
                                    <FontAwesomeIcon icon={link.icon} className="text-lg" />
                                    {link.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
