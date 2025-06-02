"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--light-bg)',
        color: 'var(--foreground)',
        padding: '2rem 2rem',
        marginTop: '3rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(92, 58, 33, 0.2)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="footer-container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '2rem',
        }}
      >
        {/* Footer Logo and Brand */}
        <div
          className="footer-brand"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '0.5rem',
          }}
        >
          <Image
            src="/Logo Icon.png"
            alt="Mt.Elgon Women Logo"
            width={50}
            height={50}
            style={{ objectFit: 'contain' }}
          />
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: 'var(--primary)',
              marginLeft: '0.5rem',
            }}
          >
            Mt.Elgon Women in Specialty Coffee
          </span>
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
            }}
            className="footer-links"
          >
            <li>
              <Link
                href="/"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                About & Impact
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                Products & Education
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                  fontWeight: 500,
                  display: 'inline-block',
                }}
              >
                Blog & Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer Social Media Links - now with icons */}
        <div
          className="footer-social"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <a
            href="#"
            aria-label="Instagram"
            style={{ color: 'var(--secondary)', fontSize: 24, transition: 'color 0.2s' }}
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            style={{ color: 'var(--secondary)', fontSize: 24, transition: 'color 0.2s' }}
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            style={{ color: 'var(--secondary)', fontSize: 24, transition: 'color 0.2s' }}
          >
            <FaTwitter />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            style={{ color: 'var(--secondary)', fontSize: 24, transition: 'color 0.2s' }}
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Footer Copyright and Legal */}
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
            &copy; {new Date().getFullYear()} Mt.Elgon Women in Specialty Coffee Ltd. All rights reserved.
          </p>
        </div>
      </div>
      {/* Responsive styles for mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .footer-container {
            gap: 1.2rem !important;
          }
          .footer-brand {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .footer-links {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .footer-social {
            gap: 1rem !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
