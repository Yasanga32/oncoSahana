'use client';

import React, { useContext, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppContent } from '../../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Lock, KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const { backendUrl } = useContext(AppContent);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, 6);
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { 
        email,
        appId: process.env.NEXT_PUBLIC_APP_ID 
      });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map(el => el.value).join('');
    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword,
        appId: process.env.NEXT_PUBLIC_APP_ID
      });
      if (data.success) {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl glass transition-all">
        
        {/* Step 1: Enter Email */}
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Reset Password</h1>
              <p className="text-foreground/60 mt-2">Enter your registered email address.</p>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/30 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isLoading ? 'Sending...' : 'Send Reset OTP'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOTP} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Verify OTP</h1>
              <p className="text-foreground/60 mt-2">Enter the 6-digit code sent to your email.</p>
            </div>

            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-14 bg-secondary/30 border border-border text-foreground text-2xl font-bold rounded-xl text-center focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Verify & Continue
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">New Password</h1>
              <p className="text-foreground/60 mt-2">Create a secure new password.</p>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/30 border border-border outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-foreground/60 hover:text-primary transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
