import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const PlanComparison = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plans = location.state?.plans;
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      </header>

      {/* Plan Comparison Table Section */}
      <section className="bg-surface-container-low p-1 px-1 md:p-8 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 md:gap-6 min-w-[800px] md:min-w-0">
              {/* Row: Empty Header */}
              <div className="flex items-end pb-4 font-headline font-bold text-lg text-on-surface-variant">Feature</div>
              
              {/* Budget Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 0 ? 'border-primary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 0 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Selected</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 0 ? 'text-primary' : 'text-outline'}`}>Budget</span>
                  <div className="text-3xl font-extrabold text-on-surface">${budgetPlan.total_cost?.toLocaleString() || budgetPlan.total_cost}</div>
              </div>
              
              {/* Standard Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 1 ? 'border-primary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 1 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Most Popular</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 1 ? 'text-primary' : 'text-outline'}`}>Standard</span>
                  <div className="text-3xl font-extrabold text-on-surface">${standardPlan.total_cost?.toLocaleString() || standardPlan.total_cost}</div>
              </div>
              
              {/* Premium Header */}
              <div className={`bg-surface-container-lowest p-6 rounded-t-lg text-center space-y-2 border-b-4 ${selectedPlanIndex === 2 ? 'border-secondary shadow-xl relative' : 'border-surface-container'}`}>
                  {selectedPlanIndex === 2 && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter shadow-md">Selected</div>}
                  <span className={`text-sm font-bold tracking-widest uppercase ${selectedPlanIndex === 2 ? 'text-secondary' : 'text-outline'}`}>Premium</span>
                  <div className="text-3xl font-extrabold text-on-surface">${premiumPlan.total_cost?.toLocaleString() || premiumPlan.total_cost}</div>
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
          <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-headline font-bold text-on-surface">Your Selected Itinerary</h2>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${selectedPlanIndex === 2 ? 'bg-secondary-container text-on-secondary-container' : 'bg-primary-container text-on-primary-container'}`}>
                    {selectedPlanIndex === 0 ? 'Budget Tier' : selectedPlanIndex === 1 ? 'Standard Tier' : 'Premium Tier'}
                  </span>
              </div>
              
              {/* Timeline */}
              <div className="relative space-y-12">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-6 top-8 bottom-8 w-2 bg-surface-container-highest rounded-full"></div>
                  
                  {selectedPlan.itinerary?.map((dayStr, idx) => {
                      // Extract simple day title if format is "Day 1: Title - content"
                      const parts = dayStr.split(': ');
                      const content = parts.length > 1 ? parts[1] : dayStr;
                      
                      return (
                          <div key={idx} className="relative pl-20 group">
                              <div className={`absolute left-2.5 top-0 w-8 h-8 rounded-full ${selectedPlanIndex === 2 ? 'bg-secondary' : 'bg-primary'} ring-8 ring-surface-container-low z-10 hidden sm:block`}></div>
                              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                      <span className={`${selectedPlanIndex === 2 ? 'text-secondary' : 'text-primary'} font-bold tracking-widest uppercase text-sm`}>Day 0{idx + 1}</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4 items-center">
                                      <p className="text-on-surface-variant leading-relaxed text-lg">{content}</p>
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
          
          {/* Right: Cost Breakdown Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
              {/* Donut Chart & Breakdown */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-xl relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${selectedPlanIndex === 2 ? 'bg-secondary/5' : 'bg-primary/5'} rounded-full -mr-16 -mt-16`}></div>
                  <h3 className="text-xl font-headline font-bold mb-8">Cost Breakdown</h3>
                  
                  {/* Simplified CSS Donut Chart */}
                  <div className="relative w-48 h-48 mx-auto mb-10">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#eaeef1" strokeWidth="3.5"></circle>
                          <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#4a4bd7" strokeDasharray="45 100" strokeWidth="4"></circle>
                          <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#842cd3" strokeDasharray="25 100" strokeDashoffset="-45" strokeWidth="4"></circle>
                          <circle cx="18" cy="18" fill="transparent" r="15.9" stroke="#b5146e" strokeDasharray="30 100" strokeDashoffset="-70" strokeWidth="4"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-extrabold">${selectedPlan.total_cost?.toLocaleString() || selectedPlan.total_cost}</span>
                          <span className="text-[10px] uppercase font-bold tracking-tighter text-on-surface-variant">Total Budget</span>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
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
                  
                  <div className="mt-8 pt-8 border-t border-surface-container space-y-4">
                      <Link to="/dashboard" className="block w-full">
                        <button className="w-full bg-primary text-on-primary py-4 rounded-full font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                            Finalize Itinerary
                        </button>
                      </Link>
                      <button className="w-full py-4 text-primary font-bold border-2 border-primary/20 rounded-full hover:bg-primary/5 transition-all">
                          Save as Draft
                      </button>
                  </div>
              </div>
          </aside>
      </div>
    </main>
  );
};

export default PlanComparison;
