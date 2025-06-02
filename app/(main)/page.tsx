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
      <section className="section" style={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/Secondary Logo.png")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 'var(--spacing-xl) 0',
        borderRadius: 'var(--border-radius)',
        margin: '0 var(--spacing-md)'
      }}>
        <div className="container">
          <h1 style={{ color: 'white', marginBottom: 'var(--spacing-lg)' }}>Welcome to Mt. Elgon Women in Specialty Coffee</h1>
          <p style={{ 
            fontSize: '1.2rem', 
            maxWidth: '800px', 
            margin: '0 auto var(--spacing-lg)',
            color: 'white'
          }}>
            Empowering women coffee farmers in Uganda through sustainable practices and direct market access.
          </p>
          <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn-accent">Discover Our Coffee</Link>
            <Link href="/about" className="btn btn-primary" style={{ backgroundColor: 'var(--secondary)' }}>Our Impact</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section container">
        <div className="flex gap-lg" style={{ 
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2>Our Story</h2>
            <p>
              Mt. Elgon Women in Specialty Coffee Ltd (MTEWISCOF) is a cooperative of women coffee farmers 
              in the Mt. Elgon region of Uganda. We are dedicated to empowering women through sustainable 
              coffee production and direct market access.
            </p>
            <p>
              Our mission is to improve the livelihoods of women farmers and their families while producing 
              exceptional coffee that reflects the unique terroir of Mt. Elgon.
            </p>
            <Link href="/about" className="btn btn-primary">Learn More</Link>
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center' }}>
            <img 
              src="/Main Logo.png" 
              alt="Women Coffee Farmers" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-md)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section" style={{ backgroundColor: 'var(--light-bg)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Discover Our Coffee</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {featuredProducts.map((product) => (
                <div key={product._id} className="card product-card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <div style={{ flex: '1', marginBottom: 'var(--spacing-md)' }}>
                    {product.imageUrl ? (
                      <div style={{ 
                        width: '100%', 
                        height: '220px', 
                        position: 'relative',
                        borderRadius: 'var(--border-radius)',
                        overflow: 'hidden',
                        marginBottom: 'var(--spacing-md)'
                      }}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ) : (
                      <div style={{ 
                        height: '220px', 
                        backgroundColor: 'var(--primary)', 
                        borderRadius: 'var(--border-radius)',
                        marginBottom: 'var(--spacing-md)'
                      }}></div>
                    )}
                    
                    <h3>{product.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">Origin: {product.origin}</p>
                    
                    {product.tastingNotes && product.tastingNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tastingNotes.slice(0, 3).map((note, i) => (
                          <span key={i} className="badge badge-accent text-xs px-2 py-1">
                            {note}
                          </span>
                        ))}
                        {product.tastingNotes.length > 3 && (
                          <span className="badge badge-neutral text-xs px-2 py-1">+{product.tastingNotes.length - 3}</span>
                        )}
                      </div>
                    )}
                    
                    <p className="mb-4" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {product.description}
                    </p>
                    
                    <div className="text-lg font-semibold mb-4">
                      ${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">/ {product.weight}</span>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <Link 
                      href={`/products/${product._id}`} 
                      className="btn btn-secondary"
                      style={{ width: '100%', display: 'block' }}
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
              <Link href="/products" className="btn btn-primary">
                View All Coffee Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Section */}
      <section className="section container">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Impact Stat 1 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: 'bold' }}>500+</h3>
            <p>Women Farmers Supported</p>
          </div>
          {/* Impact Stat 2 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: 'bold' }}>200+</h3>
            <p>Hectares of Sustainable Farming</p>
          </div>
          {/* Impact Stat 3 */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: 'bold' }}>40%</h3>
            <p>Increase in Farmer Income</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section" style={{ 
        backgroundColor: 'var(--primary)',
        color: 'white',
        textAlign: 'center',
        padding: 'var(--spacing-xl) 0',
        marginBottom: '0'
      }}>
        <div className="container">
          <h2 style={{ color: 'white' }}>Join Our Coffee Journey</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto var(--spacing-lg)', color: 'white' }}>
            Support women coffee farmers and enjoy exceptional specialty coffee from the slopes of Mt. Elgon.
          </p>
          <Link href="/products" className="btn btn-accent">Shop Now</Link>
        </div>
      </section>
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
