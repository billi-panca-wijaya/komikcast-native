import React, { useState } from 'react'
import SEO from '../components/SEO'

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen 
          ? 'bg-gradient-to-br from-blue-900/20 via-teal-900/10 to-purple-900/20 border-teal-500/50 shadow-xl shadow-teal-500/10' 
          : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-teal-500/30'
      }`}
    >
      {/* Animated glow effect */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent animate-glow-sweep"></div>
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <button
        onClick={onClick}
        className="relative w-full px-6 py-6 md:px-8 md:py-8 text-left flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
            isOpen 
              ? 'bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-teal-500/30' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}>
            {index + 1}
          </div>
          <h3 className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${
            isOpen ? 'text-teal-400' : 'text-gray-900 dark:text-gray-100'
          }`}>
            {question}
          </h3>
        </div>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-teal-500 text-white rotate-180' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      <div className={`relative overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-6 pb-6 md:px-8 md:pb-8 ml-14 md:ml-16">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)
  
  const faqData = [
    {
      question: "Apa itu Komikcast?",
      answer: "Komikcast adalah platform baca komik online terbaik bahasa Indonesia. Kami menyediakan berbagai koleksi komik, manga, dan manhwa yang dapat Anda baca secara gratis tanpa iklan."
    },
    {
      question: "Apakah Komikcast gratis?",
      answer: "Ya, Komikcast sepenuhnya gratis untuk digunakan. Anda dapat membaca semua komik tanpa perlu membayar biaya apapun dan tanpa iklan yang mengganggu."
    },
    {
      question: "Bagaimana cara membaca komik di Komikcast?",
      answer: "Cukup cari komik yang ingin Anda baca melalui fitur pencarian atau jelajahi kategori yang tersedia. Klik pada judul komik untuk melihat detail dan pilih chapter yang ingin dibaca."
    },
    {
      question: "Apakah saya perlu mendaftar untuk membaca komik?",
      answer: "Tidak, Anda tidak perlu mendaftar atau membuat akun untuk membaca komik di Komikcast. Semua konten dapat diakses langsung tanpa registrasi."
    },
    {
      question: "Seberapa sering komik diperbarui?",
      answer: "Kami memperbarui koleksi komik secara rutin setiap hari. Update terbaru dapat dilihat di halaman beranda atau halaman Terbaru."
    },
    {
      question: "Bagaimana cara melaporkan masalah atau bug?",
      answer: "Jika Anda menemukan masalah atau bug, silakan hubungi kami melalui halaman Kontak. Tim kami akan segera menangani laporan Anda."
    },
    {
      question: "Apakah Komikcast tersedia di mobile?",
      answer: "Ya, Komikcast dirancang dengan desain responsif yang optimal untuk berbagai perangkat termasuk smartphone dan tablet."
    },
    {
      question: "Bagaimana cara request komik baru?",
      answer: "Anda dapat mengajukan request komik baru melalui halaman Kontak kami. Kami akan mempertimbangkan setiap request yang masuk."
    }
  ]

  return (
    <>
      <SEO
        title="FAQ - Komikcast"
        description="Pertanyaan yang sering diajukan tentang Komikcast - Platform baca komik online terbaik bahasa Indonesia"
        url="https://komikcast.co.id/faq"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-[#0a0a0a] dark:via-[#0d1117] dark:to-[#0a0a0a] text-gray-900 dark:text-gray-100">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-400 to-blue-500 bg-clip-text text-transparent mb-4">
              Pertanyaan Umum
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang Komikcast
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                index={index}
              />
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-12 p-8 bg-gradient-to-br from-blue-900/20 via-teal-900/10 to-purple-900/20 rounded-2xl border border-teal-500/30 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent animate-glow-sweep"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Masih punya pertanyaan?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Hubungi tim kami untuk bantuan lebih lanjut
              </p>
              <a 
                href="/kontak" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQ
