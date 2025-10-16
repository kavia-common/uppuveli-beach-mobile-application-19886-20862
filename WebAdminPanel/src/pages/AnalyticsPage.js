import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinner, ErrorMessage } from '../components';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';

// PUBLIC_INTERFACE
/**
 * Analytics and reporting page. Fetches analytics data from GET /analytics
 * and displays raw JSON for now.
 * @returns {JSX.Element}
 */
const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const retryBtnRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.get(endpoints.analytics.get());
      setData(res.data || {});
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load analytics');
      setTimeout(() => retryBtnRef.current?.focus(), 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="admin-content">
      <div className="welcome-section">
        <h2 className="welcome-title">Analytics</h2>
        <p className="welcome-description">
          View analytics, reports, and business insights
        </p>
      </div>
      <pre aria-label="Analytics data" style={{ overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default AnalyticsPage;
