'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useContext, useEffect } from 'react';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ChevronDown, LogOut, UserCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'AI Support', href: '/ai-support' },
    { name: 'Feedback', href: '/feedback' },
  ];

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        router.push('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        router.push('/');
        toast.success('Logged out successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="text-xl font-bold gradient-text">oncoSahana</span>
          </Link>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href ? 'text-primary' : 'text-foreground/70'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          {userData ? (
            <div className="relative group flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-sm">
                {userData.name[0].toUpperCase()}
              </div>
              <ChevronDown className="w-4 h-4 text-foreground/60 group-hover:text-primary transition-colors hidden md:block" />
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="w-48 p-2 rounded-xl border border-border bg-card shadow-xl">
                  {!userData.isAccountVerified && (
                    <button 
                      onClick={sendVerificationOtp}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      <UserCheck className="w-4 h-4" />
                      Verify Email
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium bg-cta text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-xl bg-secondary/50 border border-border text-foreground/60"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-xl border-b border-border p-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-bold transition-colors ${
                  pathname === link.href ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!userData && (
              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <Link
                  href="/login"
                  className="w-full py-4 text-center text-lg font-bold rounded-2xl bg-secondary text-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="w-full py-4 text-center text-lg font-bold rounded-2xl bg-cta text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
            {userData && (
              <div className="pt-6 border-t border-border">
                <button 
                  onClick={logout}
                  className="w-full py-4 text-center text-lg font-bold rounded-2xl bg-red-500/10 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
