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
    <footer className="relative z-10 mt-auto bg-gradient-to-t from-gray-900/90 to-transparent backdrop-blur-sm pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-t border-white/10 pt-8">
          {/* Logo and Brand */}
          <div className="flex justify-center mb-8">
            <a href="https://s1.komikcast00.co.id/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="https://cloudassetskita.com/uploads/kclogo-d386495e.png" 
                alt="Komikcast Logo" 
                className="h-10 w-auto drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]"
              />
            </a>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-gray-200 hover:text-white hover:drop-shadow-[0_0_5px_rgba(45,212,191,0.8)] transition-all duration-300 font-medium tracking-wide"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Main Content */}
          <div className="text-center">
            <p className="text-gray-200 text-sm drop-shadow-sm">
              <a href="https://s1.komikcast00.co.id/" className="text-teal-400 hover:text-teal-300 transition-colors font-bold drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]">
                Komikcast
              </a> - Platform baca komik online terbaik tanpa iklan
            </p>
            <p className="text-gray-400 text-xs mt-2">
              &copy; {new Date().getFullYear()} <a href="https://s1.komikcast00.co.id/" className="text-gray-300 hover:text-white transition-colors">Komikcast</a>. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-4 max-w-2xl mx-auto leading-relaxed">
              All the comics on this website are only previews of the original comics, there may be many language errors, character names, and story lines. For the original version, please buy the comic if it's available in your city.
            </p>
          </div>

          {/* DMCA Badge and Histats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {/* DMCA Badge */}
            <a 
              href="https://www.dmca.com/compliance/s1.komikcast00.co.id" 
              title="DMCA Compliance information for s1.komikcast00.co.id"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://www.dmca.com/img/dmca-compliant-grayscale.png" 
                alt="DMCA compliant" 
                className="h-8 opacity-80 hover:opacity-100"
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
