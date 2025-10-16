/**
 * Loyalty Detail Page Component
 * Shows detailed information for a specific loyalty account with edit capability
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiSave, 
  FiX,
  FiUser,
  FiStar,
  FiAward
} from 'react-icons/fi';
import './Loyalty.css';

// PUBLIC_INTERFACE
/**
 * Loyalty account detail page with view and edit functionality
 * Loads account via GET /loyalty/{id} and allows saving changes via PUT /loyalty/{id}
 * @returns {JSX.Element} Loyalty detail page component
 */
const LoyaltyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Form data for editing
  const [formData, setFormData] = useState({
    guestId: '',
    points: 0,
    tier: 'bronze',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAccountDetail();
  }, [id]);

  /**
   * Fetch loyalty account details from API
   * @private
   */
  const fetchAccountDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/loyalty/${id}`);
      setAccount(response.data);
      setFormData({
        guestId: response.data.guestId,
        points: response.data.points,
        tier: response.data.tier,
      });
    } catch (err) {
      console.error('Failed to fetch loyalty account details:', err);
      setError(err.response?.data?.message || 'Failed to load loyalty account details. Please try again.');
    } finally {
      setLoading(false);
    }
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
   * Enable edit mode
   * @private
   */
  const enableEditMode = () => {
    setIsEditing(true);
    setError(null);
  };

  /**
   * Cancel edit mode and reset form
   * @private
   */
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      guestId: account.guestId,
      points: account.points,
      tier: account.tier,
    });
    setFormErrors({});
  };

  /**
   * Save changes to loyalty account
   * @private
   */
  const saveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setSaveLoading(true);
    setError(null);

    try {
      const accountData = {
        ...formData,
        id: account.id,
        points: parseInt(formData.points, 10),
      };

      const response = await apiClient.put(`/loyalty/${id}`, accountData);
      
      // Update local state with saved data
      setAccount(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update loyalty account:', err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Navigate back to loyalty accounts list
   * @private
   */
  const goBack = () => {
    navigate('/loyalty');
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
    return <LoadingSpinner message="Loading loyalty account details..." size="large" />;
  }

  if (!account) {
    return (
      <div className="loyalty-detail-container">
        <ErrorMessage
          message="Loyalty account not found"
          title="Not Found"
          type="error"
          onRetry={fetchAccountDetail}
        />
        <button className="btn btn-secondary" onClick={goBack}>
          <FiArrowLeft />
          Back to Loyalty Accounts
        </button>
      </div>
    );
  }

  return (
    <div className="loyalty-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={goBack}>
          <FiArrowLeft />
          Back to Loyalty Accounts
        </button>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={enableEditMode}>
              <FiEdit2 />
              Edit Account
            </button>
          ) : (
            <>
              <button 
                className="btn btn-secondary" 
                onClick={cancelEdit}
                disabled={saveLoading}
              >
                <FiX />
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={saveChanges}
                disabled={saveLoading}
              >
                <FiSave />
                {saveLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          title="Error"
          type="error"
          onDismiss={() => setError(null)}
        />
      )}

      {/* Account Details */}
      <div className="detail-content">
        <div className="detail-card">
          <div className="card-header">
            <h2 className="card-title">Loyalty Account Information</h2>
            <span className={`tier-badge-large ${getTierClass(account.tier)}`}>
              {account.tier}
            </span>
          </div>

          <div className="detail-grid">
            {/* Guest Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiUser className="section-icon" />
                Guest Details
              </h3>
              <div className="detail-row">
                <label>Guest ID</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="text"
                      value={formData.guestId}
                      onChange={(e) => handleFormChange('guestId', e.target.value)}
                      className={formErrors.guestId ? 'input-error' : ''}
                    />
                    {formErrors.guestId && (
                      <span className="error-text">{formErrors.guestId}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">{account.guestId}</span>
                )}
              </div>
            </div>

            {/* Points Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiStar className="section-icon" />
                Points Details
              </h3>
              <div className="detail-row">
                <label>Total Points</label>
                {isEditing ? (
                  <div className="edit-field">
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => handleFormChange('points', e.target.value)}
                      className={formErrors.points ? 'input-error' : ''}
                      min="0"
                    />
                    {formErrors.points && (
                      <span className="error-text">{formErrors.points}</span>
                    )}
                  </div>
                ) : (
                  <span className="detail-value">
                    <div className="points-display">
                      <FiStar className="points-icon" />
                      {formatPoints(account.points)}
                    </div>
                  </span>
                )}
              </div>
            </div>

            {/* Tier Information */}
            <div className="detail-section">
              <h3 className="section-title">
                <FiAward className="section-icon" />
                Tier Status
              </h3>
              <div className="detail-row">
                <label>Current Tier</label>
                {isEditing ? (
                  <div className="edit-field">
                    <select
                      value={formData.tier}
                      onChange={(e) => handleFormChange('tier', e.target.value)}
                      className={`tier-select ${formErrors.tier ? 'input-error' : ''}`}
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
                ) : (
                  <span className={`tier-badge-large ${getTierClass(account.tier)}`}>
                    {account.tier}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Account ID */}
          <div className="loyalty-id-section">
            <label>Account ID:</label>
            <code>{account.id}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDetailPage;
