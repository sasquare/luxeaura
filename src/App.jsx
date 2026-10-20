import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import WholesalePage from './pages/WholesalePage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import ShippingPage from './pages/ShippingPage'
import LegalPage from './pages/LegalPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/wholesale"   element={<WholesalePage />} />
        <Route path="/admin"       element={<AdminPage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/shipping"    element={<ShippingPage />} />
        <Route path="/returns"     element={<LegalPage />} />
        <Route path="/privacy"     element={<LegalPage />} />
        <Route path="/terms"       element={<LegalPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
