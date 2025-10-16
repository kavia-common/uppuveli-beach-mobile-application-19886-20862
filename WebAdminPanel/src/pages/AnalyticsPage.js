/**
 * Analytics Page
 * Displays analytics and reports
 */
import React, { useEffect, useState } from 'react';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import './AnalyticsPage.css';

// PUBLIC_INTERFACE
/**
 * Analytics page component
 */
const AnalyticsPage = () => {
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
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchAnalytics} />;
  }

  return (
    <div className="analytics-page">
      <h1>Analytics & Reports</h1>
      <div className="analytics-content">
        <pre>{JSON.stringify(analytics, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AnalyticsPage;
