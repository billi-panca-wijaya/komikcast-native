import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  // Initialize Histats tracking
  useEffect(() => {
    const initHistats = () => {
      if (typeof window !== 'undefined') {
        window._Hasync = window._Hasync || []
        window._Hasync.push(['Histats.start', '1,5002031,4,14,200,40,00011111'])
        window._Hasync.push(['Histats.fasi', '1'])
        window._Hasync.push(['Histats.track_hits', ''])
        
        const hs = document.createElement('script')
        hs.type = 'text/javascript'
        hs.async = true
        hs.src = '//s10.histats.com/js15_as.js'
        const head = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
        if (head && !document.querySelector('script[src*="histats.com"]')) {
          head.appendChild(hs)
        }
      }
    }
    initHistats()
  }, [])

  const footerLinks = [
    { name: 'Kebijakan Privasi', path: '/kebijakan-privasi' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'Pedoman Editorial', path: '/pedoman-editorial' },
    { name: 'DMCA', path: '/dmca' },
    { name: 'FAQ', path: '/faq' },
  ]

  return (
    <footer className="mt-auto bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-900 dark:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          {/* Logo and Brand */}
          <div className="flex justify-center mb-8">
            <a href="https://komikcast.co.id/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="https://cloudassetskita.com/uploads/kclogo-d386495e.png" 
                alt="Komikcast Logo" 
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Main Content */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <a href="https://komikcast.co.id/" className="text-teal-500 hover:text-teal-400 transition-colors font-semibold">
                Komikcast
              </a> - Platform baca komik online terbaik tanpa iklan
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              &copy; {new Date().getFullYear()} <a href="https://komikcast.co.id/" className="hover:text-teal-400 transition-colors">Komikcast</a>. All rights reserved.
            </p>
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-4 max-w-2xl mx-auto leading-relaxed">
              All the comics on this website are only previews of the original comics, there may be many language errors, character names, and story lines. For the original version, please buy the comic if it's available in your city.
            </p>
          </div>

          {/* DMCA Badge and Histats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {/* DMCA Badge */}
            <a 
              href="https://www.dmca.com/compliance/komikcast.co.id" 
              title="DMCA Compliance information for komikcast.co.id"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://www.dmca.com/img/dmca-compliant-grayscale.png" 
                alt="DMCA compliant" 
                className="h-8"
              />
            </a>

            {/* Histats Counter */}
            <div id="histats_counter"></div>
            <noscript>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img src="//sstatic1.histats.com/0.gif?5002031&101" alt="" style={{border: 0}} />
              </a>
            </noscript>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
