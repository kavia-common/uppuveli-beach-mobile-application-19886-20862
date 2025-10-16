/**
 * Loyalty Detail Page
 * Displays details of a loyalty account
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import loyaltyService from '../../services/loyaltyService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './LoyaltyDetailPage.css';

// PUBLIC_INTERFACE
/**
 * Loyalty detail page component
 */
const LoyaltyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyService.getById(id);
      setAccount(data);
    } catch (err) {
      setError(err.message || 'Failed to load loyalty account');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  if (loading) {
    return <LoadingSpinner message="Loading account..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAccount} />;
  }

  if (!account) {
    return <ErrorMessage message="Account not found" />;
  }

  return (
    <div className="loyalty-detail-page">
      <div className="page-header">
        <h1>Loyalty Account Details</h1>
        <button className="btn-secondary" onClick={() => navigate('/loyalty')}>
          Back to List
        </button>
      </div>
      <div className="detail-card">
        <div className="detail-row">
          <label>Account ID:</label>
          <span>{account.id}</span>
        </div>
        <div className="detail-row">
          <label>Guest ID:</label>
          <span>{account.guestId}</span>
        </div>
        <div className="detail-row">
          <label>Points:</label>
          <span>{account.points}</span>
        </div>
        <div className="detail-row">
          <label>Tier:</label>
          <span className="tier-badge">{account.tier}</span>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDetailPage;
