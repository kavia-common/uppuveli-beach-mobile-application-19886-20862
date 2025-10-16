/**
 * Main App Component
 * Sets up routing and authentication
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookingsListPage from './pages/Bookings/BookingsListPage';
import BookingDetailPage from './pages/Bookings/BookingDetailPage';
import BookingFormPage from './pages/Bookings/BookingFormPage';
import LoyaltyListPage from './pages/Loyalty/LoyaltyListPage';
import LoyaltyDetailPage from './pages/Loyalty/LoyaltyDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PaymentsPage from './pages/PaymentsPage';
import NotificationsPage from './pages/NotificationsPage';
import ChatPage from './pages/Chat/ChatPage';
import BoutiqueListPage from './pages/Boutique/BoutiqueListPage';
import BoutiqueFormPage from './pages/Boutique/BoutiqueFormPage';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/callback" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/dashboard" replace />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BookingsListPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BookingFormPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BookingDetailPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings/:id/edit"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BookingFormPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/loyalty"
            element={
              <PrivateRoute>
                <MainLayout>
                  <LoyaltyListPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/loyalty/:id"
            element={
              <PrivateRoute>
                <MainLayout>
                  <LoyaltyDetailPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <MainLayout>
                  <AnalyticsPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute>
                <MainLayout>
                  <PaymentsPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <MainLayout>
                  <NotificationsPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ChatPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/boutique"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BoutiqueListPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/boutique/new"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BoutiqueFormPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/boutique/:id/edit"
            element={
              <PrivateRoute>
                <MainLayout>
                  <BoutiqueFormPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
