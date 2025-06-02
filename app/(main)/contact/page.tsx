"use client";

import { useState } from 'react';
import Image from 'next/image';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="page-content container">
      {/* Hero Section */}
      <div className="section">
        <h1>Contact Us</h1>
        <p className="lead">
          We'd love to hear from you! Get in touch with the Mt. Elgon Women in Specialty Coffee team.
        </p>
      </div>

      <div className="section flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
        {/* Contact Form */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="card">
            <h2>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '500' }}>Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--primary)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '500' }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--primary)',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '500' }}>Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--primary)',
                    outline: 'none'
                  }}
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Wholesale">Wholesale Partnership</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Coffee Subscription">Coffee Subscription</option>
                  <option value="Press/Media">Press/Media</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '500' }}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--primary)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>Get in Touch</h2>
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Email</h3>
              <p><a href="mailto:info@mtelgonwomen.com" style={{ color: 'var(--secondary)' }}>info@mtelgonwomen.com</a></p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Phone</h3>
              <p><a href="tel:+256700123456" style={{ color: 'var(--secondary)' }}>+256 700 123 456</a></p>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
              <h3>Address</h3>
              <p>Mt. Elgon Women in Specialty Coffee Ltd<br />
              Mbale, Uganda<br />
              East Africa</p>
            </div>
          </div>
          
          <div className="card">
            <h2>Follow Us</h2>
            <div className="flex" style={{ gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#" className="btn btn-secondary" style={{ flex: '1' }}>Instagram</a>
              <a href="#" className="btn btn-secondary" style={{ flex: '1' }}>Facebook</a>
              <a href="#" className="btn btn-secondary" style={{ flex: '1' }}>Twitter</a>
              <a href="#" className="btn btn-secondary" style={{ flex: '1' }}>LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="section">
        <h2>Visit Our Coffee Processing Center</h2>
        <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--border-radius)', overflow: 'hidden', marginTop: '1.5rem' }}>
          <Image 
            src="/placeholder-map.jpg" 
            alt="Map to Mt. Elgon Women's Coffee Processing Center"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 