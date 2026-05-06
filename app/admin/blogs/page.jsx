'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(null); // ID of blog being deleted

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/blog-api/blog');
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) return;

    setIsDeleting(id);
    try {
      const { data } = await axios.delete(`/blog-api/blog?id=${id}`);
      if (data.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter(blog => blog._id !== id));
      } else {
        toast.error(data.msg || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Manage Blogs</h1>
          <p className="text-foreground/60 mt-1">Review, view, or delete blog posts from the platform.</p>
        </div>
        <Link 
          href="/create-blog"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 w-fit"
        >
          <span>+</span> Create New Blog
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input 
            type="text" 
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-foreground/60 font-medium">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-foreground/40 font-medium">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/30 text-foreground/60 text-sm font-semibold border-b border-border">
                  <th className="px-6 py-4">Blog Info</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-secondary/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0">
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-foreground line-clamp-1">{blog.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-foreground/40 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(blog.date || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                          <UserIcon className="w-3 h-3 text-foreground/40" />
                        </div>
                        <span className="text-sm font-medium text-foreground/60">{blog.author || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/blogs/${blog._id}`}
                          className="p-2 rounded-lg bg-secondary text-foreground/60 hover:text-primary transition-colors"
                          title="View Blog"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          disabled={isDeleting === blog._id}
                          className={`p-2 rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-all ${
                            isDeleting === blog._id ? 'animate-pulse' : ''
                          }`}
                          title="Delete Blog"
                        >
                          {isDeleting === blog._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="group-hover:hidden text-foreground/20">
                         <MoreVertical className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-foreground/40 text-lg">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
