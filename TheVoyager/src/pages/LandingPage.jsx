import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative px-8 py-24 md:py-40 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full">
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label text-sm font-semibold tracking-wide">
                    AI-POWERED EXPLORATION
                </span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.1]">
                    Plan Your <span className="text-gradient">Perfect Trip</span> with AI
                </h1>
                <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
                    Experience the future of travel. Our AI concierge crafts bespoke itineraries that balance adventure, luxury, and your unique rhythm.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/planner">
                        <button className="signature-gradient text-white px-8 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                            Start Planning
                            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
                        </button>
                    </Link>
                    <Link to="/compare">
                        <button className="px-8 py-4 rounded-full text-lg font-bold border-2 border-outline-variant/20 hover:bg-surface-container-low transition-colors flex items-center gap-2">
                            View Samples
                        </button>
                    </Link>
                </div>
            </div>
            {/* Floating Glass Hero Component */}
            <div className="relative mt-8 md:mt-0">
                <div className="relative">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                        <img alt="Serene beach" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-fWYo6njpFjDd5wiXIjT3yx3flzEKvBVxx-vUZhkzIWBbswuORixJdSwab3YwkV8AwlBxAqUAQ2iaQ5x4A68P4j_Amje85ArZikqBSdSe6K--3eei-8LfuDdmfKpPsQy2fx8zog3UbyXCep3txflvmkdoZsQxNSQcWm3FLJ0H4q4cq1qTSnSmCSaCKWn6zbyLUv5DYYlO2HYyC8bsounOaE3Jfiai8K4UuDrQGhH9fc_gyHJcjQKDRePqVRpi2raLm5kBCWR2B1G_" />
                    </div>
                    {/* Overlapping Glass Card */}
                    <div className="absolute -bottom-6 left-4 right-4 md:right-auto md:-left-12 glass-panel p-6 md:p-8 rounded-lg ambient-shadow border border-white/40 md:max-w-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full signature-gradient flex items-center justify-center text-white shrink-0">
                                <span className="material-symbols-outlined text-lg md:text-xl" data-icon="auto_awesome">auto_awesome</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary">AI Recommendation</p>
                                <p className="text-xs text-on-surface-variant">Optimal route found</p>
                            </div>
                        </div>
                        <h3 className="font-headline text-lg md:text-xl font-bold mb-2">Amalfi Coast Escape</h3>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm" data-icon="calendar_today">calendar_today</span>
                                7 Days in June
                            </div>
                            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm" data-icon="payments">payments</span>
                                $4,200 - $5,800
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="bg-surface-container-low py-24 px-8">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold">Next-Gen Travel Intelligence</h2>
                <p className="text-on-surface-variant max-w-2xl mx-auto">Sophisticated tools designed to handle the complexity of travel, so you can focus on the journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* AI Generation Card */}
                <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-8 ambient-shadow relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                            <span className="material-symbols-outlined text-3xl" data-icon="psychology">psychology</span>
                        </div>
                        <h3 className="font-headline text-3xl font-bold mb-4">Hyper-Personalized AI Generation</h3>
                        <p className="text-on-surface-variant text-lg max-w-md mb-8">Our proprietary LLM analyzes millions of data points to create itineraries that match your pacing, interests, and dietary needs.</p>
                        <div className="flex gap-4">
                            <span className="px-4 py-2 rounded-full bg-surface-container text-xs font-bold uppercase tracking-wider">Dynamic Routing</span>
                            <span className="px-4 py-2 rounded-full bg-surface-container text-xs font-bold uppercase tracking-wider">Taste Profiling</span>
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 w-1/2 h-full hidden md:block">
                        <div className="w-full h-full opacity-20 group-hover:opacity-30 transition-opacity">
                            <img alt="Cityscape" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYxUcp4Ut6gWMB-4XmhKSfH13V91Gr-bTW9wtfd1dKhM4riCeGNF4VibqZAQbzojLVgVEdBFje7y_ePuH5Qp5VLolvol1C4DRE3djGrxDyi-qtydnXtbbQ_gYwgmYFxVhRjdmnJYaUqn-e-Ta_8XYo4Y_xtPF7YkU0hTdogYS8NukHxIAlj3Udl22nlNXMyOtNhu4Lb8pTdXeUkxG1KgmYlC6eWCpOQzI8kFXnCCObCEOv3PuHDbyxuAnGj0QuJE8C9ZLhKnXS0TsG" />
                        </div>
                    </div>
                </div>
                {/* Budget Card */}
                <div className="md:col-span-4 bg-surface-container-lowest rounded-lg p-8 ambient-shadow flex flex-col justify-between border-t-4 border-secondary">
                    <div>
                        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                            <span className="material-symbols-outlined text-3xl" data-icon="analytics">analytics</span>
                        </div>
                        <h3 className="font-headline text-2xl font-bold mb-4">Budget Precision</h3>
                        <p className="text-on-surface-variant">Real-time comparison across airlines, hotels, and local experiences to ensure maximum value.</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-surface-container">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span>Estimated Savings</span>
                            <span className="text-secondary">Up to 24%</span>
                        </div>
                    </div>
                </div>
                {/* Smart Recommendations */}
                <div className="md:col-span-4 bg-surface-container-lowest rounded-lg p-8 ambient-shadow flex flex-col">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl" data-icon="auto_awesome_motion">auto_awesome_motion</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-4">Smart Curation</h3>
                    <p className="text-on-surface-variant mb-6">Hidden gems that aren't on typical travel blogs, curated by our AI from local whispers.</p>
                    <div className="mt-auto flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+12k</div>
                    </div>
                </div>
                {/* Itinerary Visualizer */}
                <div className="md:col-span-8 bg-surface-container-lowest rounded-lg p-8 ambient-shadow overflow-hidden">
                    <h3 className="font-headline text-2xl font-bold mb-8">The Luminous Timeline</h3>
                    <div className="space-y-6">
                        {/* Day 1 */}
                        <div className="flex gap-6 items-start">
                            <div className="flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_rgba(74,75,215,0.5)]"></div>
                                <div className="w-2 h-20 bg-surface-container-highest rounded-full mt-2"></div>
                            </div>
                            <div className="glass-panel p-6 rounded-md border border-white/50 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold">Sunrise Hike: Diamond Head</h4>
                                    <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">MORNING</span>
                                </div>
                                <p className="text-sm text-on-surface-variant">Breathtaking views of the Pacific coast followed by a local acai breakfast.</p>
                            </div>
                        </div>
                        {/* Day 2 */}
                        <div className="flex gap-6 items-start opacity-60">
                            <div className="flex flex-col items-center">
                                <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_12px_rgba(132,44,211,0.5)]"></div>
                                <div className="w-2 h-12 bg-surface-container-highest rounded-full mt-2"></div>
                            </div>
                            <div className="glass-panel p-6 rounded-md border border-white/50 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold">Helicopter Island Tour</h4>
                                    <span className="text-xs font-bold text-secondary px-2 py-1 bg-secondary/10 rounded">AFTERNOON</span>
                                </div>
                                <p className="text-sm text-on-surface-variant">A private flight over hidden waterfalls and jurassic valleys.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto rounded-xl signature-gradient p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <img alt="Travel map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc-Nadrdwq6beos8zPPw6zYp2QfAcu78y70bU_mwPdahH-ffeoNmAAG4kVTeOPUU-u_R2gQ295fKdIusAQizIG87iMRdaG_KZddtNCwrxN2GLbpmRl4EQ4ew_mr7nBbrPjzRpSng7r5wfCevOpdU59YOF4FkMplH_FO1z2tY73vcA9iySNn8HYXg0Bdm5OtzIwBDFX90J1Q9cpLjUauSGLutyk-ZHDl65ghuik_PwxRXaitC1bpMwlHzw296YFRy2-5aWop9xrOghF" />
            </div>
            <div className="relative z-10">
                <h2 className="font-headline text-4xl md:text-6xl font-extrabold text-white mb-8">Your next horizon is calling.</h2>
                <p className="text-white/80 text-xl max-w-2xl mx-auto mb-12">Join thousands of voyagers using AI to discover the world in its most beautiful light.</p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <input className="px-8 py-4 rounded-full bg-white/20 border-none text-white placeholder:text-white/60 focus:ring-2 focus:ring-white w-full md:w-auto md:min-w-[300px] backdrop-blur-md" placeholder="Enter your email" type="email" />
                    <button className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl w-full md:w-auto">Get Early Access</button>
                </div>
            </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
