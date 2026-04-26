'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

type Tab = 'signin' | 'register';

function InputField({ label, id, type = 'text', placeholder }: { label: string; id: string; type?: string; placeholder: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5 mb-4">
      <label htmlFor={id} className="block text-[14px] font-medium text-[#4B5563]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full h-12 rounded-xl text-[15px] outline-none transition-all duration-200 px-4"
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${focused ? '#0D7A5F' : '#E5E7EB'}`,
          color: '#1A1F2C',
          boxShadow: focused ? '0 0 0 4px rgba(13, 122, 95, 0.1)' : 'none',
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin');
  const router = useRouter();

  const goDashboard = () => router.push('/dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: 'var(--font-outfit), sans-serif', backgroundColor: '#F2EFE9' }}>
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-[#4B5563] hover:text-[#1A1F2C] text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center pt-10 px-4 pb-20">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Logo className="w-10 h-10" />
          <span className="text-[28px] font-bold tracking-tight">
            <span style={{ color: '#1A1F2C' }}>Volunteer</span>
            <span style={{ color: '#12B76A' }}>IQ</span>
          </span>
        </div>
        
        {/* Title */}
        <h1 className="text-[32px] font-bold text-[#1A1F2C] mb-2 tracking-tight text-center">
          {tab === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-[16px] text-[#4B5563] mb-8 text-center">
          {tab === 'signin' ? 'Sign in to your account' : 'Join the NGOs using AI to save lives'}
        </p>

        {/* Card */}
        <div className="w-full max-w-[440px] bg-white rounded-[24px] p-6 sm:p-8" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.05)' }}>
          
          {/* Demo Banner */}
          <div className="rounded-2xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: '#F0F9F6', border: '1px solid rgba(13, 122, 95, 0.1)' }}>
            <div>
              <p className="text-[14px] font-bold" style={{ color: '#0D7A5F' }}>Demo mode</p>
              <p className="text-[13px] mt-0.5" style={{ color: '#4B5563' }}>Any email & password works — or skip the form.</p>
            </div>
            <button 
              onClick={goDashboard} 
              className="shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200"
              style={{ backgroundColor: '#0D7A5F', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(13, 122, 95, 0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Enter demo
            </button>
          </div>

          {/* Tabs */}
          <div className="flex p-1 rounded-xl mb-8" style={{ backgroundColor: '#F3F4F6' }}>
            <button 
              onClick={() => { setTab('signin'); router.replace('/login'); }} 
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all duration-200 ${tab === 'signin' ? 'bg-white text-[#1A1F2C] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1F2C]'}`}
            >
              Sign in
            </button>
            <button 
              onClick={() => { setTab('register'); router.replace('/register'); }} 
              className={`flex-1 py-2.5 rounded-lg text-[14px] font-bold transition-all duration-200 ${tab === 'register' ? 'bg-white text-[#1A1F2C] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1F2C]'}`}
            >
              Create account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={e => { e.preventDefault(); goDashboard(); }}>
            {tab === 'register' && (
              <>
                <InputField label="Full name" id="fullname" placeholder="John Doe" />
                <InputField label="NGO name" id="ngoname" placeholder="Global Relief Fund" />
              </>
            )}
            <InputField label="Work email" id="email" type="email" placeholder="john@example.com" />
            <InputField label="Password" id="password" type="password" placeholder="••••••••" />
            
            <button 
              type="submit" 
              className="w-full h-12 mt-6 rounded-xl text-[16px] font-bold text-white transition-all duration-200 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0D7A5F 0%, #71B188 100%)', boxShadow: '0 4px 12px rgba(13, 122, 95, 0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 122, 95, 0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 122, 95, 0.2)'; }}
            >
              {tab === 'signin' ? 'Sign in to demo account' : 'Create demo account'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
