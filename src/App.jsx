import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Pages/Home'
import TerbaruPage from './Pages/TerbaruPage'
import TrendingPage from './Pages/TrendingPage'
import PustakaPage from './Pages/PustakaPage'
import UnlimitedPage from './Pages/UnlimitedPage'
import DetailComic from './Pages/page-detail'
import ReadComic from './Pages/read-comic'
import StatisticsPage from './Pages/StatisticsPage'
import usePageTracking from './hooks/usePageTracking'
import HistoryPage from './Pages/HistoryPage'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import AboutUs from './Pages/AboutUs'
import Contact from './Pages/Contact'
import EditorialGuidelines from './Pages/EditorialGuidelines'
import DMCA from './Pages/DMCA'
import FAQ from './Pages/FAQ'

function AppContent() {
  // Track page views
  usePageTracking()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terbaru" element={<TerbaruPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/pustaka" element={<PustakaPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/unlimited" element={<UnlimitedPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/detail-comic/:slug" element={<DetailComic />} />
          <Route path="/read-comic/:slug/:chapterSlug" element={<ReadComic />} />
          <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />
          <Route path="/tentang-kami" element={<AboutUs />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/pedoman-editorial" element={<EditorialGuidelines />} />
          <Route path="/dmca" element={<DMCA />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App