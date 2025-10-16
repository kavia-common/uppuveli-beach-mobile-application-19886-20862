/**
 * Boutique List Page
 * Lists all boutique items
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import boutiqueService from '../../services/boutiqueService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './BoutiqueListPage.css';

// PUBLIC_INTERFACE
/**
 * Boutique list page component
 */
const BoutiqueListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boutiqueService.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load boutique items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await boutiqueService.delete(id);
        fetchItems();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading boutique items..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchItems} />;
  }

  return (
    <div className="boutique-list-page">
      <div className="page-header">
        <h1>Boutique Items</h1>
        <button className="btn-primary" onClick={() => navigate('/boutique/new')}>
          New Item
        </button>
      </div>
      <div className="items-grid">
        {items.length === 0 ? (
          <p className="no-data">No boutique items found</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">${item.price}</p>
              <p className="item-stock">Stock: {item.stock}</p>
              <div className="item-actions">
                <button
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/boutique/${item.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BoutiqueListPage;
