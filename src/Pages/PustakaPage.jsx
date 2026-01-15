import React, { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardNewComic from '../components/Home/CardNewComic'
import SEO from '../components/SEO'

const PustakaPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const genreFromUrl = searchParams.get('genre') || ''

    // Handle page change - update URL while preserving genre
    const handlePageChange = useCallback((newPage) => {
        const params = { page: newPage.toString() }
        if (genreFromUrl) {
            params.genre = genreFromUrl
        }
        setSearchParams(params)
    }, [genreFromUrl, setSearchParams])

    return (
        <>
            <SEO
                title={genreFromUrl 
                    ? (currentPage > 1 ? `Komik ${genreFromUrl} Halaman ${currentPage} - Komikcast` : `Komik ${genreFromUrl} - Komikcast`)
                    : (currentPage > 1 ? `Pustaka Komik Halaman ${currentPage} - Komikcast` : "Pustaka Komik - Komikcast")}
                description={genreFromUrl 
                    ? `Koleksi komik ${genreFromUrl} terlengkap di Komikcast. Baca gratis tanpa iklan.` 
                    : "Komikcast menghadirkan koleksi lengkap komik online gratis tanpa iklan."}
                keywords={genreFromUrl 
                    ? `komik ${genreFromUrl}, baca komik ${genreFromUrl}, komikcast` 
                    : "pustaka komik, koleksi komik, baca komik online, komikcast"}
                url={genreFromUrl 
                    ? `https://s1.komikcast00.co.id/pustaka?genre=${genreFromUrl}` 
                    : "https://s1.komikcast00.co.id/pustaka"}
                preserveQueryParams={true}
                robots={currentPage > 10 ? "noindex, follow" : "index, follow"}
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
                    <CardNewComic
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        initialGenre={genreFromUrl}
                    />
                </div>
            </div>
        </>
    )
}

export default PustakaPage
