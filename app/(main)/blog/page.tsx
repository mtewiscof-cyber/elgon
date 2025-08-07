'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';

type ContentType = 'all' | 'blogs' | 'news';

const BlogPage = () => {
  const [selectedTab, setSelectedTab] = useState<ContentType>('all');
  
  // Fetch blog posts and news from database
  const blogPosts = useQuery(api.blogPosts.listBlogPosts);
  const news = useQuery(api.news.listNews);

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";

  // Combine and transform data for display
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
    type: 'blog' as const,
    timestamp: post.date,
  })) || [];

  const transformedNews = news?.map(item => ({
    id: item._id,
    title: item.title,
    excerpt: item.excerpt || item.content.substring(0, 150) + '...',
    date: new Date(item.publishedAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    author: item.author || 'Mt. Elgon Team',
    category: 'News',
    image: item.imageUrl || '/coffee2.jpg',
    type: 'news' as const,
    timestamp: item.publishedAt,
  })) || [];

  // Combine all content
  const allContent = [...transformedBlogPosts, ...transformedNews]
    .sort((a, b) => b.timestamp - a.timestamp);

  // Filter content based on selected tab
  const filteredContent = selectedTab === 'all' 
    ? allContent 
    : selectedTab === 'blogs' 
    ? transformedBlogPosts 
    : transformedNews;

  // Get featured post (most recent)
  const featuredPost = allContent[0] || {
    id: 'default',
    title: "Welcome to Mt. Elgon Women's Coffee Blog",
    excerpt: "Stay updated with the latest stories, news, and insights from our coffee community. We share the journey of our farmers, sustainability practices, and the impact of your support.",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    author: "Mt. Elgon Team",
    category: "Welcome",
    image: '/coffee2.jpg',
    type: 'blog' as const,
  };

  const isLoading = blogPosts === undefined || news === undefined;

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
            Blog & News
          </h1>
          <h2 className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">
            Stories, updates, and insights from Mt. Elgon Women in Specialty Coffee.
          </h2>
          <Link 
            href="#latest" 
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#f1d7cf] text-[#171312] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em] hover:bg-[#e8d4cb] transition-colors"
          >
            Explore
          </Link>
        </div>
      </section>

      {/* Featured Post Section */}
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
                  {featuredPost.type === 'news' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">NEWS</span>
                  )}
                </span>
                <h3 className="text-[#171312] text-lg md:text-2xl font-bold leading-tight tracking-[-0.015em]">{featuredPost.title}</h3>
                <p className="text-[#826e68] text-base font-normal leading-normal">{featuredPost.excerpt}</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                  <span className="text-[#826e68] text-sm">{featuredPost.date} | By {featuredPost.author}</span>
                  <Link 
                    href={`/${featuredPost.type}/${featuredPost.id}`} 
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

      {/* Content Filter Tabs */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { key: 'all' as ContentType, label: 'All Content', count: allContent.length },
              { key: 'blogs' as ContentType, label: 'Blog Posts', count: transformedBlogPosts.length },
              { key: 'news' as ContentType, label: 'News', count: transformedNews.length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTab === key
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[#f4f2f1] text-[#171312] hover:bg-[#e8e4e1]'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section id="latest" style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em] px-2 pb-3 pt-2">
            {selectedTab === 'all' ? 'Latest Stories' : 
             selectedTab === 'blogs' ? 'Blog Posts' : 'Latest News'}
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
              <span className="ml-2">Loading content...</span>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No {selectedTab === 'all' ? 'content' : selectedTab} found.</p>
              <p className="text-sm">Check back soon for new updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredContent.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full aspect-video">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover transition-transform duration-300 hover:scale-105" 
                    />
                    {post.type === 'news' && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        NEWS
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <span className="text-[var(--secondary)] font-bold text-xs">{post.category}</span>
                    <h3 className="text-[#171312] text-base font-semibold leading-tight line-clamp-2">{post.title}</h3>
                    <p className="text-[#826e68] text-sm font-normal leading-normal line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#826e68] text-xs">{post.date}</span>
                      <Link 
                        href={`/${post.type}/${post.id}`} 
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

      {/* Categories Section */}
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

      {/* Newsletter Section */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8 md:py-12">
          <div className="bg-[var(--light-bg)] rounded-xl shadow-md p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-shadow">
            <h2 className="text-[#171312] text-2xl font-bold leading-tight mb-2">Stay Updated</h2>
            <p className="text-[#171312] text-base font-normal leading-normal mb-2 text-center">Get the latest news and stories delivered to your inbox.</p>
            <form className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 min-w-0 rounded-xl border border-[#f1d7cf] bg-white px-4 py-3 text-[#171312] placeholder:text-[#826e68] focus:outline-none focus:ring-2 focus:ring-[#f1d7cf]"
              />
              <button type="submit" className="flex min-w-[120px] max-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f1d7cf] text-[#171312] text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#e8d4cb] transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage; 