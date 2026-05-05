'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../../../context/AppContext';
import { ImagePlus, Send, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateBlog() {
  const { userData } = useContext(AppContent);
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [categories, setCategories] = useState(['Health', 'Lifestyle', 'Community', 'Nutrition', 'Research']);
  
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Health",
    author: "Anonymous",
    authorImg: "/author_img.png" 
  });

  // Fetch existing categories on load to stay in sync with the blog project
  useState(() => {
    const fetchCategories = async () => {
      try {
        const { data: blogData } = await axios.get('/blog-api/blog');
        if (blogData.success && blogData.blogs) {
          const uniqueCategories = [...new Set(blogData.blogs.map(b => b.category))];
          if (uniqueCategories.length > 0) {
            setCategories(uniqueCategories);
            setData(prev => ({ ...prev, category: uniqueCategories[0] }));
          }
        }
      } catch (error) {
        console.error("Failed to sync categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      return toast.error("Please upload an image");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('authorImg', data.authorImg);
    formData.append('image', image);

    try {
      const response = await axios.post('/blog-api/blog', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        router.push('/blogs');
      } else {
        toast.error("Failed to add blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to blog server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12 max-w-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Share Your Story</h1>
        <p className="text-foreground/60">Create a blog post to help and inspire others in the community.</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Cover Image</label>
          <div className="relative group">
            {preview ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-primary/30">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-2xl border-2 border-dashed border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all cursor-pointer">
                <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
                  <ImagePlus className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">Click to upload cover image</p>
                <p className="text-xs text-foreground/50 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                <input type="file" className="hidden" onChange={onImageChange} accept="image/*" required />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Title</label>
          <input 
            type="text" 
            name="title"
            value={data.title}
            onChange={onChangeHandler}
            placeholder="Give your post a compelling title"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Category</label>
            <select 
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Author Display (Read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Privacy Setting</label>
            <div className="px-4 py-3 rounded-xl border border-border bg-success/5 text-success text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Posting as Anonymous
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground/80">Content</label>
          <textarea 
            name="description"
            value={data.description}
            onChange={onChangeHandler}
            rows={10}
            placeholder="Tell your story here..."
            className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Link href="/blogs" className="px-6 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary/50 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-cta text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
