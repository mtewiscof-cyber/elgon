'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast, Toaster } from 'sonner';
import { useUploadThing } from '@/utils/uploadthing';
import { MdCloudUpload, MdImage, MdDelete } from 'react-icons/md';
import { Id } from '@/convex/_generated/dataModel';


interface EditBlogPostPageProps {
  params: Promise<{
    blogPostId: string;
  }>;
}

const EditBlogPostPage = async ({ params }: EditBlogPostPageProps) => {
  const { blogPostId } = await params;
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;
  
  const updateBlogPost = useMutation(api.blogPosts.updateBlogPost);
  const { startUpload, isUploading } = useUploadThing("imageBlogFile");

  // Fetch the existing blog post
  const blogPost = useQuery(api.blogPosts.getBlogPost, { 
    blogPostId: blogPostId as Id<'blogPosts'> 
  });

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    imageUrl: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when blog post is fetched
  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title || '',
        excerpt: blogPost.excerpt || '',
        content: blogPost.content || '',
        author: blogPost.author || '',
        category: blogPost.category || '',
        imageUrl: blogPost.imageUrl || '',
      });
      if (blogPost.imageUrl) {
        setImagePreview(blogPost.imageUrl);
      }
    }
  }, [blogPost]);

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

  if (blogPost === undefined) {
    return <div className="container section">Loading blog post...</div>;
  }

  if (blogPost === null) {
    return <div className="container section">Blog post not found.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(blogPost.imageUrl || '');
    setFormData(prev => ({ ...prev, imageUrl: blogPost.imageUrl || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
      toast.error('Title, excerpt, and content are required');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadResult = await startUpload([selectedFile]);
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url;
        }
      }

      await updateBlogPost({
        blogPostId: blogPostId as Id<'blogPosts'>,
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'Admin',
        category: formData.category.trim(),
        imageUrl,
      });

      toast.success('Blog post updated successfully!');
      router.push('/dashboard/admin/blog-posts');
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Coffee Production',
    'Social Impact',
    'Sustainable Farming',
    'Coffee Education',
    'Farmer Stories',
    'Impact Report',
    'Community',
    'Other'
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ← Back to Blog Posts
          </button>
          <h1 style={{ color: 'var(--primary)' }}>Edit Blog Post</h1>
          <p className="lead">Update your blog post content.</p>
        </div>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="card p-6">
              <h3 className="mb-4">Featured Image</h3>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                      disabled={isUploading || isSubmitting}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isUploading || isSubmitting 
                          ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                          : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <MdCloudUpload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 4MB</p>
                      </div>
                    </label>
                  </div>
                  {isUploading && (
                    <div className="mt-2 text-sm text-blue-600">
                      Uploading image...
                    </div>
                  )}
                </div>
                
                {imagePreview && (
                  <div className="flex-1 max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedFile ? 'New Image Preview' : 'Current Image'}
                    </label>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          disabled={isUploading || isSubmitting}
                        >
                          <MdDelete size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="card p-6">
              <h3 className="mb-4">Blog Post Content</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter blog post title"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter author name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the blog post"
                  disabled={isSubmitting}
                />
              </div>

              <div className="mt-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={12}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your blog post content here..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <MdImage size={20} />
                    Update Blog Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBlogPostPage; 