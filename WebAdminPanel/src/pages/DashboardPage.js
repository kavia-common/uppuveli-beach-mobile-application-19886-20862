/**
 * Dashboard Page
 * Main dashboard with overview widgets
 */
import React, { useEffect, useState } from 'react';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import './DashboardPage.css';

// PUBLIC_INTERFACE
/**
 * Dashboard page component
 */
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsService.getData();
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAnalytics} />;
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Total Bookings</h3>
          <p className="widget-value">{analytics?.totalBookings || 0}</p>
        </div>
        <div className="widget">
          <h3>Active Guests</h3>
          <p className="widget-value">{analytics?.activeGuests || 0}</p>
        </div>
        <div className="widget">
          <h3>Revenue</h3>
          <p className="widget-value">${analytics?.revenue || 0}</p>
        </div>
        <div className="widget">
          <h3>Loyalty Members</h3>
          <p className="widget-value">{analytics?.loyaltyMembers || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
