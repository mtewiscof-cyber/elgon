"use client";

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--light-bg)',
      color: 'var(--foreground)',
      padding: '2rem 2rem',
      marginTop: '3rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(92, 58, 33, 0.2)'
    }}>
      <div className="footer-container" style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '2rem'
      }}>
        {/* Footer Logo and Brand */}
        <div className="footer-brand" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <Image 
            src="/Logo Icon.png"
            alt="Mt.Elgon Women Logo"
            width={50}
            height={50}
            style={{ objectFit: 'contain' }}
          />
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.2rem', 
            color: 'var(--primary)',
            marginLeft: '0.5rem'
          }}>
            Mt.Elgon Women in Specialty Coffee
          </span>
        </div>

        {/* Footer Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem'
          }} className="footer-links">
            <li><Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Home</Link></li>
            <li><Link href="/about" style={{ color: 'var(--primary)', textDecoration: 'none' }}>About & Impact</Link></li>
            <li><Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Products & Education</Link></li>
            <li><Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Blog & Contact</Link></li>
          </ul>
        </div>

        {/* Footer Social Media Links - placeholder */}
        <div className="footer-social" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Social media links would go here */}
          <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Instagram</a>
          <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Facebook</a>
          <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>Twitter</a>
          <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>LinkedIn</a>
        </div>

        {/* Footer Copyright and Legal */}
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
            &copy; {new Date().getFullYear()} Mt.Elgon Women in Specialty Coffee Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
