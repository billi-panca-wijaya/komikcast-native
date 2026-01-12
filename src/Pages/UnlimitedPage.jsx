import React, { useEffect } from 'react'
import CardUnlimitedComic from '../components/Home/CardUnlimitedComic'
import SEO from '../components/SEO'
import { useTheme } from '../hooks/useTheme'

const UnlimitedPage = () => {
    const { setTheme } = useTheme()

    useEffect(() => {
        setTheme('dark')
    }, [setTheme])
    
    return (
        <>
            <SEO
                title="All Comic / Unlimited - Komikcast"
                description="Komikcast menghadirkan koleksi komik unlimited tanpa batas. Baca gratis tanpa iklan."
                keywords="komik unlimited, baca komik, koleksi lengkap, komikcast, all comic"
                url="https://komikcast.co.id/unlimited"
            />
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10 pt-8">
                    <CardUnlimitedComic />
                </div>
            </div>
        </>
    )
}

export default UnlimitedPage
