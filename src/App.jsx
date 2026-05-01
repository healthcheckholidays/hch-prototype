import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

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

export default function App() {
  return (
    <BrowserRouter>
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

        {/* Booking flow — stub, extend with BookingFlow.jsx */}
        <Route path="/book" element={<ShopPage />} />

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
