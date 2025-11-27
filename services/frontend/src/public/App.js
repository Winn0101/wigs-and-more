import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalogue from './components/Catalogue';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Admin from './components/Admin';
import OrderConfirmation from './components/OrderConfirmation';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', id);
    }
    return id;
  });

  const updateCartCount = async () => {
    try {
      const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:3002';
      const response = await fetch(`${CART_SERVICE_URL}/api/cart/${sessionId}`);
      const data = await response.json();
      setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link to="/" className="logo">
                <h1>Wigs and More</h1>
              </Link>
              <nav className="nav">
                <Link to="/" className="nav-link">Shop</Link>
                <Link to="/cart" className="nav-link cart-link">
                  Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                <Link to="/admin" className="nav-link">Admin</Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Catalogue sessionId={sessionId} updateCartCount={updateCartCount} />} />
            <Route path="/cart" element={<Cart sessionId={sessionId} updateCartCount={updateCartCount} />} />
            <Route path="/checkout" element={<Checkout sessionId={sessionId} updateCartCount={updateCartCount} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Wigs and More. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;