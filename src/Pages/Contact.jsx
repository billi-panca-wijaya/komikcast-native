import React from 'react'
import SEO from '../components/SEO'

const Contact = () => {
  return (
    <>
      <SEO
        title="Kontak - Komikcast"
        description="Hubungi Komikcast - Platform baca komik online terbaik bahasa Indonesia"
        url="https://s1.komikcast00.co.id/kontak"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent mb-8">
              Hubungi Kami
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Kontak</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Jika Anda memiliki pertanyaan, saran, atau masukan, silakan hubungi kami melalui:
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-600 dark:text-gray-400">
                  <li>Email: <a href="mailto:admin@komikcast00.co.id" className="text-blue-500">admin@komikcast00.co.id</a></li>
                  <li className="flex items-center gap-2 mt-2">
                    <span>Sosial Media:</span>
                    <a 
                      href="https://t.me/mrbuhuy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </a>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Jam Operasional</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Kami akan merespons pertanyaan Anda dalam waktu 1-3 hari kerja. Jam operasional kami adalah:
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Setiap hari, pukul 08:00 - 18:00 WIB.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
