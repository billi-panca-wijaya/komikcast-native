import React from 'react'
import SEO from '../components/SEO'

const StatisticsPage = () => {
    return (
        <>
            <SEO
                title="Statistik - Komikcast"
                description="Statistik dan analitik website Komikcast"
                keywords="statistik, analitik, data pengunjung, komikcast"
                url="https://komikcast.co.id/statistics"
            />
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                {/* Background decorative elements - Dark Blue */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-blue-950/20 rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 pt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                    Statistik Website
                                </h1>
                            </div>
                            <svg className="w-6 h-6 text-blue-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                            </svg>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
                        </div>

                        {/* Coming Soon Message */}
                        <div className="flex flex-col items-center justify-center min-h-[60vh]">
                            <div className="relative mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
                                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                {/* Floating particles */}
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                                <div className="absolute top-1/2 -right-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                            </div>

                            <h2 className="text-4xl font-bold mb-4 text-center">
                                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Coming Soon
                                </span>
                            </h2>

                            <p className="text-gray-600 dark:text-gray-400 text-lg text-center max-w-md mb-8">
                                Fitur statistik sedang dalam pengembangan. Nantikan update selanjutnya!
                            </p>

                            {/* Stats Preview Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full">
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-1">
                                        ---
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Views</div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1">
                                        ---
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Today</div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-1">
                                        ---
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Comics</div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:scale-105 transition-transform">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-1">
                                        ---
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Readers</div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <a
                                href="/"
                                className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatisticsPage
