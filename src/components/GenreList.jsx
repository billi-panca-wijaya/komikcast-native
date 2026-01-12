import React from 'react'
import { useNavigate } from 'react-router-dom'

// 50 genres for comic categories
const GENRES = [
    { name: 'Action', color: 'from-red-500 to-orange-500' },
    { name: 'Adventure', color: 'from-blue-600 to-teal-400' },
    { name: 'Comedy', color: 'from-blue-700 to-teal-500' },
    { name: 'Drama', color: 'from-purple-500 to-pink-500' },
    { name: 'Fantasy', color: 'from-blue-500 to-cyan-500' },
    { name: 'Horror', color: 'from-gray-700 to-gray-900' },
    { name: 'Isekai', color: 'from-blue-700 to-teal-500' },
    { name: 'Martial Arts', color: 'from-blue-600 to-teal-400' },
    { name: 'Mystery', color: 'from-slate-500 to-gray-600' },
    { name: 'Romance', color: 'from-blue-600 to-teal-400' },
    { name: 'School Life', color: 'from-teal-500 to-green-500' },
    { name: 'Sci-Fi', color: 'from-blue-700 to-teal-500' },
    { name: 'Slice of Life', color: 'from-lime-500 to-green-500' },
    { name: 'Sports', color: 'from-emerald-500 to-teal-500' },
    { name: 'Supernatural', color: 'from-violet-500 to-purple-500' },
    { name: 'Thriller', color: 'from-zinc-600 to-gray-800' },
    { name: 'Psychological', color: 'from-fuchsia-600 to-purple-700' },
    { name: 'Historical', color: 'from-amber-600 to-yellow-700' },
    { name: 'Mecha', color: 'from-sky-500 to-blue-600' },
    { name: 'Shounen', color: 'from-orange-400 to-red-500' },
    { name: 'Shoujo', color: 'from-pink-400 to-rose-400' },
    { name: 'Seinen', color: 'from-gray-500 to-slate-600' },
    { name: 'Josei', color: 'from-rose-400 to-pink-500' },
    { name: 'Ecchi', color: 'from-red-400 to-pink-400' },
    { name: 'Harem', color: 'from-pink-300 to-rose-400' },
    { name: 'Magic', color: 'from-violet-400 to-indigo-500' },
    { name: 'Music', color: 'from-fuchsia-400 to-purple-400' },
    { name: 'Parody', color: 'from-yellow-400 to-orange-400' },
    { name: 'Police', color: 'from-blue-600 to-indigo-600' },
    { name: 'Post-Apocalyptic', color: 'from-stone-600 to-neutral-700' },
    { name: 'Reincarnation', color: 'from-teal-400 to-cyan-500' },
    { name: 'Revenge', color: 'from-red-600 to-rose-700' },
    { name: 'Samurai', color: 'from-red-700 to-orange-600' },
    { name: 'Survival', color: 'from-green-600 to-emerald-600' },
    { name: 'System', color: 'from-blue-400 to-cyan-400' },
    { name: 'Time Travel', color: 'from-indigo-400 to-blue-500' },
    { name: 'Tragedy', color: 'from-gray-600 to-slate-700' },
    { name: 'Vampire', color: 'from-red-800 to-rose-900' },
    { name: 'Video Games', color: 'from-green-400 to-teal-400' },
    { name: 'Villainess', color: 'from-purple-400 to-fuchsia-500' },
    { name: 'War', color: 'from-stone-500 to-gray-600' },
    { name: 'Webtoon', color: 'from-green-500 to-lime-400' },
    { name: 'Wuxia', color: 'from-amber-500 to-orange-500' },
    { name: 'Zombies', color: 'from-green-700 to-emerald-800' },
    { name: 'Cooking', color: 'from-orange-300 to-amber-400' },
    { name: 'Crime', color: 'from-neutral-600 to-zinc-700' },
    { name: 'Demons', color: 'from-red-700 to-gray-800' },
    { name: 'Dungeon', color: 'from-stone-600 to-amber-700' },
    { name: 'Gore', color: 'from-red-900 to-rose-800' },
    { name: 'Military', color: 'from-green-700 to-emerald-700' },
]

const GenreList = ({ onGenreClick, activeGenre = '', navigateToAll = true }) => {
    const navigate = useNavigate()

    const handleGenreClick = (genreName) => {
        if (navigateToAll) {
            // Navigate to Pustaka/All Comic page with genre filter
            navigate(`/pustaka?genre=${encodeURIComponent(genreName)}`)
        } else if (onGenreClick) {
            onGenreClick(genreName)
        }
    }

    return (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                    <h4 className="font-bold text-gray-700 dark:text-gray-300">Genre</h4>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{GENRES.length} genre</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto scrollbar-hide">
                {GENRES.map((genre) => (
                    <button
                        key={genre.name}
                        onClick={() => handleGenreClick(genre.name)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300 hover:scale-105 ${
                            activeGenre.toLowerCase() === genre.name.toLowerCase()
                                ? `bg-gradient-to-r ${genre.color} text-white shadow-lg`
                                : 'bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 hover:text-white border border-gray-200 dark:border-gray-600 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500'
                        }`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
            {activeGenre && (
                <button
                    onClick={() => onGenreClick ? onGenreClick('') : navigate('/pustaka')}
                    className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filter
                </button>
            )}
        </div>
    )
}

export { GENRES }
export default GenreList
