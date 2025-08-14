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
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-amber-800">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="" disabled>Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Wholesale">Wholesale Partnership</option>
                      <option value="Order Support">Order Support</option>
                      <option value="Coffee Subscription">Coffee Subscription</option>
                      <option value="Press/Media">Press/Media</option>
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="w-full py-4 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex-1 min-w-[260px] flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-amber-800">Get in Touch</h2>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Email</h3>
                  <p><a href="mailto:info@mtelgonwomen.com" className="text-amber-600 hover:text-amber-700 hover:underline transition-colors">info@mtelgonwomen.com</a></p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Phone</h3>
                  <p><a href="tel:+256700123456" className="text-amber-600 hover:text-amber-700 hover:underline transition-colors">+256 700 123 456</a></p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-1">Address</h3>
                  <p className="text-gray-600">Mt. Elgon Women in Specialty Coffee Ltd<br />Mbale, Uganda<br />East Africa</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-amber-800">Follow Us</h2>
                <div className="flex gap-4 flex-wrap justify-start items-center">
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-base transition-colors" aria-label="Instagram">
                    <FaInstagram size={20} />
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-base transition-colors" aria-label="Facebook">
                    <MdFacebook size={20} />
                    <span>Facebook</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-base transition-colors" aria-label="Twitter">
                    <FaTwitter size={20} />
                    <span>Twitter</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 text-base transition-colors" aria-label="LinkedIn">
                    <FaLinkedin size={20} />
                    <span>LinkedIn</span>
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
          <h2 className="text-xl font-semibold mb-4 text-center text-amber-800">Visit Our Coffee Processing Center</h2>
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 border border-gray-200">
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