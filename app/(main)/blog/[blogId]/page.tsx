'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, use } from 'react';
import { MdArrowBack, MdShare, MdEvent, MdPerson, MdTag } from 'react-icons/md';

interface BlogPostPageProps {
  params: Promise<{
    blogId: string;
  }>;
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const [shareOpen, setShareOpen] = useState(false);
  const resolvedParams = use(params);
  
  // Fetch the specific blog post
  const blogPost = useQuery(api.blogPosts.getBlogPost, { 
    blogPostId: resolvedParams.blogId as Id<'blogPosts'> 
  });
  
  // Fetch related blog posts (same category, limit 3)
  const allBlogPosts = useQuery(api.blogPosts.listBlogPosts);

  // Consistent horizontal padding for all sections
  const sectionPadding = "clamp(1rem, 5vw, 2.5rem)";
  
  if (blogPost === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (blogPost === null) {
    notFound();
  }

  // Find related posts
  const relatedPosts = allBlogPosts?.filter(post => 
    post._id !== blogPost._id && 
    post.category === blogPost.category
  ).slice(0, 3) || [];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blogPost.title,
          text: blogPost.excerpt,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(shareUrl);
      setShareOpen(true);
      setTimeout(() => setShareOpen(false), 2000);
    }
  };

  const formattedDate = new Date(blogPost.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="py-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
            >
              <MdArrowBack className="mr-2" size={20} />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <article style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
        <div className="py-8">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="inline-flex items-center gap-1">
                <MdTag size={16} />
                <span className="bg-[var(--light-bg)] px-2 py-1 rounded-full text-[var(--primary)] font-medium">
                  {blogPost.category}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MdEvent size={16} />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <MdPerson size={16} />
                {blogPost.author}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#171312] leading-tight mb-4">
              {blogPost.title}
            </h1>
            
            <p className="text-lg md:text-xl text-[#826e68] leading-relaxed mb-6">
              {blogPost.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {Math.ceil(blogPost.content.split(' ').length / 200)} min read
              </div>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--light-bg)] text-[var(--primary)] rounded-lg hover:bg-[#e8e4e1] transition-colors"
              >
                <MdShare size={16} />
                Share
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {blogPost.imageUrl && (
            <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={blogPost.imageUrl}
                alt={blogPost.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-[#171312] leading-relaxed whitespace-pre-wrap">
              {blogPost.content}
            </div>
          </div>

          {/* Share Toast */}
          {shareOpen && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
              Link copied to clipboard!
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[var(--light-bg)] py-12 mt-12">
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
            <h2 className="text-2xl md:text-3xl font-bold text-[#171312] mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="relative w-full aspect-video">
                    <Image
                      src={post.imageUrl || '/coffee1.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[var(--secondary)] font-bold text-xs">
                      {post.category}
                    </span>
                    <h3 className="text-[#171312] text-base font-semibold leading-tight mt-1 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#826e68] text-sm line-clamp-2 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="text-[#826e68] text-xs">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-[var(--primary)] text-white py-12">
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Connected with Our Coffee Community
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Get the latest stories, coffee insights, and updates from Mt. Elgon Women's Coffee delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 w-full px-4 py-3 rounded-lg text-[#171312] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="w-full sm:w-auto px-6 py-3 bg-[var(--accent)] text-[var(--primary)] rounded-lg font-bold hover:bg-[#e8d4cb] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="bg-white border-t py-8">
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: `0 ${sectionPadding}` }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link 
              href="/blog" 
              className="text-[var(--primary)] hover:text-[var(--secondary)] transition-colors"
            >
              ← All Blog Posts
            </Link>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="px-4 py-2 bg-[var(--accent)] text-[var(--primary)] rounded-lg hover:bg-[#e8d4cb] transition-colors font-medium"
              >
                Shop Coffee
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--light-bg)] transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage; 