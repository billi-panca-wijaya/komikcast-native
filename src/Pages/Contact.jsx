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
                  <li>Sosial Media: (akan diperbarui)</li>
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
