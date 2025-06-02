'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminBlogPostsPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch blog posts data
  const blogPosts = useQuery(api.blogPosts.listBlogPosts);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Admin - Blog Posts</h1>
      <p className="lead">View and manage blog post content.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Blog Post List</h3>
        {blogPosts === undefined ? (
          <div>Loading blog posts...</div>
        ) : blogPosts.length === 0 ? (
           <div>No blog posts found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Date</th>
                  {/* Add more headers as needed, e.g., excerpt */}
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(bp => (
                  <tr key={bp._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.title}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.author}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.category}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{new Date(bp.date).toLocaleDateString()}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {blogPosts.map(bp => (
                <div key={bp._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Title:</span> {bp.title}</div>
                  <div className="mb-sm"><span className="font-semibold">Author:</span> {bp.author}</div>
                  <div className="mb-sm"><span className="font-semibold">Category:</span> {bp.category}</div>
                  <div><span className="font-semibold">Date:</span> {new Date(bp.date).toLocaleDateString()}</div>
                  {/* Add more fields as needed */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogPostsPage; 