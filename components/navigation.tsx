"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FaBars, FaTimes } from 'react-icons/fa';
import CartIcon from './CartIcon';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}>
      <nav
        className="premium-nav"
        style={{
          background: 'white',
          padding: '0.7rem 1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1.5rem auto 0 auto',
          maxWidth: 1200,
          borderRadius: '9999px',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
          minHeight: 44,
          pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          >
            <Image
              src="/Main Logo.png"
              alt="Mt.Elgon Women Logo Icon"
              width={90}
              height={90}
              style={{ objectFit: 'contain', marginRight: '0.5rem', transition: 'width 0.2s, height 0.2s' }}
              className="nav-logo"
            />
          </Link>
        </div>
        {/* Hamburger menu for mobile - inside nav, right-aligned */}
        <button
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '2rem',
            cursor: 'pointer',
            display: 'none',
            marginLeft: 'auto',
          }}
          className="mobile-menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Navigation links */}
        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            flexGrow: 1,
            minWidth: '200px',
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
          }}
          className={`nav-links ${menuOpen ? 'menu-open' : 'menu-closed'}`}
        >
          <li>
            <Link
              href="/about"
              onClick={closeMenu}
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: 6,
                transition: 'background 0.2s',
              }}
            >
              <span style={{ marginLeft: '0.25rem' }}>Our Story</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              onClick={closeMenu}
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: 6,
                transition: 'background 0.2s',
              }}
            >
              <span style={{ marginLeft: '0.25rem' }}>Blogs</span>
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              onClick={closeMenu}
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                padding: '0.5rem 1rem',
                borderRadius: 6,
                transition: 'background 0.2s',
              }}
            >
              <span style={{ marginLeft: '0.25rem' }}>Contact</span>
            </Link>
          </li>
          {clerkLoaded && clerkUser && user && ["customer", "grower", "admin"].includes(user.role) && (
            <li>
              <Link
                href={
                  user.role === "customer"
                    ? "/dashboard/customer"
                    : user.role === "grower"
                    ? "/dashboard/grower"
                    : "/dashboard/admin"
                }
                onClick={closeMenu}
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  background: 'var(--accent)',
                  borderRadius: '9999px',
                  padding: '0.5rem 1.5rem',
                  marginLeft: '0.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background 0.2s',
                }}
              >
                Dashboard
              </Link>
            </li>
          )}
          {/* User actions moved inside nav-links for mobile */}
          <li className="user-actions-mobile">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexDirection: 'column' }}>
              <CartIcon />
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--primary)',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '9999px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'background 0.2s',
                      width: '100%',
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </li>
        </ul>
        {/* User actions for desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }} className="user-actions-desktop">
          <CartIcon />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                style={{
                  background: 'var(--accent)',
                  color: 'var(--primary)',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background 0.2s',
                  marginLeft: '0.5rem',
                }}
              >
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
        {/* Responsive styles for mobile */}
        <style jsx global>{`
          @media (max-width: 900px) {
            .premium-nav {
              padding: 0.7rem 0.7rem 0.7rem 0.7rem !important;
            }
          }
          @media (max-width: 768px) {
            .premium-nav {
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              gap: 0 !important;
              min-height: 56px !important;
              margin-top: 0.5rem !important;
              padding: 0.5rem 1rem !important;
              border-radius: 16px !important;
              box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10) !important;
              background: rgba(255,255,255,0.95) !important;
              max-width: 96vw !important;
            }
            .nav-logo {
              width: 48px !important;
              height: 48px !important;
              min-width: 48px !important;
              min-height: 48px !important;
              margin: 0 !important;
              display: block !important;
            }
            .mobile-menu-button {
              display: block !important;
              position: static !important;
              right: 0 !important;
              top: auto !important;
              transform: none !important;
              margin-left: 0 !important;
              z-index: 1100;
              font-size: 1.5rem !important;
              padding: 0.5rem !important;
            }
            .user-actions-desktop {
              display: none !important;
            }
            .user-actions-mobile {
              display: block !important;
              margin-top: 0.8rem;
              padding-top: 0.8rem;
              border-top: 1px solid rgba(0,0,0,0.1);
              width: 100%;
            }
            .nav-links.menu-closed {
              display: none !important;
            }
            .nav-links.menu-open {
              display: flex !important;
              flex-direction: column !important;
              gap: 0.4rem !important;
              background: rgba(255, 248, 239, 0.98);
              position: fixed !important;
              top: 76px !important;
              left: 2vw;
              right: 2vw;
              padding: 1.2rem 1rem 1rem 1rem;
              border-radius: 16px;
              box-shadow: 0 8px 32px 0 rgba(0,0,0,0.12);
              z-index: 1050;
              max-height: calc(100vh - 90px);
              overflow-y: auto;
              backdrop-filter: blur(8px);
            }
            .nav-links.menu-open li a {
              padding: 0.6rem 1rem !important;
              border-radius: 8px !important;
              font-size: 1rem !important;
              text-align: center;
              background: rgba(255,255,255,0.7);
              margin-bottom: 0.1rem;
            }
            .nav-links.menu-open .user-actions-mobile div {
              gap: 0.5rem !important;
            }
            .nav-links.menu-open .user-actions-mobile button,
            .nav-links.menu-open .user-actions-mobile a {
              padding: 0.75rem 1.5rem !important;
              font-size: 1rem !important;
              margin: 0 !important;
            }
            .nav-links.menu-open .user-actions-mobile .cart-icon {
              width: 100% !important;
              justify-content: center !important;
              padding: 0.75rem 1.5rem !important;
            }
            /* Remove centering of logo on mobile */
            .premium-nav > div:first-child {
              flex: 0 0 auto !important;
              display: flex;
              justify-content: flex-start;
              align-items: center;
            }
          }
          @media (min-width: 769px) {
            .user-actions-mobile {
              display: none !important;
            }
            .user-actions-desktop {
              display: flex !important;
            }
          }
          @media (max-width: 480px) {
            .premium-nav {
              margin-top: 0.25rem !important;
              padding: 0.4rem 0.8rem !important;
              min-height: 52px !important;
              max-width: 98vw !important;
            }
            .nav-logo {
              width: 44px !important;
              height: 44px !important;
              min-width: 44px !important;
              min-height: 44px !important;
            }
            .mobile-menu-button {
              font-size: 1.4rem !important;
              padding: 0.4rem !important;
            }
            .nav-links.menu-open {
              top: 70px !important;
              left: 1vw;
              right: 1vw;
              padding: 1.2rem 0.8rem 1rem 0.8rem;
            }
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Navigation;
