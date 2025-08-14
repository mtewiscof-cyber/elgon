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

interface EditNewsPageProps {
  params: Promise<{
    newsId: string;
  }>;
}

const EditNewsPage = async ({ params }: EditNewsPageProps) => {
  const { newsId } = await params;
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;
  
  const updateNews = useMutation(api.news.updateNews);
  const { startUpload, isUploading } = useUploadThing("imageNewsFile");

  // Fetch the existing news article
  const newsArticle = useQuery(api.news.getNews, { 
    newsId: newsId as Id<'news'> 
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    excerpt: '',
    imageUrl: '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when news article is fetched
  useEffect(() => {
    if (newsArticle) {
      setFormData({
        title: newsArticle.title || '',
        content: newsArticle.content || '',
        author: newsArticle.author || '',
        excerpt: newsArticle.excerpt || '',
        imageUrl: newsArticle.imageUrl || '',
      });
      if (newsArticle.imageUrl) {
        setImagePreview(newsArticle.imageUrl);
      }
    }
  }, [newsArticle]);

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

  if (newsArticle === undefined) {
    return <div className="container section">Loading news article...</div>;
  }

  if (newsArticle === null) {
    return <div className="container section">News article not found.</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setImagePreview(newsArticle.imageUrl || '');
    setFormData(prev => ({ ...prev, imageUrl: newsArticle.imageUrl || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
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

      await updateNews({
        newsId: newsId as Id<'news'>,
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: formData.author.trim() || 'Admin',
        excerpt: formData.excerpt.trim(),
        imageUrl,
      });

      toast.success('News article updated successfully!');
      router.push('/dashboard/admin/news');
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Failed to update news article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ← Back to News
          </button>
          <h1 style={{ color: 'var(--primary)' }}>Edit News Article</h1>
          <p className="lead">Update your news article content.</p>
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
              <h3 className="mb-4">Article Content</h3>
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
                    placeholder="Enter news title"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter author name"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the news article"
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
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your news article content here..."
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
                    Update News Article
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

export default EditNewsPage; 