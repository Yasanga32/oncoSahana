'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';

export default function BlogDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogDetails = async () => {
    try {
      const { data } = await axios.get(`/blog-api/blog?id=${id}`);
      if (data.blog) {
        setBlog(data.blog);
      } else {
        router.push('/blogs');
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      router.push('/blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-12 animate-pulse">
        <div className="h-8 w-32 bg-secondary rounded mb-8" />
        <div className="max-w-3xl mx-auto">
          <div className="h-64 bg-secondary/30 rounded-2xl mb-8" />
          <div className="h-10 w-3/4 bg-secondary rounded mb-4" />
          <div className="h-6 w-1/2 bg-secondary/50 rounded mb-12" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-full bg-secondary/30 rounded" />
            <div className="h-4 w-2/3 bg-secondary/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container-custom py-12">
      <Link 
        href="/blogs" 
        className="inline-flex items-center text-sm font-medium text-foreground/60 hover:text-primary mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Insights
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {blog.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <img src={blog.authorImg} alt={blog.author} className="w-10 h-10 rounded-full border border-border" />
              <div>
                <p className="text-sm font-bold">{blog.author}</p>
                <p className="text-xs text-foreground/50">Medical Contributor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-video relative rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src={`http://localhost:3001${blog.image}`} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-none">
          <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-lg" 
               dangerouslySetInnerHTML={{ __html: blog.description }} />
        </div>
      </article>
    </div>
  );
}
