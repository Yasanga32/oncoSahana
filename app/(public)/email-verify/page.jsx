'use client';

import React, { useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AppContent } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function EmailVerifyPage() {
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
  const inputRefs = useRef([]);
  const router = useRouter();

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(input => input.value);
      const otp = otpArray.join('');

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        router.push('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      router.push('/');
    }
  }, [isLoggedin, userData, router]);

  return (
    <div className="container-custom flex items-center justify-center min-h-[calc(100vh-16rem)] py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl glass transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Verify Your Email</h1>
          <p className="text-foreground/60 mt-2">
            Enter the 6-digit code sent to your inbox.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-8">
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
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Verify Email
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/60">
            Didn't receive the code?{' '}
            <button className="text-primary font-semibold hover:underline">
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
