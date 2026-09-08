import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './index.css'
import { useSeo } from './seo'

import HomePage from './pages/HomePage'
import DestinationsPage from './pages/DestinationsPage'
import HowItWorksPage from './pages/HowItWorksPage'
import ShopPage from './pages/ShopPage'
import PackageDetailPage from './pages/PackageDetailPage'
import AccountPage from './pages/AccountPage'
import ItineraryPage from './pages/ItineraryPage'
import ResultsPage from './pages/ResultsPage'
import ProfilePage from './pages/ProfilePage'
import SearchResultsPage from './pages/SearchResultsPage'
import ConfirmationPage from './pages/ConfirmationPage'
import TestSelectorPage from './pages/TestSelectorPage'
import BookingFlow from './pages/BookingFlow'
import CorporatePage from './pages/CorporatePage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import DemoNotice from './components/DemoNotice'

const PUBLIC_HOSTS = ['go-hch.com', 'www.go-hch.com']

function Seo() {
  useSeo(useLocation().pathname)
  return null
}

export default function App() {
  const isPublic = typeof window !== 'undefined' && PUBLIC_HOSTS.includes(window.location.hostname)

  if (isPublic) {
    return (
      <BrowserRouter>
        <Seo />
        <Routes>
          <Route path="/" element={<CorporatePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Seo />
      <DemoNotice />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />

        {/* Package browsing */}
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<PackageDetailPage />} />

        {/* Search results */}
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Test selector */}
        <Route path="/test-selector" element={<TestSelectorPage />} />

        {/* Booking flow — 10-step guided flow */}
        <Route path="/book" element={<BookingFlow />} />

        {/* Booking confirmation */}
        <Route path="/confirmation/:bookingRef" element={<ConfirmationPage />} />

        {/* User account */}
        <Route path="/account" element={<AccountPage />} />

        {/* Health screening results */}
        <Route path="/results/:tripId" element={<ResultsPage />} />

        {/* Edit health profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Printable itinerary */}
        <Route path="/itinerary/:id" element={<ItineraryPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/shop" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
