"use client"
import React, { useState } from 'react';
import { Mail, Lock, Loader2, KeyRound } from 'lucide-react';

const DealerLogin = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '', hashPayload: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- LOGIN LOGIC ---
// --- LOGIN LOGIC ---
const handleLogin = async (e) => {
  e.preventDefault();
  setStatus('loading');
  try {
    const res = await fetch('/api/DealerLogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Added header
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    // ✅ Add these two lines for fast fetching
    if (data.user) {
    localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userPhone", data.user.phone);
    }
    
    setStatus('success');
    window.location.href = "/admin/UploadProp"; // Updated path to match registration
  } catch (err) {
    setFeedback({ type: 'error', message: err.message });
    setStatus('idle');
  }
};

  // --- REQUEST OTP LOGIC ---
// --- REQUEST OTP LOGIC ---
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ADD THIS HEADER
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setFormData({ ...formData, hashPayload: data.hashPayload });
      setView('reset');
      setFeedback({ type: 'success', message: "OTP sent to your email!" });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally { 
      setStatus('idle'); 
    }
  };

  // --- RESET PASSWORD LOGIC ---
const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/DealerLogin/verify-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // ADD THIS HEADER
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          hashPayload: formData.hashPayload,
          newPassword: formData.newPassword
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setView('login');
      setFeedback({ type: 'success', message: "Password reset successful! Please login." });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally { 
      setStatus('idle'); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 italic">
        {view === 'login' ? "Dealer Login" : view === 'forgot' ? "Forgot Password" : "Reset Password"}
      </h2>

      {feedback.message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${feedback.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {feedback.message}
        </div>
      )}

      {/* LOGIN VIEW */}
      {view === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          <button type="submit" disabled={status === 'loading'} className="w-full bg-slate-900 text-white p-4 rounded-xl">
            {status === 'loading' ? 'Verifying...' : 'Login'}
          </button>
          <button type="button" onClick={() => setView('forgot')} className="text-sm text-blue-600 hover:underline">Forgot Password?</button>
        </form>
      )}

      {/* FORGOT VIEW (Step 1: Request OTP) */}
      {view === 'forgot' && (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          <p className="text-sm text-slate-500">Enter your email to receive a reset OTP.</p>
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          <button
  type="submit"
  disabled={status === 'loading'}
  className={`w-full p-4 rounded-xl text-white ${
    status === 'loading'
      ? 'bg-blue-400 cursor-not-allowed'
      : 'bg-blue-600'
  }`}
>
  {status === 'loading' ? 'Sending...' : 'Send OTP'}
</button>
          <button type="button" onClick={() => setView('login')} className="w-full text-slate-500">Back to Login</button>
        </form>
      )}

      {/* RESET VIEW (Step 2: Verify & Update) */}
      {view === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input name="otp" type="text" placeholder="Enter 6-digit OTP" onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} className="w-full p-3 border rounded-xl" required />
      <button
  type="submit"
  disabled={status === 'loading'}
  className={`w-full p-4 rounded-xl text-white ${
    status === 'loading'
      ? 'bg-green-400 cursor-not-allowed'
      : 'bg-green-600'
  }`}
>
  {status === 'loading' ? 'Updating...' : 'Update Password'}
</button>
        </form>
      )}
    </div>
  );
};

export default DealerLogin;