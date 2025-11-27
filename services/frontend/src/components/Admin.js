import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [wigs, setWigs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('wigs');
  const [showForm, setShowForm] = useState(false);
  const [editingWig, setEditingWig] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const CATALOGUE_SERVICE_URL = process.env.REACT_APP_CATALOGUE_SERVICE_URL || 'http://localhost:3001';
  const CHECKOUT_SERVICE_URL = process.env.REACT_APP_CHECKOUT_SERVICE_URL || 'http://localhost:3003';

  useEffect(() => {
    if (activeTab === 'wigs') {
      fetchWigs();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchWigs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CATALOGUE_SERVICE_URL}/api/wigs`);
      setWigs(response.data);
    } catch (error) {
      console.error('Error fetching wigs:', error);
      alert('Failed to load wigs');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CHECKOUT_SERVICE_URL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('inStock', formData.inStock);
    
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (editingWig) {
        await axios.put(`${CATALOGUE_SERVICE_URL}/api/wigs/${editingWig._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Wig updated successfully!');
      } else {
        await axios.post(`${CATALOGUE_SERVICE_URL}/api/wigs`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Wig added successfully!');
      }
      
      resetForm();
      fetchWigs();
    } catch (error) {
      console.error('Error saving wig:', error);
      alert('Failed to save wig. Please try again.');
    }
  };

  const handleEdit = (wig) => {
    setEditingWig(wig);
    setFormData({
      name: wig.name,
      description: wig.description || '',
      price: wig.price,
      category: wig.category || '',
      inStock: wig.inStock
    });
    setShowForm(true);
  };

  const handleDelete = async (wigId) => {
    if (!window.confirm('Are you sure you want to delete this wig?')) return;
    
    try {
      await axios.delete(`${CATALOGUE_SERVICE_URL}/api/wigs/${wigId}`);
      alert('Wig deleted successfully!');
      fetchWigs();
    } catch (error) {
      console.error('Error deleting wig:', error);
      alert('Failed to delete wig');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      inStock: true
    });
    setImageFile(null);
    setEditingWig(null);
    setShowForm(false);
  };

  return (
    <div className="container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'wigs' ? 'active' : ''}`}
            onClick={() => setActiveTab('wigs')}
          >
            Manage Wigs
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            View Orders
          </button>
        </div>
      </div>

      {activeTab === 'wigs' && (
        <div className="wigs-management">
          {!showForm && (
            <button className="btn btn-primary add-btn" onClick={() => setShowForm(true)}>
              Add New Wig
            </button>
          )}

          {showForm && (
            <div className="wig-form-container">
              <div className="form-header">
                <h3>{editingWig ? 'Edit Wig' : 'Add New Wig'}</h3>
                <button className="btn-close" onClick={resetForm}>✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="wig-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Wig Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input-field"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price ($) *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="input-field"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="input-field"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      className="input-field"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Long, Short, Curly"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      className="input-field"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                    />
                    <span>In Stock</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-success">
                    {editingWig ? 'Update Wig' : 'Add Wig'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="wigs-list">
              <h3>Current Wigs ({wigs.length})</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wigs.map((wig) => (
                    <tr key={wig._id}>
                      <td>
                        {wig.imageUrl ? (
                          <img 
                            src={`${CATALOGUE_SERVICE_URL}${wig.imageUrl}`} 
                            alt={wig.name}
                            className="table-image"
                          />
                        ) : (
                          <div className="table-no-image">No Image</div>
                        )}
                      </td>
                      <td>{wig.name}</td>
                      <td>${wig.price.toFixed(2)}</td>
                      <td>{wig.category || '-'}</td>
                      <td>
                        <span className={`status-badge ${wig.inStock ? 'in-stock' : 'out-stock'}`}>
                          {wig.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-action btn-edit" 
                          onClick={() => handleEdit(wig)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => handleDelete(wig._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {wigs.length === 0 && (
                <p className="empty-message">No wigs in catalogue. Add your first wig!</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-list">
          <h3>Recent Orders ({orders.length})</h3>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : orders.length === 0 ? (
            <p className="empty-message">No orders yet.</p>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <h4>Order #{order.orderNumber}</h4>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="order-customer">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.customerEmail}</p>
                    <p><strong>Phone:</strong> {order.customerPhone}</p>
                  </div>
                  
                  <div className="order-items">
                    <strong>Items:</strong>
                    <ul>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="order-total">
                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;