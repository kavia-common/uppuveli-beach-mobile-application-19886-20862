/**
 * Application Routes Configuration
 * Defines all routes for the Web Admin Panel
 * Includes protected routes, public routes, and OAuth callback handling
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import CallbackPage from '../pages/CallbackPage';
import DashboardPage from '../pages/DashboardPage';
import BookingsPage from '../pages/BookingsPage';
import BookingDetailPage from '../pages/BookingDetailPage';
import LoyaltyPage from '../pages/LoyaltyPage';
import LoyaltyDetailPage from '../pages/LoyaltyDetailPage';
import PaymentsPage from '../pages/PaymentsPage';
import NotificationsPage from '../pages/NotificationsPage';
import ChatPage from '../pages/ChatPage';
import BoutiquePage from '../pages/BoutiquePage';
import BoutiqueDetailPage from '../pages/BoutiqueDetailPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import Layout from '../components/Layout';

// PUBLIC_INTERFACE
/**
 * Main routing component for the application
 * Configures all routes with appropriate protection and layout
 * @returns {JSX.Element} Routes configuration
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - only login and callback */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />

      {/* Root should land on dashboard if authenticated */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Navigate to="/dashboard" replace />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Protected routes - require authentication and wrap with Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Bookings */}
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <BookingDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Loyalty */}
      <Route
        path="/loyalty"
        element={
          <ProtectedRoute>
            <Layout>
              <LoyaltyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loyalty/new"
        element={
          <ProtectedRoute>
            <Layout>
              <LoyaltyDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/loyalty/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <LoyaltyDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Other feature routes */}
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Layout>
              <PaymentsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <NotificationsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/boutique"
        element={
          <ProtectedRoute>
            <Layout>
              <BoutiquePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/boutique/new"
        element={
          <ProtectedRoute>
            <Layout>
              <BoutiqueDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/boutique/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <BoutiqueDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all - redirect to login if unauthenticated will be handled by ProtectedRoute on '/' */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
