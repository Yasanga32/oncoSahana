'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function PatientBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async (retries = 3) => {
    try {
      setLoading(true);
      const { data } = await axios.get('/blog-api/blog');
      const allBlogs = data?.blogs || [];
      setBlogs(allBlogs);
      setFilteredBlogs(allBlogs);
      
      // Dynamically extract unique categories with safety check
      const uniqueCategories = ['All', ...new Set(allBlogs.filter(b => b && b.category).map(blog => blog.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (retries > 0) {
        console.log(`Retrying blog fetch... (${retries} attempts left)`);
        setTimeout(() => fetchBlogs(retries - 1), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === selectedCategory));
    }
  }, [selectedCategory, blogs]);

  return (
    <div className="container-custom py-12">
      <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Supportive Insights</h1>
          <p className="text-xl text-foreground/60 mt-2">Find stories, advice, and community wisdom.</p>
        </div>
        <Link 
          href="/create-blog"
          className="flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <span className="text-lg">+</span>
          Create Post
        </Link>
      </header>

      {/* Dynamic Category Filter */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                selectedCategory === cat 
                  ? 'bg-primary text-white border-primary shadow-md' 
                  : 'bg-white text-foreground/60 border-border hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <article key={i} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all animate-pulse">
              <div className="h-48 bg-secondary/30" />
              <div className="p-6">
                <div className="h-4 w-1/4 bg-primary/20 rounded mb-4" />
                <div className="h-6 w-3/4 bg-secondary rounded mb-2" />
                <div className="h-4 w-full bg-secondary/50 rounded" />
              </div>
            </article>
          ))
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <article key={blog._id} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-md flex flex-col">
              <div className="h-48 bg-secondary/30 relative overflow-hidden">
                <img 
                  src={blog.image?.startsWith('http') ? blog.image : `${(process.env.NEXT_PUBLIC_BLOG_IMAGE_URL || 'http://localhost:3001').replace(/\/$/, '')}/${blog.image?.replace(/^\//, '') || ''}`} 
                  alt={blog.title || 'Blog Post'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'; // Fallback medical image
                  }}
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{blog.category}</span>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                <p className="text-foreground/60 text-sm line-clamp-3 mb-4">{blog.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full border border-border bg-secondary/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-foreground/40" />
                    </div>
                    <span className="text-xs font-medium text-foreground/60">Anonymous</span>
                  </div>
                  <Link 
                    href={`/blogs/${blog._id}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline group/link"
                  >
                    Read More 
                    <span className="inline-block transition-transform group-hover/link:translate-x-1 ml-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-foreground/40 text-lg">No blogs found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
