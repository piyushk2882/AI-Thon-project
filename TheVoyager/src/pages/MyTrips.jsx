import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ─── Cost breakdown donut SVG ────────────────────────────────────────────────
const DonutChart = ({ breakdown }) => {
  const total = (breakdown?.travel || 0) + (breakdown?.stay || 0) + (breakdown?.food || 0) + (breakdown?.activities || 0);
  if (!total) return null;

  const travel = ((breakdown.travel / total) * 100).toFixed(1);
  const stay = ((breakdown.stay / total) * 100).toFixed(1);
  const food = ((breakdown.food / total) * 100).toFixed(1);
  const activities = ((breakdown.activities / total) * 100).toFixed(1);

  return (
    <div className="relative w-36 h-36 mx-auto mb-6">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#eaeef1" strokeWidth="3.5" />
        <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#4a4bd7" strokeDasharray={`${stay} 100`} strokeWidth="4" />
        <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#842cd3" strokeDasharray={`${travel} 100`} strokeDashoffset={`-${stay}`} strokeWidth="4" />
        <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#b5146e" strokeDasharray={`${food} 100`} strokeDashoffset={`-${parseFloat(stay) + parseFloat(travel)}`} strokeWidth="4" />
        <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#0ea5e9" strokeDasharray={`${activities} 100`} strokeDashoffset={`-${parseFloat(stay) + parseFloat(travel) + parseFloat(food)}`} strokeWidth="4" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold">${total.toLocaleString()}</span>
        <span className="text-[9px] uppercase font-bold tracking-tighter text-on-surface-variant">Total</span>
      </div>
    </div>
  );
};

