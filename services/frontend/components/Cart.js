import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = ({ sessionId, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:3002';
  const CATALOGUE_SERVICE_URL = process.env.REACT_APP_CATALOGUE_SERVICE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CART_SERVICE_URL}/api/cart/${sessionId}`);
      setCartItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put(`${CART_SERVICE_URL}/api/cart/${sessionId}/${itemId}`, {
        quantity: newQuantity
      });
      await fetchCart();
      updateCartCount();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${CART_SERVICE_URL}/api/cart/${sessionId}/${itemId}`);
      await fetchCart();
      updateCartCount();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await axios.delete(`${CART_SERVICE_URL}/api/cart/${sessionId}`);
      await fetchCart();
      updateCartCount();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        {cartItems.length > 0 && (
          <button className="btn btn-danger" onClick={clearCart}>
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Browse our collection and add items to your cart</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-image">
                  {item.imageUrl ? (
                    <img src={`${CATALOGUE_SERVICE_URL}${item.imageUrl}`} alt={item.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-item-quantity">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  className="btn-remove" 
                  onClick={() => removeItem(item._id)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-success btn-checkout" onClick={proceedToCheckout}>
              Proceed to Checkout
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;