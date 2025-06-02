"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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
    <main className="page-content">
      {/* Onboarding Banner */}
      {clerkLoaded && clerkUser && user && user.role !== "customer" && user.role !== "grower" && user.role !== "admin" && (
        <div
          className="container"
          style={{
            margin: "var(--spacing-md) auto",
            padding: "var(--spacing-md)",
            background: "var(--accent)",
            borderRadius: "var(--border-radius)",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          <h3 style={{ color: "var(--primary)", margin: 0 }}>Welcome! Complete your profile to get started</h3>
          <p style={{ color: "var(--foreground)", margin: 0 }}>
            Please choose how you want to join our community:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", width: "100%", justifyContent: "center" }}>
            <Link href="/onboarding/customer" className="btn btn-primary" style={{ flex: 1, minWidth: 140 }}>
              Onboard as Customer
            </Link>
            <Link href="/onboarding/grower" className="btn btn-secondary" style={{ flex: 1, minWidth: 140 }}>
              Onboard as Grower
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="section hero-section"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/Secondary Logo.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          padding: 'var(--spacing-xl) 0',
          borderRadius: 'var(--border-radius)',
          margin: '0 var(--spacing-md)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="container hero-content" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1
            style={{
              color: 'white',
              marginBottom: 'var(--spacing-lg)',
              fontSize: '2.2rem',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}
          >
            Welcome to Mt. Elgon Women in Specialty Coffee
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              maxWidth: '90vw',
              margin: '0 auto var(--spacing-lg)',
              color: 'white',
              lineHeight: 1.5,
            }}
          >
            Empowering women coffee farmers in Uganda through sustainable practices and direct market access.
          </p>
          <div
            className="flex gap-md justify-center hero-btns"
            style={{ flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}
          >
            <Link
              href="/products"
              className="btn btn-accent hero-btn"
              style={{ minWidth: 180, fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}
            >
              Discover Our Coffee
            </Link>
            <Link
              href="/about"
              className="btn btn-primary hero-btn"
              style={{ backgroundColor: 'var(--secondary)', minWidth: 180, fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}
            >
              Our Impact
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section container about-section" style={{ padding: 'var(--spacing-lg) 0' }}>
        <div
          className="flex gap-lg about-content"
          style={{
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            rowGap: '2rem',
          }}
        >
          <div style={{ flex: '1', minWidth: '260px', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Our Story</h2>
            <p style={{ fontSize: '1rem', marginBottom: 8 }}>
              Mt. Elgon Women in Specialty Coffee Ltd (MTEWISCOF) is a cooperative of women coffee farmers
              in the Mt. Elgon region of Uganda. We are dedicated to empowering women through sustainable
              coffee production and direct market access.
            </p>
            <p style={{ fontSize: '1rem', marginBottom: 16 }}>
              Our mission is to improve the livelihoods of women farmers and their families while producing
              exceptional coffee that reflects the unique terroir of Mt. Elgon.
            </p>
            <Link href="/about" className="btn btn-primary" style={{ width: '100%', maxWidth: 220 }}>
              Learn More
            </Link>
          </div>
          <div style={{ flex: '1', minWidth: '220px', textAlign: 'center' }}>
            <img
              src="/Main Logo.png"
              alt="Women Coffee Farmers"
              style={{
                maxWidth: '90%',
                height: 'auto',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-md)',
                margin: '0 auto',
              }}
            />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg featured-grid">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="card product-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ flex: '1', marginBottom: 'var(--spacing-md)' }}>
                    {product.imageUrl ? (
                      <div
                        style={{
                          width: '100%',
                          height: '180px',
                          position: 'relative',
                          borderRadius: 'var(--border-radius)',
                          overflow: 'hidden',
                          marginBottom: 'var(--spacing-md)',
                        }}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          height: '180px',
                          backgroundColor: 'var(--primary)',
                          borderRadius: 'var(--border-radius)',
                          marginBottom: 'var(--spacing-md)',
                        }}
                      ></div>
                    )}

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{product.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">Origin: {product.origin}</p>

                    {product.tastingNotes && product.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tastingNotes.slice(0, 3).map((note, i) => (
                          <span key={i} className="badge badge-accent text-xs px-2 py-1">
                            {note}
                          </span>
                        ))}
                        {product.tastingNotes.length > 3 && (
                          <span className="badge badge-neutral text-xs px-2 py-1">
                            +{product.tastingNotes.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <p
                      className="mb-4"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.98rem',
                      }}
                    >
                      {product.description}
                    </p>

                    <div className="text-lg font-semibold mb-4">
                      ${product.price.toFixed(2)}{' '}
                      <span className="text-sm font-normal text-gray-600">/ {product.weight}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <Link
                      href={`/products/${product._id}`}
                      className="btn btn-secondary"
                      style={{ width: '100%', display: 'block', fontWeight: 600 }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p>No products available at the moment. Check back soon!</p>
            </div>
          )}

          {products.length > 3 && (
            <div className="text-center mt-8">
              <Link href="/products" className="btn btn-primary" style={{ width: '100%', maxWidth: 220 }}>
                View All Coffee Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="section container impact-section" style={{ padding: 'var(--spacing-lg) 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', fontSize: '1.4rem' }}>
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg impact-grid">
          {/* Impact Stat 1 */}
          <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2rem', fontWeight: 'bold' }}>500+</h3>
            <p>Women Farmers Supported</p>
          </div>
          {/* Impact Stat 2 */}
          <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2rem', fontWeight: 'bold' }}>200+</h3>
            <p>Hectares of Sustainable Farming</p>
          </div>
          {/* Impact Stat 3 */}
          <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2rem', fontWeight: 'bold' }}>40%</h3>
            <p>Increase in Farmer Income</p>
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
            padding: var(--spacing-lg) 0;
            margin: 0 var(--spacing-sm);
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
          .impact-section .impact-grid {
            grid-template-columns: 1fr !important;
            gap: 1.2rem !important;
          }
          .cta-section {
            padding: var(--spacing-lg) 0 !important;
          }
        }
      `}</style>
    </main>
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
