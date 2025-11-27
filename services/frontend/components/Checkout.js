import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = ({ sessionId, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:3002';
  const CHECKOUT_SERVICE_URL = process.env.REACT_APP_CHECKOUT_SERVICE_URL || 'http://localhost:3003';
  const CATALOGUE_SERVICE_URL = process.env.REACT_APP_CATALOGUE_SERVICE_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CART_SERVICE_URL}/api/cart/${sessionId}`);
      
      if (response.data.items.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCartItems(response.data.items);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          wigId: item.wigId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: total,
        sessionId
      };
      
      const response = await axios.post(`${CHECKOUT_SERVICE_URL}/api/checkout`, orderData);
      
      updateCartCount();
      navigate(`/order-confirmation/${response.data.order.orderNumber}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to complete order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="checkout-container">
        <div className="checkout-form">
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className={`input-field ${errors.customerName ? 'error' : ''}`}
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {errors.customerName && (
                <span className="error-message">{errors.customerName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address *</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                className={`input-field ${errors.customerEmail ? 'error' : ''}`}
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
              {errors.customerEmail && (
                <span className="error-message">{errors.customerEmail}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Phone Number *</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                className={`input-field ${errors.customerPhone ? 'error' : ''}`}
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="+1234567890"
              />
              {errors.customerPhone && (
                <span className="error-message">{errors.customerPhone}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-success btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Complete Order'}
            </button>
            
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/cart')}
              disabled={submitting}
            >
              Back to Cart
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <div className="summary-item-image">
                  {item.imageUrl ? (
                    <img src={`${CATALOGUE_SERVICE_URL}${item.imageUrl}`} alt={item.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="summary-item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;