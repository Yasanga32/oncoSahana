'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare,
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Manage Blogs', icon: FileText, href: '/admin/blogs' },
    { name: 'Feedback', icon: MessageSquare, href: '/admin/feedback' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-border transition-all duration-300 flex flex-col sticky top-0 h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">Admin</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-grow p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-foreground/60 hover:bg-secondary hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary'}`} />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary text-foreground/40 transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 mt-2 rounded-xl text-foreground/60 hover:bg-error/10 hover:text-error transition-all group"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Exit Admin</span>}
        </Link>
      </div>
    </aside>
  );
}
