import React from 'react';
import SEO from '../components/SEO';

const AboutUs = () => {
  return (
    <>
      <SEO
        title="Tentang Kami - Komikcast"
        description="Tentang Komikcast - Platform baca komik online terbaik bahasa Indonesia"
        url="https://s1.komikcast00.co.id/tentang-kami"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent mb-8">
              Tentang Kami
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Komikcast</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Komikcast adalah platform baca komik online terbaik di Indonesia yang menyediakan berbagai koleksi komik, manga, dan manhwa dalam berbagai genre untuk penggemar komik di seluruh Indonesia. Kami berkomitmen memberikan pengalaman membaca komik yang nyaman, bebas iklan, dan tanpa gangguan apapun.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Di Komikcast, kami selalu berusaha menghadirkan koleksi terbaru dan terbaik untuk pembaca kami, dengan platform yang mudah digunakan dan dapat diakses kapan saja dan di mana saja. Dengan antarmuka yang sederhana dan ramah pengguna, kami ingin memastikan setiap pembaca merasa puas dan betah membaca.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Misi Kami</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Misi kami adalah untuk menyediakan platform baca komik yang dapat dinikmati oleh semua kalangan di Indonesia. Kami ingin memberikan akses mudah, gratis, dan berkualitas untuk komik-komik terbaik tanpa iklan, serta menjaga pengalaman membaca yang menyenangkan bagi semua pembaca kami.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Kami juga berupaya menjadi pusat komunitas penggemar komik yang aktif, di mana pembaca dapat berdiskusi, berbagi rekomendasi, dan saling mendukung. Kami percaya bahwa komik adalah seni yang menyatukan banyak orang, dan melalui Komikcast, kami ingin membantu menghubungkan pembaca dan kreator komik di seluruh dunia.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Disclaimer</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Semua komik yang kami tampilkan adalah versi terjemahan atau preview dari komik asli. Meskipun kami berusaha sebaik mungkin untuk menyediakan terjemahan yang akurat, ada kemungkinan adanya kesalahan dalam terjemahan, penulisan nama karakter, atau alur cerita. Untuk mendapatkan pengalaman terbaik, kami mendorong pembaca untuk membeli komik asli jika tersedia di toko buku atau platform resmi.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Komikcast tidak berafiliasi dengan penerbit atau pembuat komik, dan kami hanya menyediakan akses untuk membaca komik secara bebas tanpa melanggar hak cipta.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Hubungi Kami</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Untuk pertanyaan atau umpan balik, Anda dapat menghubungi kami melalui email di <a href="mailto:admin@komikcast00.co.id" className="text-blue-500">admin@komikcast00.co.id</a>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs;
