import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Catalogue.css';

const Catalogue = ({ sessionId, updateCartCount }) => {
  const [wigs, setWigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CATALOGUE_SERVICE_URL = process.env.REACT_APP_CATALOGUE_SERVICE_URL || 'http://localhost:3001';
  const CART_SERVICE_URL = process.env.REACT_APP_CART_SERVICE_URL || 'http://localhost:3002';

  useEffect(() => {
    fetchWigs();
  }, []);

  const fetchWigs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CATALOGUE_SERVICE_URL}/api/wigs`);
      setWigs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load wigs. Please try again later.');
      console.error('Error fetching wigs:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (wig) => {
    try {
      await axios.post(`${CART_SERVICE_URL}/api/cart/${sessionId}`, {
        wigId: wig._id,
        name: wig.name,
        price: wig.price,
        imageUrl: wig.imageUrl
      });
      updateCartCount();
      alert(`${wig.name} added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading wigs...</div></div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="container">
      <div className="catalogue-header">
        <h2>Our Premium Wig Collection</h2>
        <p>Browse our selection of high-quality wigs</p>
      </div>

      {wigs.length === 0 ? (
        <div className="empty-catalogue">
          <p>No wigs available at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="wigs-grid">
          {wigs.map((wig) => (
            <div key={wig._id} className="wig-card">
              <div className="wig-image">
                {wig.imageUrl ? (
                  <img src={`${CATALOGUE_SERVICE_URL}${wig.imageUrl}`} alt={wig.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="wig-details">
                <h3>{wig.name}</h3>
                {wig.description && <p className="wig-description">{wig.description}</p>}
                {wig.category && <span className="wig-category">{wig.category}</span>}
                <div className="wig-footer">
                  <span className="wig-price">${wig.price.toFixed(2)}</span>
                  {wig.inStock ? (
                    <button className="btn btn-primary" onClick={() => addToCart(wig)}>
                      Add to Cart
                    </button>
                  ) : (
                    <button className="btn btn-disabled" disabled>
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalogue;