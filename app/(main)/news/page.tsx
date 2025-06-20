'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { MdSearch, MdEvent, MdPerson } from 'react-icons/md';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all news articles
  const news = useQuery(api.news.listNews);

  // Filter news based on search term
  const filteredNews = news?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (article.author && article.author.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => b.publishedAt - a.publishedAt) || [];

  const isLoading = news === undefined;

  return (
    <div className="min-h-screen bg-white font-[Newsreader, Noto Sans, sans-serif]">
      {/* Hero Section */}
      <section className="w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-center px-2 py-10 md:py-20 relative" style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%), url('/coffee4.jpg')"}}>
        <div className="absolute inset-0 bg-black/30 z-0 rounded-b-3xl" />
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] mb-2 mt-16 drop-shadow">Latest News</h1>
          <h2 className="text-white text-base sm:text-lg font-medium mb-2 drop-shadow">Stay updated with the latest developments from Mt. Elgon Women in Specialty Coffee.</h2>
          <Link href="/blog" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 md:h-12 md:px-5 bg-[#f1d7cf] text-[#171312] text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em]">All Content</Link>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto w-full px-2 sm:px-4 py-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
          />
        </div>
      </section>

      {/* News Grid */}
      <section className="max-w-6xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[#171312] text-[22px] font-bold leading-tight tracking-[-0.015em]">
            {searchTerm ? `Search Results (${filteredNews.length})` : 'All News Articles'}
          </h2>
          <Link
            href="/blog"
            className="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors text-sm font-medium"
          >
            View Blog Posts →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            <span className="ml-2">Loading news articles...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm ? (
              <>
                <p className="text-lg mb-2">No news articles found for "{searchTerm}"</p>
                <p className="text-sm">Try different keywords or browse all articles.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--secondary)] transition-colors"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No news articles found.</p>
                <p className="text-sm">Check back soon for new updates!</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Featured News Article (First/Latest) */}
            {filteredNews.length > 0 && (
              <div className="mb-12">
                <h3 className="text-[#171312] text-lg font-bold mb-4">Featured News</h3>
                <Link
                  href={`/news/${filteredNews[0]._id}`}
                  className="block bg-[var(--light-bg)] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="relative w-full lg:w-1/2 h-64 lg:h-80">
                      <Image
                        src={filteredNews[0].imageUrl || '/coffee2.jpg'}
                        alt={filteredNews[0].title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        FEATURED NEWS
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-6 lg:w-1/2">
                      <h2 className="text-[#171312] text-xl md:text-2xl font-bold leading-tight mb-3">
                        {filteredNews[0].title}
                      </h2>
                      <p className="text-[#826e68] text-base leading-normal mb-4">
                        {filteredNews[0].excerpt || filteredNews[0].content.substring(0, 200) + '...'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <MdEvent size={16} />
                          {new Date(filteredNews[0].publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {filteredNews[0].author && (
                          <span className="inline-flex items-center gap-1">
                            <MdPerson size={16} />
                            {filteredNews[0].author}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Other News Articles */}
            {filteredNews.length > 1 && (
              <div>
                <h3 className="text-[#171312] text-lg font-bold mb-6">More News</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.slice(1).map((article) => (
                    <Link
                      key={article._id}
                      href={`/news/${article._id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-gray-100"
                    >
                      <div className="relative w-full aspect-video">
                        <Image
                          src={article.imageUrl || '/coffee2.jpg'}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                          NEWS
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#171312] text-base font-semibold leading-tight mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-[#826e68] text-sm line-clamp-3 mb-3">
                          {article.excerpt || article.content.substring(0, 120) + '...'}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {article.author && <span>By {article.author}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="max-w-3xl mx-auto w-full px-2 sm:px-4 py-8 md:py-12">
        <div className="bg-[var(--light-bg)] rounded-xl shadow-md p-6 flex flex-col items-center gap-4">
          <h2 className="text-[#171312] text-2xl font-bold leading-tight mb-2">Stay Updated</h2>
          <p className="text-[#171312] text-base font-normal leading-normal mb-2 text-center">Get the latest news and updates delivered to your inbox.</p>
          <form className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 min-w-0 rounded-xl border border-[#f1d7cf] bg-white px-4 py-3 text-[#171312] placeholder:text-[#826e68] focus:outline-none focus:ring-2 focus:ring-[#f1d7cf]"
            />
            <button type="submit" className="flex min-w-[120px] max-w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#f1d7cf] text-[#171312] text-base font-bold leading-normal tracking-[0.015em]">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default NewsPage; 