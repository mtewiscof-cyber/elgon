"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { formatPrice } from "@/lib/utils";

export default function Home() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");
  const products = useQuery(api.products.listProducts) || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (products) setIsLoading(false);
  }, [products]);

  const featuredProducts = products.slice(0, 3);

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  return (
    <>
      <main
        style={{
          margin: 0,
          padding: 0,
          position: "relative",
          background: "var(--page-bg, #faf9f6)",
        }}
      >
        {/* Hero Section */}
        <section
          className="section hero-section flex items-center justify-center relative"
          style={{
            minHeight: "420px",
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 100%), url("/coffeeeebg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: 0,
            boxShadow: "var(--shadow-lg)",
            padding: `${sectionPadding} 0`,
            paddingTop: "clamp(2rem, 8vw, 3.5rem)",
            paddingBottom: "clamp(2rem, 8vw, 3.5rem)",
            borderRadius: "clamp(0.5rem, 2vw, 1.25rem)",
          }}
        >
          {/* Onboarding Banner Overlay */}
          {clerkLoaded &&
            clerkUser &&
            user &&
            user.role !== "customer" &&
            user.role !== "grower" &&
            user.role !== "admin" && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "clamp(1rem, 5vw, 2.5rem)",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "100%",
                  maxWidth: 320,
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 24,
                  boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)",
                  backdropFilter: "blur(8px)",
                  padding: "1.2rem 1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    color: "var(--primary)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    margin: 0,
                  }}
                >
                  Welcome to the Cooperative
                </h3>
                <p
                  style={{
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Complete your profile to get started.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <Link
                    href="/onboarding/customer"
                    className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[var(--accent)] text-[var(--primary)] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
                    style={{ flex: 1 }}
                  >
                    <span className="truncate">Join as Customer</span>
                  </Link>
                </div>
              </div>
            )}
          {/* Hero Content */}
          <div
            className="flex flex-col gap-4 items-center justify-center w-full max-w-2xl px-4 py-6 rounded-lg text-center"
            style={{
              margin: "0 auto",
              borderRadius: "clamp(0.5rem, 2vw, 1.25rem)",
            }}
          >
            <h1
              className="text-white font-black leading-tight tracking-tight"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                letterSpacing: "-0.033em",
                marginBottom: "0.25rem",
                marginTop: "2.5rem",
              }}
            >
              Empowering Women, Brewing Change
            </h1>
            <h2
              className="text-white font-normal leading-normal"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                marginBottom: "1rem",
                fontWeight: 400,
              }}
            >
              Our cooperative is dedicated to supporting women coffee farmers through fair trade practices and sustainable agriculture. We believe in quality coffee that makes a difference.
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/products"
                className="btn hero-btn"
                style={{
                  minWidth: 100,
                  maxWidth: 320,
                  borderRadius: 9999,
                  height: 40,
                  padding: "0 1.2rem",
                  background: "var(--accent)",
                  color: "var(--primary)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.015em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="truncate">Discover Our Coffee</span>
              </Link>
              <Link
                href="/about"
                className="btn hero-btn"
                style={{
                  minWidth: 100,
                  maxWidth: 320,
                  borderRadius: 9999,
                  height: 40,
                  padding: "0 1.2rem",
                  background: "var(--secondary)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.015em",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span className="truncate">Our Impact</span>
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section - Modern, Larger, More Vivid, No Gradient, No Accent Text Color */}
        <section
          className="section about-section"
          style={{
            padding: `clamp(2.5rem, 8vw, 5rem) 0`,
            margin: 0,
            borderRadius: "clamp(0.5rem, 2vw, 1.5rem)",
            background: "#fff",
            boxShadow: "0 4px 32px 0 rgba(80, 60, 120, 0.07)",
          }}
        >
          <div
            className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16 justify-between"
            style={{
              maxWidth: 1300,
              margin: "0 auto",
              padding: `0 ${sectionPadding}`,
            }}
          >
            {/* Left: Info */}
            <div className="flex flex-col gap-7 md:w-1/2 w-full md:pr-8">
              <div className="flex flex-col gap-4 text-left">
                <h1
                  className="text-[var(--primary)] text-3xl md:text-5xl font-extrabold leading-tight tracking-tight"
                  style={{
                    letterSpacing: "-0.045em",
                    lineHeight: 1.1,
                    textShadow: "0 2px 16px rgba(80,60,120,0.08)",
                  }}
                >
                  Empowering Women, <span className="text-[var(--primary)]">Brewing Change</span>
                </h1>
                <h2
                  className="text-[var(--foreground)] text-lg md:text-2xl font-semibold leading-snug"
                  style={{
                    textShadow: "0 1px 8px rgba(80,60,120,0.04)",
                  }}
                >
                  Mt. Elgon Women in Specialty Coffee Ltd (MTEWISCOF) uplifts women coffee farmers in Uganda's highlands. <span className="font-bold text-[var(--primary)]">We champion economic independence</span> through <span className="font-bold text-[var(--primary)]">resources, training, and fair trade</span>. Our mission: <span className="font-bold text-[var(--primary)]">a more equitable, sustainable, and delicious coffee industry</span>—one cup at a time.
                </h2>
                <ul className="mt-2 space-y-2 text-base md:text-lg text-[var(--primary)] font-medium">
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    <span>100% Women-Owned Cooperative</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--secondary)]"></span>
                    <span>Direct Impact in Local Communities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[var(--primary)]"></span>
                    <span>Sustainable, Ethical, and Delicious</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/about"
                className="flex min-w-[120px] max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-[var(--primary)] text-white text-lg font-bold shadow-lg hover:scale-105 transition-transform duration-200"
                style={{ width: "fit-content", boxShadow: "0 4px 24px 0 rgba(80,60,120,0.10)" }}
              >
                <span className="truncate">Learn More</span>
              </Link>
            </div>
            {/* Right: Image */}
            <div
              className="w-full md:w-1/2 flex items-center justify-center"
              style={{
                minHeight: 320,
                maxWidth: 650,
                margin: "0 auto",
              }}
            >
              <div
                className="relative w-full aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"
                style={{
                  minHeight: 260,
                  maxHeight: 480,
                  background: "#fff",
                  border: "4px solid #fff",
                  boxShadow: "0 8px 32px 0 rgba(80,60,120,0.13)",
                }}
              >
                <img
                  src="/home1.jpg"
                  alt="Women coffee farmers"
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  style={{
                    borderRadius: "1.5rem",
                    filter: "saturate(1.15) contrast(1.05)",
                  }}
                  loading="lazy"
                />
                <div
                  className="absolute bottom-3 left-3 bg-white/80 text-[var(--primary)] text-xs md:text-sm font-semibold px-3 py-1 rounded-full shadow"
                  style={{
                    backdropFilter: "blur(4px)",
                  }}
                >
                  Mt. Elgon Highlands, Uganda
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section
          className="section featured-section"
          style={{
            backgroundColor: "var(--light-bg)",
            padding: `${sectionPadding} 0`,
            margin: 0,
            borderRadius: "clamp(0.5rem, 2vw, 1.25rem)",
          }}
        >
          <div
            className="featured-container"
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: `0 ${sectionPadding}`,
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "clamp(0.5rem, 2vw, 1.2rem)",
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Discover Our Coffee
            </h2>

            {isLoading ? (
              <div
                className="flex justify-center items-center"
                style={{ minHeight: "100px" }}
              >
                <div className="loading-spinner"></div>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div
                className="featured-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  margin: "0 auto",
                  maxWidth: 900,
                }}
              >
                {featuredProducts.map((product, idx) => {
                  let fallbackImg =
                    idx % 2 === 0 ? "/coffee1.jpg" : "/coffee3.jpg";
                  return (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="product-card"
                      style={{
                        position: "relative",
                        display: "block",
                        textDecoration: "none",
                        borderRadius: "16px",
                        overflow: "hidden",
                        minHeight: "200px",
                        background: "var(--accent)",
                        boxShadow: "0 4px 24px 0 rgba(80,60,120,0.10)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Product Image Background */}
                      <div
                        className="product-image-bg"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundImage: product.imageUrl
                            ? `url('${product.imageUrl}')`
                            : `url('${fallbackImg}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          transform: "scale(0.85)",
                          transition: "transform 0.3s ease",
                        }}
                      />

                      {/* Gradient Overlay */}
                      <div
                        className="product-overlay"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%)",
                          padding: "1.5rem",
                          color: "white",
                        }}
                      >
                        {/* Product Info */}
                        <div className="product-info">
                          <div className="product-name" style={{
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            marginBottom: "0.25rem",
                            color: "white",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}>
                            {product.name}
                          </div>
                          <div className="product-price" style={{
                            fontSize: "1.2rem",
                            fontWeight: "800",
                            color: "white",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}>
                            {product.price ? formatPrice(product.price) : ""}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <p>No products available at the moment. Check back soon!</p>
              </div>
            )}

            {products.length > 3 && (
              <div className="flex justify-center mt-6">
                <Link
                  href="/products"
                  className="flex min-w-[70px] max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[var(--light-bg)] text-[var(--primary)] text-sm font-bold leading-normal tracking-[0.015em] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--primary)] transition"
                  style={{ fontWeight: 700 }}
                >
                  <span className="truncate">View All Coffee Products</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Minimal Impact Section */}
        <section
          className="section impact-section"
          style={{
            padding: `${sectionPadding} 0`,
            margin: 0,
            borderRadius: "clamp(0.5rem, 2vw, 1.25rem)",
            background: "#fff",
          }}
        >
          <div
            className="flex flex-col items-center"
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: `0 ${sectionPadding}`,
            }}
          >
            <h2
              style={{
                color: "var(--primary)",
                textAlign: "center",
                marginBottom: "2rem",
                fontSize: "1.35rem",
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Impact Card 1 */}
              <div className="impact-card-minimal">
                <div className="number-minimal" style={{ color: "var(--primary)" }}>1,200+</div>
                <div className="label-minimal">Women Farmers</div>
              </div>
              {/* Impact Card 2 */}
              <div className="impact-card-minimal">
                <div className="number-minimal" style={{ color: "var(--secondary)" }}>500+</div>
                <div className="label-minimal">Hectares Farmed</div>
              </div>
              {/* Impact Card 3 */}
              <div className="impact-card-minimal">
                <div className="number-minimal" style={{ color: "var(--accent)" }}>25%</div>
                <div className="label-minimal">Income Increase</div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive styles for mobile and minimal impact section */}
        <style jsx global>{`
          .section {
            box-sizing: border-box;
            width: 100%;
          }

          /* Minimal Impact Cards Styling */
          .impact-card-minimal {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px 0 rgba(80,60,120,0.10);
            padding: 2rem 1.5rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--accent-light, #f3e9f7);
            min-height: 120px;
            transition: box-shadow 0.2s;
          }
          .impact-card-minimal:hover {
            box-shadow: 0 8px 32px 0 rgba(80,60,120,0.16);
          }
          .number-minimal {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            line-height: 1;
          }
          .label-minimal {
            font-size: 1.08rem;
            font-weight: 600;
            color: var(--foreground);
            letter-spacing: -0.01em;
          }

          /* Product Cards Styling */
          .product-card {
            position: relative;
            display: block;
            text-decoration: none;
            border-radius: 16px;
            overflow: hidden;
            min-height: 200px;
            background: var(--accent);
            box-shadow: 0 4px 24px 0 rgba(80,60,120,0.10);
            transition: all 0.3s ease;
          }

          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px 0 rgba(80,60,120,0.20);
          }

          .product-card:hover .product-image-bg {
            transform: scale(1.05);
          }

          .product-image-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: transform 0.3s ease;
            transform: scale(0.85);
          }

          .product-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%);
            padding: 1.5rem;
            color: white;
          }

          .product-info {
            position: relative;
            z-index: 2;
          }

          .product-name {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .product-price {
            font-size: 1.2rem;
            font-weight: 800;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          @media (max-width: 900px) {
            .featured-section .featured-grid {
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
              gap: 1rem !important;
            }
            .section,
            .about-section,
            .impact-section {
              border-radius: 0.75rem !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
            .impact-card-minimal {
              padding: 1.5rem 1rem;
            }
            .number-minimal {
              font-size: 1.7rem;
            }
            .product-card {
              min-height: 180px;
            }
            .product-image-bg {
              transform: scale(0.9);
            }
            .product-name {
              font-size: 1rem;
            }
            .product-price {
              font-size: 1.1rem;
            }
          }
          @media (max-width: 768px) {
            .hero-section {
              padding-top: 1.5rem !important;
              padding-bottom: 1.5rem !important;
              margin: 0 !important;
              border-radius: 0.75rem !important;
            }
            .hero-content h1 {
              font-size: 1.2rem !important;
            }
            .hero-btns .hero-btn {
              width: 100% !important;
              min-width: 0 !important;
              margin-bottom: 0.5rem !important;
            }
            .about-section .about-content {
              flex-direction: column !important;
              gap: 1rem !important;
            }
            .about-section img {
              max-width: 100% !important;
            }
            .featured-section .featured-grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            .impact-section .grid {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
            }
            .page-content {
              padding-top: 60px !important;
            }
            .section,
            .about-section,
            .impact-section {
              padding-left: 0.75rem !important;
              padding-right: 0.75rem !important;
            }
            .impact-card-minimal {
              padding: 1rem 0.75rem;
            }
            .number-minimal {
              font-size: 1.3rem;
            }
            .product-card {
              min-height: 160px;
            }
            .product-image-bg {
              transform: scale(0.95);
            }
            .product-name {
              font-size: 0.95rem;
            }
            .product-price {
              font-size: 1rem;
            }
            .product-overlay {
              padding: 1rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}
