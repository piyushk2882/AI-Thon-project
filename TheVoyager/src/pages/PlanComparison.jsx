import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// --- Map Embed Component using OpenStreetMap ---
const MapEmbed = ({ places, destination }) => {
  // Use the first place's coordinates, or fall back to geocoding the destination name
  const mainPlace = places && places.length > 0 ? places[0] : null;
  
  let mapSrc;
  if (mainPlace && mainPlace.lat && mainPlace.lng) {
    // Build a bounding box around the main place
    const delta = 0.02;
    const bbox = `${mainPlace.lng - delta},${mainPlace.lat - delta},${mainPlace.lng + delta},${mainPlace.lat + delta}`;
    mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mainPlace.lat},${mainPlace.lng}`;
  } else {
    // Fallback: search for the destination
    mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=0,0,0,0&layer=mapnik`;
  }

  return (
    <div className="rounded-xl overflow-hidden border border-outline-variant/20 shadow-md">
      <div className="bg-surface-container px-4 py-2.5 flex items-center gap-2 border-b border-outline-variant/10">
        <span className="material-symbols-outlined text-primary text-sm">map</span>
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Map View</span>
        <span className="text-xs text-on-surface-variant ml-auto opacity-60">via OpenStreetMap</span>
      </div>
      <iframe
        title="Day Map"
        src={mapSrc}
        width="100%"
        height="220"
        style={{ border: 0, display: 'block' }}
        allowFullScreen
        loading="lazy"
      />
      {/* Place markers list */}
      {places && places.length > 0 && (
        <div className="bg-surface-container-lowest p-3 flex flex-wrap gap-2">
          {places.map((place, i) => (
            <a
              key={i}
              href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=15/${place.lat}/${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/8 hover:bg-primary/15 text-primary rounded-full text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs" style={{ fontSize: '12px' }}>location_on</span>
              {place.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Price Range Badge ---
const PriceTag = ({ range }) => {
  const colors = {
    '$': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '$$': 'bg-amber-50 text-amber-700 border-amber-200',
    '$$$': 'bg-orange-50 text-orange-700 border-orange-200',
    '$$$$': 'bg-rose-50 text-rose-700 border-rose-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colors[range] || 'bg-surface text-on-surface-variant border-outline-variant/20'}`}>
      {range || '$'}
    </span>
  );
};

// --- Day Card Component ---
const DayCard = ({ day, index, isPremium, isOpen, onToggle }) => {
  const accentColor = isPremium ? 'secondary' : 'primary';
  const dayData = typeof day === 'string' ? null : day;

  // Legacy string format fallback
  if (!dayData || typeof dayData === 'string') {
    const content = typeof day === 'string' ? day.split(': ').slice(1).join(': ') || day : '';
    return (
      <div className="relative pl-16 group">
        <div className={`absolute left-2 top-0 w-8 h-8 rounded-full bg-${accentColor} ring-4 ring-surface-container-low z-10 flex items-center justify-center text-on-primary text-xs font-bold`}>
          {index + 1}
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <span className={`text-${accentColor} font-bold tracking-widest uppercase text-sm`}>Day {String(index + 1).padStart(2, '0')}</span>
          <p className="text-on-surface-variant leading-relaxed mt-2">{content}</p>
        </div>
      </div>
    );
  }

  const timelineItems = [
    { icon: 'wb_sunny', label: 'Morning', text: dayData.morning, color: 'text-amber-500' },
    { icon: 'partly_cloudy_day', label: 'Afternoon', text: dayData.afternoon, color: 'text-sky-500' },
    { icon: 'nightlight', label: 'Evening', text: dayData.evening, color: 'text-indigo-500' },
  ];

  return (
    <div className="relative group">
      {/* Timeline connector dot */}
      <div className={`absolute left-0 top-6 w-10 h-10 rounded-full bg-${accentColor} ring-4 ring-surface-container-low z-10 flex items-center justify-center text-on-primary text-sm font-extrabold shadow-lg`}>
        {index + 1}
      </div>

      <div className="ml-16 bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-outline-variant/10">
        {/* Day Header - Clickable */}
        <button
          onClick={onToggle}
          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-surface-container/50 transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div>
              <div className={`text-xs font-black uppercase tracking-widest text-${accentColor} mb-0.5`}>
                Day {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-bold text-on-surface truncate">{dayData.title || `Day ${index + 1}`}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Mini preview badges */}
            {dayData.places && dayData.places.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-primary/8 text-primary rounded-full text-xs font-bold">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>explore</span>
                {dayData.places.length} places
              </span>
            )}
            {dayData.restaurants && dayData.restaurants.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-secondary/8 text-secondary rounded-full text-xs font-bold">
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>restaurant</span>
                {dayData.restaurants.length} eats
              </span>
            )}
            <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
        </button>

        {/* Expandable Content */}
        {isOpen && (
          <div className="border-t border-outline-variant/10">
            {/* Schedule Timeline */}
            <div className="px-6 pt-5 pb-4 space-y-4">
              {timelineItems.map(item => item.text && (
                <div key={item.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined text-base ${item.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="w-px flex-1 bg-outline-variant/20 mt-1 mb-1"></div>
                  </div>
                  <div className="pb-4 min-w-0">
                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{item.label}</span>
                    <p className="text-sm text-on-surface leading-relaxed mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Places to Visit */}
            {dayData.places && dayData.places.length > 0 && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                  <h4 className="text-sm font-black uppercase tracking-wider text-on-surface">Must-Visit Places</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {dayData.places.map((place, i) => (
                    <a
                      key={i}
                      href={place.lat && place.lng
                        ? `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`
                        : `https://www.openstreetmap.org/search?query=${encodeURIComponent(place.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 p-3 rounded-xl bg-surface-container hover:bg-primary/5 border border-outline-variant/10 hover:border-primary/20 transition-all group/place"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface group-hover/place:text-primary transition-colors truncate">{place.name}</p>
                        <p className="text-xs text-on-surface-variant leading-tight mt-0.5">{place.description}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Map Embed */}
                <MapEmbed places={dayData.places} />
              </div>
            )}

            {/* Restaurants */}
            {dayData.restaurants && dayData.restaurants.length > 0 && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                  <h4 className="text-sm font-black uppercase tracking-wider text-on-surface">Where to Eat</h4>
                </div>
                <div className="space-y-2">
                  {dayData.restaurants.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant/10">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>lunch_dining</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-on-surface truncate">{r.name}</p>
                          <p className="text-xs text-on-surface-variant">{r.cuisine}</p>
                        </div>
                      </div>
                      <PriceTag range={r.price_range} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Tip */}
            {dayData.tip && (
              <div className="mx-6 mb-5 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60">
                <span className="material-symbols-outlined text-amber-500 text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-amber-700 mb-0.5">Pro Tip</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{dayData.tip}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


// Helper: derive total from cost_breakdown since AI doesn't return total_cost
const totalCost = (plan) => {
  if (!plan?.cost_breakdown) return 0;
  const { travel = 0, stay = 0, food = 0, activities = 0 } = plan.cost_breakdown;
  return travel + stay + food + activities;
};

// --- Main PlanComparison Component ---
const PlanComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plans = location.state?.plans;
  const formData = location.state?.formData || {};
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState('');
  const [openDays, setOpenDays] = useState({});

  const handleFinalize = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/compare' } } });
      return;
    }

    setIsFinalizing(true);
    setFinalizeError('');

    try {
      // Step 1: Insert trip record
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          location: formData.location || 'Unknown',
          days: parseInt(formData.days) || 0,
          people: parseInt(formData.people) || 0,
          profile: formData.profile || 'solo',
        })
        .select()
        .single();

      if (tripError) throw tripError;

      const tripId = tripData.id;

      // Step 2: Insert all 3 generated plans
      const planInserts = plans.map((plan) => ({
        trip_id: tripId,
        type: plan.type,
        itinerary: plan.itinerary,
        cost_breakdown: plan.cost_breakdown,
        transport: plan.transport || '',
        hotel: plan.hotel || '',
      }));

      const { error: planError } = await supabase.from('plans').insert(planInserts);
      if (planError) throw planError;

      // Step 3: Redirect to My Trips
      navigate('/my-trips');
    } catch (err) {
      console.error('Finalize error:', err);
      setFinalizeError(err.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsFinalizing(false);
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Open first day by default when plan changes
  useEffect(() => {
    setOpenDays({ 0: true });
  }, [selectedPlanIndex]);

  const toggleDay = (idx) => {
    setOpenDays(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAll = () => {
    const selected = plans?.[selectedPlanIndex];
    if (!selected?.itinerary) return;
    const all = {};
    selected.itinerary.forEach((_, i) => { all[i] = true; });
    setOpenDays(all);
  };

  const collapseAll = () => setOpenDays({});

  if (!plans || plans.length === 0) {
    return (
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center items-center h-[70vh]">
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">No Plans Found</h2>
        <p className="text-on-surface-variant mb-8 text-center max-w-md">Please return to the Trip Planner and generate plans using our AI concierge.</p>
        <Link to="/planner">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Back to Trip Planner</button>
        </Link>
      </main>
    );
  }

  const budgetPlan = plans[0] || plans[0];
  const standardPlan = plans[1] || plans[0];
  const premiumPlan = plans[2] || plans[0];
  
  const selectedPlan = plans[selectedPlanIndex] || plans[0];
  const isPremium = selectedPlanIndex === 2;

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header Section */}
      <header className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tight text-on-surface mb-6">
              Tailor Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Custom Escape</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
              Compare our AI-curated tiers for your perfect journey. From essential discovery to ultimate luxury.
          </p>
          {formData.currentLocation && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-semibold text-primary">
              <span className="material-symbols-outlined text-base">my_location</span>
              Departing from: <span className="font-extrabold">{formData.currentLocation}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
              <span className="font-extrabold">{formData.location}</span>
            </div>
          )}
      </header>

      {/* Transport Mode Recommendation Cards */}
      {(budgetPlan.transport || standardPlan.transport || premiumPlan.transport) && (
        <section>
          <h2 className="font-headline text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">connecting_airports</span>
            </div>
            How to Get There
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Budget Transport */}
            <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedPlanIndex === 0 ? 'border-primary bg-primary/5 shadow-lg' : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30'}`}
              onClick={() => setSelectedPlanIndex(0)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sky-600 text-xl">train</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Budget</span>
              </div>
              <p className="text-sm font-semibold text-on-surface leading-relaxed">{budgetPlan.transport || 'Budget transport option'}</p>
              <div className="mt-3 text-xs font-bold text-sky-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">payments</span>
                ~${budgetPlan.cost_breakdown?.travel?.toLocaleString() || 0} travel
              </div>
            </div>
            {/* Standard Transport */}
            <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedPlanIndex === 1 ? 'border-primary bg-primary/5 shadow-lg' : 'border-outline-variant/20 bg-surface-container-lowest hover:border-primary/30'}`}
              onClick={() => setSelectedPlanIndex(1)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">flight</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Standard</span>
              </div>
              <p className="text-sm font-semibold text-on-surface leading-relaxed">{standardPlan.transport || 'Standard transport option'}</p>
              <div className="mt-3 text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">payments</span>
                ~${standardPlan.cost_breakdown?.travel?.toLocaleString() || 0} travel
              </div>
            </div>
            {/* Premium Transport */}
            <div className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedPlanIndex === 2 ? 'border-secondary bg-secondary/5 shadow-lg' : 'border-outline-variant/20 bg-surface-container-lowest hover:border-secondary/30'}`}
              onClick={() => setSelectedPlanIndex(2)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-xl">flight_class</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Premium</span>
              </div>
              <p className="text-sm font-semibold text-on-surface leading-relaxed">{premiumPlan.transport || 'Premium transport option'}</p>
              <div className="mt-3 text-xs font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">payments</span>
                ~${premiumPlan.cost_breakdown?.travel?.toLocaleString() || 0} travel
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Plan Comparison Table Section */}
      <section className="bg-surface-container-low p-1 px-1 md:p-8 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 md:gap-6 min-w-[800px] md:min-w-0">
              {/* Row: Empty Header */}
              <div className="flex items-end pb-4 font-headline font-bold text-lg text-on-surface-variant">Feature</div>
              
              {/* Budget Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 0 ? 'border-primary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 0 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Selected</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 0 ? 'text-primary' : 'text-outline'}`}>Budget</span>
                  <div className="text-3xl font-extrabold text-on-surface">${totalCost(budgetPlan).toLocaleString()}</div>
              </div>
              
              {/* Standard Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 1 ? 'border-primary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Most Popular</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 1 ? 'text-primary' : 'text-outline'}`}>Standard</span>
                  <div className="text-3xl font-extrabold text-on-surface">${totalCost(standardPlan).toLocaleString()}</div>
              </div>
              
              {/* Premium Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 2 ? 'border-secondary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 2 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Selected</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 2 ? 'text-secondary' : 'text-outline'}`}>Premium</span>
                  <div className="text-3xl font-extrabold text-on-surface">${totalCost(premiumPlan).toLocaleString()}</div>
              </div>

              {/* Feature Rows */}
              <div className="py-4 font-semibold text-on-surface-variant border-b border-surface-variant flex items-center">Stay</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${budgetPlan.cost_breakdown?.stay || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant font-medium text-on-surface bg-surface-container-lowest flex items-center justify-center">${standardPlan.cost_breakdown?.stay || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${premiumPlan.cost_breakdown?.stay || 0}</div>
              
              <div className="py-4 font-semibold text-on-surface-variant border-b border-surface-variant flex items-center">Transport</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex flex-col items-center justify-center text-xs px-2 gap-1"><span className="font-bold text-sm">${budgetPlan.cost_breakdown?.travel || 0}</span> <span>{budgetPlan.transport || ""}</span></div>
              <div className="py-4 text-center border-b border-surface-variant font-medium text-on-surface bg-surface-container-lowest flex flex-col items-center justify-center text-xs px-2 gap-1"><span className="font-bold text-sm">${standardPlan.cost_breakdown?.travel || 0}</span> <span>{standardPlan.transport || ""}</span></div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex flex-col items-center justify-center text-xs px-2 gap-1"><span className="font-bold text-sm">${premiumPlan.cost_breakdown?.travel || 0}</span> <span>{premiumPlan.transport || ""}</span></div>
              
              <div className="py-4 font-semibold text-on-surface-variant border-b border-surface-variant flex items-center">Activities</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${budgetPlan.cost_breakdown?.activities || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant font-medium text-on-surface bg-surface-container-lowest flex items-center justify-center">${standardPlan.cost_breakdown?.activities || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${premiumPlan.cost_breakdown?.activities || 0}</div>
              
              <div className="py-4 font-semibold text-on-surface-variant border-b border-surface-variant flex items-center">Dining</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${budgetPlan.cost_breakdown?.food || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant font-medium text-on-surface bg-surface-container-lowest flex items-center justify-center">${standardPlan.cost_breakdown?.food || 0}</div>
              <div className="py-4 text-center border-b border-surface-variant text-on-surface flex items-center justify-center">${premiumPlan.cost_breakdown?.food || 0}</div>
              
              {/* Footer Action Buttons */}
              <div></div>
              <div className="py-6 flex justify-center">
                  <button onClick={() => setSelectedPlanIndex(0)} className={`${selectedPlanIndex === 0 ? 'bg-primary text-on-primary px-8 shadow-lg shadow-primary/20 scale-105' : 'text-primary hover:bg-surface-container-high px-6'} py-3 rounded-full font-bold transition-all`}>Select Budget</button>
              </div>
              <div className="py-6 flex justify-center bg-surface-container-lowest rounded-b-lg">
                  <button onClick={() => setSelectedPlanIndex(1)} className={`${selectedPlanIndex === 1 ? 'bg-primary text-on-primary px-8 shadow-lg shadow-primary/20 scale-105' : 'text-primary hover:bg-surface-container-high px-6'} py-3 rounded-full font-bold transition-all`}>Select Standard</button>
              </div>
              <div className="py-6 flex justify-center">
                  <button onClick={() => setSelectedPlanIndex(2)} className={`${selectedPlanIndex === 2 ? 'bg-secondary text-on-secondary px-8 shadow-lg shadow-secondary/20 scale-105' : 'text-secondary hover:bg-surface-container-high px-6'} py-3 rounded-full font-bold transition-all`}>Select Premium</button>
              </div>
          </div>
      </section>

      {/* Detailed Itinerary View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8" id="detailed-itinerary">
          {/* Left: Day-wise Itinerary */}
          <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-3xl font-headline font-bold text-on-surface">Day-by-Day Journey</h2>
                    <p className="text-on-surface-variant text-sm mt-1">Restaurants · Attractions · Maps · Tips</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${isPremium ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'}`}>
                      {selectedPlanIndex === 0 ? '🎒 Budget Tier' : selectedPlanIndex === 1 ? '✈️ Standard Tier' : '👑 Premium Tier'}
                    </span>
                    <button onClick={expandAll} className="text-xs font-bold text-primary hover:underline">Expand All</button>
                    <span className="text-outline-variant">|</span>
                    <button onClick={collapseAll} className="text-xs font-bold text-on-surface-variant hover:underline">Collapse All</button>
                  </div>
              </div>
              
              {/* Rich Timeline */}
              <div className="relative space-y-6">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-full"></div>
                  
                  {selectedPlan.itinerary?.map((day, idx) => (
                      <DayCard
                        key={idx}
                        day={day}
                        index={idx}
                        isPremium={isPremium}
                        isOpen={!!openDays[idx]}
                        onToggle={() => toggleDay(idx)}
                      />
                  ))}
              </div>
          </div>
          
          {/* Right: Cost Breakdown Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
              {/* Sticky Sidebar */}
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Donut Chart & Breakdown */}
                <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${isPremium ? 'bg-secondary/5' : 'bg-primary/5'} rounded-full -mr-16 -mt-16`}></div>
                    <h3 className="text-xl font-headline font-bold mb-6">Cost Breakdown</h3>
                    
                    {/* Simplified CSS Donut Chart */}
                    <div className="relative w-44 h-44 mx-auto mb-8">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#eaeef1" strokeWidth="3.5"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#4a4bd7" strokeDasharray="45 100" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#842cd3" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4"></circle>
                            <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#b5146e" strokeDasharray="30 100" strokeDashoffset="-70" strokeWidth="4"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-extrabold">${totalCost(selectedPlan).toLocaleString()}</span>
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">Total Budget</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-sm font-medium">Accommodation</span>
                            </div>
                            <span className="text-sm font-bold">${selectedPlan.cost_breakdown?.stay || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                <span className="text-sm font-medium">Transport</span>
                            </div>
                            <span className="text-sm font-bold">${selectedPlan.cost_breakdown?.travel || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                                <span className="text-sm font-medium">Dining & Activities</span>
                            </div>
                            <span className="text-sm font-bold">${(selectedPlan.cost_breakdown?.food || 0) + (selectedPlan.cost_breakdown?.activities || 0)}</span>
                        </div>
                    </div>
                    
                    {finalizeError && (
                      <div className="mt-4 flex items-start gap-2 bg-error/10 border border-error/20 text-error p-3 rounded-xl text-xs font-medium">
                        <span className="material-symbols-outlined text-sm shrink-0">error</span>
                        {finalizeError}
                      </div>
                    )}
                    <div className="mt-8 pt-6 border-t border-surface-container space-y-3">
                        <button
                          onClick={handleFinalize}
                          disabled={isFinalizing}
                          className="w-full bg-primary text-on-primary py-4 rounded-full font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                        >
                          {isFinalizing ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                              Finalize Itinerary
                            </>
                          )}
                        </button>
                        <Link to="/dashboard" className="block w-full">
                          <button className="w-full py-4 text-primary font-bold border-2 border-primary/20 rounded-full hover:bg-primary/5 transition-all">
                              Preview Dashboard
                          </button>
                        </Link>
                    </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-sm font-black uppercase tracking-wider text-on-surface-variant mb-3">Trip Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Destination</span>
                      <span className="font-bold text-on-surface">{formData.location || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Duration</span>
                      <span className="font-bold text-on-surface">{formData.days || '—'} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Travelers</span>
                      <span className="font-bold text-on-surface">{formData.people || '—'} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Tier</span>
                      <span className={`font-bold ${isPremium ? 'text-secondary' : 'text-primary'}`}>
                        {selectedPlanIndex === 0 ? 'Budget' : selectedPlanIndex === 1 ? 'Standard' : 'Premium'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant">Days in Itinerary</span>
                      <span className="font-bold text-on-surface">{selectedPlan.itinerary?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
          </aside>
      </div>
    </main>
  );
};

export default PlanComparison;
