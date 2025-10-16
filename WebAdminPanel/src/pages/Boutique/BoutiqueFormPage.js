/**
 * Boutique Form Page
 * Form for creating and editing boutique items
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import boutiqueService from '../../services/boutiqueService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './BoutiqueFormPage.css';

// PUBLIC_INTERFACE
/**
 * Boutique form page component
 */
const BoutiqueFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boutiqueService.getById(id);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        stock: data.stock.toString()
      });
    } catch (err) {
      setError(err.message || 'Failed to load item');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      fetchItem();
    }
  }, [isEdit, fetchItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const submitData = {
      ...formData,
      id: isEdit ? id : undefined,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10)
    };

    try {
      if (isEdit) {
        await boutiqueService.update(id, submitData);
      } else {
        await boutiqueService.create(submitData);
      }
      navigate('/boutique');
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="boutique-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Item' : 'New Item'}</h1>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/boutique')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoutiqueFormPage;
