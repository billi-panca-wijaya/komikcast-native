import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import CardTerbaruComic from '../components/Home/CardTerbaruComic'
import CardTrendingComic from '../components/Home/CardTrendingComic'
import GenreList from '../components/GenreList'
import SEO from '../components/SEO'

// Lazy load GridScan for performance
const GridScan = lazy(() => import('../components/GridScan'))

const Home = () => {
  return (
    <>
      <SEO
        title="Komikcast - Baca Komik Online Tanpa Iklan Bahasa Indonesia"
        description="Komikcast menghadirkan pengalaman baca komik online terbaik bahasa Indonesia. Dari One Piece sampai Apotheosis, semua tersedia gratis tanpa iklan"
        keywords="komikcast, komik indonesia, baca komik gratis, komik online, manga indonesia, manhwa indonesia"
        url="https://s1.komikcast00.co.id/"
      />
      <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      {/* GridScan Background Effect */}
      <div className="fixed inset-0 overflow-hidden z-0" style={{ pointerEvents: 'none' }}>
        <Suspense fallback={
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d1117] to-[#0a0a0a]" />
        }>
          <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#0d3d3d"
              gridScale={0.1}
              scanColor="#14b8a6"
              scanOpacity={0.5}
              enablePost={true}
              bloomIntensity={0.6}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
              scanDuration={2.5}
              scanDelay={1.5}
            />
          </div>
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Trending Section */}
        <div className="pt-6 pb-6">
          <CardTrendingComic />
        </div>

        {/* Terbaru Section */}
        <div className="pb-6">
          <CardTerbaruComic />
        </div>

        {/* Genre List Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-700 to-teal-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-teal-400 bg-clip-text text-transparent">
                Jelajahi Genre
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"></div>
          </div>
          <GenreList navigateToAll={true} />
        </div>

        {/* Quick Links Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                Jelajahi Lebih Banyak
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Temukan koleksi komik lengkap di pustaka kami
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to="/pustaka"
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 max-w-md">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-teal-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-teal-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faBookOpen} className="text-3xl text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent text-center">
                    Pustaka Komik
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors text-center">
                    Jelajahi koleksi lengkap pustaka komik dengan ribuan judul
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                    <span className="text-sm font-semibold mr-2">Lihat Semua</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-blue-700 to-teal-500"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home
