'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const BlogPage = () => {
  // Fetch only blog posts from database
  const blogPosts = useQuery(api.blogPosts.listBlogPosts);

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  // Transform blog posts data for display
  const transformedBlogPosts = blogPosts?.map(post => ({
    id: post._id,
    title: post.title,
    excerpt: post.excerpt,
    date: new Date(post.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    author: post.author,
    category: post.category,
    image: post.imageUrl || '/coffee1.jpg',
    timestamp: post.date,
  })) || [];

  // Sort by most recent
  const sortedBlogPosts = transformedBlogPosts.sort((a, b) => b.timestamp - a.timestamp);

  // Get featured post (most recent)
  const featuredPost = sortedBlogPosts[0];

  const isLoading = blogPosts === undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center relative" 
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee3.jpg')",
          minHeight: "420px",
          padding: `${sectionPadding} 0`,
          paddingTop: "clamp(2rem, 8vw, 3.5rem)",
          paddingBottom: "clamp(2rem, 8vw, 3.5rem)",
        }}
      >
        <div className="absolute inset-0 bg-black/30 z-0 rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2 mt-16 drop-shadow">
            Blog
          </h1>
          <h2 className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">
            Stories and insights from Mt. Elgon Women in Specialty Coffee.
          </h2>
          <div className="flex gap-3">
            <Link 
              href="#latest" 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#f1d7cf] text-[#171312] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] hover:bg-[#e8d4cb] transition-colors"
            >
              Explore
            </Link>
            <Link 
              href="/news" 
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-white/20 text-white border border-white/30 text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] hover:bg-white/30 transition-colors"
            >
              View News
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="py-8 md:py-12">
            <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">Featured Post</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                <span className="ml-2">Loading featured content...</span>
              </div>
            ) : (
              <div className="flex flex-col xl:flex-row gap-6 bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative w-full xl:w-1/2 min-h-[220px] h-64 xl:h-auto">
                  <Image 
                    src={featuredPost.image} 
                    alt={featuredPost.title} 
                    fill 
                    className="object-cover transition-transform duration-300 hover:scale-105" 
                  />
                </div>
                <div className="flex flex-col justify-center gap-2 p-6 xl:w-1/2">
                  <span className="text-[var(--secondary)] font-bold text-sm">
                    {featuredPost.category}
                  </span>
                  <h3 className="text-[#171312] text-lg md:text-2xl font-bold leading-tight tracking-[-0.015em]">{featuredPost.title}</h3>
                  <p className="text-[#826e68] text-base font-normal leading-normal">{featuredPost.excerpt}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                    <span className="text-[#826e68] text-sm">{featuredPost.date} | By {featuredPost.author}</span>
                    <Link 
                      href={`/blog/${featuredPost.id}`} 
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#f1d7cf] text-[#171312] text-sm font-medium leading-normal hover:bg-[#e8d4cb] transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Blog Posts Grid */}
      <section id="latest" style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">
              Latest Blog Posts
            </h2>
            <Link
              href="/news"
              className="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors text-sm font-medium"
            >
              View News Articles →
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              <span className="ml-2">Loading blog posts...</span>
            </div>
          ) : sortedBlogPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No blog posts found.</p>
              <p className="text-sm">Check back soon for new stories and insights!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedBlogPosts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full aspect-video">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-105" 
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="text-[var(--secondary)] font-bold text-xs">{post.category}</span>
                    <h3 className="text-[#171312] text-base font-semibold leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-[#826e68] text-sm font-normal leading-normal line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#826e68] text-xs">{post.date}</span>
                      <Link 
                        href={`/blog/${post.id}`} 
                        className="flex min-w-[64px] max-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-3 bg-[#f1d7cf] text-[#171312] text-xs font-medium leading-normal hover:bg-[#e8d4cb] transition-colors"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* No Content Message */}
      {!isLoading && sortedBlogPosts.length === 0 && (
        <section style={{ maxWidth: "800px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="py-16 text-center">
            <div className="bg-[var(--light-bg)] rounded-xl p-8">
              <h2 className="text-2xl font-bold text-[#171312] mb-4">No Blog Posts Available</h2>
              <p className="text-[#826e68] text-lg mb-6">
                We're working on creating amazing blog content for you. Check back soon for stories and insights from Mt. Elgon Women in Specialty Coffee.
              </p>
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-[#f1d7cf] text-[#171312] rounded-full font-medium hover:bg-[#e8d4cb] transition-colors"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/news" 
                  className="inline-flex items-center px-6 py-3 bg-white border border-[#f1d7cf] text-[#171312] rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  View News
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {sortedBlogPosts.length > 0 && (
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="py-8 md:py-12">
            <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">Categories</h2>
            <div className="flex flex-wrap gap-3 p-2">
              <Link href="/blog/category/coffee-production" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium hover:bg-[#e8e4e1] transition-colors">Coffee Production</Link>
              <Link href="/blog/category/social-impact" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium hover:bg-[#e8e4e1] transition-colors">Social Impact</Link>
              <Link href="/blog/category/sustainable-farming" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium hover:bg-[#e8e4e1] transition-colors">Sustainable Farming</Link>
              <Link href="/blog/category/coffee-education" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium hover:bg-[#e8e4e1] transition-colors">Coffee Education</Link>
              <Link href="/blog/category/farmer-stories" className="flex h-8 items-center justify-center gap-x-2 rounded-xl bg-[#f4f2f1] px-4 text-[#171312] text-sm font-medium hover:bg-[#e8e4e1] transition-colors">Farmer Stories</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPage; 