
import React from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';

// Configure the theme
const themeConfig = {
  token: {
    colorPrimary: '#D4AF37', // Metallic Gold
    colorBgLayout: '#FAF9F6', // Rich Cream
    colorTextBase: '#1A1A1A', // Luxury Black
    fontFamily: "'Lato', sans-serif",
    borderRadius: 2,
    colorBorder: '#C5A028', // Secondary Gold for borders
  },
  components: {
    Button: {
      colorPrimary: '#D4AF37',
      primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
    },
    Typography: {
      fontFamilyCode: "'Playfair Display', serif",
    },
    Input: {
      activeBorderColor: '#C5A028', // Secondary Gold on focus
      hoverBorderColor: '#C5A028',
    }
  }
};

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ShopSettingsProvider } from './context/ShopSettingsContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Categories from './pages/Categories';
import TryAtHome from './pages/TryAtHome';

// ... (imports remain)

import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminPosters from './pages/admin/AdminPosters';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import Payment from './pages/Payment';
import Wishlist from './pages/Wishlist';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <ShopSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F1E6 100%)' }}>
                      <Navbar />
                      <main style={{ flex: 1 }}>
                        <Outlet />
                      </main>
                      <Footer />
                    </div>
                  }>
                    <Route index element={<Home />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="try-at-home" element={<TryAtHome />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="payment" element={<Payment />} />
                    <Route path="wishlist" element={<Wishlist />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ErrorBoundary>
                      <AdminLayout />
                    </ErrorBoundary>
                  }>
                    <Route index element={<div style={{ padding: 20 }}><h3>Welcome to Admin Dashboard</h3><p>Select an option from the sidebar to manage your shop.</p></div>} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="posters" element={<AdminPosters />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Routes>
              </Router>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ShopSettingsProvider>
    </ConfigProvider>
  );
}

export default App;
