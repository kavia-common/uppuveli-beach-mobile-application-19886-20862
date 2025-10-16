import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Dashboard.css';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Toast from '../components/Toast';
import { useToast } from '../hooks/useToast';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';

/**
 * PUBLIC_INTERFACE
 * DashboardPage: Fetch lightweight metrics and display as cards.
 * Metrics fetched:
 * - bookingsCount: GET /bookings -> count
 * - loyaltyCount: GET /loyalty -> count
 * - boutiqueCount: GET /boutique -> count
 * Handles a11y, loading, error states. Shows toast on refresh success/error.
 */
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [metrics, setMetrics] = useState({
    bookingsCount: 0,
    loyaltyCount: 0,
    boutiqueCount: 0,
  });

  const { toasts, addError, addSuccess, dismiss } = useToast();

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      // Fetch in parallel
      const [bookingsRes, loyaltyRes, boutiqueRes] = await Promise.all([
        apiClient.get(endpoints.bookings.list()),
        apiClient.get(endpoints.loyalty.list()),
        apiClient.get(endpoints.boutique.list()),
      ]);

      const bookingsCount = Array.isArray(bookingsRes?.data) ? bookingsRes.data.length : 0;
      const loyaltyCount = Array.isArray(loyaltyRes?.data) ? loyaltyRes.data.length : 0;
      const boutiqueCount = Array.isArray(boutiqueRes?.data) ? boutiqueRes.data.length : 0;

      setMetrics({ bookingsCount, loyaltyCount, boutiqueCount });
      setLoading(false);
      addSuccess('Dashboard refreshed');
    } catch (err) {
      setLoading(false);
      // Try to normalize to API error schema if possible
      const serverData = err?.response?.data;
      const normalized =
        serverData && (serverData.error_code || serverData.message)
          ? serverData
          : {
              error_code: 'NETWORK_OR_UNKNOWN',
              message: err?.message || 'Failed to load metrics',
              details: serverData || null,
            };
      setApiError(normalized);
      addError('Failed to refresh dashboard');
    }
  }, [addError, addSuccess]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <LoadingSpinner label="Loading dashboard metrics" message="Loading dashboard..." size="large" />
        </div>
      );
    }
    if (apiError) {
      return (
        <div style={{ padding: 16 }}>
          <ErrorMessage apiError={apiError} onRetry={fetchMetrics} />
        </div>
      );
    }
    return (
      <div className="dashboard-grid">
        <div className="dashboard-card" role="group" aria-label="Total bookings">
          <h3>Total Bookings</h3>
          <p>{metrics.bookingsCount}</p>
        </div>
        <div className="dashboard-card" role="group" aria-label="Loyalty accounts">
          <h3>Loyalty Accounts</h3>
          <p>{metrics.loyaltyCount}</p>
        </div>
        <div className="dashboard-card" role="group" aria-label="Boutique items">
          <h3>Boutique Items</h3>
          <p>{metrics.boutiqueCount}</p>
        </div>
      </div>
    );
  }, [loading, apiError, metrics, fetchMetrics]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={fetchMetrics} aria-label="Refresh dashboard">
            Refresh
          </button>
        </div>
      </div>
      {content}
      <Toast toasts={toasts} onDismiss={dismiss} position="top-right" />
    </div>
  );
};

export default DashboardPage;
