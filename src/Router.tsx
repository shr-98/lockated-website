import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import AboutPage from './pages/AboutPage'
import CategoryItemPage from './pages/CategoryItemPage'
import CategoryLandingPage from './pages/CategoryLandingPage'
import ContactPage from './pages/ContactPage'
import CustomerAppPage from './pages/CustomerAppPage'
import FmMatrixLandingPage from './pages/FmMatrixLandingPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import LeaseManagementLandingPage from './pages/LeaseManagementLandingPage'
import LoyaltyRuleEngineLandingPage from './pages/LoyaltyRuleEngineLandingPage'
import CpManagementLandingPage from './pages/CpManagementLandingPage'
import Snag360LandingPage from './pages/Snag360LandingPage'
import PostPossessionLandingPage from './pages/PostPossessionLandingPage'
import PATMLandingPage from './pages/PATMLandingPage'
import SurveyLandingPage from './pages/SurveyLandingPage'
import VendorManagementLandingPage from './pages/VendorManagementLandingPage'
import PostSalesLandingPage from './pages/PostSalesLandingPage'
import ClubManagementLandingPage from './pages/ClubManagementLandingPage'
import SlugPage from './pages/SlugPage'

export default function Router() {
  return (
    <Routes>
      <Route path="customer-app" element={<CustomerAppPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="lease-management" element={<LeaseManagementLandingPage />} />
      <Route path="fm-matrix" element={<FmMatrixLandingPage />} />
      <Route path="loyalty-rule-engine" element={<LoyaltyRuleEngineLandingPage />} />
      <Route path="cp-management" element={<CpManagementLandingPage />} />
      <Route path="snag-360" element={<Snag360LandingPage />} />
      <Route path="post-possession" element={<PostPossessionLandingPage />} />
      <Route path="patm" element={<PATMLandingPage />} />
      <Route path="survey" element={<SurveyLandingPage />} />
      <Route path="vendor-management" element={<VendorManagementLandingPage />} />
      <Route path="post-sales" element={<PostSalesLandingPage />} />
      <Route path="club-management" element={<ClubManagementLandingPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="contact-us" element={<ContactPage />} />

        <Route path="category/:category" element={<CategoryLandingPage />} />
        <Route path="category/:category/:item" element={<CategoryItemPage />} />

        {/* Reference-style slugs from india.lockated.co menu */}
        <Route path="offices" element={<SlugPage />} />
        <Route path="commercial-buildings" element={<SlugPage />} />
        <Route path="hotels" element={<SlugPage />} />
        <Route path="residential-communities" element={<SlugPage />} />
        <Route path="real-estate-developer" element={<SlugPage />} />
        <Route path="commercial-property" element={<SlugPage />} />
        <Route path="residential-property" element={<SlugPage />} />
        <Route path="lead-management" element={<SlugPage />} />
        <Route path="site-management" element={<SlugPage />} />
        <Route path="brokers-management" element={<SlugPage />} />
        <Route path="snagging-qc-management" element={<SlugPage />} />
        <Route path="handover-management" element={<SlugPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

