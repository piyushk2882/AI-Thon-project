import React from 'react';
import { Link } from 'react-router-dom';

const ResultsDashboard = () => {
  return (
    <main className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Trip Summary Header */}
      <header className="mb-12">
          <div className="bg-surface-container-low p-8 md:p-12 rounded-xl relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 left-1/2 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                      <div>
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-bold text-primary tracking-wider mb-4 shadow-sm">
                              <span className="material-symbols-outlined text-sm" data-icon="auto_awesome">auto_awesome</span> 
                              AI-CURATED JOURNEY
                          </span>
                          <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">Tokyo to Kyoto: The Cultural Veil</h1>
                          <p className="text-on-surface-variant text-lg max-w-2xl font-light">10 Days through neon skylines, ancient cedar forests, and the timeless artistry of Japanese hospitality.</p>
                      </div>
                      
                      <div className="flex gap-6 border-l border-outline-variant/30 pl-6 h-fit">
                          <div>
                              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Duration</p>
                              <p className="font-bold text-xl">10 Days</p>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Travelers</p>
                              <p className="font-bold text-xl">2 Adults</p>
                          </div>
                          <div>
                              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Season</p>
                              <p className="font-bold text-xl">Autumn</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </header>

      {/* Plan Details Highlight Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mt-8 pt-8 border-t border-surface-container">
          <div className="flex flex-col bg-surface-container-lowest rounded-lg p-8 border hover:border-outline-variant/20 transition-all duration-300">
             <div className="flex items-center gap-4 mb-4">
               <span className="material-symbols-outlined text-primary text-3xl">apartment</span>
               <h3 className="font-headline font-bold text-lg">Accommodation</h3>
             </div>
             <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
               4-star designer hotels in Tokyo (e.g., The Knot Shinjuku) and traditional Ryokans in Kyoto with included Kaiseki dinners.
             </p>
          </div>
          <div className="flex flex-col bg-surface-container-lowest rounded-lg p-8 border hover:border-outline-variant/20 transition-all duration-300">
             <div className="flex items-center gap-4 mb-4">
               <span className="material-symbols-outlined text-primary text-3xl">train</span>
               <h3 className="font-headline font-bold text-lg">Transit</h3>
             </div>
             <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
               Includes a 7-day Green Car JR Pass for comfortable scenic trips. Pre-loaded Suica card for seamless inner-city subways.
             </p>
          </div>
          <div className="flex flex-col bg-surface-container-lowest rounded-lg p-8 border hover:border-outline-variant/20 transition-all duration-300">
             <div className="flex items-center gap-4 mb-4">
               <span className="material-symbols-outlined text-secondary text-3xl">map</span>
               <h3 className="font-headline font-bold text-lg">Curated Tours</h3>
             </div>
             <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
               Skip-the-line passes to teamLab Planets, private tea ceremonies, and an after-hours guided walk through the Fushimi Inari shrine.
             </p>
          </div>
      </section>

      {/* Signature AI Component: Luminous Itinerary (Preview Section) */}
      <section className="mt-20">
          <h2 className="text-2xl font-bold font-headline mb-8 text-center lg:text-left">A Glimpse into the Experience</h2>
          <div className="relative min-h-[400px] rounded-xl overflow-hidden flex items-center justify-center">
              {/* Background Layer */}
              <div className="absolute inset-0 z-0">
                  <img className="w-full h-full object-cover" alt="Kyoto Bamboo Forest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeV89oLkJR7D12ewNqdp8tgag3jx69y524fKnxWKiqFlOaUd1O2OS2TtmPk4KlNrtaeLptqDFMq6_ZZKnYeMnMeJkc8m-ghzpzyj5yQ6Kyihb2wXTlT2Ak24iwiX1o8rqKVfl591ccuIuHz7bP4iOwQzwtaWa957ZEaCot8hkP1BqCVCQyT6fG8OqY6q7ThiYzUaxngfIzMSNH7V2ALEuhhG6OdwSDkbO0VKi4_XoyjAESMKmkbRQffaBzoEOjic_qktllZ7KA6ldK"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-surface/20"></div>
              </div>
              
              {/* Floating Glass Panel */}
              <div className="relative z-10 glass-card p-10 max-w-2xl mx-6 rounded-lg border border-white/20 shadow-2xl">
                  <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">03</div>
                          <div className="w-2 h-32 bg-surface-container-highest rounded-full my-2"></div>
                      </div>
                      <div>
                          <h4 className="text-xs font-bold text-primary tracking-widest uppercase mb-2">Day Three: Tokyo Awakening</h4>
                          <h3 className="text-3xl font-bold font-headline mb-4">Sunrise at Tsukiji & Zen Garden Meditation</h3>
                          <p className="text-on-surface-variant leading-relaxed mb-6">Experience the pulse of the city before it wakes. Our AI has timed your arrival at the inner market to perfectly precede the morning prayer at Senso-ji.</p>
                          <div className="flex flex-wrap gap-3">
                              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Private Guide</span>
                              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Luxury Transport</span>
                              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Sushi Breakfast</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      <div className="text-center mt-16 pt-8 border-t border-surface-container">
        <Link to="/">
          <button className="bg-white border text-primary px-10 py-4 rounded-full font-bold shadow-md scale-105 transition-transform">
             Modify Preferences
          </button>
        </Link>
      </div>
    </main>
  );
};

export default ResultsDashboard;
