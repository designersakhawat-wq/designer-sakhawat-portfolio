import React, { useState, useEffect } from 'react';
import { portfolioData } from './data/portfolioData';

/* ── SVG Icons ─────────────────────────────────────────── */
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconTarget = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconZap = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconLayers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconBulb = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);
const IconPen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IconBarChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const IconQuote = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
  </svg>
);

const MARQUEE_ITEMS = ['META ADS','E-COMMERCE','EDTECH','SAAS','SERVICES','DIRECT RESPONSE','AD CREATIVES','PERFORMANCE MARKETING'];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Dynamic API Data with fallback
  const [portfolioItems, setPortfolioItems] = useState(portfolioData);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    logo: "/logo.png",
    brandColor: "#C8FF00",
    hero: {
      eyebrow: "Performance Ad Creative Specialist",
      headline: "Helping Brands Scale with High-Converting Ad Creatives.",
      subheading: "Performance-focused creatives for eCommerce, EdTech, SaaS & Service Brands.",
      cta_primary: "View My Work",
      cta_secondary: "Let's Talk"
    },
    contact: {
      email: "your.email@example.com",
      phone: "",
      whatsapp: "",
      location: "Remote / Global",
      availability: "Open to New Projects"
    },
    social: {
      linkedin: "",
      instagram: "",
      behance: "",
      dribbble: ""
    },
    seo: {
      title: "Md. Sakhawat Hossain | Performance Ad Creative Specialist",
      description: "High-converting ad creatives for eCommerce, EdTech, SaaS & Service Brands."
    }
  });

  const categories = ['All', 'Meta Ads', 'E-commerce', 'EdTech', 'SaaS', 'Services'];

  const filteredPortfolio = activeCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === activeCategory || p.industry === activeCategory);

  // Fetch portfolio, settings, testimonials
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length) setPortfolioItems(data); })
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.hero) setSiteSettings(data); })
      .catch(() => {});

    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setTestimonialsList(data); })
      .catch(() => {});
  }, []);

  // Update dynamic SEO Title/Description
  useEffect(() => {
    if (siteSettings?.seo?.title) {
      document.title = siteSettings.seo.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && siteSettings?.seo?.description) {
      metaDesc.setAttribute('content', siteSettings.seo.description);
    }
  }, [siteSettings]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedCaseStudy(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (selectedCaseStudy || isMobileMenuOpen) ? 'hidden' : '';
  }, [selectedCaseStudy, isMobileMenuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const filterAndScrollToWork = (cat) => {
    setActiveCategory(cat);
    scrollTo('work');
  };

  const brandColor = siteSettings.brandColor || '#C8FF00';
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '200, 255, 0';
  };
  const rgb = hexToRgb(brandColor);

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen font-sans selection:bg-primary selection:text-on-primary">
      <style>{`
        :root {
          --primary-color: ${brandColor};
          --primary-color-hover: ${brandColor}dd;
          --primary-color-rgb: ${rgb};
        }
      `}</style>

      {/* ── 1. NAVBAR ───────────────────────────────────── */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B0B]/95 backdrop-blur-sm border-b border-white/5' : 'bg-[#0B0B0B]'}`}>
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <button onClick={() => scrollTo('hero')} className="flex items-center">
            <img src={siteSettings.logo || "/logo.png"} alt="Md. Sakhawat Hossain" className="h-9 w-auto object-contain" />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[['work','Work'],['services','Services'],['about','About'],['contact','Contact']].map(([id,label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link">{label}</button>
            ))}
            <button onClick={() => scrollTo('contact')} className="btn-primary py-2.5 px-5 text-xs">Let's Talk</button>
          </div>

          <button className="md:hidden text-white p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0B0B] pt-20 px-6 flex flex-col">
          {[['work','Work'],['services','Services'],['about','About'],['contact','Contact']].map(([id,label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-3xl font-bold text-left py-5 border-b border-white/10 text-white hover:text-primary transition-colors">{label}</button>
          ))}
          <button onClick={() => scrollTo('contact')} className="btn-primary w-full mt-8 py-4 text-base">Let's Talk</button>
        </div>
      )}

      <main className="pt-[72px]">

        {/* ── 2. HERO ─────────────────────────────────────── */}
        <section id="hero" className="min-h-[calc(100vh-72px)] flex flex-col justify-between relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 w-full flex-1 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
              
              {/* LEFT — Typography */}
              <div className="lg:col-span-7 flex flex-col items-start relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold tracking-[0.25em] text-primary uppercase">{siteSettings.hero.eyebrow}</span>
                </div>
                
                <h1 className="font-bold text-[44px] sm:text-[60px] md:text-[76px] leading-[0.95] text-white tracking-[-0.04em] mb-8 max-w-2xl">
                  {siteSettings.hero.headline.split(' ').map((word, i) => {
                    const cleanWord = word.replace(/[.,]/g, '');
                    const isHigh = cleanWord.toLowerCase() === 'high-converting' || cleanWord.toLowerCase() === 'ad' || cleanWord.toLowerCase() === 'creatives';
                    return (
                      <span key={i} className={isHigh ? 'text-primary' : ''}>
                        {word}{' '}
                      </span>
                    );
                  })}
                </h1>

                <p className="text-[#888] text-base md:text-lg max-w-md mb-10 leading-relaxed font-light">
                  {siteSettings.hero.subheading}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => scrollTo('work')} className="btn-primary text-sm py-3.5 px-7 gap-2">
                    {siteSettings.hero.cta_primary || "View My Work"} <ArrowRight />
                  </button>
                  <button onClick={() => scrollTo('contact')} className="btn-secondary-dark text-sm py-3.5 px-7">
                    {siteSettings.hero.cta_secondary || "Let's Talk"}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-0 mt-14 pt-8 border-t border-white/10 w-full max-w-sm">
                  {[
                    { val: '3+', label: 'Years Exp.' },
                    { val: '4',  label: 'Industries' },
                    { val: '∞',  label: 'Ideas / Brief' },
                  ].map((s, i) => (
                    <div key={i} className={`flex flex-col ${i > 0 ? 'border-l border-white/10 pl-5' : ''}`}>
                      <span className="font-bold text-[32px] leading-none text-primary">{s.val}</span>
                      <span className="text-[11px] text-white/40 uppercase tracking-[0.15em] mt-1.5">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — Ad Concept Grid (with optional custom images) */}
              <div className="hidden lg:grid lg:col-span-5 grid-cols-2 gap-3 relative">
                {/* Card 1 — Meta Ads */}
                <div className="bg-[#111] border border-white/8 p-5 flex flex-col justify-between group hover:border-primary-40 transition-all duration-300 min-h-[220px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">Meta Ads</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  </div>
                  {siteSettings.hero?.image1 ? (
                    <div className={`w-full border border-white/5 bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden mt-3 ${
                      siteSettings.hero.image1Fit === 'original' ? 'h-auto' : 'aspect-square'
                    }`}>
                      <img 
                        src={siteSettings.hero.image1} 
                        className={`w-full h-full ${
                          siteSettings.hero.image1Fit === 'original' ? 'object-contain h-auto' : 
                          siteSettings.hero.image1Fit === 'contain' ? 'object-contain' : 'object-cover'
                        }`} 
                        alt="Custom Meta Ad" 
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="h-20 bg-[#0d0d0d] border border-white/5 flex flex-col gap-2 p-3">
                        <div className="flex gap-2 items-center">
                          <div className="w-6 h-6 bg-white/10 rounded-full flex-shrink-0"></div>
                          <div className="flex flex-col gap-1 flex-1">
                            <div className="h-1.5 w-16 bg-white/20 rounded"></div>
                            <div className="h-1 w-10 bg-white/10 rounded"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-white/5 rounded"></div>
                      </div>
                      <div className="h-7 bg-primary flex items-center justify-center">
                        <span className="text-[9px] font-bold text-on-primary uppercase tracking-[0.2em]">Shop Now →</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card 2 — E-commerce */}
                <div className="bg-[#111] border border-white/8 p-5 flex flex-col justify-between group hover:border-primary-40 transition-all duration-300 mt-8 min-h-[220px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">E-commerce</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-white/20" />
                  </div>
                  {siteSettings.hero?.image2 ? (
                    <div className={`w-full border border-white/5 bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden mt-3 ${
                      siteSettings.hero.image2Fit === 'original' ? 'h-auto' : 'aspect-square'
                    }`}>
                      <img 
                        src={siteSettings.hero.image2} 
                        className={`w-full h-full ${
                          siteSettings.hero.image2Fit === 'original' ? 'object-contain h-auto' : 
                          siteSettings.hero.image2Fit === 'contain' ? 'object-contain' : 'object-cover'
                        }`} 
                        alt="Custom Ecom Ad" 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="h-20 bg-[#0d0d0d] border border-white/5 flex items-center justify-center">
                      <div className="w-12 h-12 border border-white/10 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white/10"></div>
                      </div>
                    </div>
                    <div className="h-7 bg-white/8 border border-white/10 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">Learn More</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3 — Featured (spans full width) */}
              <div className="col-span-2 bg-[#111] border border-primary-20 p-5 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-5 rounded-full"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary"></div>
                    <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">Featured Concept</span>
                  </div>
                  <span className="text-[9px] text-white/25 uppercase tracking-[0.15em]">Direct Response</span>
                </div>
                {siteSettings.hero?.image3 ? (
                  <div className={`w-full border border-white/5 bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden ${
                    siteSettings.hero.image3Fit === 'original' ? 'h-auto' : 'aspect-[21/9]'
                  }`}>
                    <img 
                      src={siteSettings.hero.image3} 
                      className={`w-full h-full ${
                        siteSettings.hero.image3Fit === 'original' ? 'object-contain h-auto' : 
                        siteSettings.hero.image3Fit === 'contain' ? 'object-contain' : 'object-cover'
                      }`} 
                      alt="Custom Featured Ad" 
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-3 h-28 bg-[#0B0B0B] border border-white/8 flex flex-col justify-between p-3">
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-white/25 rounded"></div>
                        <div className="w-4/5 h-1.5 bg-white/12 rounded"></div>
                        <div className="w-3/5 h-1.5 bg-white/8 rounded"></div>
                      </div>
                      <div className="w-3/4 h-6 bg-primary"></div>
                    </div>
                    <div className="col-span-2 h-28 bg-[#0d0d0d] border border-white/8 flex items-center justify-center">
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                        <div className="w-5 h-5 bg-white/10"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/8 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-3/4 bg-primary-40"></div>
                  </div>
                  <span className="text-[9px] text-white/25 tracking-wider">Creative Ready</span>
                </div>
              </div>

              {/* Tags row */}
              <div className="col-span-2 grid grid-cols-3 gap-3">
                {['SaaS','EdTech','Services'].map((t,i) => (
                  <button 
                    key={i} 
                    onClick={() => filterAndScrollToWork(t)}
                    className="border border-white/8 py-2.5 flex items-center justify-center hover:border-primary-40 hover:bg-primary transition-all cursor-pointer bg-transparent"
                  >
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase">{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

          {/* Marquee ticker */}
          <div className="w-full bg-[#111] border-t border-white/5 overflow-hidden py-3 flex-shrink-0 relative z-10">
            <div className="flex whitespace-nowrap" style={{animation:'marquee 32s linear infinite',width:'max-content'}}>
              {[0,1].map(rep => (
                <span key={rep} className="flex items-center">
                  {MARQUEE_ITEMS.map((item, i) => (
                    <span key={i} className="inline-flex items-center">
                      <span className="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase px-5">{item}</span>
                      <span className="text-primary text-[10px]">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. CREDIBILITY STRIP ────────────────────── */}
        <section className="bg-[#0B0B0B] border-t border-b border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { stat: '3+',            label: 'Years of Experience',  sub: 'In Performance Ad Design' },
                { stat: 'Performance',   label: 'Focused',              sub: 'ROI-Driven Creative Strategy' },
                { stat: 'Multi-Industry',label: 'Expertise',            sub: 'eCommerce · SaaS · EdTech' },
                { stat: 'Creative',      label: 'Partner',              sub: 'Extension of Your Team' },
              ].map((item, i) => (
                <div key={i} className={`py-10 px-6 flex flex-col ${i > 0 ? 'border-l border-white/8' : ''} ${i >= 2 ? 'border-t border-white/8 md:border-t-0' : ''}`}>
                  <span className="font-bold text-2xl md:text-3xl text-white mb-1 tracking-tight">{item.stat}</span>
                  <span className="text-primary text-xs font-bold uppercase tracking-[0.15em] mb-1">{item.label}</span>
                  <span className="text-white/35 text-xs">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. PORTFOLIO ────────────────────────────── */}
        <section id="work" className="bg-[#0B0B0B] py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">Portfolio</span>
                <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em]">Selected Work</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] uppercase border transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-primary border-primary text-on-primary'
                        : 'bg-transparent border-white/15 text-white/50 hover:border-white/40 hover:text-white'
                    }`}
                  >{cat}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
              {filteredPortfolio.map(project => (
                <div
                  key={project.id}
                  className="bg-[#0B0B0B] group cursor-pointer flex flex-col hover:bg-[#111] transition-colors duration-300"
                  onClick={() => setSelectedCaseStudy(project)}
                >
                  {/* Thumbnail — 1:1 square */}
                  <div className="aspect-square relative flex flex-col justify-between overflow-hidden border-b border-white/8">
                    {/* Background Image (if uploaded) or Fallback Color */}
                    {project.imageUrl ? (
                      <div 
                        className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 bg-center ${
                          project.thumbnailFit === 'contain' ? 'bg-contain bg-no-repeat' : 'bg-cover'
                        }`}
                        style={{ backgroundImage: `url(${project.imageUrl})` }}
                      />
                    ) : (
                      <div className={`absolute inset-0 ${project.thumbnailBg}`} />
                    )}

                    {/* Dark gradient overlay if image exists so labels remain readable */}
                    {project.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/60 z-0" />
                    )}

                    {/* Content overlay */}
                    <div className="relative z-10 p-5 flex flex-col justify-between h-full w-full">
                      <div className="flex justify-between items-start">
                        <span className="bg-primary text-on-primary text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider">{project.category}</span>
                        <span className="border border-white/20 bg-black/40 backdrop-blur-sm text-white/80 text-[9px] font-medium px-2.5 py-1 uppercase tracking-wider">{project.badge}</span>
                      </div>

                      {/* If no image, show the abstract wireframe box. Otherwise don't clutter the visual */}
                      {!project.imageUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover:opacity-40 transition-opacity">
                          <div className="w-3/5 h-3/5 border border-dashed border-white/30 flex items-center justify-center">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] text-center px-2">{project.industry}</span>
                          </div>
                        </div>
                      )}

                      <div className="text-[9px] text-white/35 font-bold uppercase tracking-[0.2em] mt-auto">Concept Project</div>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors leading-snug">{project.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">{project.shortDescription}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 group-hover:text-primary transition-all group-hover:gap-3">
                      View Case Study <ArrowRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. SERVICES ─────────────────────────────── */}
        <section id="services" className="bg-[#0B0B0B] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">What I Do</span>
              <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em]">Services</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
              {[
                { icon: <IconTarget />, title: 'Ad Creative Strategy', desc: 'Developing data-backed creative angles and concepts tailored to your target audience and campaign objectives.' },
                { icon: <IconZap />,    title: 'Direct Response Design', desc: 'Crafting static and motion graphics engineered for scroll-stopping hooks and high click-through rates.' },
                { icon: <IconLayers />, title: 'Creative Testing', desc: 'Building modular creative frameworks to systematically test hooks, copy variations, and visual treatments.' },
                { icon: <IconTrendingUp />, title: 'Performance Analysis', desc: "Reading creative metrics and iterating on winning formats to scale what's working and cut what's not." },
              ].map((s, i) => (
                <div key={i} className="bg-[#0B0B0B] p-8 flex flex-col gap-6 group hover:bg-[#111] transition-colors duration-300">
                  <div className="w-11 h-11 bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white mb-3">{s.title}</h3>
                    <p className="text-white/45 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. WHY WORK WITH ME ──────────────────────── */}
        <section className="bg-[#0B0B0B] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-[-0.03em] leading-[1.08] max-w-3xl mb-16">
              More Than a Designer.<br /><span className="text-primary">A Creative Partner.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8">
              {[
                { num:'01', title:'Performance-First Thinking', desc:"I don't just make things look pretty. Every creative decision is tied to a measurable business objective — lower CPA, higher CTR, better ROAS." },
                { num:'02', title:'Media Buying Awareness',    desc:'By understanding the media buying side, I bridge the gap between creative and performance — designing ads that work WITH the algorithm, not against it.' },
                { num:'03', title:'Proactive Creative Partner', desc:'I act as an extension of your team — bringing proactive ideas, creative angles, and strategic thinking rather than just waiting for a brief.' },
              ].map((item, i) => (
                <div key={i} className="bg-[#0B0B0B] p-8 hover:bg-[#111] transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 bg-primary text-on-primary font-bold text-sm flex items-center justify-center flex-shrink-0">{item.num}</span>
                    <h3 className="font-bold text-base text-white">{item.title}</h3>
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. CREATIVE PROCESS ─────────────────────── */}
        <section className="bg-[#111] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">Process</span>
              <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em]">How I Work</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
              {[
                { icon: <IconSearch />,   title: 'Discovery & Brief',        desc: 'Deep-diving into your brand, audience, competitors, and campaign goals before touching any design tool.' },
                { icon: <IconBulb />,     title: 'Ideation & Strategy',      desc: 'Developing multiple creative angles, hook frameworks, and visual concepts mapped to the target audience psyche.' },
                { icon: <IconPen />,      title: 'Design & Production',      desc: 'Executing high-quality static and motion ad creatives with pixel-perfect attention to detail and brand consistency.' },
                { icon: <IconBarChart />, title: 'Test, Analyze & Iterate',  desc: 'Reviewing performance data to identify winning creatives, kill underperformers, and build on what scales.' },
              ].map((step, i) => (
                <div key={i} className="bg-[#111] p-8 relative group hover:bg-[#161616] transition-colors duration-300">
                  <div className="absolute top-6 right-6 font-bold text-6xl text-white/5 select-none pointer-events-none leading-none">0{i+1}</div>
                  <div className="w-9 h-9 border border-white/15 flex items-center justify-center text-white/60 mb-6 group-hover:border-primary-40 group-hover:text-primary transition-colors duration-300">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-base text-white mb-3">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CASE STUDY SPOTLIGHT ─────────────────── */}
        <section className="bg-[#0B0B0B] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">Featured Case Study</span>
              <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em]">Scaling D2C Revenue.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-white/8">
              <div className="lg:col-span-3 bg-[#111] p-10 md:p-14 flex flex-col justify-between gap-8">
                <div>
                  <h3 className="font-bold text-2xl text-white mb-4">High-Converting Meta Ads for D2C Apparel</h3>
                  <p className="text-white/50 leading-relaxed text-sm">The brand was experiencing ad fatigue with rising CPAs on Meta. We developed a direct-response creative system using rapid visual hooks and modular copy testing to reinvigorate performance.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-l-2 border-primary pl-4">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] block mb-1">Objective</span>
                    <span className="font-bold text-sm text-white">Lower CPA by 20%</span>
                  </div>
                  <div className="border-l-2 border-white/15 pl-4">
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] block mb-1">Outcome</span>
                    <span className="font-bold text-sm text-primary">Ready for Deployment</span>
                  </div>
                </div>
                <button onClick={() => setSelectedCaseStudy(portfolioData[0])} className="btn-primary self-start gap-2">
                  View Full Case Study <ArrowRight />
                </button>
              </div>
              <div className="lg:col-span-2 bg-[#0d0d0d] flex flex-col justify-center items-center p-8 gap-5 min-h-[360px]">
                {/* Ad mockup grid */}
                <div className="w-full grid grid-cols-2 gap-3">
                  {/* Story/Reel format */}
                  <div className="aspect-[9/16] bg-[#111] border border-white/10 flex flex-col overflow-hidden relative">
                    {siteSettings.spotlight?.image1 ? (
                      <img 
                        src={siteSettings.spotlight.image1} 
                        className={`w-full h-full ${
                          siteSettings.spotlight.image1Fit === 'contain' ? 'object-contain' : 'object-cover'
                        }`} 
                        alt="Spotlight Story Ad" 
                      />
                    ) : (
                      <>
                        <div className="h-6 border-b border-white/8 flex items-center px-2 gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                          <div className="flex-1 h-1 bg-white/8 rounded"></div>
                        </div>
                        <div className="flex-1 bg-white/4 flex items-center justify-center">
                          <span className="text-white/10 text-[7px] font-bold uppercase tracking-widest text-center">Story<br/>Ad</span>
                        </div>
                        <div className="h-5 bg-primary flex items-center justify-center">
                          <span className="text-[7px] font-bold text-on-primary uppercase tracking-widest">Shop Now</span>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Square + Feed format stacked */}
                  <div className="flex flex-col gap-3">
                    <div className="aspect-square bg-[#111] border border-white/10 flex flex-col overflow-hidden relative">
                      {siteSettings.spotlight?.image2 ? (
                        <img 
                          src={siteSettings.spotlight.image2} 
                          className={`w-full h-full ${
                            siteSettings.spotlight.image2Fit === 'contain' ? 'object-contain' : 'object-cover'
                          }`} 
                          alt="Spotlight Square Ad" 
                        />
                      ) : (
                        <>
                          <div className="flex-1 bg-white/4 flex items-center justify-center">
                            <span className="text-white/10 text-[7px] font-bold uppercase tracking-widest text-center">Square<br/>Ad</span>
                          </div>
                          <div className="h-5 border-t border-white/8 flex items-center gap-1 px-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/15"></div>
                            <div className="flex-1 h-1 bg-white/8 rounded"></div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="aspect-video bg-[#111] border border-white/10 flex flex-col overflow-hidden relative">
                      {siteSettings.spotlight?.image3 ? (
                        <img 
                          src={siteSettings.spotlight.image3} 
                          className={`w-full h-full ${
                            siteSettings.spotlight.image3Fit === 'contain' ? 'object-contain' : 'object-cover'
                          }`} 
                          alt="Spotlight Feed Ad" 
                        />
                      ) : (
                        <>
                          <div className="flex-1 bg-white/4 flex items-center justify-center">
                            <span className="text-white/10 text-[7px] font-bold uppercase tracking-widest text-center">Feed<br/>Video</span>
                          </div>
                          <div className="h-4 bg-primary flex items-center justify-center">
                            <span className="text-[6px] font-bold text-on-primary uppercase tracking-widest">Learn More</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <div className="h-px flex-1 bg-white/8"></div>
                  <span className="text-[9px] text-white/25 uppercase tracking-widest font-bold">Ad Formats</span>
                  <div className="h-px flex-1 bg-white/8"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. INDUSTRIES ───────────────────────────── */}
        <section className="bg-[#111] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">Industries</span>
              <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em]">I Serve</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
              {[
                { name:'E-commerce',  desc:'High-urgency product ads, flash sale creatives, and catalogue-style visuals that stop the scroll and drive to cart.' },
                { name:'SaaS',        desc:'Communicating complex software value propositions clearly to B2B decision-makers with outcome-first messaging.' },
                { name:'EdTech',      desc:'Outcome-driven ads focused on enrollment, app installs, and course completions at an efficient cost per lead.' },
                { name:'Services',    desc:'Trust-building creatives that generate qualified leads for local businesses, agencies, and premium service brands.' },
              ].map((ind, i) => (
                <div key={i} className="bg-[#111] p-8 group hover:bg-[#161616] transition-colors duration-300 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-white">{ind.name}</h3>
                    <div className="w-6 h-6 border border-white/15 flex items-center justify-center text-white/30 group-hover:border-primary group-hover:text-primary transition-colors">
                      <ArrowRight />
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{ind.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. ABOUT ───────────────────────────────── */}
        <section id="about" className="bg-[#0B0B0B] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-4">Meet Sakhawat</span>
                <h2 className="font-bold text-5xl md:text-6xl text-white tracking-[-0.03em] mb-8">Designing for<br />the Click.</h2>
                <div className="space-y-5 text-white/55 leading-relaxed text-base">
                  <p>I'm Md. Sakhawat Hossain, a Performance Ad Creative Specialist with over 3 years of experience helping brands scale through high-converting ad creatives.</p>
                  <p>In today's landscape, <em className="text-white not-italic font-medium">the creative is the targeting</em>. I specialize in designing direct-response static and motion graphics that grab attention in the first 3 seconds, communicate value instantly, and drive action — whether that's a click, a swipe-up, or an install.</p>
                  <p>My approach marries strong aesthetic principles with aggressive performance marketing logic. I understand the media buying side, which means I design ads that work with algorithms, not against them.</p>
                </div>
                <div className="flex flex-wrap gap-4 mt-10">
                  <button onClick={() => scrollTo('contact')} className="btn-primary gap-2">Start a Project <ArrowRight /></button>
                  <a href="#" className="btn-secondary-dark">Download Resume</a>
                </div>
              </div>

              <div className="bg-[#111] border border-white/8 p-8 flex flex-col">
                <h3 className="font-bold text-sm text-primary uppercase tracking-[0.15em] mb-8">Core Principles</h3>
                <ul className="space-y-7 flex-1">
                  {[
                    { n:'01', title:'Clarity over Cleverness',   desc:'The message must be crystal clear in 3 seconds or less. Every word and visual must earn its place.' },
                    { n:'02', title:'Test Everything',            desc:'Intuition is a starting point. Data is the verdict. Build creatives designed to be systematically tested.' },
                    { n:'03', title:'Native to Platform',         desc:'Design specifically for the feed environment — not a billboard, not a TV commercial, not a brochure.' },
                  ].map((p,i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-primary font-bold text-sm w-5 flex-shrink-0 mt-0.5">{p.n}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white mb-1">{p.title}</h4>
                        <p className="text-white/40 text-xs leading-relaxed">{p.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 11. TESTIMONIALS ────────────────────────── */}
        <section className="bg-[#111] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-primary-20 mb-6 flex justify-center">
              <IconQuote />
            </div>
            <h2 className="font-bold text-3xl md:text-4xl text-white mb-8">Client Feedback</h2>
            
            {testimonialsList.length === 0 ? (
              <div className="border border-white/8 max-w-xl mx-auto p-8 mb-8">
                <p className="text-white/40 text-sm leading-relaxed mb-3">Client testimonials will be displayed here.</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Available upon request</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 text-left text-white">
                {testimonialsList.map(t => (
                  <div key={t.id} className="bg-[#0B0B0B] border border-white/8 p-6 flex flex-col justify-between">
                    <div>
                      {/* Rating stars */}
                      <div className="flex gap-1 mb-4 text-[#FFD700]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg 
                            key={i} 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill={i < (t.rating || 5) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            strokeWidth="2"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-white/60 italic text-sm leading-relaxed mb-6">"{t.quote}"</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {t.avatarUrl ? (
                        <img 
                          src={t.avatarUrl} 
                          className="w-8 h-8 rounded-full object-cover border border-white/10" 
                          alt={t.clientName} 
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary text-on-primary font-bold text-xs flex items-center justify-center rounded-full">
                          {t.clientName[0]}
                        </div>
                      )}
                      <div>
                        <span className="block font-bold text-xs text-white">{t.clientName}</span>
                        <span className="block text-white/40 text-[10px] uppercase tracking-wider">{t.clientCompany}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => scrollTo('contact')} className="btn-secondary-dark">Get In Touch</button>
          </div>
        </section>

        {/* ── 12. FINAL CTA ────────────────────────────── */}
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="font-bold text-4xl md:text-5xl text-on-primary tracking-[-0.03em] leading-[1.1] max-w-xl">
                Ready to scale your ad performance?
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <button onClick={() => scrollTo('contact')} className="bg-[#0B0B0B] text-white font-bold text-sm px-8 py-4 hover:bg-[#111] transition-colors">Let's Talk</button>
              <button onClick={() => scrollTo('work')} className="border-2 border-black text-black font-bold text-sm px-8 py-4 hover:bg-black hover:text-white transition-colors">View Portfolio</button>
            </div>
          </div>
        </section>

        {/* ── 13. CONTACT ─────────────────────────────── */}
        <section id="contact" className="bg-[#0B0B0B] py-24 border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              <div className="lg:col-span-2">
                <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-4">Contact</span>
                <h2 className="font-bold text-5xl text-white tracking-[-0.03em] mb-6">Get In<br />Touch.</h2>
                <p className="text-white/45 mb-10 leading-relaxed text-sm">Currently accepting new projects. Fill out the form and I'll get back to you within 24 hours.</p>
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] block mb-1">Email</span>
                    <a href={`mailto:${siteSettings.contact.email}`} className="text-white font-bold hover:text-primary transition-colors text-sm">{siteSettings.contact.email}</a>
                  </div>
                  {siteSettings.contact.whatsapp && (
                    <div>
                      <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] block mb-1">WhatsApp</span>
                      <a href={`https://wa.me/${siteSettings.contact.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-primary transition-colors text-sm">{siteSettings.contact.whatsapp}</a>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] block mb-1">Location</span>
                    <span className="text-white font-bold text-sm">{siteSettings.contact.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] block mb-1">Availability</span>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      <span className="text-white font-bold text-sm">{siteSettings.contact.availability}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 bg-[#111] border border-white/8 p-8 md:p-10">
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" id="name" className="form-input" placeholder="Your name" required />
                    </div>
                    <div className="form-field">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" id="email" className="form-input" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-field">
                      <label htmlFor="company" className="form-label">Company / Brand</label>
                      <input type="text" id="company" className="form-input" placeholder="Brand name" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="projectType" className="form-label">Project Type</label>
                      <div className="relative">
                        <select id="projectType" className="form-select w-full">
                          <option value="">Select...</option>
                          <option>Meta Ads Creative</option>
                          <option>Creative Testing Pipeline</option>
                          <option>Creative Strategy</option>
                          <option>Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="budget" className="form-label">Budget Range</label>
                    <div className="relative">
                      <select id="budget" className="form-select w-full">
                        <option value="">Select range...</option>
                        <option>$1k – $3k</option>
                        <option>$3k – $5k</option>
                        <option>$5k+</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="details" className="form-label">Project Details</label>
                    <textarea id="details" rows="5" className="form-input resize-none" placeholder="Tell me about your project, goals, and timeline..." required></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 justify-center gap-2 text-sm mt-2">
                    Send Project Inquiry <ArrowRight />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── 14. FOOTER ──────────────────────────────────── */}
      <footer className="bg-[#0B0B0B] border-t border-white/8 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <img src={siteSettings.logo || "/logo.png"} alt="Md. Sakhawat Hossain" className="h-9 w-auto object-contain" />
          <div className="flex items-center gap-6 text-xs font-bold text-white/40 uppercase tracking-[0.12em]">
            {[['work','Work'],['services','Services'],['about','About'],['contact','Contact']].map(([id,l]) => (
              <button key={id} onClick={() => scrollTo(id)} className="hover:text-primary transition-colors">{l}</button>
            ))}
          </div>
          <div className="text-xs text-white/25">&copy; {new Date().getFullYear()} Md. Sakhawat Hossain</div>
        </div>
      </footer>

      {/* ── CASE STUDY MODAL ────────────────────────────── */}
      {selectedCaseStudy && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm modal-overlay" onClick={() => setSelectedCaseStudy(null)} />
          <div className="w-full max-w-2xl bg-[#0B0B0B] h-full overflow-y-auto relative z-10 modal-drawer border-l border-white/10 flex flex-col">
            {/* Drawer header */}
            <div className="sticky top-0 bg-[#0B0B0B] border-b border-white/8 px-8 py-5 flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <span className="bg-primary text-on-primary text-[9px] font-bold px-2.5 py-1 uppercase tracking-wider">{selectedCaseStudy.category}</span>
                <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Case Study</span>
              </div>
              <button onClick={() => setSelectedCaseStudy(null)} className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:border-white/40 hover:text-white transition-colors">
                <CloseIcon />
              </button>
            </div>

            <div className="p-8 md:p-10 flex-1 space-y-10">
              {/* Title */}
              <div>
                <h2 className="font-bold text-3xl md:text-4xl text-white tracking-[-0.03em] mb-3">{selectedCaseStudy.title}</h2>
                <div className="border border-white/15 inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">{selectedCaseStudy.badge}</div>
              </div>

              {/* Banner Image (if uploaded) */}
              {selectedCaseStudy.bannerUrl ? (
                <div className={`w-full border border-white/8 overflow-hidden bg-[#111] flex items-center justify-center ${
                  selectedCaseStudy.bannerFit === 'original' ? 'h-auto' : 'aspect-[16/9]'
                }`}>
                  <img 
                    src={selectedCaseStudy.bannerUrl} 
                    alt={selectedCaseStudy.title} 
                    className={`w-full h-full ${
                      selectedCaseStudy.bannerFit === 'original' ? 'object-contain h-auto' : 
                      selectedCaseStudy.bannerFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`} 
                  />
                </div>
              ) : selectedCaseStudy.imageUrl ? (
                <div className={`w-full border border-white/8 overflow-hidden bg-[#111] flex items-center justify-center ${
                  selectedCaseStudy.thumbnailFit === 'original' ? 'h-auto' : 'aspect-[16/9]'
                }`}>
                  <img 
                    src={selectedCaseStudy.imageUrl} 
                    alt={selectedCaseStudy.title} 
                    className={`w-full h-full ${
                      selectedCaseStudy.thumbnailFit === 'original' ? 'object-contain h-auto' : 
                      selectedCaseStudy.thumbnailFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`} 
                  />
                </div>
              ) : null}

              {/* Sections */}
              {[
                { label: 'Challenge',           content: selectedCaseStudy.caseStudy.challenge },
                { label: 'Creative Strategy',   content: selectedCaseStudy.caseStudy.creativeStrategy },
                { label: 'Creative Direction',  content: selectedCaseStudy.caseStudy.creativeDirection },
                { label: 'Creative Variations', content: selectedCaseStudy.caseStudy.creativeVariations },
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-white/10 pl-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">{s.label}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.content}</p>
                </div>
              ))}

              {/* Objective */}
              <div className="bg-[#111] border border-white/8 border-l-2 border-l-primary p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-2">Objective</h3>
                <p className="font-bold text-white text-lg">{selectedCaseStudy.caseStudy.objective}</p>
              </div>

              {/* Final Designs */}
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-4">Final Designs</h3>
                <ul className="space-y-3">
                  {selectedCaseStudy.caseStudy.finalDesigns.map((d, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="w-5 h-5 bg-primary text-on-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                      <span className="text-white/60 text-sm">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outcome */}
              <div className="bg-primary p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-primary/60 mb-2">Outcome</h3>
                <p className="font-bold text-on-primary text-xl">{selectedCaseStudy.caseStudy.outcome}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
