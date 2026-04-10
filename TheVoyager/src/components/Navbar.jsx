import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Explore' },
    { to: '/planner', label: 'Plan Trip' },
    { to: '/my-trips', label: 'My Trips' },
    { to: '/compare', label: 'Itineraries' },
  ];

  const isActive = (path) => location.pathname === path;

  const userInitial = user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl shadow-[0_40px_60px_rgba(0,0,0,0.04)] dark:shadow-none">
      <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-full relative">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-headline truncate">
            The Ethereal Voyager
          </Link>
          <div className="hidden md:flex gap-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`${isActive(to)
                  ? 'text-indigo-600 dark:text-indigo-300 font-semibold border-b-2 border-indigo-600'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors duration-200'}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          {user ? (
            <>
              <Link to="/planner" className="hidden sm:block">
                <button className="bg-gradient-to-br from-primary to-secondary text-on-primary px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold scale-105 active:scale-95 transition-transform text-sm md:text-base">
                  Plan Trip
                </button>
              </Link>
              {/* User Avatar Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full signature-gradient text-white font-bold text-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  title={user.email}
                >
                  {userInitial}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/10 py-2 z-50">
                    <div className="px-4 py-3 border-b border-outline-variant/10">
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-semibold text-on-surface truncate">{user.email}</p>
                    </div>
                    <Link to="/my-trips" onClick={() => setIsUserMenuOpen(false)}>
                      <div className="px-4 py-2.5 flex items-center gap-3 text-sm text-on-surface hover:bg-surface-container-low cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-lg text-on-surface-variant">luggage</span>
                        My Trips
                      </div>
                    </Link>
                    <button
                      id="signout-btn"
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-error hover:bg-error/5 cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <button className="px-4 md:px-5 py-2 md:py-2.5 rounded-full font-semibold text-primary border-2 border-primary/20 hover:bg-primary/5 transition-all text-sm md:text-base">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gradient-to-br from-primary to-secondary text-on-primary px-4 md:px-6 py-2 md:py-2.5 rounded-full font-semibold scale-105 active:scale-95 transition-transform text-sm md:text-base">
                  Get Started
                </button>
              </Link>
            </>
          )}
          <button
            className="md:hidden flex items-center justify-center text-on-surface-variant ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex flex-col px-6 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${isActive(to) ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'} py-2.5 border-b border-slate-100 dark:border-slate-800/50`}
              >
                {label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="w-full mt-4 flex items-center justify-center gap-2 text-error font-bold border-2 border-error/20 py-3 rounded-full hover:bg-error/5 transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
                Sign Out
              </button>
            ) : (
              <div className="flex gap-3 pt-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <button className="w-full py-3 rounded-full font-bold text-primary border-2 border-primary/20 hover:bg-primary/5 transition-all">Sign In</button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex-1">
                  <button className="w-full bg-gradient-to-br from-primary to-secondary text-on-primary py-3 rounded-full font-bold shadow-md">Get Started</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

