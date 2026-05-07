'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { backendUrl, isLoggedin, setIsLoggedin, getUserData, loading } = useContext(AppContent);

  React.useEffect(() => {
    if (!loading && isLoggedin) {
      router.push('/dashboard');
    }
  }, [isLoggedin, loading, router]);

  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { 
          name, 
          email, 
          password,
          appId: process.env.NEXT_PUBLIC_APP_ID 
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          router.push('/dashboard');
          toast.success('Welcome to oncoSahana!');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { 
          email, 
          password,
          appId: process.env.NEXT_PUBLIC_APP_ID 
        });

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          router.push('/dashboard');
          toast.success('Welcome back!');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Server error';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl glass transition-all">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-foreground/60 mt-2">
            {state === 'Sign Up' ? 'Join our support community' : 'Access your dashboard'}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === 'Sign Up' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/30 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/30 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/30 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
          </div>

          <p
            onClick={() => router.push('/reset-password')}
            className="text-xs text-primary hover:underline cursor-pointer text-right"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              state
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          {state === 'Sign Up' ? (
            <p className="text-foreground/60">
              Already have an account?{' '}
              <button
                onClick={() => setState('Login')}
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          ) : (
            <p className="text-foreground/60">
              Don’t have an account?{' '}
              <button
                onClick={() => setState('Sign Up')}
                className="text-primary font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
