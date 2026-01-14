import React from 'react'
import SEO from '../components/SEO'

const DMCA = () => {
  return (
    <>
      <SEO
        title="DMCA Copyright - Komikcast"
        description="Kebijakan DMCA Komikcast - Platform baca komik online terbaik bahasa Indonesia"
        url="https://s1.komikcast00.co.id/dmca"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent mb-8">
              Kebijakan DMCA
            </h1>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Undang-Undang Hak Cipta Milenium Digital (DMCA)</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Komikcast</strong> menghormati hak kekayaan intelektual dan berkomitmen untuk mematuhi aturan yang ada di bawah <strong>Digital Millennium Copyright Act (DMCA)</strong>. Kami akan merespons pemberitahuan pelanggaran hak cipta yang sesuai dengan ketentuan DMCA, dan akan mengambil tindakan yang tepat jika diperlukan.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Pemberitahuan Penghapusan (Takedown Notice)</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Jika Anda adalah pemilik hak cipta dan meyakini bahwa konten yang terdapat di situs kami melanggar hak cipta Anda, Anda dapat mengirimkan pemberitahuan penghapusan (takedown notice) sesuai dengan DMCA. Pemberitahuan tersebut harus mencakup elemen-elemen berikut:
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-600 dark:text-gray-400">
                  <li>Identifikasi karya berhak cipta yang diklaim telah dilanggar</li>
                  <li>Identifikasi materi yang diklaim melanggar hak cipta dan perlu dihapus atau diakses</li>
                  <li>Informasi kontak Anda yang jelas (termasuk alamat email dan telepon)</li>
                  <li>Pernyataan bahwa Anda memiliki itikad baik bahwa materi tersebut tidak memiliki izin dari pemilik hak cipta atau agen yang sah</li>
                  <li>Pernyataan bahwa informasi dalam pemberitahuan tersebut akurat, dan bahwa Anda berwenang untuk bertindak atas nama pemilik hak cipta</li>
                  <li>Tanda tangan elektronik atau fisik dari orang yang berwenang untuk bertindak atas nama pemilik hak cipta</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Pengajuan Counter-Notice</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Jika Anda merasa bahwa materi Anda telah dihapus karena kesalahan atau identifikasi yang salah, Anda dapat mengajukan counter-notice untuk memulihkan materi tersebut. Counter-notice harus mencakup informasi berikut:
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-600 dark:text-gray-400">
                  <li>Nama, alamat, nomor telepon, dan alamat email Anda</li>
                  <li>Pernyataan bahwa Anda memiliki itikad baik bahwa materi tersebut dihapus akibat kesalahan atau identifikasi yang salah</li>
                  <li>Tanda tangan Anda</li>
                  <li>Identifikasi materi yang dihapus dan lokasi materi sebelum dihapus</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Menghubungi Kami</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Jika Anda ingin mengirimkan pemberitahuan takedown atau counter-notice, atau jika Anda memiliki pertanyaan lebih lanjut mengenai kebijakan DMCA kami, silakan hubungi kami melalui email di:
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <a href="mailto:admin@komikcast00.co.id" className="text-blue-500">admin@komikcast00.co.id</a>
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Peringatan tentang Penyalahgunaan</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Kami ingin mengingatkan bahwa pemberitahuan atau counter-notice yang tidak akurat atau dilakukan dengan niat buruk dapat mengakibatkan tindakan hukum terhadap pihak yang mengajukan pemberitahuan tersebut. Kami menghargai hak cipta, dan kami berharap semua pihak bertindak dengan itikad baik.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DMCA
