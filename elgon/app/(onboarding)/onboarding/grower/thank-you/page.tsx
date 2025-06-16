'use client';

import Link from 'next/link';

const GrowerThankYouPage = () => {
  return (
    <div className="page-content container section text-center">
      <h1 style={{ color: 'var(--primary)' }}>Thank You for Onboarding!</h1>
      <p className="lead" style={{ marginBottom: 'var(--spacing-lg)' }}>Your grower profile has been created successfully.</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <Link href="/grower/dashboard" className="btn btn-primary">
          Go to Grower Dashboard
        </Link>
        <Link href="/" className="btn btn-secondary">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default GrowerThankYouPage;
