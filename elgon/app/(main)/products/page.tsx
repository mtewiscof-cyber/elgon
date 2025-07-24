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
    <div className="min-h-screen bg-[#fcfaf8]">
      {/* Hero Section */}
      <section className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-2 py-10 md:py-20" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee1.jpg')"}}>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-4 mt-10">Exceptional Coffee from Mt. Elgon</h1>
      </section>

      {/* Products Section */}
      <section id="products" className="max-w-5xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#1c140d] text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Our Products</h2>
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-6">
              {/* Search */}
          <div className="flex-1">
            <label className="w-full">
              <div className="flex items-center rounded-xl bg-[#f4ede7] h-11 w-full">
                <span className="pl-4 text-[#9c6f49]"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg></span>
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
              className="rounded-xl bg-[#f4ede7] text-[#1c140d] h-11 px-4 text-sm font-medium border-none focus:ring-2 focus:ring-[#f38124]"
            >
              <option value="name">Sort: Name</option>
              <option value="price-low">Sort: Price Low</option>
              <option value="price-high">Sort: Price High</option>
            </select>
                <select
                  value={filterBy}
              onChange={e => setFilterBy(e.target.value)}
              className="rounded-xl bg-[#f4ede7] text-[#1c140d] h-11 px-4 text-sm font-medium border-none focus:ring-2 focus:ring-[#f38124]"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-2xl font-bold text-[#1c140d] mb-2">No coffees found</h3>
              <p className="text-[#9c6f49]">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredProducts.map(product => {
                const grower = product.growerId ? growersMap.get(product.growerId) : null;
                return (
                <Link key={product._id} href={`/products/${product._id}`} className="flex flex-col gap-2 bg-white rounded-xl shadow-sm p-2 pb-3 hover:shadow-md transition-shadow cursor-pointer">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                    style={{ backgroundImage: product.imageUrl ? `url('${product.imageUrl}')` : `url('/coffee1.jpg')` }}
                  ></div>
                          <div>
                    <p className="text-[#1c140d] text-base font-semibold leading-tight truncate">{product.name}</p>
                    <p className="text-[#9c6f49] text-xs font-normal leading-normal line-clamp-2">{product.description}</p>
                          </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                    <span className="text-[#1c140d] text-sm font-bold">${product.price.toFixed(2)}</span>
                      </div>
                    </Link>
                );
            })
          )}
        </div>
      </section>

      {/* Wholesale Section */}
      <section id="wholesale" className="max-w-2xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#1c140d] text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Wholesale Partnerships</h2>
        <p className="text-[#1c140d] text-base font-normal mb-4">Partner with us to bring the exceptional taste of Mt. Elgon coffee to your customers. We offer competitive pricing, dedicated support, and a commitment to quality. Contact us today to learn more about wholesale opportunities.</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Competitive Pricing</span>
                      </div>
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M201.89,54.66A103.43,103.43,0,0,0,128.79,24H128A104,104,0,0,0,24,128v56a24,24,0,0,0,24,24H64a24,24,0,0,0,24-24V144a24,24,0,0,0-24-24H40.36A88.12,88.12,0,0,1,190.54,65.93,87.39,87.39,0,0,1,215.65,120H192a24,24,0,0,0-24,24v40a24,24,0,0,0,24,24h24a24,24,0,0,1-24,24H136a8,8,0,0,0,0,16h56a40,40,0,0,0,40-40V128A103.41,103.41,0,0,0,201.89,54.66ZM64,136a8,8,0,0,1,8,8v40a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V136Zm128,56a8,8,0,0,1-8-8V144a8,8,0,0,1,8-8h24v56Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Dedicated Support</span>
          </div>
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Quality Assurance</span>
          </div>
        </div>
        <div className="flex py-3 justify-start">
          <a href="/contact" className="flex min-w-[84px] items-center justify-center rounded-xl h-10 px-4 bg-[#f38124] text-[#1c140d] text-sm font-bold">Contact Us</a>
          </div>
      </section>

      {/* Subscription Section */}
      <section id="subscribe" className="max-w-2xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <h2 className="text-[#1c140d] text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em] mb-2">Subscribe & Save</h2>
        <p className="text-[#1c140d] text-base font-normal mb-4">Never run out of your favorite coffee again! Subscribe to our coffee delivery service and enjoy regular shipments of freshly roasted beans, delivered right to your door. Plus, subscribers receive exclusive discounts and early access to new products.</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M247.42,117l-14-35A15.93,15.93,0,0,0,218.58,72H184V64a8,8,0,0,0-8-8H24A16,16,0,0,0,8,72V184a16,16,0,0,0,16,16H41a32,32,0,0,0,62,0h50a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V120A7.94,7.94,0,0,0,247.42,117ZM184,88h34.58l9.6,24H184ZM24,72H168v64H24ZM72,208a16,16,0,1,1,16-16A16,16,0,0,1,72,208Zm81-24H103a32,32,0,0,0-62,0H24V152H168v12.31A32.11,32.11,0,0,0,153,184Zm31,24a16,16,0,1,1,16-16A16,16,0,0,1,184,208Zm48-24H215a32.06,32.06,0,0,0-31-24V128h48Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Regular Deliveries</span>
          </div>
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,61.64l-144,144a8,8,0,0,1-11.32-11.32l144-144a8,8,0,0,1,11.32,11.31ZM50.54,101.44a36,36,0,0,1,50.92-50.91h0a36,36,0,0,1-50.92,50.91ZM56,76A20,20,0,1,0,90.14,61.84h0A20,20,0,0,0,56,76ZM216,180a36,36,0,1,1-10.54-25.46h0A35.76,35.76,0,0,1,216,180Zm-16,0a20,20,0,1,0-5.86,14.14A19.87,19.87,0,0,0,200,180Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Exclusive Discounts</span>
          </div>
          <div className="flex items-center gap-3 bg-[#fcfaf8] rounded-lg p-3">
            <span className="bg-[#f4ede7] rounded-lg p-2"><svg width="22" height="22" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path></svg></span>
            <span className="text-[#1c140d] text-base font-normal flex-1 truncate">Early Access</span>
          </div>
        </div>
        <div className="flex py-3 justify-start">
          <a href="/dashboard/customer/subscriptions" className="flex min-w-[84px] items-center justify-center rounded-xl h-10 px-4 bg-[#f38124] text-[#1c140d] text-sm font-bold">Subscribe Now</a>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage; 