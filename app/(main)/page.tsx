"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Home() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  // Fetch user document from Convex
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");
  // Fetch products from Convex
  const products = useQuery(api.products.listProducts) || [];
  const [isLoading, setIsLoading] = useState(true);

  // Set loading state based on products being fetched
  useEffect(() => {
    if (products) {
      setIsLoading(false);
    }
  }, [products]);

  // Display a limited number of featured products
  const featuredProducts = products.slice(0, 3);

  return (
    <>
    <main className="page-content" style={{ marginTop: 0, paddingTop: 0, position: 'relative' }}>
      {/* Hero Section */}
      <section
        className="section hero-section flex items-center justify-center relative"
        style={{
          minHeight: '600px',
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url("/coffee1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          margin: 0,
          boxShadow: 'var(--shadow-lg)',
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
        }}
      >
        {/* Onboarding Banner Overlay */}
        {clerkLoaded && clerkUser && user && user.role !== "customer" && user.role !== "grower" && user.role !== "admin" && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '4%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '100%',
              maxWidth: 320,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 32,
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
              backdropFilter: 'blur(8px)',
              padding: '1.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2rem', margin: 0 }}>Welcome to the Cooperative</h3>
            <p style={{ color: 'var(--foreground)', fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>
              Complete your profile to get started.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', justifyContent: 'center' }}>
              <Link href="/onboarding/customer"
                className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[var(--accent)] text-[var(--primary)] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[var(--secondary)] hover:text-white transition"
                style={{ flex: 1 }}
              >
                <span className="truncate">Join as Customer</span>
              </Link>
            </div>
          </div>
        )}
        {/* Hero Content */}
        <div
          className="flex flex-col gap-6 items-center justify-center w-full max-w-2xl p-6 md:p-12 rounded-xl text-center"

        >
          <h1
            className="text-white font-black leading-tight tracking-tight"
            style={{
              fontSize: '2.5rem',
              letterSpacing: '-0.033em',
              marginBottom: '0.5rem',
          }}
        >
            Empowering Women, Brewing Change
        </h1>
          <h2
            className="text-white font-normal leading-normal"
          style={{
              fontSize: '1.15rem',
              marginBottom: '1.5rem',
              fontWeight: 400,
            }}
          >
            Our cooperative is dedicated to supporting women coffee farmers through fair trade practices and sustainable agriculture. We believe in quality coffee that makes a difference.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/products"
              className="btn hero-btn"
              style={{
                minWidth: 120,
                maxWidth: 480,
                borderRadius: 9999,
                height: 44,
                padding: '0 1.5rem',
                background: 'var(--accent)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.015em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="truncate">Discover Our Coffee</span>
            </Link>
            <Link
              href="/about"
              className="btn hero-btn"
              style={{
                minWidth: 120,
                maxWidth: 480,
                borderRadius: 9999,
                height: 44,
                padding: '0 1.5rem',
                background: 'var(--secondary)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.015em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="truncate">Our Impact</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section container about-section" style={{ padding: 'var(--spacing-lg) 0' }}>
        <div
          className="flex flex-col gap-6 md:flex-row md:gap-8 items-center justify-between px-4 py-10"
        >
          {/* Left: Image */}
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl md:min-w-[340px] md:w-1/2"
            style={{
              backgroundImage: `url('/coffee2.jpg')`,
              minHeight: 220,
              maxWidth: 480,
              margin: '0 auto',
            }}
          ></div>
          {/* Right: Info */}
          <div className="flex flex-col gap-6 md:min-w-[340px] md:w-1/2 md:justify-center">
            <div className="flex flex-col gap-2 text-left">
              <h1
                className="text-[var(--primary)] text-3xl md:text-4xl font-black leading-tight tracking-tight"
                style={{ letterSpacing: '-0.033em' }}
              >
                Empowering Women, Brewing Change
              </h1>
              <h2 className="text-[var(--foreground)] text-sm md:text-base font-normal leading-normal">
                Mt. Elgon Women in Specialty Coffee Ltd (MTEWISCOF) is a cooperative dedicated to supporting women coffee farmers in the highlands. We provide resources, training, and fair trade practices to ensure their economic independence and a sustainable future. Join us in our mission to create a more equitable and delicious coffee industry.
              </h2>
            </div>
            <Link
              href="/about"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 md:h-12 md:px-5 bg-[var(--accent)] text-[var(--primary)] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] shadow hover:bg-[var(--secondary)] hover:text-white transition"
              style={{ width: 'fit-content' }}
            >
              <span className="truncate">Learn More</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-section" style={{ backgroundColor: 'var(--light-bg)', padding: 'var(--spacing-lg) 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', fontSize: '1.4rem' }}>
            Discover Our Coffee
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {featuredProducts.map((product, idx) => {
                // Choose fallback image if product.imageUrl is missing
                let fallbackImg = idx % 2 === 0 ? '/coffee1.jpg' : '/coffee3.jpg';
                return (
                <div
                  key={product._id}
                    className="flex items-stretch justify-between gap-4 rounded-xl bg-white shadow-md p-4 flex-col md:flex-row"
                    style={{ minHeight: 180 }}
              >
                    {/* Left: Info */}
                    <div className="flex flex-[2_2_0px] flex-col gap-4 justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-[var(--primary)] text-base font-bold leading-tight">{product.name}</p>
                        <p className="text-[var(--secondary)] text-sm font-normal leading-normal">
                          {product.origin}
                    {product.tastingNotes && product.tastingNotes.length > 0 && (
                            <span className="ml-2 text-xs font-medium">• {product.tastingNotes.slice(0, 2).join(', ')}{product.tastingNotes.length > 2 ? `, +${product.tastingNotes.length - 2}` : ''}</span>
                          )}
                        </p>
                        <p className="text-[var(--foreground)] text-sm font-normal leading-normal mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <Link
                        href={`/products/${product._id}`}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-[var(--light-bg)] text-[var(--primary)] text-sm font-medium leading-normal w-fit border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition"
                        style={{ fontWeight: 600 }}
                      >
                        <span className="truncate">View Details</span>
                      </Link>
                    </div>
                    {/* Right: Image */}
                    <div
                      className="w-full md:w-64 bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
                      style={{
                        backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : `url('${fallbackImg}')`,
                        backgroundColor: product.imageUrl ? undefined : 'var(--accent)',
                        minWidth: 180,
                        maxWidth: 320,
                        minHeight: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {!product.imageUrl && (
                        <span className="text-5xl text-[var(--primary)]">☕</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <p>No products available at the moment. Check back soon!</p>
            </div>
          )}

          {products.length > 3 && (
            <div className="flex justify-center mt-8">
              <Link
                href="/products"
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[var(--light-bg)] text-[var(--primary)] text-sm font-bold leading-normal tracking-[0.015em] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition"
                style={{ fontWeight: 700 }}
              >
                <span className="truncate">View All Coffee Products</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="section container impact-section" style={{ padding: 'var(--spacing-lg) 0' }}>
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          {/* Card 1 */}
          <div className="flex flex-col justify-center bg-[var(--light-bg)] rounded-xl p-6 min-w-[220px] flex-1" style={{ textAlign: 'left' }}>
            <span className="text-[var(--primary)] text-base font-medium mb-2">Women Farmers Supported</span>
            <span className="text-[var(--primary)] text-2xl font-bold">1,200+</span>
          </div>
          {/* Card 2 */}
          <div className="flex flex-col justify-center bg-[var(--light-bg)] rounded-xl p-6 min-w-[220px] flex-1" style={{ textAlign: 'left' }}>
            <span className="text-[var(--primary)] text-base font-medium mb-2">Hectares of Sustainable Farming</span>
            <span className="text-[var(--primary)] text-2xl font-bold">500+</span>
          </div>
          {/* Card 3 */}
          <div className="flex flex-col justify-center bg-[var(--light-bg)] rounded-xl p-6 min-w-[220px] flex-1" style={{ textAlign: 'left' }}>
            <span className="text-[var(--primary)] text-base font-medium mb-2">Increase in Farmer Income</span>
            <span className="text-[var(--primary)] text-2xl font-bold">25%</span>
          </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="section cta-section"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'white',
          textAlign: 'center',
          padding: 'var(--spacing-xl) 0',
          marginBottom: '0',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div className="container">
          <h2 style={{ color: 'white', fontSize: '1.4rem', marginBottom: 12 }}>
            Join Our Coffee Journey
          </h2>
          <p
            style={{
              maxWidth: '600px',
              margin: '0 auto var(--spacing-lg)',
              color: 'white',
              fontSize: '1rem',
            }}
          >
            Support women coffee farmers and enjoy exceptional specialty coffee from the slopes of Mt. Elgon.
          </p>
          <Link
            href="/products"
            className="btn btn-accent"
            style={{ minWidth: 180, fontWeight: 600, fontSize: '1rem' }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Responsive styles for mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .hero-section {
          padding-top: 0 !important;
          margin-top: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          }
          .hero-content h1 {
            font-size: 1.4rem !important;
          }
          .hero-btns .hero-btn {
            width: 100% !important;
            min-width: 0 !important;
            margin-bottom: 0.5rem !important;
          }
          .about-section .about-content {
            flex-direction: column !important;
            gap: 1.5rem !important;
          }
          .about-section img {
            max-width: 100% !important;
          }
          .featured-section .featured-grid {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
          }
        .impact-section .flex-row {
          flex-direction: column !important;
            gap: 1.2rem !important;
          }
          .cta-section {
            padding: var(--spacing-lg) 0 !important;
          }
          .page-content {
            padding-top: 60px !important;
          }
        }
      `}</style>
    </main>
  </>
  );
}

// Removed AuthenticatedContent as its logic is simplified into the main Home component
// function AuthenticatedContent() {
//   return (
//     <div>
//       <img src="/Logo Icon.png" alt="App Logo" style={{ width: '50px', height: '50px' }} />
//       <h1 style={{ color: 'var(--primary)' }}>Welcome to the app</h1>
//       <UploadButton
//         endpoint="imageUploader"
//         onClientUploadComplete={(res) => {
//           console.log("Files: ", res);
//           alert("Upload Completed");
//         }}
//         onUploadError={(error: Error) => {
//           alert(`ERROR! ${error.message}`);
//         }}
//       />
//     </div>
//   );
// }
