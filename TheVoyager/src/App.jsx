import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TripPlanner from './pages/TripPlanner';
import PlanComparison from './pages/PlanComparison';
import ResultsDashboard from './pages/ResultsDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<ResultsDashboard />} />

              {/* Protected routes — require login */}
              <Route path="/planner" element={
                <ProtectedRoute><TripPlanner /></ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute><PlanComparison /></ProtectedRoute>
              } />
              <Route path="/my-trips" element={
                <ProtectedRoute><MyTrips /></ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

