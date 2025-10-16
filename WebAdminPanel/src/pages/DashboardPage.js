/**
 * Dashboard Page Component
 * Main dashboard with overview of hotel operations
 * Fetches data from multiple API endpoints and displays summary cards
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';
import { LoadingSpinner, ErrorMessage } from '../components';
import { 
  FiCalendar, 
  FiAward, 
  FiCreditCard, 
  FiBell, 
  FiBarChart2,
  FiTrendingUp,
  FiUsers,
  FiDollarSign
} from 'react-icons/fi';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard page showing operational overview
 * Fetches summary data from multiple endpoints and displays key metrics
 * @returns {JSX.Element} Dashboard page component
 */
const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: null,
    loyalty: null,
    payments: null,
    notifications: null,
    analytics: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  /**
   * Fetch data from all dashboard endpoints
   * @private
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data from all endpoints in parallel
      const [bookingsRes, loyaltyRes, paymentsRes, notificationsRes, analyticsRes] = await Promise.allSettled([
        apiClient.get('/bookings'),
        apiClient.get('/loyalty'),
        apiClient.get('/payments'),
        apiClient.get('/notifications'),
        apiClient.get('/analytics'),
      ]);

      // Process results
      setDashboardData({
        bookings: bookingsRes.status === 'fulfilled' ? bookingsRes.value.data : null,
        loyalty: loyaltyRes.status === 'fulfilled' ? loyaltyRes.value.data : null,
        payments: paymentsRes.status === 'fulfilled' ? paymentsRes.value.data : null,
        notifications: notificationsRes.status === 'fulfilled' ? notificationsRes.value.data : null,
        analytics: analyticsRes.status === 'fulfilled' ? analyticsRes.value.data : null,
      });

      // Check if all requests failed
      const allFailed = [bookingsRes, loyaltyRes, paymentsRes, notificationsRes, analyticsRes].every(
        res => res.status === 'rejected'
      );

      if (allFailed) {
        setError('Failed to load dashboard data. Please check your connection and try again.');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'An unexpected error occurred while loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle retry action
   * @private
   */
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  /**
   * Calculate summary statistics from data
   * @private
   */
  const getSummaryStats = () => {
    const stats = {
      totalBookings: 0,
      activeBookings: 0,
      totalLoyaltyAccounts: 0,
      totalLoyaltyPoints: 0,
      pendingPayments: 0,
      totalRevenue: 0,
      unreadNotifications: 0,
      conversionRate: 0,
    };

    // Calculate bookings stats
    if (dashboardData.bookings && Array.isArray(dashboardData.bookings)) {
      stats.totalBookings = dashboardData.bookings.length;
      stats.activeBookings = dashboardData.bookings.filter(
        b => b.status === 'booked' || b.status === 'checked_in'
      ).length;
    }

    // Calculate loyalty stats
    if (dashboardData.loyalty && Array.isArray(dashboardData.loyalty)) {
      stats.totalLoyaltyAccounts = dashboardData.loyalty.length;
      stats.totalLoyaltyPoints = dashboardData.loyalty.reduce((sum, acc) => sum + (acc.points || 0), 0);
    }

    // Calculate payment stats
    if (dashboardData.payments && Array.isArray(dashboardData.payments)) {
      stats.pendingPayments = dashboardData.payments.filter(p => p.status === 'pending').length;
      stats.totalRevenue = dashboardData.payments
        .filter(p => p.status === 'completed' || p.status === 'success')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    }

    // Calculate notification stats
    if (dashboardData.notifications && Array.isArray(dashboardData.notifications)) {
      stats.unreadNotifications = dashboardData.notifications.filter(
        n => n.status === 'unread' || n.status === 'pending'
      ).length;
    }

    // Calculate analytics stats
    if (dashboardData.analytics) {
      stats.conversionRate = dashboardData.analytics.conversionRate || 0;
    }

    return stats;
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard data..." size="large" />;
  }

  const stats = getSummaryStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <p className="dashboard-subtitle">
          Real-time insights into hotel operations and key metrics
        </p>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          title="Dashboard Error"
          type="warning"
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="dashboard-grid">
        {/* Bookings Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon bookings-icon">
              <FiCalendar />
            </div>
            <h3 className="card-title">Bookings</h3>
          </div>
          <div className="card-body">
            <div className="card-stat">
              <span className="stat-value">{stats.totalBookings}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="card-stat-secondary">
              <span className="stat-value-small">{stats.activeBookings}</span>
              <span className="stat-label-small">Active</span>
            </div>
          </div>
          <div className="card-footer">
            <FiTrendingUp className="trend-icon" />
            <span className="trend-text">View all bookings</span>
          </div>
        </div>

        {/* Loyalty Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon loyalty-icon">
              <FiAward />
            </div>
            <h3 className="card-title">Loyalty Programs</h3>
          </div>
          <div className="card-body">
            <div className="card-stat">
              <span className="stat-value">{stats.totalLoyaltyAccounts}</span>
              <span className="stat-label">Accounts</span>
            </div>
            <div className="card-stat-secondary">
              <span className="stat-value-small">{stats.totalLoyaltyPoints.toLocaleString()}</span>
              <span className="stat-label-small">Total Points</span>
            </div>
          </div>
          <div className="card-footer">
            <FiUsers className="trend-icon" />
            <span className="trend-text">Manage loyalty accounts</span>
          </div>
        </div>

        {/* Payments Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon payments-icon">
              <FiCreditCard />
            </div>
            <h3 className="card-title">Payments</h3>
          </div>
          <div className="card-body">
            <div className="card-stat">
              <span className="stat-value">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="card-stat-secondary">
              <span className="stat-value-small">{stats.pendingPayments}</span>
              <span className="stat-label-small">Pending</span>
            </div>
          </div>
          <div className="card-footer">
            <FiDollarSign className="trend-icon" />
            <span className="trend-text">Process payments</span>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon notifications-icon">
              <FiBell />
            </div>
            <h3 className="card-title">Notifications</h3>
          </div>
          <div className="card-body">
            <div className="card-stat">
              <span className="stat-value">{stats.unreadNotifications}</span>
              <span className="stat-label">Unread</span>
            </div>
            <div className="card-stat-secondary">
              <span className="stat-label-small">Pending notifications</span>
            </div>
          </div>
          <div className="card-footer">
            <FiBell className="trend-icon" />
            <span className="trend-text">View notifications</span>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="dashboard-card dashboard-card-wide">
          <div className="card-header">
            <div className="card-icon analytics-icon">
              <FiBarChart2 />
            </div>
            <h3 className="card-title">Analytics & Reports</h3>
          </div>
          <div className="card-body">
            <div className="analytics-grid">
              <div className="analytics-item">
                <span className="analytics-label">Conversion Rate</span>
                <span className="analytics-value">{stats.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Active Bookings</span>
                <span className="analytics-value">{stats.activeBookings}</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Revenue</span>
                <span className="analytics-value">${stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <FiBarChart2 className="trend-icon" />
            <span className="trend-text">View detailed analytics</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <h3 className="actions-title">Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => window.location.href = '/bookings'}>
            <FiCalendar />
            <span>Manage Bookings</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/loyalty'}>
            <FiAward />
            <span>Loyalty Programs</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/payments'}>
            <FiCreditCard />
            <span>Process Payments</span>
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/analytics'}>
            <FiBarChart2 />
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
