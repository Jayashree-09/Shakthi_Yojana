import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { alert("Please fill all required fields"); return; }
    setSent(true);
  };

  const contacts = [
    { icon: "📞", title: "Helpline (Toll Free)", value: "1800-425-9339", sub: "Mon–Sat, 9AM–6PM" },
    { icon: "✉️", title: "Email", value: "shakthi@karnataka.gov.in", sub: "Response within 2 working days" },
    { icon: "🏛️", title: "Office Address", value: "Vidhana Soudha, Dr. Ambedkar Veedhi", sub: "Bengaluru, Karnataka — 560001" },
    { icon: "🌐", title: "Website", value: "www.karnataka.gov.in", sub: "Official Government Portal" },
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper">

        <div className="about-hero">
          <div className="tricolor-bar" style={{ maxWidth: "120px", margin: "0 auto 24px" }} />
          <h1>Contact & Help</h1>
          <p style={{ marginTop: "8px" }}>ಸಂಪರ್ಕ ಮತ್ತು ಸಹಾಯ — We're here to help you</p>
        </div>

        <div className="section">
          <div className="contact-grid">

            {/* Left: Contact Info */}
            <div>
              <h3 style={{ marginBottom: "24px", fontSize: "22px" }}>Get in Touch</h3>
              {contacts.map((c, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-icon">{c.icon}</div>
                  <div>
                    <h4>{c.title}</h4>
                    <p style={{ fontWeight: "600", color: "var(--navy)" }}>{c.value}</p>
                    <p>{c.sub}</p>
                  </div>
                </div>
              ))}

              {/* FAQ */}
              <div style={{ marginTop: "32px", background: "var(--navy)", borderRadius: "14px", padding: "24px", border: "1px solid var(--border)" }}>
                <h4 style={{ color: "var(--gold)", marginBottom: "16px", fontSize: "16px" }}>🙋 Common Questions</h4>
                {[
                  ["My Aadhaar shows invalid?", "Ensure your Aadhaar address is updated to Karnataka. Visit nearest Aadhaar centre."],
                  ["How to update state in Aadhaar?", "Visit uidai.gov.in or nearest Aadhaar Seva Kendra with proof of address."],
                  ["Who can use this scanner?", "Authorized field workers and government officials with login credentials."],
                ].map(([q, a], i) => (
                  <div key={i} style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>Q: {q}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>A: {a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="contact-form-card">
              {sent ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
                  <h3 style={{ color: "var(--navy)", marginBottom: "10px" }}>Message Sent!</h3>
                  <p style={{ color: "#64748b" }}>We'll get back to you within 2 working days.</p>
                  <button onClick={() => setSent(false)} style={{ marginTop: "20px", padding: "10px 24px", background: "var(--navy)", color: "var(--gold)", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>Send a Message</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input name="name" placeholder="Your name" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input name="email" type="email" placeholder="your@email.com" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Subject</label>
                      <input name="subject" placeholder="What is this about?" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Message *</label>
                      <textarea name="message" placeholder="Describe your issue or question..." rows={5} onChange={handleChange} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="form-submit">
                      📨 Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Contact;