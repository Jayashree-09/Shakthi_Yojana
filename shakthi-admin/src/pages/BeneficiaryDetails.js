import React from "react";
import { Link } from "react-router-dom";

const BeneficiaryDetails = () => {
  const beneficiary = {
    name: "Lakshmi Devi",
    verified: true,
    aadhaar: "xxxx xxxx 1234",
    mobile: "9876543210",
    address: "123, Main Street, Chennai, Tamil Nadu - 600001",
    scheme: {
      name: "Shakthi Yojana",
      benefit: "₹ 5,000",
      regDate: "01 Jan 2024",
      status: "Active"
    }
  };

  return (
    <div className="dashboard-content">
      <header style={{ marginBottom: '32px' }}>
        <Link to="/users" style={{ textDecoration: 'none', color: 'var(--p-600)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
           ← Back to Users
        </Link>
        <h1 style={{ fontSize: '24px', marginTop: '16px' }}>Beneficiary Details</h1>
      </header>

      <div className="reports-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Profile Card */}
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 20px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi" alt="Profile" style={{ width: '100%', height: '100%' }} />
          </div>
          <h2 style={{ fontSize: '20px' }}>{beneficiary.name}</h2>
          <span style={{ 
             display: 'inline-block', 
             marginTop: '8px', 
             padding: '4px 12px', 
             borderRadius: '20px', 
             background: 'rgba(16, 185, 129, 0.1)', 
             color: 'var(--acc-success)',
             fontSize: '12px',
             fontWeight: '700'
          }}>✓ Verified</span>
          
          <div style={{ marginTop: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
             <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aadhaar Number</p>
                <p style={{ fontWeight: '600' }}>{beneficiary.aadhaar}</p>
             </div>
             <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mobile Number</p>
                <p style={{ fontWeight: '600' }}>{beneficiary.mobile}</p>
             </div>
             <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Address</p>
                <p style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.5' }}>{beneficiary.address}</p>
             </div>
          </div>
          
          <button className="btn-primary" style={{ width: '100%', marginTop: '32px' }}>Edit Profile</button>
        </div>

        {/* Scheme Details */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px' }}>Scheme Details</h3>
            <button style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'white', fontSize: '14px', fontWeight: '600' }}>Edit</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
             <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Scheme Name</p>
                <p style={{ fontWeight: '700', fontSize: '16px' }}>{beneficiary.scheme.name}</p>
             </div>
             <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Benefit Amount</p>
                <p style={{ fontWeight: '700', fontSize: '16px', color: 'var(--p-600)' }}>{beneficiary.scheme.benefit}</p>
             </div>
             <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Registration Date</p>
                <p style={{ fontWeight: '700', fontSize: '16px' }}>{beneficiary.scheme.regDate}</p>
             </div>
             <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</p>
                <span style={{ fontWeight: '700', color: 'var(--acc-success)' }}>● {beneficiary.scheme.status}</span>
             </div>
          </div>

          <div style={{ marginTop: '60px' }}>
             <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>Activity History</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Aadhaar Verified", date: "08 May 2024", icon: "✓" },
                  { title: "Benefit Released", date: "04 May 2024", icon: "₹" },
                  { title: "Scheme Registered", date: "01 Jan 2024", icon: "📄" }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'var(--p-600)' }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</p>
                       <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.date}</p>
                    </div>
                  </div>
                ))}
             </div>
             <button className="btn-secondary" style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '12px', border: '1px solid var(--p-600)', background: 'transparent', color: 'var(--p-600)', fontWeight: '700' }}>View Full History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDetails;
