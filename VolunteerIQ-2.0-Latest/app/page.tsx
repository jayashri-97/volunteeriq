'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-[#0D7A5F]/10" 
      style={{ fontFamily: 'var(--font-outfit), system-ui, sans-serif', backgroundColor: '#FAF8F4', color: '#1A1F2C' }}
    >
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#FAF8F4]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Logo className="w-8 h-8" />
            <span className="text-[20px] font-bold tracking-tight text-[#1A1F2C]">
              VolunteerIQ
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-[14px] font-medium text-[#4B5563] hover:text-[#1A1F2C] transition-colors">How it works</Link>
            <Link href="#features" className="text-[14px] font-medium text-[#4B5563] hover:text-[#1A1F2C] transition-colors">Features</Link>
            <Link href="#impact" className="text-[14px] font-medium text-[#4B5563] hover:text-[#1A1F2C] transition-colors">Impact</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-[14px] font-medium text-[#1A1F2C] hover:text-[#0D7A5F] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-full text-[14px] font-bold text-white transition-all duration-200"
              style={{ backgroundColor: '#12B76A', boxShadow: '0 4px 12px rgba(18, 183, 106, 0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(18, 183, 106, 0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 183, 106, 0.2)'; }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ backgroundColor: '#E8F5EE' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className="text-[13px] font-bold text-[#0D7A5F]">
              AI-powered crisis response for NGOs
            </span>
          </div>

          <h1 className="text-[56px] sm:text-[72px] font-bold leading-[1.05] tracking-tight mb-8 text-[#0F2922]">
            From field report to<br />
            <span style={{ color: '#258C69' }}>
              deployed volunteer
            </span>
            {' '}in<br />
            10 seconds.
          </h1>

          <p className="text-[18px] text-[#4B5563] max-w-2xl mx-auto leading-relaxed mb-10">
            Paste any WhatsApp message, voice note transcript, or paper scan.<br />
            VolunteerIQ parses it with AI, scores urgency, and matches the right<br />
            volunteer — automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-[16px] font-bold text-white transition-all duration-200"
              style={{ background: 'linear-gradient(to right, #0D7A5F, #30A47B)', boxShadow: '0 8px 24px rgba(13, 122, 95, 0.25)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start coordinating
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="#how-it-works"
              className="text-[16px] font-bold text-[#1A1F2C] hover:text-[#0D7A5F] transition-colors"
            >
              See how it works
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-black/5">
            <div>
              <p className="text-[36px] font-bold text-[#0D7A5F]">&lt; 10s</p>
              <p className="text-[13px] text-[#4B5563] font-medium mt-1">Avg. parse to assign</p>
            </div>
            <div>
              <p className="text-[36px] font-bold text-[#0D7A5F]">12+</p>
              <p className="text-[13px] text-[#4B5563] font-medium mt-1">Active volunteers</p>
            </div>
            <div>
              <p className="text-[36px] font-bold text-[#0D7A5F]">98%</p>
              <p className="text-[13px] text-[#4B5563] font-medium mt-1">Match accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Box Section */}
      <section className="px-6 py-10 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="text-[11px] font-bold text-[#6B7280] tracking-widest uppercase mb-4">Raw Field Report</p>
            <div className="bg-[#F8F5EF] p-6 rounded-2xl h-[160px] flex items-center">
              <p className="text-[15px] font-mono text-[#4B5563] leading-relaxed">
                "urgent - nandgaon village amravati. 34 families no food 3 weeks. 2 kids under 5 malnourished. road ok by jeep. need food distribution volunteers asap."
              </p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold text-[#6B7280] tracking-widest uppercase mb-4">Parsed Need</p>
            <div className="bg-[#F0F9F6] p-6 rounded-2xl h-[160px] flex flex-col justify-center space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#4B5563]">Type</span>
                <span className="text-[14px] font-bold text-[#1A1F2C]">Food Scarcity</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#4B5563]">Location</span>
                <span className="text-[14px] font-bold text-[#1A1F2C]">Nandgaon, Amravati</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#4B5563]">Families</span>
                <span className="text-[14px] font-bold text-[#1A1F2C]">34</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[#4B5563]">Urgency</span>
                <span className="px-2.5 py-1 bg-[#EF4444] text-white text-[11px] font-bold rounded-full">8.4 / CRITICAL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[48px] font-bold text-[#0F2922] tracking-tight mb-4">How it works</h2>
            <p className="text-[18px] text-[#4B5563]">Three steps. No spreadsheets. No phone tag.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <span className="text-[32px] font-bold text-[#E5E7EB]">01</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#1A1F2C] mb-3">Paste anything</h3>
              <p className="text-[15px] text-[#4B5563] leading-relaxed">
                WhatsApp messages, voice transcripts, paper scan OCR, typed notes. Any format works.
              </p>
            </div>
            <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <span className="text-[32px] font-bold text-[#E5E7EB]">02</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#1A1F2C] mb-3">AI parses & scores</h3>
              <p className="text-[15px] text-[#4B5563] leading-relaxed">
                Gemini extracts location, type, family count, and computes urgency in under 4 seconds.
              </p>
            </div>
            <div className="bg-white rounded-[24px] p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E8F5EE] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                </div>
                <span className="text-[32px] font-bold text-[#E5E7EB]">03</span>
              </div>
              <h3 className="text-[20px] font-bold text-[#1A1F2C] mb-3">Match & deploy</h3>
              <p className="text-[15px] text-[#4B5563] leading-relaxed">
                Top 3 volunteers ranked by skills, proximity, and availability. One click to assign.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[48px] font-bold text-[#0F2922] tracking-tight mb-4">Built for the field, not the<br/>office</h2>
            <p className="text-[18px] text-[#4B5563]">Every feature designed to save coordinator time and get help on the ground<br/>faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">AI-powered parsing</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">Gemini extracts structured needs from messy text in any language.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">Location intelligence</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">Auto-geocodes village names. Distance-aware volunteer matching.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">Smart matching</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">Ranks volunteers by skill overlap, proximity, and availability.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">Urgency scoring</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">Weighted formula combines AI signal, recency, and family count.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">Audit trail</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">Every action logged. Never lose track of who did what, when.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm">
              <div className="w-8 h-8 mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#0D7A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#1A1F2C] mb-2">10-second deploys</h3>
              <p className="text-[14px] text-[#4B5563] leading-relaxed">From paste to assignment notification, faster than a phone call.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto rounded-[32px] overflow-hidden p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #0D7A5F 0%, #258C69 100%)' }}
        >
          <h2 className="text-[42px] font-bold text-white mb-4 tracking-tight">
            Ready to coordinate smarter?
          </h2>
          <p className="text-[18px] text-white/90 mb-10">
            Join NGOs using AI to deploy volunteers faster than ever.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[16px] font-bold transition-all duration-200"
            style={{ backgroundColor: '#FFFFFF', color: '#0D7A5F' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            Create free account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6" />
            <span className="text-[14px] font-bold text-[#0D7A5F]">VolunteerIQ</span>
          </div>
          <p className="text-[13px] text-[#6B7280] font-medium">© 2026 VolunteerIQ. Built for social impact.</p>
        </div>
      </footer>
    </div>
  );
}
