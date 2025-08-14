"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, slugify } from "@/lib/utils";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  
  // Fetch products from Convex
  const products = useQuery(api.products.listProducts) || [];
  const growers = useQuery(api.growers.listGrowers) || [];
  
  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";
  
  // Note: We intentionally avoid a loading screen for consistency across pages

  // Create a map of growers for quick lookup
  const growersMap = new Map(growers.map(grower => [grower._id, grower]));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "all") return matchesSearch;
      if (filterBy === "in-stock") return matchesSearch && product.stock > 0;
      if (filterBy === "out-of-stock") return matchesSearch && product.stock === 0;
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Hero Section */}
      <section 
        className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee1.jpg')",
          minHeight: "420px",
          padding: `${sectionPadding} 0`,
          paddingTop: "clamp(2rem, 8vw, 3.5rem)",
          paddingBottom: "clamp(2rem, 8vw, 3.5rem)",
        }}
      >
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4 mt-10">
          Exceptional Coffee from Mt. Elgon
        </h1>
      </section>

      {/* Products Section */}
      <section id="products" style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <h2 className="text-[var(--primary)] text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Our Products</h2>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-6">
              {/* Search */}
          <div className="flex-1">
            <label className="w-full">
              <div className="flex items-center rounded-xl bg-[#f4ede7] h-11 w-full">
                  <span className="pl-4 text-[#9c6f49]">
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                  placeholder="Search for products"
                  className="form-input flex-1 bg-transparent border-none focus:ring-0 focus:outline-none px-3 text-[#1c140d] placeholder:text-[#9c6f49] text-base"
                    value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  />
              </div>
            </label>
          </div>
          {/* Sort & Filter */}
          <div className="flex gap-2 flex-wrap">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
                className="rounded-xl bg-[#f4ede7] text-[#1c140d] h-11 px-4 text-sm font-medium border-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="name">Sort: Name</option>
              <option value="price-low">Sort: Price Low</option>
              <option value="price-high">Sort: Price High</option>
            </select>
                <select
                  value={filterBy}
              onChange={e => setFilterBy(e.target.value)}
                className="rounded-xl bg-[#f4ede7] text-[#1c140d] h-11 px-4 text-sm font-medium border-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
          </div>
        </div>
        {/* Product Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 sm:gap-2">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">☕</div>
                <h3 className="text-2xl font-bold text-[#1c140d] mb-2">No coffees found</h3>
                <p className="text-[#9c6f49]">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredProducts.map(product => {
                const imageSrc = Array.isArray(product.imageUrl) ? (product.imageUrl[0] || "/coffee1.jpg") : (product.imageUrl || "/coffee1.jpg");
                return (
                  <Link
                    key={product._id}
                    href={`/products/${slugify(product.name)}`}
                    className="group block"
                  >
                    <div className="bg-[#f3f3f3] rounded-lg overflow-hidden">
                      <div
                        className="relative"
                        style={{
                          aspectRatio: "1/1",
                          width: "100%",
                          minHeight: "120px",
                          height: "clamp(120px, 18vw, 180px)",
                          maxHeight: "220px",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 80vw, (max-width: 1200px) 35vw, 22vw"
                          className="object-contain p-2 sm:p-3 md:p-4 transition-transform duration-300 group-hover:scale-105"
                          style={{
                            position: "absolute",
                            inset: 0,
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex flex-col items-center justify-center gap-1">
                      <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-[#1c140d] line-clamp-1 uppercase text-center">
                        {product.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-[#1c140d] text-center">
                        {product.price ? formatPrice(product.price) : ""}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Responsive styles for mobile and product cards */}
      <style jsx global>{`
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
          transform: scale(0.9);
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
    </div>
  );
};

export default ProductsPage; 