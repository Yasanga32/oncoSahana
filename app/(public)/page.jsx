'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, BookOpen, HeartHandshake, ShieldCheck, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>Trusted by 10,000+ Patients</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Compassionate Care for <br />
            <span className="gradient-text">Your Cancer Journey</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-foreground/60 mb-10">
            oncoSahana combines advanced AI support, community wisdom, and smart fundraising to ensure no one fights cancer alone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-cta text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cta/25"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/blogs" 
              className="w-full sm:w-auto px-8 py-4 glass border border-border rounded-2xl font-bold text-lg hover:bg-secondary/50 transition-all"
            >
              Read Community Stories
            </Link>
          </div>
        </div>

        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Navigate Care</h2>
            <p className="text-foreground/60 max-w-xl mx-auto text-lg">
              We've built a comprehensive ecosystem to support your physical, emotional, and financial well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Bot className="w-8 h-8 text-primary" />}
              title="AI Health Assistant"
              description="Get instant answers to your questions about symptoms, treatments, and lifestyle adjustments, powered by specialized AI."
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-accent" />}
              title="Patient-Driven Blogs"
              description="Learn from the experiences of others. Share your story, find hope, and stay informed with expert-reviewed articles."
            />
            <FeatureCard 
              icon={<HeartHandshake className="w-8 h-8 text-primary" />}
              title="Smart Fundraising"
              description="Launch and manage crowdfunding campaigns with low fees and transparent tracking to cover medical expenses."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="relative rounded-[2rem] overflow-hidden bg-primary p-12 text-center text-white">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Join our community today</h2>
              <p className="text-white/80 text-xl mb-10">
                Create an account to access personalized support and connect with others on the same path.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-white text-cta rounded-2xl font-bold text-lg hover:bg-white/90 transition-all"
                >
                  Create Account
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-4 bg-primary-dark/20 border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 border-8 border-white rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-96 h-96 border-8 border-white rounded-full -ml-48 -mb-48" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl border border-border bg-card hover:shadow-xl transition-all duration-300 group">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-foreground/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
