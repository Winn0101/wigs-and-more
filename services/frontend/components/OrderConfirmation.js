import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CHECKOUT_SERVICE_URL = process.env.REACT_APP_CHECKOUT_SERVICE_URL || 'http://localhost:3003';

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CHECKOUT_SERVICE_URL}/api/orders/${orderNumber}`);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found. Please check your order number.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        
        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your purchase! Your order has been successfully placed.
        </p>

        <div className="order-details-card">
          <div className="order-number">
            <h3>Order Number</h3>
            <span className="order-number-value">{order.orderNumber}</span>
          </div>

          <div className="customer-details">
            <h3>Customer Information</h3>
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{order.customerName}</span>
            </div>
            <div className="detail-row">
              <span className="label">Email:</span>
              <span className="value">{order.customerEmail}</span>
            </div>
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{order.customerPhone}</span>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="order-total-row">
              <span className="total-label">Total Amount:</span>
              <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-date">
            <small>Order placed on {new Date(order.createdAt).toLocaleString()}</small>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>

        <div className="confirmation-note">
          <p>
            📧 A confirmation email has been sent to <strong>{order.customerEmail}</strong>
          </p>
          <p>
            We'll contact you at <strong>{order.customerPhone}</strong> regarding your order delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;