// Main App Component with React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Pages
import Homepage from './pages/Homepage';
import Auth from './pages/Auth';
import Products from './pages/Products';
import Cart from './pages/Cart';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Font Awesome (via CDN in index.html)
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              
              {/* Redirect unknown routes to homepage */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
