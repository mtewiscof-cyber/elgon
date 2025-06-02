'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminNewsPage = () => {
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

  // Fetch news data
  const news = useQuery(api.news.listNews);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Admin - News</h1>
      <p className="lead">View and manage news articles.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>News List</h3>
        {news === undefined ? (
          <div>Loading news...</div>
        ) : news.length === 0 ? (
           <div>No news found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Published At</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Excerpt</th>
                  {/* Add more headers as needed, e.g., imageUrl */}
                </tr>
              </thead>
              <tbody>
                {news.map(n => (
                  <tr key={n._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{n.title}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{new Date(n.publishedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{n.author || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{n.excerpt || 'N/A'}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {news.map(n => (
                <div key={n._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Title:</span> {n.title}</div>
                  <div className="mb-sm"><span className="font-semibold">Published At:</span> {new Date(n.publishedAt).toLocaleDateString()}</div>
                  <div className="mb-sm"><span className="font-semibold">Author:</span> {n.author || 'N/A'}</div>
                  <div><span className="font-semibold">Excerpt:</span> {n.excerpt || 'N/A'}</div>
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

export default AdminNewsPage; 