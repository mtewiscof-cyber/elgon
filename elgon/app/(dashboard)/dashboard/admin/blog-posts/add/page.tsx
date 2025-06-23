"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/utils/uploadthing";

export default function AddBlogPostPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const createBlogPost = useMutation(api.blogPosts.createBlogPost);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: clerkUser?.fullName || "",
    date: Date.now(),
    category: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");

  // TODO: Fetch user role and redirect if not admin (optional, for extra security)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.excerpt || !form.content || !form.author || !form.category || !form.imageUrl) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createBlogPost({
        ...form,
        date: Date.now(),
      });
      router.push("/dashboard/admin/blog-posts");
    } catch (err: any) {
      setError(err.message || "Failed to create blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container section max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {error && <div className="text-red-600 font-medium mb-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt *</label>
          <input type="text" name="excerpt" value={form.excerpt} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea name="content" value={form.content} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Author *</label>
          <input type="text" name="author" value={form.author} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <input type="text" name="category" value={form.category} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Blog Image *</label>
          <div className="mb-2">
            <UploadButton
              endpoint="imageBlogFile"
              onClientUploadComplete={(res) => {
                if (res && res[0]?.url) {
                  setForm(f => ({ ...f, imageUrl: res[0].url }));
                }
              }}
              onUploadError={(error) => {
                setError(error.message || "Image upload failed");
              }}
            />
          </div>
          {form.imageUrl && (
            <div className="mt-2">
              <img src={form.imageUrl} alt="Blog Post" className="rounded-md max-h-40" />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.push('/dashboard/admin/blog-posts')} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400">{isSubmitting ? "Creating..." : "Create Blog Post"}</button>
        </div>
      </form>
    </div>
  );
} 