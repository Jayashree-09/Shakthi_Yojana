import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const LandingPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      
      <section className="landing-hero animate-fade">
        <div className="hero-content">
          <h1>
            Empowering Women <br />
            <span>Building Futures</span>
          </h1>
          <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto 40px', color: 'var(--text-600)' }}>
            Shakthi Yojana provides financial assistance and support to women for a stronger and self-reliant tomorrow.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary" style={{ padding: '14px 28px', borderRadius: '16px', border: '1px solid var(--p-600)', background: 'transparent', color: 'var(--p-600)', fontWeight: '700' }}>Learn More</button>
          </div>
        </div>

        <div className="hero-mockups">
           <div className="mockup-card glass-card" style={{ transform: 'rotate(-5deg) translateY(20px)' }}>
             {/* Mockup Content */}
             <div style={{ padding: '20px', color: 'white' }}>
               <div style={{ width: '40px', height: '40px', background: 'var(--p-600)', borderRadius: '10px' }}></div>
               <div style={{ marginTop: '20px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px' }}></div>
               <div style={{ marginTop: '10px', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', width: '60%' }}></div>
             </div>
           </div>
           <div className="mockup-card glass-card" style={{ zIndex: 2 }}>
             {/* Mockup Content */}
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '40px' }}>📱</div>
           </div>
           <div className="mockup-card glass-card" style={{ transform: 'rotate(5deg) translateY(20px)' }}>
              {/* Mockup Content */}
           </div>
        </div>
      </section>

      <section className="features section" style={{ padding: '80px var(--container-padding)' }}>
        <div className="section-title" style={{ textAlign: 'center', marginBottom: '60px' }}>
           <h2>Seamless Experience</h2>
           <p style={{ color: 'var(--text-600)' }}>Manage everything in one place</p>
        </div>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
           {[
             { icon: "📄", title: "Easy Registration", desc: "Simple and fast beneficiary registration" },
             { icon: "🔍", title: "Instant Verification", desc: "Aadhaar scanning and verification" },
             { icon: "📢", title: "Voice Alerts", desc: "Audio notifications for beneficiaries" },
             { icon: "📊", title: "Real-time Reports", desc: "Track and analyze activities" }
           ].map((f, i) => (
             <div key={i} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
               <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
               <h3>{f.title}</h3>
               <p style={{ fontSize: '14px', color: 'var(--text-600)', marginTop: '8px' }}>{f.desc}</p>
             </div>
           ))}
        </div>
      </section>

      <section className="how-it-works section" style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '80px var(--container-padding)' }}>
         <div className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2>How It Works</h2>
         </div>
         <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { step: 1, title: "Register", desc: "Enter beneficiary details" },
              { step: 2, title: "Scan & Verify", desc: "Verify Aadhaar details" },
              { step: 3, title: "Get Benefits", desc: "Receive benefits & notifications" }
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '200px' }}>
                 <div style={{ width: '48px', height: '48px', background: 'var(--p-600)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: '800' }}>{s.step}</div>
                 <h4>{s.title}</h4>
                 <p style={{ fontSize: '14px', color: 'var(--text-600)' }}>{s.desc}</p>
              </div>
            ))}
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
