import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

export default function CleanStreetLanding() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeroVisible(true);
          heroObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsAnimated(true);
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => {
      heroObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FF] font-sans text-slate-900 overflow-x-hidden pb-10">
      <style>{`
  /* Custom Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px; /* Slimmer width */
  }

  ::-webkit-scrollbar-track {
    background: #F8F9FF; /* Match your page background */
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #4F46E5, #7C3AED); /* Indigo to Violet gradient */
    border-radius: 10px;
    border: 2px solid #F8F9FF; /* Creates a "floating" effect */
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #4338CA; /* Darker Indigo on hover */
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #4F46E5 #F8F9FF;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 18px 50px rgba(79, 70, 229, 0.12);
  }
  .text-gradient {
    background: linear-gradient(to right, #4F46E5, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .step-circle {
    background: white;
    border: 2px solid #4F46E5;
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.1);
  }
      `}</style>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-15 pb-16 px-4 flex flex-col items-center"
      >
        {/* Decorative Blurs matching your Nav palette */}
        <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-indigo-400/10 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-rose-400/10 blur-[100px]" />

        <div
          className={
            "w-full max-w-xl glass-card rounded-[2.5rem] px-8 pb-12 pt-20 relative text-center transform transition-all duration-700 " +
            (heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
          }
        >
          {/* Circular Floating Logo */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/80 p-1 rounded-full shadow-2xl border border-white flex items-center justify-center aspect-square backdrop-blur-md">
              <img src="/image.png" alt="CleanStreet Logo" className="w-24 h-24 object-contain rounded-full" />
            </div>
          </div>

          <span className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">
            Digital India Initiative
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-800 mb-4">
            Building a <span className="text-gradient font-black">Cleaner India</span> Together
          </h1>
          <p className="text-[13px] text-slate-500 max-w-sm mx-auto mb-8 leading-relaxed">
            A revolutionary platform empowering citizens to report civic issues and municipal corporations to resolve them efficiently.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-3 rounded-full font-bold shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 hover:bg-indigo-700 transition-all no-underline"
            >
              Get Started
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto border border-indigo-100 bg-white/50 text-slate-700 px-10 py-3 rounded-full font-bold hover:bg-white hover:shadow-md transition-all no-underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section with Scroll Animation */}
      <section
        ref={statsRef}
        className={
          "max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4 transform transition-all duration-700 " +
          (statsAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
        }
      >
        <StatItem number={4905} label="Cities" animated={statsAnimated} />
        <StatItem number={3000000} label="Citizens" animated={statsAnimated} />
        <StatItem number={500000} label="Resolved" animated={statsAnimated} />
        <StatItem number={98} label="Success %" animated={statsAnimated} />
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">Why CleanStreet?</h2>
          <div className="h-1 w-12 bg-indigo-600 mx-auto mt-2 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<CameraIcon />} title="Simple Reporting" desc="Just take a picture of the civic issue. No complex forms required." />
          <FeatureCard icon={<LocationIcon />} title="GPS Accuracy" desc="Automatic location pinpointing for faster municipal response." />
          <FeatureCard icon={<BellIcon />} title="Live Updates" desc="Track your complaint progress with real-time push notifications." />
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="bg-white/30 backdrop-blur-sm py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl font-extrabold text-slate-800 mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative">
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-indigo-100 z-0" />
            <Step number="1" title="Spot" desc="Identify a civic issue" />
            <Step number="2" title="Snap" desc="Take a clear photo" />
            <Step number="3" title="Submit" desc="Auto-GPS tags location" />
            <Step number="4" title="Track" desc="Watch progress live" />
          </div>
        </div>
      </section>

      {/* SLA Section - Service Level Agreements */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="glass-card rounded-[3rem] p-10 overflow-hidden relative border border-white/60">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/5 rounded-full blur-[80px]" />
          <h2 className="text-xl font-bold text-slate-800 mb-10 text-center tracking-tight">Service Standards (SLA)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SLACard icon={<TrashIcon />} title="Garbage Removal" time="12 hrs" color="text-rose-600" />
            <SLACard icon={<TrashIcon />} title="Street Sweeping" time="12 hrs" color="text-indigo-600" />
            <SLACard icon={<TrashIcon />} title="Toilet Cleaning" time="24 hrs" color="text-violet-600" />
          </div>
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="bg-slate-50 text-slate-500 border-t border-indigo-50 py-16 px-6 mt-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-slate-900 font-bold text-lg mb-4">
              CleanStreet Platform
            </h3>
            <p className="text-sm">
              A civic issue management platform built under the Swachh Bharat vision
              to improve transparency, responsiveness, and urban governance.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>Features</li>
              <li>Workflow</li>
              <li>Services</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>Documentation</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@cleanstreet.in</li>
              <li>India</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs mt-12 pt-6">
          © 2026 CleanStreet Platform | Swachh Bharat Inspired Initiative
        </div>
      </footer>
    </div>
  );
}

// --- Sub-components (Styled for consistency) ---

function StatItem({ number, label, animated }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (animated) {
      let start = 0;
      const end = number;
      const timer = setInterval(() => {
        start += Math.ceil(end / 40);
        if (start >= end) { setVal(end); clearInterval(timer); }
        else setVal(start);
      }, 30);
    }
  }, [animated, number]);

  return (
    <div className="glass-card p-6 rounded-3xl text-center border border-white/80">
      <div className="text-2xl font-black text-indigo-600">
        {val.toLocaleString()}{number < 100 ? '%' : '+'}
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-card p-8 rounded-[2rem] hover:-translate-y-1 transition-all border border-white/40">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-sm mb-2">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-14 h-14 step-circle rounded-full flex items-center justify-center font-black text-indigo-600 mb-4">
        {number}
      </div>
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-slate-400 text-[11px] px-4">{desc}</p>
    </div>
  );
}

function SLACard({ icon, title, time, color }) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white/40 rounded-2xl border border-white/60 shadow-sm">
      <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{title}</div>
        <div className={`${color} font-black text-xl`}>{time}</div>
      </div>
    </div>
  );
}
