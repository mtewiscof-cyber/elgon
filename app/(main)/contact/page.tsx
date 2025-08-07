"use client";

import { useState } from 'react';
import { MdFacebook } from 'react-icons/md';
import { FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative mb-8" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee3.jpg')",
          minHeight: "420px",
          padding: `${sectionPadding} 0`,
          paddingTop: "clamp(2rem, 8vw, 3.5rem)",
          paddingBottom: "clamp(2rem, 8vw, 3.5rem)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0 rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2 mt-14 drop-shadow">
            Contact Us
          </h1>
          <p className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">
            We'd love to hear from you! Get in touch with the Mt. Elgon Women in Specialty Coffee team.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Contact Form */}
            <div className="flex-1 min-w-[260px]">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--card-bg)]">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Floating label input */}
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="peer w-full px-3 py-3 rounded-xl border border-[var(--primary)] bg-[var(--light-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] placeholder-transparent"
                      placeholder="Your Name"
                    />
                    <label htmlFor="name" className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--primary)] bg-white px-1 pointer-events-none">Your Name</label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="peer w-full px-3 py-3 rounded-xl border border-[var(--primary)] bg-[var(--light-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] placeholder-transparent"
                      placeholder="Email Address"
                    />
                    <label htmlFor="email" className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--primary)] bg-white px-1 pointer-events-none">Email Address</label>
                  </div>
                  <div className="relative pt-4">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="peer w-full px-3 py-3 rounded-xl border border-[var(--primary)] bg-[var(--light-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-gray-700"
                    >
                      <option value="" disabled hidden></option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Wholesale">Wholesale Partnership</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Coffee Subscription">Coffee Subscription</option>
                      <option value="Press/Media">Press/Media</option>
                    </select>
                    <label htmlFor="subject" className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--primary)] bg-white px-1 pointer-events-none">Subject</label>
                  </div>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="peer w-full px-3 py-3 rounded-xl border border-[var(--primary)] bg-[var(--light-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] placeholder-transparent"
                      placeholder="Your Message"
                    ></textarea>
                    <label htmlFor="message" className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--primary)] bg-white px-1 pointer-events-none">Your Message</label>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl font-semibold transition-all duration-200 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 hover:shadow-lg shadow-md">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex-1 min-w-[260px] flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--card-bg)]">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Get in Touch</h2>
                <div className="mb-3">
                  <h3 className="font-semibold text-[var(--secondary)]">Email</h3>
                  <p><a href="mailto:info@mtelgonwomen.com" className="hover:underline transition-colors" style={{ color: 'var(--secondary)' }}>info@mtelgonwomen.com</a></p>
                </div>
                <div className="mb-3">
                  <h3 className="font-semibold text-[var(--secondary)]">Phone</h3>
                  <p><a href="tel:+256700123456" className="hover:underline transition-colors" style={{ color: 'var(--secondary)' }}>+256 700 123 456</a></p>
                </div>
                <div className="mb-3">
                  <h3 className="font-semibold text-[var(--secondary)]">Address</h3>
                  <p>Mt. Elgon Women in Specialty Coffee Ltd<br />Mbale, Uganda<br />East Africa</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[var(--card-bg)]">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>Follow Us</h2>
                <div className="flex gap-3 flex-wrap justify-start items-center mt-1">
                  <a href="#" className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] text-lg transition-colors" aria-label="Instagram">
                    <FaInstagram size={24} />Instagram
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] text-lg transition-colors" aria-label="Facebook">
                    <MdFacebook size={24} />Facebook
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] text-lg transition-colors" aria-label="Twitter">
                    <FaTwitter size={24} />Twitter
                  </a>
                  <a href="#" className="flex items-center gap-2 text-[var(--secondary)] hover:text-[var(--primary)] text-lg transition-colors" aria-label="LinkedIn">
                    <FaLinkedin size={24} />LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <h2 className="text-xl font-semibold mb-2 text-center" style={{ color: 'var(--primary)' }}>Visit Our Coffee Processing Center</h2>
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 border border-[var(--card-bg)]">
            {/* Google Maps embed for Mt. Elgon, Uganda */}
            <iframe
              title="Mt. Elgon Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.96496435703!2d34.3901!3d1.1337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177f7e2e2e2e2e2f%3A0x2e2e2e2e2e2e2e2e!2sMt.%20Elgon!5e0!3m2!1sen!2sug!4v1689876543210!5m2!1sen!2sug"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage; 