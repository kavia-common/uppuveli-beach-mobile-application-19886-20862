/**
 * Loyalty Page Component
 * Lists all loyalty accounts and provides management interface with filters and CRUD operations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiAward, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiFilter,
  FiX,
  FiEye,
  FiStar
} from 'react-icons/fi';
import './Loyalty.css';

// PUBLIC_INTERFACE
/**
 * Loyalty accounts list page with filters, create, edit, and delete functionality
 * Fetches loyalty accounts from GET /loyalty and provides full CRUD operations
 * @returns {JSX.Element} Loyalty page component
 */
const LoyaltyPage = () => {
  const navigate = useNavigate();
  const [loyaltyAccounts, setLoyaltyAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    tier: '',
    minPoints: '',
    searchGuestId: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    guestId: '',
    points: 0,
    tier: 'bronze',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchLoyaltyAccounts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [loyaltyAccounts, filters]);

  /**
   * Fetch loyalty accounts from API
   * @private
   */
  const fetchLoyaltyAccounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get('/loyalty');
      setLoyaltyAccounts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch loyalty accounts:', err);
      setError(err.response?.data?.message || 'Failed to load loyalty accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Apply filters to loyalty accounts list
   * @private
   */
  const applyFilters = () => {
    let filtered = [...loyaltyAccounts];

    // Filter by tier
    if (filters.tier) {
      filtered = filtered.filter(account => account.tier === filters.tier);
    }

    // Filter by minimum points
    if (filters.minPoints) {
      const minPoints = parseInt(filters.minPoints, 10);
      filtered = filtered.filter(account => account.points >= minPoints);
    }

    // Filter by guest ID (search)
    if (filters.searchGuestId) {
      const search = filters.searchGuestId.toLowerCase();
      filtered = filtered.filter(account => 
        account.guestId.toLowerCase().includes(search)
      );
    }

    setFilteredAccounts(filtered);
  };

  /**
   * Handle filter change
   * @private
   */
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Clear all filters
   * @private
   */
  const clearFilters = () => {
    setFilters({
      tier: '',
      minPoints: '',
      searchGuestId: '',
    });
  };

  /**
   * Validate form data
   * @private
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.guestId.trim()) {
      errors.guestId = 'Guest ID is required';
    }

    if (formData.points < 0) {
      errors.points = 'Points cannot be negative';
    }

    if (!formData.tier) {
      errors.tier = 'Tier is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle form field change
   * @private
   */
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Reset form data
   * @private
   */
  const resetForm = () => {
    setFormData({
      guestId: '',
      points: 0,
      tier: 'bronze',
    });
    setFormErrors({});
  };

  /**
   * Open create modal
   * @private
   */
  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  /**
   * Open edit modal
   * @private
   */
  const openEditModal = (account) => {
    setSelectedAccount(account);
    setFormData({
      guestId: account.guestId,
      points: account.points,
      tier: account.tier,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  /**
   * Open delete confirmation modal
   * @private
   */
  const openDeleteModal = (account) => {
    setSelectedAccount(account);
    setShowDeleteModal(true);
  };

  /**
   * Close all modals
   * @private
   */
  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedAccount(null);
    resetForm();
  };

  /**
   * Handle create loyalty account
   * @private
   */
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const accountData = {
        ...formData,
        points: parseInt(formData.points, 10),
      };

      const response = await apiClient.post('/loyalty', accountData);
      
      // Optimistic UI update
      setLoyaltyAccounts(prev => [...prev, response.data]);
      
      closeModals();
    } catch (err) {
      console.error('Failed to create loyalty account:', err);
      setError(err.response?.data?.message || 'Failed to create loyalty account. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle update loyalty account
   * @private
   */
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      const accountData = {
        ...formData,
        id: selectedAccount.id,
        points: parseInt(formData.points, 10),
      };

      const response = await apiClient.put(`/loyalty/${selectedAccount.id}`, accountData);
      
      // Optimistic UI update
      setLoyaltyAccounts(prev => 
        prev.map(account => 
          account.id === selectedAccount.id ? response.data : account
        )
      );
      
      closeModals();
    } catch (err) {
      console.error('Failed to update loyalty account:', err);
      setError(err.response?.data?.message || 'Failed to update loyalty account. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handle delete loyalty account
   * @private
   */
  const handleDeleteAccount = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/loyalty/${selectedAccount.id}`);
      
      // Optimistic UI update
      setLoyaltyAccounts(prev => prev.filter(account => account.id !== selectedAccount.id));
      
      closeModals();
    } catch (err) {
      console.error('Failed to delete loyalty account:', err);
      setError(err.response?.data?.message || 'Failed to delete loyalty account. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Navigate to loyalty account detail page
   * @private
   */
  const viewAccountDetail = (accountId) => {
    navigate(`/loyalty/${accountId}`);
  };

  /**
   * Get tier badge class
   * @private
   */
  const getTierClass = (tier) => {
    const tierMap = {
      bronze: 'tier-bronze',
      silver: 'tier-silver',
      gold: 'tier-gold',
      platinum: 'tier-platinum',
    };
    return tierMap[tier] || 'tier-default';
  };

  /**
   * Format points display
   * @private
   */
  const formatPoints = (points) => {
    return points.toLocaleString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading loyalty accounts..." size="large" />;
  }

  return (
    <div className="loyalty-container">
      {/* Header */}
      <div className="loyalty-header">
        <div className="header-title-section">
          <h2 className="page-title">
            <FiAward className="title-icon" />
            Loyalty Accounts Management
          </h2>
          <p className="page-subtitle">
            Manage customer loyalty accounts, points, and tier levels
          </p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <FiPlus />
            New Account
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Error"
          type="error"
          onDismiss={() => setError(null)}
          onRetry={fetchLoyaltyAccounts}
        />
      )}

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-field">
              <label>Tier</label>
              <select
                value={filters.tier}
                onChange={(e) => handleFilterChange('tier', e.target.value)}
                className="filter-select"
              >
                <option value="">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className="filter-field">
              <label>Minimum Points</label>
              <input
                type="number"
                value={filters.minPoints}
                onChange={(e) => handleFilterChange('minPoints', e.target.value)}
                placeholder="e.g., 1000"
                className="filter-input"
                min="0"
              />
            </div>
            <div className="filter-field">
              <label>Search Guest ID</label>
              <input
                type="text"
                value={filters.searchGuestId}
                onChange={(e) => handleFilterChange('searchGuestId', e.target.value)}
                placeholder="Enter guest ID"
                className="filter-input"
              />
            </div>
          </div>
          <button 
            className="btn btn-link"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loyalty Accounts Table */}
      <div className="loyalty-table-container">
        {filteredAccounts.length === 0 ? (
          <div className="empty-state">
            <FiAward className="empty-icon" />
            <h3>No loyalty accounts found</h3>
            <p>
              {loyaltyAccounts.length === 0 
                ? 'Create your first loyalty account to get started.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <table className="loyalty-table">
            <thead>
              <tr>
                <th>Guest ID</th>
                <th>Points</th>
                <th>Tier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.guestId}</td>
                  <td>
                    <div className="points-display">
                      <FiStar className="points-icon" />
                      {formatPoints(account.points)}
                    </div>
                  </td>
                  <td>
                    <span className={`tier-badge ${getTierClass(account.tier)}`}>
                      {account.tier}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => viewAccountDetail(account.id)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => openEditModal(account)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => openDeleteModal(account)}
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Loyalty Account</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateAccount}>
              <div className="modal-body">
                <div className="form-field">
                  <label>Guest ID *</label>
                  <input
                    type="text"
                    value={formData.guestId}
                    onChange={(e) => handleFormChange('guestId', e.target.value)}
                    className={formErrors.guestId ? 'input-error' : ''}
                    placeholder="Enter guest ID"
                  />
                  {formErrors.guestId && (
                    <span className="error-text">{formErrors.guestId}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Points *</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleFormChange('points', e.target.value)}
                    className={formErrors.points ? 'input-error' : ''}
                    min="0"
                    placeholder="0"
                  />
                  {formErrors.points && (
                    <span className="error-text">{formErrors.points}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Tier *</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => handleFormChange('tier', e.target.value)}
                    className={formErrors.tier ? 'input-error' : ''}
                  >
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                  {formErrors.tier && (
                    <span className="error-text">{formErrors.tier}</span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModals}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Loyalty Account</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdateAccount}>
              <div className="modal-body">
                <div className="form-field">
                  <label>Guest ID *</label>
                  <input
                    type="text"
                    value={formData.guestId}
                    onChange={(e) => handleFormChange('guestId', e.target.value)}
                    className={formErrors.guestId ? 'input-error' : ''}
                    placeholder="Enter guest ID"
                  />
                  {formErrors.guestId && (
                    <span className="error-text">{formErrors.guestId}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Points *</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => handleFormChange('points', e.target.value)}
                    className={formErrors.points ? 'input-error' : ''}
                    min="0"
                    placeholder="0"
                  />
                  {formErrors.points && (
                    <span className="error-text">{formErrors.points}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Tier *</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => handleFormChange('tier', e.target.value)}
                    className={formErrors.tier ? 'input-error' : ''}
                  >
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                  {formErrors.tier && (
                    <span className="error-text">{formErrors.tier}</span>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModals}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAccount && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={closeModals}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete the loyalty account for{' '}
                <strong>{selectedAccount.guestId}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeModals}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPage;
