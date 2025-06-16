"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          minHeight: 64,
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
          className={menuOpen ? 'menu-open' : 'menu-closed'}
        >
          <li>
            <Link
              href="/about"
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
              href="/about#impact"
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
              <span style={{ marginLeft: '0.25rem' }}>Our Impact</span>
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
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
        </ul>
        {/* User actions and Shop Now button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }} className={menuOpen ? 'menu-open' : 'menu-closed'}>
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
          <Link
            href="/products"
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
            Shop Now
          </Link>
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
              justify-content: center !important;
              gap: 0 !important;
              min-height: 48px !important;
              margin-top: 0.7rem !important;
              padding: 0.3rem 0.5rem !important;
              border-radius: 24px !important;
              box-shadow: 0 2px 12px 0 rgba(0,0,0,0.10) !important;
              background: rgba(255,255,255,0.92) !important;
              max-width: 98vw !important;
            }
            .nav-logo {
              width: 80px !important;
              height: 80px !important;
              min-width: 80px !important;
              min-height: 80px !important;
              margin: 0 auto !important;
              display: block !important;
            }
            .mobile-menu-button {
              display: block !important;
              position: absolute !important;
              right: 1.2rem !important;
              top: 50%;
              transform: translateY(-50%);
              margin-left: 0 !important;
              z-index: 1100;
            }
            .menu-closed {
              display: none !important;
            }
            .menu-open {
              display: flex !important;
              flex-direction: column !important;
              gap: 0.7rem !important;
              background: rgba(255, 248, 239, 0.98);
              position: fixed !important;
              top: 70px !important;
              left: 0;
              right: 0;
              padding: 1.2rem 0.5rem 1rem 0.5rem;
              border-radius: 0 0 18px 18px;
              box-shadow: var(--shadow-md);
              z-index: 1050;
            }
            /* Center nav content and logo */
            .premium-nav > div:first-child {
              flex: 1 1 0%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Navigation;
