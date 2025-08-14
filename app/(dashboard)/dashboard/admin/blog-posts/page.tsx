'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Id } from '@/convex/_generated/dataModel';

const AdminBlogPostsPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteBlogPost = useMutation(api.blogPosts.deleteBlogPost);

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Fetch blog posts data
  const blogPosts = useQuery(api.blogPosts.listBlogPosts);

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

  const handleDelete = async (blogPostId: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setDeletingId(blogPostId);
    try {
      await deleteBlogPost({ blogPostId: blogPostId as Id<'blogPosts'> });
      toast.success('Blog post deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete blog post.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 style={{ color: 'var(--primary)' }}>Admin - Blog Posts</h1>
            <p className="lead">View and manage blog post content.</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/admin/blog-posts/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Blog Post
          </button>
        </div>

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
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Excerpt</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogPosts.map(bp => (
                    <tr key={bp._id.toString()} className="border-b border-gray-200">
                      <td>
                        <img src={bp.imageUrl || '/coffee1.jpg'} alt={bp.title} className="w-16 h-16 object-cover rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.title}</td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 max-w-xs truncate">{bp.excerpt}</td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.author}</td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{bp.category}</td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{new Date(bp.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                        <button
                          className="mr-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          onClick={() => router.push(`/dashboard/admin/blog-posts/edit/${bp._id}`)}
                          title="Edit Blog Post"
                          aria-label="Edit Blog Post"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleDelete(bp._id)}
                          disabled={deletingId === bp._id}
                          title="Delete Blog Post"
                          aria-label="Delete Blog Post"
                        >
                          {deletingId === bp._id ? (
                            <span className="animate-spin"> <MdDelete size={18} /> </span>
                          ) : (
                            <MdDelete size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Stacked view for smaller screens */}
              <div className="md:hidden">
                {blogPosts.map(bp => (
                  <div key={bp._id.toString()} className="card mb-md p-md border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={bp.imageUrl || '/coffee1.jpg'} alt={bp.title} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-semibold">{bp.title}</div>
                        <div className="text-xs text-gray-500 truncate">{bp.excerpt}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => router.push(`/dashboard/admin/blog-posts/edit/${bp._id}`)}
                        title="Edit Blog Post"
                        aria-label="Edit Blog Post"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        onClick={() => handleDelete(bp._id)}
                        disabled={deletingId === bp._id}
                        title="Delete Blog Post"
                        aria-label="Delete Blog Post"
                      >
                        {deletingId === bp._id ? (
                          <span className="animate-spin"> <MdDelete size={18} /> </span>
                        ) : (
                          <MdDelete size={18} />
                        )}
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

export default AdminBlogPostsPage; 