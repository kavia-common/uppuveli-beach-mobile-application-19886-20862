/**
 * Loyalty List Page
 * Lists all loyalty accounts
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loyaltyService from '../../services/loyaltyService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import './LoyaltyListPage.css';

// PUBLIC_INTERFACE
/**
 * Loyalty list page component
 */
const LoyaltyListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyService.getAll();
      setAccounts(data);
    } catch (err) {
      setError(err.message || 'Failed to load loyalty accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading loyalty accounts..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAccounts} />;
  }

  return (
    <div className="loyalty-list-page">
      <div className="page-header">
        <h1>Loyalty Accounts</h1>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Guest ID</th>
              <th>Points</th>
              <th>Tier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No loyalty accounts found</td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.guestId}</td>
                  <td>{account.points}</td>
                  <td>
                    <span className="tier-badge">{account.tier}</span>
                  </td>
                  <td>
                    <button
                      className="btn-action btn-view"
                      onClick={() => navigate(`/loyalty/${account.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoyaltyListPage;
