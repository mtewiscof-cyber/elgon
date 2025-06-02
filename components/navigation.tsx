"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { useState } from 'react';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="premium-nav" style={{
      backgroundColor: 'rgba(255, 248, 239, 0.7)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      borderRadius: '0 0 10px 10px',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <Image 
            src="/Main Logo.png"
            alt="Mt.Elgon Women Logo Icon"
            width={150}
            height={150}
            style={{ objectFit: 'contain', marginRight: '0.5rem' }}
          />

        </Link>
      </div>
      <button 
        onClick={toggleMenu} 
        style={{ 
          display: 'none', 
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
        className="mobile-menu-button"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      <ul style={{
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
      }} className={menuOpen ? 'menu-open' : 'menu-closed'}>
        <li><Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><span style={{marginLeft: '0.25rem'}}>Home</span></Link></li>
        <li><Link href="/about" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><span style={{marginLeft: '0.25rem'}}>About & Impact</span></Link></li>
        <li><Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><span style={{marginLeft: '0.25rem'}}>Products & Education</span></Link></li>
        <li><Link href="/blog" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><span style={{marginLeft: '0.25rem'}}>Blog & Contact</span></Link></li>
      </ul>
      <div style={{ flexShrink: 0 }} className={menuOpen ? 'menu-open' : 'menu-closed'}>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--primary)',
              padding: '0.8rem 2rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navigation;
