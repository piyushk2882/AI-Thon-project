import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TripPlanner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    days: '',
    people: '',
    profile: 'solo',
    budget: 5000,
    currentLocation: '',   // user's detected origin city
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Detect current city via browser Geolocation + Nominatim reverse geocoding
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state ||
            'Unknown location';
          setFormData((prev) => ({ ...prev, currentLocation: city }));
        } catch {
          setLocationError('Could not reverse-geocode your position. Please type it manually.');
        } finally {
          setIsDetecting(false);
        }
      },
      (err) => {
        setLocationError('Location access denied. Please type your departure city manually.');
        setIsDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.days || !formData.people) {
      setError('Please fill out all required fields.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate plans');

      // Navigate to comparison with the generated plans AND formData for Supabase save
      navigate('/compare', { state: { plans: data.plans, formData } });
    } catch (err) {
      setError(err.message);
      setIsGenerating(false);
    }
  };
  return (
    <main className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center bg-surface">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Page Header */}
      <header className="text-center mb-12 max-w-2xl">
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6">
              Where will AI take you <span className="text-primary italic">next?</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
              Provide a few details about your ideal escape, and our Digital Concierge will curate a seamless, magazine-worthy itinerary just for you.
          </p>
      </header>

      {/* Input Form Card */}
      <div className="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-[0_40px_60px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row">
          {/* Left Side: Visual/Context */}
          <div className="md:w-1/3 relative bg-primary-container overflow-hidden hidden md:block">
              <img className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" alt="Dreamy landscape of a mist-covered mountain lake at twilight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkRLhxLvwZM74lZTz4yW923X-yF_7ndUKZvwJYJaqQro8pFJqW-reUoQtSRf1hkViytKmADmcLvTERqIK86vmW3mDAKHINLg85Ru-lu10raw-XWE9xco2NFbl10XzzW1EUGBspS1JjvO4Z_hPNWD2-Sl8kCxcSJPCG2GldqkXni7WyQ_MRF1Kbm2N6VKev3cLg4ehEwtd42V7YY_P4kSZYbIbAyD9L4-tTHcwKGa-5rurosdIr4s0S2V6ZhJ7PU8itcZEtcFa7Hlp7"/>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-on-primary-container">
                  <div className="mb-4">
                      <span className="material-symbols-outlined text-4xl" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold mb-2">Curated Journeys</h3>
                  <p className="text-sm opacity-80 leading-relaxed">Our AI analyzes millions of data points to ensure your trip is perfectly balanced between adventure and relaxation.</p>
              </div>
          </div>
          {/* Right Side: Form Fields */}
          <form className="flex-1 p-8 md:p-12 space-y-8 bg-surface-container-lowest" onSubmit={handleSubmit}>
              
              {error && (
                <div className="bg-error/10 text-error p-4 rounded-md text-sm font-semibold border border-error/20">
                  {error}
                </div>
              )}

              {/* Departing From — Current Location */}
              <div className="space-y-3">
                  <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Departing From</label>
                  <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">my_location</span>
                      <input
                        className="w-full pl-12 pr-36 py-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant"
                        placeholder="Your departure city"
                        type="text"
                        value={formData.currentLocation}
                        onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={isDetecting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 rounded-md text-xs font-bold transition-colors disabled:opacity-60"
                      >
                        {isDetecting ? (
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-sm">gps_fixed</span>
                        )}
                        {isDetecting ? 'Detecting...' : 'Auto-detect'}
                      </button>
                  </div>
                  {locationError && (
                    <p className="text-xs text-error font-medium ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      {locationError}
                    </p>
                  )}
                  {formData.currentLocation && !locationError && (
                    <p className="text-xs text-primary font-semibold ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Departing from: {formData.currentLocation}
                    </p>
                  )}
              </div>

              {/* Destination */}
              <div className="space-y-3">
                  <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Destination</label>
                  <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="explore">explore</span>
                      <input 
                        className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                        placeholder="Where do you want to go?" 
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                  </div>
              </div>
              {/* Days & People Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                      <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Number of Days</label>
                      <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="calendar_today">calendar_today</span>
                          <input 
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                            max="90" min="1" 
                            placeholder="Duration" 
                            type="number"
                            value={formData.days}
                            onChange={(e) => setFormData({...formData, days: e.target.value})}
                            required
                          />
                      </div>
                  </div>
                  <div className="space-y-3">
                      <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Number of People</label>
                      <div className="relative group">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors" data-icon="group">group</span>
                          <input 
                            className="w-full pl-12 pr-4 py-4 bg-surface-container-high rounded-md border-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" 
                            min="1" 
                            placeholder="Total travelers" 
                            type="number"
                            value={formData.people}
                            onChange={(e) => setFormData({...formData, people: e.target.value})}
                            required
                          />
                      </div>
                  </div>
              </div>
              {/* Traveler Type */}
              <div className="space-y-3">
                  <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider ml-1">Traveler Type</label>
                  <div className="flex flex-wrap gap-3">
                      <label className="cursor-pointer group">
                          <input 
                            className="hidden peer" 
                            name="traveler_type" 
                            type="radio" 
                            value="solo" 
                            checked={formData.profile === 'solo'}
                            onChange={(e) => setFormData({...formData, profile: e.target.value})}
                          />
                          <div className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant peer-checked:bg-primary peer-checked:text-on-primary transition-all font-medium flex items-center gap-2">
                              <span className="material-symbols-outlined text-xl" data-icon="person">person</span>Solo
                          </div>
                      </label>
                      <label className="cursor-pointer group">
                          <input 
                            className="hidden peer" 
                            name="traveler_type" 
                            type="radio" 
                            value="couple"
                            checked={formData.profile === 'couple'}
                            onChange={(e) => setFormData({...formData, profile: e.target.value})}
                          />
                          <div className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant peer-checked:bg-primary peer-checked:text-on-primary transition-all font-medium flex items-center gap-2">
                              <span className="material-symbols-outlined text-xl" data-icon="favorite">favorite</span>Couple
                          </div>
                      </label>
                      <label className="cursor-pointer group">
                          <input 
                            className="hidden peer" 
                            name="traveler_type" 
                            type="radio" 
                            value="group" 
                            checked={formData.profile === 'group'}
                            onChange={(e) => setFormData({...formData, profile: e.target.value})}
                          />
                          <div className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface-variant peer-checked:bg-primary peer-checked:text-on-primary transition-all font-medium flex items-center gap-2">
                              <span className="material-symbols-outlined text-xl" data-icon="groups">groups</span>Group
                          </div>
                      </label>
                  </div>
              </div>
              {/* Budget Slider */}
              <div className="space-y-4">
                  <div className="flex justify-between items-center ml-1">
                      <label className="block text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Budget Range</label>
                      <span className="text-primary font-bold font-headline">${formData.budget.toLocaleString()}</span>
                  </div>
                  <div className="relative pt-4 px-2">
                      <input 
                        className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer" 
                        max="20000" min="500" step="500" 
                        type="range" 
                        value={formData.budget} 
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      />
                      <div className="flex justify-between mt-4 text-[10px] text-outline uppercase font-bold tracking-widest">
                          <span>Economic</span>
                          <span>Mid-Range</span>
                          <span>Luxury</span>
                      </div>
                  </div>
              </div>
              {/* Submit Button */}
              <div className="pt-6">
                  <button 
                    disabled={isGenerating}
                    type="submit"
                    className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
                  >
                      {isGenerating ? (
                        <>
                          <span className="material-symbols-outlined animate-spin" data-icon="progress_activity" style={{ fontVariationSettings: "'FILL' 1" }}>progress_activity</span>
                          Generating... (This takes 10-15s)
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" data-icon="auto_mode" style={{ fontVariationSettings: "'FILL' 1" }}>auto_mode</span>
                          Generate Plans
                        </>
                      )}
                  </button>
              </div>
          </form>
      </div>
      
      {/* Featured Destinations Preview */}
      <section className="w-full max-w-6xl mt-32 space-y-12">
          <div className="text-center">
              <h2 className="font-headline text-3xl font-bold mb-4">Trending This Season</h2>
              <p className="text-on-surface-variant">Top itineraries created by the community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 gap-6 h-auto md:h-[600px]">
              {/* Item 1 */}
              <div className="md:col-span-7 bg-surface-container-lowest rounded-lg overflow-hidden relative group cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                  <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="London Modernity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAggT13XKtkU48BzMMJQ-g4YGL_KxoKF1kGq6mYD_w23AEaOtjgUdh6p-Vf8kfMfoLnRD0UZqf3HBI4-LJ41Et3G7SKmbC9syNB_vHRto-5TfZX7X6h8pXazHTgOzo5yWxliNeXlF8e8FkrpD89_UMw9iXfKjYSCtbdrINvbPWhwlplRjNH3DTgh3g3VAXO92dRG_EpJ7DohaH8dFN26U0CyKxksuXfv2tjY0F3cboVwOkl11BSnjmLl41Mpb3BBWZdFfq2c4td8r2w"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">7 Days</span>
                      <h4 className="font-headline text-3xl font-bold">London Modernity</h4>
                      <p className="text-sm opacity-80 max-w-xs mt-2">Explore the pulse of London's skyline and contemporary art scene.</p>
                  </div>
              </div>
              {/* Item 2 */}
              <div className="md:col-span-5 bg-surface-container-lowest rounded-lg overflow-hidden relative group cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                  <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Bali Zen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWYipAIcoEOXTrqSAXTrqSAXtoj2InuLk8NfwWwsp7WfiLV1FxaoaGDJVS5Yzg1E4n6xquHmLMDvoV61qSfmCuFJ0JDOlsquvg9eVXQq7TSgC61u4573-D1SLQq_MsMHnwHNwCEazk1HkNMVSPqezi6LDplezUaCEqseAfQyo7uJPFuBLSdIWfPPbvET3Wiw3bzG96ZtmUhf7hVFjp7JEnIKQjvrwpvGuagohKsqWDfaDrIcgQZE-nvjr65ggOWTIcY0qpGlZ2jH3nCkNpHM"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">12 Days</span>
                      <h4 className="font-headline text-3xl font-bold">Bali Zen</h4>
                  </div>
              </div>
              {/* Item 3 */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-lg overflow-hidden relative group cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                  <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Kyoto Tradition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1VXVd9GJ5LB164rv_U3ywwcLaT6b2bdy8WXOKjYRf1TbNK_8y9aJOIc9rSNvuN0gKMYbXcZ07k9muElyOxMsltkDAsl8dDVkvnmwy4mhgJeHECbDDdRCU70H0kzevkCMPkq7S9PzDEJrmReIr5vn8KazouGYApxCXk44bw_E1mzy1F2Uf7yn0dis97W_d2No4rOoEjXBLElV1t1hoWJhxXEVQkcYKuCSt9-wV8PGM1LRLai-GB_A2VT5XTqZndJO5KVkd4cVcEZhQ"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                      <h4 className="font-headline text-2xl font-bold">Kyoto Tradition</h4>
                  </div>
              </div>
              {/* Item 4 */}
              <div className="md:col-span-8 bg-surface-container-lowest rounded-lg overflow-hidden relative group cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
                  <img className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Italian Coastline Escape" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4B7KXMPT1UsvLD5vk9Pb8crLllqc36WXQ8UbsbyBSlFY3CXRNb9X-DxtssM6VI0p4PJXEUa8hpLFYCAyii0vrTaOH8QyPwfmHYT1X-X9lgKjpq5kX6IMzlwHS_5HmH9aJKVa6kGdAPN0iUhmY6I5e-Q9U5Lya9OSySHMwPHrivNuDDiT20QSPKuv74okPuJRdBPu8Fjk2TbHB-Kr1PDq9R46ur5GSn_Js2uC7drGu2R2Uc0-KKL8Ovs_hGcuCg9iFlyREOyGT0jFu"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                      <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">10 Days</span>
                      <h4 className="font-headline text-3xl font-bold">Italian Coastline Escape</h4>
                  </div>
              </div>
          </div>
      </section>
    </main>
  );
};

export default TripPlanner;