// ─── Single Trip Card ─────────────────────────────────────────────────────────
const TripCard = ({ trip }) => {
  const [expanded, setExpanded] = useState(false);
  const plans = trip.plans || [];
  const selectedPlan = plans[0]; // We save all 3, default to the first (the finalized one)

  // Derive total_cost from cost_breakdown since it's not stored as a separate column
  const derivedTotal = (plan) => {
    if (!plan?.cost_breakdown) return 0;
    const { travel = 0, stay = 0, food = 0, activities = 0 } = plan.cost_breakdown;
    return travel + stay + food + activities;
  };

  const tierColors = {
    budget: 'bg-primary-container text-on-primary-container',
    standard: 'bg-secondary-container text-on-secondary-container',
    premium: 'bg-tertiary-container text-on-tertiary-container',
  };

  return (
    <article className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      {/* Trip Header */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-outline-variant/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">flight_takeoff</span>
              <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface">{trip.location}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {trip.days} {trip.days === 1 ? 'day' : 'days'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">group</span>
                {trip.people} {trip.people === 1 ? 'traveler' : 'travelers'}
              </span>
              <span className="flex items-center gap-1.5 capitalize">
                <span className="material-symbols-outlined text-base">person</span>
                {trip.profile}
              </span>
            </div>
          </div>
          {selectedPlan && (
            <div className="flex items-center gap-3 shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider capitalize ${tierColors[selectedPlan.type] || 'bg-surface-container text-on-surface-variant'}`}>
                {selectedPlan.type} plan
              </span>
              <span className="text-2xl font-extrabold text-on-surface">
                ${derivedTotal(selectedPlan).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {selectedPlan && (
        <div className="p-6 md:p-8">
          {/* Plan Tier Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {plans.map((p, i) => (
              <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${tierColors[p.type] || 'bg-surface-container text-on-surface-variant'}`}>
                {p.type}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Itinerary Timeline */}
            <div className="lg:col-span-8">
              <h3 className="font-headline text-lg font-bold mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">route</span>
                Day-wise Itinerary
              </h3>
              <div className="relative space-y-4">
                <div className="absolute left-3.5 top-4 bottom-4 w-0.5 bg-surface-container-highest rounded-full" />
                {(expanded ? selectedPlan.itinerary : selectedPlan.itinerary?.slice(0, 3))?.map((day, idx) => {
                  // Support both new object format and legacy string format
                  const isObject = day && typeof day === 'object';
                  const title = isObject ? (day.title || `Day ${idx + 1}`) : (() => {
                    const parts = String(day).split(': ');
                    return parts.length > 1 ? parts[1] : day;
                  })();
                  const detail = isObject
                    ? [day.morning, day.afternoon, day.evening].filter(Boolean).join(' · ')
                    : null;

                  return (
                    <div key={idx} className="relative pl-10 group">
                      <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold z-10 shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl group-hover:bg-surface-container transition-colors">
                        <p className="text-sm font-semibold text-on-surface mb-1">{title}</p>
                        {detail && <p className="text-xs text-on-surface-variant leading-relaxed">{detail}</p>}
                        {/* Restaurants & places chips */}
                        {isObject && (day.restaurants?.length > 0 || day.places?.length > 0) && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {day.restaurants?.slice(0, 2).map((r, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/8 text-secondary rounded-full text-xs font-medium">
                                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>restaurant</span>
                                {r.name}
                              </span>
                            ))}
                            {day.places?.slice(0, 2).map((p, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/8 text-primary rounded-full text-xs font-medium">
                                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>location_on</span>
                                {p.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {selectedPlan.itinerary?.length > 3 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-10 mt-2 text-primary text-sm font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-base">{expanded ? 'expand_less' : 'expand_more'}</span>
                    {expanded ? 'Show less' : `+${selectedPlan.itinerary.length - 3} more days`}
                  </button>
                )}
              </div>

              {/* Transport */}
              {selectedPlan.transport && (
                <div className="mt-6 flex items-start gap-3 p-4 bg-surface-container-low rounded-xl">
                  <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">train</span>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Transport</p>
                    <p className="text-sm text-on-surface">{selectedPlan.transport}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Cost Breakdown */}
            {selectedPlan.cost_breakdown && (
              <aside className="lg:col-span-4">
                <div className="bg-surface-container-low p-6 rounded-xl">
                  <h3 className="font-headline text-lg font-bold mb-4 text-center">Cost Breakdown</h3>
                  <DonutChart breakdown={selectedPlan.cost_breakdown} />
                  <div className="space-y-3">
                    {[
                      { label: 'Accommodation', key: 'stay', color: 'bg-primary' },
                      { label: 'Transport', key: 'travel', color: 'bg-secondary' },
                      { label: 'Dining', key: 'food', color: 'bg-tertiary' },
                      { label: 'Activities', key: 'activities', color: 'bg-sky-400' },
                    ].map(({ label, key, color }) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="text-on-surface-variant">{label}</span>
                        </div>
                        <span className="font-bold">${selectedPlan.cost_breakdown[key]?.toLocaleString() || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

// ─── Main MyTrips Page ────────────────────────────────────────────────────────
const MyTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchTrips = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch trips for this user
        const { data: tripsData, error: tripErr } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tripErr) throw tripErr;
        if (!tripsData || tripsData.length === 0) {
          setTrips([]);
          return;
        }

        // Fetch all plans for these trips
        const tripIds = tripsData.map((t) => t.id);
        const { data: plansData, error: planErr } = await supabase
          .from('plans')
          .select('*')
          .in('trip_id', tripIds);

        if (planErr) throw planErr;

        // Merge plans into their respective trips
        const merged = tripsData.map((trip) => ({
          ...trip,
          plans: plansData?.filter((p) => p.trip_id === trip.id) || [],
        }));

        setTrips(merged);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to load your trips. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-wider mb-4">
              <span className="material-symbols-outlined text-sm">luggage</span>
              YOUR JOURNEYS
            </span>
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface">
              My <span className="text-gradient">Trips</span>
            </h1>
            <p className="text-on-surface-variant text-lg mt-3 max-w-xl">
              All your AI-crafted itineraries, saved and ready to explore.
            </p>
          </div>
          <Link to="/planner">
            <button className="signature-gradient text-white px-8 py-4 rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shrink-0">
              <span className="material-symbols-outlined">add</span>
              Plan New Trip
            </button>
          </Link>
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="text-on-surface-variant font-medium">Loading your trips...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="material-symbols-outlined text-5xl text-error">cloud_off</span>
          <p className="text-error font-semibold text-xl">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-3 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">
            Retry
          </button>
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-primary">travel_explore</span>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">No trips yet</h2>
            <p className="text-on-surface-variant max-w-sm">Your finalized itineraries will appear here. Let's plan your first adventure!</p>
          </div>
          <Link to="/planner">
            <button className="signature-gradient text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-transform text-lg">
              Start Planning
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyTrips;
