"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  return (
    <footer
      style={{
        backgroundColor: 'var(--light-bg)',
        color: 'var(--foreground)',
        borderTop: '1px solid rgba(92, 58, 33, 0.1)',
        marginTop: '4rem',
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: `0 ${sectionPadding}`,
        }}
      >
        {/* Newsletter Section */}
        <div
          style={{
            padding: '3rem 0',
            borderBottom: '1px solid rgba(92, 58, 33, 0.1)',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              color: 'var(--primary)', 
              marginBottom: '1rem' 
            }}>
              Stay Connected with Our Coffee Community
            </h3>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--foreground)', 
              marginBottom: '2rem',
              opacity: '0.8'
            }}>
              Get the latest stories, coffee insights, and updates from Mt. Elgon Women's Coffee delivered to your inbox.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '400px',
              margin: '0 auto',
            }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '0.25rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    flex: '1',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                />
                <button style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          padding: '3rem 0',
          borderBottom: '1px solid rgba(92, 58, 33, 0.1)',
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
          <Image
            src="/Logo Icon.png"
            alt="Mt.Elgon Women Logo"
                width={40}
                height={40}
            style={{ objectFit: 'contain' }}
          />
              <span style={{
                fontWeight: '700',
                fontSize: '1.1rem',
              color: 'var(--primary)',
              }}>
            Mt.Elgon Women in Specialty Coffee
          </span>
        </div>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: 'var(--foreground)',
              opacity: '0.8',
              marginBottom: '1.5rem',
            }}>
              Empowering women coffee farmers in the Mt. Elgon region through sustainable practices, 
              quality production, and community development.
            </p>
            <div style={{
            display: 'flex',
            gap: '1rem',
            }}>
              <a
                href="#"
                aria-label="Instagram"
                style={{
                  color: 'var(--secondary)',
                  fontSize: '1.25rem',
                  transition: 'color 0.3s ease',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                style={{
                  color: 'var(--secondary)',
                  fontSize: '1.25rem',
                  transition: 'color 0.3s ease',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                style={{
                  color: 'var(--secondary)',
                  fontSize: '1.25rem',
                  transition: 'color 0.3s ease',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
            style={{
                  color: 'var(--secondary)',
                  fontSize: '1.25rem',
                  transition: 'color 0.3s ease',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                }}
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
            <li>
              <Link
                href="/"
                style={{
                    color: 'var(--foreground)',
                  textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                style={{
                    color: 'var(--foreground)',
                  textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                About & Impact
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                style={{
                    color: 'var(--foreground)',
                  textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                Products & Education
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Blog & Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  style={{
                    color: 'var(--foreground)',
                  textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Contact Us
              </Link>
            </li>
          </ul>
        </div>

          {/* Products & Services */}
          <div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}>
              Products & Services
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <li>
                <Link
                  href="/products"
          style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
            display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Specialty Coffee
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Coffee Subscriptions
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Wholesale Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Brewing Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  style={{
                    color: 'var(--foreground)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <FaArrowRight style={{ fontSize: '0.75rem' }} />
                  Our Impact
                </Link>
              </li>
            </ul>
        </div>

          {/* Contact Information */}
        <div>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--primary)',
              marginBottom: '1.5rem',
            }}>
              Contact Us
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <FaMapMarkerAlt style={{ color: 'var(--secondary)', fontSize: '1rem' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>
                  Mt. Elgon Region, Kenya
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <FaPhone style={{ color: 'var(--secondary)', fontSize: '1rem' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>
                  +254 XXX XXX XXX
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <FaEnvelope style={{ color: 'var(--secondary)', fontSize: '1rem' }} />
                <span style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>
                  info@mtelgonwomen.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem 0',
          borderTop: '1px solid rgba(92, 58, 33, 0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <p style={{ 
              fontSize: '0.9rem', 
              color: 'var(--primary)',
              margin: '0',
            }}>
              &copy; {currentYear} Mt.Elgon Women in Specialty Coffee Ltd. All rights reserved.
            </p>
            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
            }}>
              <Link
                href="/privacy"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--foreground)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
              >
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .footer-container {
            gap: 1.5rem !important;
          }
          .footer-brand {
            flex-direction: column !important;
            gap: 0.5rem !important;
            text-align: center !important;
          }
          .footer-links {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .footer-social {
            gap: 1rem !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
