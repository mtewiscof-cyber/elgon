"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterBy, setFilterBy] = useState("all");
  
  // Fetch products from Convex
  const products = useQuery(api.products.listProducts);
  const growers = useQuery(api.growers.listGrowers);
  
  if (products === undefined || growers === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Our Coffee Collection</h2>
              <p className="text-gray-600">Discovering exceptional coffees from Mt. Elgon...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Exceptional Coffee from Mt. Elgon
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
              Discover premium specialty coffee grown by women farmers on the volcanic slopes of Uganda's Mt. Elgon
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="#products" className="btn bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Shop Our Coffee
              </Link>
              <Link href="#wholesale" className="btn border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold transition-all duration-300">
                Wholesale Inquiry
              </Link>
            </div>
        </div>
        </div>
      </div>

      {/* Products Section */}
      <section id="products" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-4">Our Coffee Collection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each coffee tells a story of the dedicated women farmers who cultivate it with care and passion
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search coffees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filter */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No coffees found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => {
                const grower = product.growerId ? growersMap.get(product.growerId) : null;
                
                return (
                  <Link href={`/products/${product._id}`} key={product._id}>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                      {/* Product Image */}
                      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-6xl text-orange-300">☕</div>
                          </div>
                        )}
                        
                        {/* Stock Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
        </div>
      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {product.description}
                          </p>
                        </div>

                        {/* Origin & Grower */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {product.origin}
                          </div>
                          {grower && (
                            <div className="flex items-center text-sm text-gray-500">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {grower.name}
                            </div>
                          )}
                        </div>

                        {/* Tasting Notes */}
                        {product.tastingNotes && product.tastingNotes.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {product.tastingNotes.slice(0, 3).map((note, index) => (
                                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                                  {note}
                                </span>
                              ))}
                              {product.tastingNotes.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{product.tastingNotes.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price and Weight */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                            <span className="text-gray-500 text-sm ml-2">/ {product.weight}</span>
                          </div>
                          <div className="text-orange-600 group-hover:text-orange-700 transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Wholesale Section */}
      <section id="wholesale" className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
                  Wholesale Partnership
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join our mission to support women farmers while serving exceptional coffee to your customers.
                </p>
                
                <div className="space-y-6 mb-8">
                  {[
                    { icon: "💰", title: "Competitive Pricing", desc: "Volume discounts and flexible payment terms" },
                    { icon: "📦", title: "Flexible Orders", desc: "Minimum order quantities that work for your business" },
                    { icon: "🤝", title: "Direct Relationships", desc: "Connect directly with our women farmers" },
                    { icon: "🎯", title: "Marketing Support", desc: "Point-of-sale materials and coffee education" }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="text-2xl">{benefit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="btn bg-orange-600 text-white hover:bg-orange-700 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Get Wholesale Info
                </Link>
              </div>
              
              <div className="relative h-96 lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-600/20"></div>
                <Image 
                  src="/api/placeholder/600/400"
                  alt="Wholesale Coffee Beans"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Never Run Out of Great Coffee</h2>
          <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
            Subscribe to regular deliveries and enjoy exclusive benefits
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              { icon: "💰", title: "10% Savings", desc: "Save on every order" },
              { icon: "🚚", title: "Free Shipping", desc: "Complimentary delivery" },
              { icon: "📅", title: "Flexible Schedule", desc: "Choose your frequency" },
              { icon: "⚙️", title: "Easy Management", desc: "Pause or cancel anytime" }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="opacity-80">{benefit.desc}</p>
          </div>
            ))}
          </div>

          <Link href="/subscription" className="btn bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Start Your Subscription
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage; 