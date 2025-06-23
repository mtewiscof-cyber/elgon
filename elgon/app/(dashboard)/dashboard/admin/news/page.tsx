'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { Id } from '@/convex/_generated/dataModel';

const AdminNewsPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteNews = useMutation(api.news.deleteNews);

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Fetch news data
  const news = useQuery(api.news.listNews);

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  const handleDelete = async (newsId: string) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    setDeletingId(newsId);
    try {
      await deleteNews({ newsId: newsId as Id<'news'> });
      toast.success('News article deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete news article.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="page-content container section">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 style={{ color: 'var(--primary)' }}>Admin - News</h1>
            <p className="lead">View and manage news articles.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/admin/news/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
          >
            <MdAdd size={20} />
            Create News Article
          </button>
        </div>

        <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
          <h3>News Articles List</h3>
          {news === undefined ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading news...</span>
            </div>
          ) : news.length === 0 ? (
             <div className="text-center py-8 text-gray-500">
               <MdAdd size={48} className="mx-auto mb-4 opacity-50" />
               <p>No news articles found.</p>
               <button
                 onClick={() => router.push('/dashboard/admin/news/add')}
                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
               >
                 Create Your First News Article
               </button>
             </div>
           ) : (
            <div className="overflow-x-auto">
              {/* Table for larger screens */}
              <table className="min-w-full bg-white hidden md:table">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Excerpt</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Published</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map(n => (
                    <tr key={n._id.toString()} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img 
                          src={n.imageUrl || '/coffee1.jpg'} 
                          alt={n.title} 
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 max-w-xs">
                        <div className="font-medium truncate">{n.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm leading-5 text-gray-900 max-w-xs">
                        <div className="truncate">{n.excerpt || 'No excerpt available'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {n.author || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {new Date(n.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <div className="flex gap-2">
                          <button
                            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            onClick={() => router.push(`/dashboard/admin/news/edit/${n._id}`)}
                            title="Edit News Article"
                            aria-label="Edit News Article"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            onClick={() => handleDelete(n._id)}
                            disabled={deletingId === n._id}
                            title="Delete News Article"
                            aria-label="Delete News Article"
                          >
                            {deletingId === n._id ? (
                              <div className="animate-spin">
                                <MdDelete size={18} />
                              </div>
                            ) : (
                              <MdDelete size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Stacked view for smaller screens */}
              <div className="md:hidden space-y-4">
                {news.map(n => (
                  <div key={n._id.toString()} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <img 
                        src={n.imageUrl || '/coffee1.jpg'} 
                        alt={n.title} 
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 line-clamp-2">{n.title}</div>
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {n.excerpt || 'No excerpt available'}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                      <span>By {n.author || 'Unknown'}</span>
                      <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        onClick={() => router.push(`/dashboard/admin/news/edit/${n._id}`)}
                        title="Edit News Article"
                        aria-label="Edit News Article"
                      >
                        <MdEdit size={18} />
                        Edit
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                        onClick={() => handleDelete(n._id)}
                        disabled={deletingId === n._id}
                        title="Delete News Article"
                        aria-label="Delete News Article"
                      >
                        {deletingId === n._id ? (
                          <div className="animate-spin">
                            <MdDelete size={18} />
                          </div>
                        ) : (
                          <MdDelete size={18} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminNewsPage; 