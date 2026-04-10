import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TripPlanner from './pages/TripPlanner';
import PlanComparison from './pages/PlanComparison';
import ResultsDashboard from './pages/ResultsDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/compare" element={<PlanComparison />} />
            <Route path="/dashboard" element={<ResultsDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
