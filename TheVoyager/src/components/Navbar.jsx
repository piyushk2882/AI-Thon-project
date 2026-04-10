import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-[0_40px_60px_rgba(0,0,0,0.04)] dark:shadow-none">
      <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-full relative">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-headline truncate">
            The Ethereal Voyager
          </Link>
          <div className="hidden md:flex gap-8">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-300 font-semibold border-b-2 border-indigo-600' : 'text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors duration-200'}`}
            >
              Explore
            </Link>
            <Link 
              to="/planner" 
              className={`${location.pathname === '/planner' ? 'text-indigo-600 dark:text-indigo-300 font-semibold border-b-2 border-indigo-600' : 'text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors duration-200'}`}
            >
              Plan Trip
            </Link>
            <Link 
              to="/dashboard" 
              className={`${location.pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-300 font-semibold border-b-2 border-indigo-600' : 'text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors duration-200'}`}
            >
              My Trips
            </Link>
            <Link 
              to="/compare" 
              className={`${location.pathname === '/compare' ? 'text-indigo-600 dark:text-indigo-300 font-semibold border-b-2 border-indigo-600' : 'text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors duration-200'}`}
            >
              Itineraries
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Link to="/planner" className="hidden sm:block">
            <button className="bg-gradient-to-br from-primary to-secondary text-on-primary px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold scale-105 active:scale-95 transition-transform text-sm md:text-base">
                Plan Trip
            </button>
          </Link>
          <div className="flex items-center justify-center text-on-surface-variant cursor-pointer">
            <span className="material-symbols-outlined text-2xl md:text-3xl" data-icon="account_circle">account_circle</span>
          </div>
          <button 
            className="md:hidden flex items-center justify-center text-on-surface-variant ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl" data-icon={isMobileMenuOpen ? "close" : "menu"}>
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'} py-2 border-b border-slate-100 dark:border-slate-800/50`}
            >
              Explore
            </Link>
            <Link 
              to="/planner" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/planner' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'} py-2 border-b border-slate-100 dark:border-slate-800/50`}
            >
              Plan Trip
            </Link>
            <Link 
              to="/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'} py-2 border-b border-slate-100 dark:border-slate-800/50`}
            >
              My Trips
            </Link>
            <Link 
              to="/compare" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`${location.pathname === '/compare' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'} py-2 border-b border-slate-100 dark:border-slate-800/50`}
            >
              Itineraries
            </Link>
            <Link to="/planner" onClick={() => setIsMobileMenuOpen(false)} className="sm:hidden pt-4">
              <button className="w-full bg-gradient-to-br from-primary to-secondary text-on-primary px-6 py-3 rounded-full font-bold shadow-md">
                  Plan New Trip
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
