'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PatientBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/blog-api/blog');
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container-custom py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Supportive Insights</h1>
        <p className="text-xl text-foreground/60 mt-2">Find stories, advice, and community wisdom.</p>
      </header>

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
        ) : (
          blogs.map((blog) => (
            <article key={blog._id} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-md flex flex-col">
              <div className="h-48 bg-secondary/30 relative overflow-hidden">
                <img 
                  src={`http://localhost:3001${blog.image}`} 
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{blog.category}</span>
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{blog.title}</h3>
                <p className="text-foreground/60 text-sm line-clamp-3 mb-4">{blog.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <img src={blog.authorImg} alt={blog.author} className="w-8 h-8 rounded-full border border-border" />
                    <span className="text-xs font-medium">{blog.author}</span>
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
        )}
      </div>
    </div>
  );
}
