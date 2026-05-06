'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  ArrowUpRight, 
  TrendingUp, 
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    latestBlog: null,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/blog-api/blog');
        const blogs = data.blogs || [];
        setStats({
          totalBlogs: blogs.length,
          latestBlog: blogs[0] || null,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Overview</h1>
        <p className="text-foreground/60 mt-1">Welcome back. Here's what's happening on your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Blogs Card */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="flex items-center gap-1 text-success text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <h3 className="text-foreground/40 text-sm font-medium uppercase tracking-wider">Total Blogs</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-foreground">
              {stats.loading ? '...' : stats.totalBlogs}
            </span>
            <span className="text-foreground/40 text-sm">articles</span>
          </div>
        </div>

        {/* Placeholder Stat Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cta/10 rounded-xl">
              <Clock className="w-6 h-6 text-cta" />
            </div>
          </div>
          <h3 className="text-foreground/40 text-sm font-medium uppercase tracking-wider">Avg. Read Time</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-foreground">4.5</span>
            <span className="text-foreground/40 text-sm">minutes</span>
          </div>
        </div>

        {/* Placeholder Stat Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-light/10 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-primary-light" />
            </div>
          </div>
          <h3 className="text-foreground/40 text-sm font-medium uppercase tracking-wider">Active Users</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-black text-foreground">128</span>
            <span className="text-foreground/40 text-sm">online now</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <Link 
              href="/admin/blogs"
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
                </div>
                <div>
                  <span className="font-bold block">Manage All Blogs</span>
                  <span className="text-xs text-foreground/40">Edit or delete existing posts</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link 
              href="/create-blog"
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors">
                  <TrendingUp className="w-5 h-5 text-foreground/60 group-hover:text-primary" />
                </div>
                <div>
                  <span className="font-bold block">Write New Post</span>
                  <span className="text-xs text-foreground/40">Publish a new article to the platform</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
            Latest Blog Post
            {stats.latestBlog && (
              <Link href="/admin/blogs" className="text-xs text-primary font-bold hover:underline">View All</Link>
            )}
          </h2>
          
          {stats.loading ? (
             <div className="h-40 bg-secondary/20 rounded-xl animate-pulse" />
          ) : stats.latestBlog ? (
            <div className="flex gap-6">
              <div className="w-1/3 aspect-video rounded-xl overflow-hidden bg-secondary">
                <img 
                  src={stats.latestBlog.image} 
                  alt={stats.latestBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-1 rounded">
                  {stats.latestBlog.category}
                </span>
                <h3 className="text-lg font-bold mt-2 line-clamp-2">{stats.latestBlog.title}</h3>
                <div className="flex items-center gap-2 mt-4 text-xs text-foreground/40">
                  <div className="w-6 h-6 rounded-full bg-secondary" />
                  <span>{stats.latestBlog.author || 'Anonymous'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center border-2 border-dashed border-border rounded-xl text-foreground/20 italic">
              No blogs published yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
