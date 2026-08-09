import React, { useState, useEffect } from 'react';

// Admin panel SVG icons
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function Admin() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('portfolio');

  // Loaded data
  const [portfolio, setPortfolio] = useState([]);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);

  // Editing state for portfolio
  const [editingProject, setEditingProject] = useState(null); // null means adding or idle
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'Meta Ads',
    industry: 'E-commerce',
    badge: 'Concept Project',
    shortDescription: '',
    thumbnailBg: 'bg-[#171717]',
    imageUrl: '',
    caseStudy: {
      challenge: '',
      objective: '',
      creativeStrategy: '',
      creativeDirection: '',
      finalDesigns: [''],
      creativeVariations: '',
      outcome: ''
    }
  });

  // Selections
  const categories = ['Meta Ads', 'E-commerce', 'EdTech', 'SaaS', 'Services'];
  const colors = ['bg-[#171717]', 'bg-[#0B0B0B]', 'bg-[#1a1a1a]', 'bg-[#262626]'];

  // Testimonial Form State
  const [testimonialForm, setTestimonialForm] = useState({
    clientName: '',
    clientCompany: '',
    quote: '',
    rating: 5,
    avatarUrl: '',
    projectDate: ''
  });

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      })
      .then(res => {
        if (res.ok) {
          setIsLoggedIn(true);
          loadAllData();
        } else {
          localStorage.removeItem('admin_token');
          setToken('');
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        setToken('');
        setIsLoggedIn(false);
      });
    }
  }, [token]);

  // Load settings on mount (public endpoint) for branding
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings(data); });
  }, []);

  const loadAllData = () => {
    fetch('/api/portfolio').then(r => r.json()).then(setPortfolio);
    fetch('/api/settings').then(r => r.json()).then(setSettings);
    fetch('/api/testimonials').then(r => r.json()).then(setTestimonials);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      loadAllData();
    })
    .catch(err => setError(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setIsLoggedIn(false);
  };

  // Image Upload handler
  const handleImageUpload = (e, fieldName = 'imageUrl') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setProjectForm(prev => ({ ...prev, [fieldName]: data.url }));
    })
    .catch(err => alert(err.message));
  };

  // Portfolio actions
  const initNewProject = () => {
    setEditingProject('new');
    setProjectForm({
      title: '',
      category: 'Meta Ads',
      industry: 'E-commerce',
      badge: 'Concept Project',
      shortDescription: '',
      thumbnailBg: 'bg-[#171717]',
      imageUrl: '',
      thumbnailFit: 'cover',
      bannerUrl: '',
      bannerFit: 'cover',
      caseStudy: {
        challenge: '',
        objective: '',
        creativeStrategy: '',
        creativeDirection: '',
        finalDesigns: [''],
        creativeVariations: '',
        outcome: ''
      }
    });
  };

  const startEditProject = (p) => {
    setEditingProject(p.id);
    setProjectForm({
      title: p.title || '',
      category: p.category || 'Meta Ads',
      industry: p.industry || 'E-commerce',
      badge: p.badge || 'Concept Project',
      shortDescription: p.shortDescription || '',
      thumbnailBg: p.thumbnailBg || 'bg-[#171717]',
      imageUrl: p.imageUrl || '',
      thumbnailFit: p.thumbnailFit || 'cover',
      bannerUrl: p.bannerUrl || '',
      bannerFit: p.bannerFit || 'cover',
      caseStudy: {
        challenge: p.caseStudy?.challenge || '',
        objective: p.caseStudy?.objective || '',
        creativeStrategy: p.caseStudy?.creativeStrategy || '',
        creativeDirection: p.caseStudy?.creativeDirection || '',
        finalDesigns: p.caseStudy?.finalDesigns?.length ? [...p.caseStudy.finalDesigns] : [''],
        creativeVariations: p.caseStudy?.creativeVariations || '',
        outcome: p.caseStudy?.outcome || ''
      }
    });
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    const url = editingProject === 'new' ? '/api/portfolio' : `/api/portfolio/${editingProject}`;
    const method = editingProject === 'new' ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(projectForm)
    })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      alert('Project saved successfully!');
      setEditingProject(null);
      loadAllData();
    })
    .catch(err => alert(err.message));
  };

  const handleDeleteProject = (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(async res => {
      if (!res.ok) throw new Error('Delete failed');
      loadAllData();
    })
    .catch(err => alert(err.message));
  };

  // Settings action
  const handleSaveSettings = (e) => {
    e.preventDefault();
    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save settings');
      }
      alert('Settings saved!');
      loadAllData();
    })
    .catch(err => alert(err.message));
  };

  // Testimonials actions
  const handleAddTestimonial = (e) => {
    e.preventDefault();
    fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(testimonialForm)
    })
    .then(async res => {
      if (!res.ok) throw new Error('Failed to add testimonial');
      setTestimonialForm({ clientName: '', clientCompany: '', quote: '', rating: 5, avatarUrl: '', projectDate: '' });
      loadAllData();
    })
    .catch(err => alert(err.message));
  };

  const handleDeleteTestimonial = (id) => {
    if (!confirm('Delete this testimonial?')) return;
    fetch(`/api/testimonials/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(async res => {
      if (!res.ok) throw new Error('Failed to delete');
      loadAllData();
    })
    .catch(err => alert(err.message));
  };

  /* ────────────── LOGIN VIEW ────────────── */
  if (!isLoggedIn) {
    const loginBrandColor = settings?.brandColor || '#C8FF00';
    const loginHexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '200, 255, 0';
    };
    const loginRgb = loginHexToRgb(loginBrandColor);

    return (
      <div className="bg-[#0B0B0B] text-white min-h-screen flex items-center justify-center font-sans selection:bg-primary selection:text-on-primary px-6">
        <style>{`
          :root {
            --primary-color: ${loginBrandColor};
            --primary-color-hover: ${loginBrandColor}dd;
            --primary-color-rgb: ${loginRgb};
          }
        `}</style>
        <div className="w-full max-w-sm bg-[#111] border border-white/8 p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <img src={settings?.logo || "/logo.png"} alt="Logo" className="h-10 w-auto object-contain" />
          </div>
          <h2 className="font-syne font-bold text-xl text-center mb-6 uppercase tracking-wider text-primary">Admin Panel Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="form-field">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input text-center tracking-widest text-lg" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-center">{error}</p>}
            <button type="submit" className="btn-primary w-full py-3.5 text-xs tracking-wider uppercase">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  const brandColor = settings?.brandColor || '#C8FF00';
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '200, 255, 0';
  };
  const rgb = hexToRgb(brandColor);

  /* ────────────── ADMIN DASHBOARD VIEW ────────────── */
  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen font-sans selection:bg-primary selection:text-on-primary">
      <style>{`
        :root {
          --primary-color: ${brandColor};
          --primary-color-hover: ${brandColor}dd;
          --primary-color-rgb: ${rgb};
        }
      `}</style>
      
      {/* Admin header */}
      <header className="bg-[#111] border-b border-white/8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={settings?.logo || "/logo.png"} alt="Logo" className="h-8 w-auto object-contain" />
            <span className="text-white/30 text-xs font-bold uppercase tracking-[0.2em] border-l border-white/10 pl-6">Admin Panel</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors">View Site ↗</a>
            <button onClick={handleLogout} className="border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-[#0B0B0B] transition-all">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Left panel tabs */}
          <div className="flex flex-col gap-1 border-r border-white/5 pr-6 h-fit">
            {[
              { id: 'portfolio', label: 'Portfolio Items' },
              { id: 'settings',  label: 'Site Settings' },
              { id: 'testimonials', label: 'Testimonials' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setActiveTab(t.id); setEditingProject(null); }}
                className={`text-left px-5 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === t.id && !editingProject
                    ? 'bg-primary text-on-primary' 
                    : 'bg-transparent text-white/55 hover:bg-white/5 hover:text-white'
                }`}
              >{t.label}</button>
            ))}
          </div>

          {/* Right panel Content area */}
          <div className="lg:col-span-3">

            {/* 1. PORTFOLIO TAB */}
            {activeTab === 'portfolio' && !editingProject && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-syne font-bold text-2xl text-white">Portfolio Projects</h2>
                  <button onClick={initNewProject} className="btn-primary py-2.5 px-5 text-xs uppercase tracking-wider flex items-center gap-2"><PlusIcon /> Add Project</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.map(p => (
                    <div key={p.id} className="bg-[#111] border border-white/8 p-5 flex flex-col justify-between h-40">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <span className="bg-primary text-on-primary text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">{p.category}</span>
                          <span className="text-white/30 text-[9px] uppercase tracking-wider">{p.industry}</span>
                        </div>
                        <h3 className="font-bold text-base text-white line-clamp-1">{p.title}</h3>
                        <p className="text-white/40 text-xs line-clamp-2 mt-1.5">{p.shortDescription}</p>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <button onClick={() => startEditProject(p)} className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1.5"><EditIcon /> Edit</button>
                        <button onClick={() => handleDeleteProject(p.id)} className="text-xs font-bold uppercase tracking-wider text-red-500 hover:underline flex items-center gap-1.5"><TrashIcon /> Delete</button>
                      </div>
                    </div>
                  ))}
                  {portfolio.length === 0 && (
                    <p className="col-span-2 text-center text-white/30 py-12 border border-dashed border-white/10">No projects yet. Click Add Project to start.</p>
                  )}
                </div>
              </div>
            )}

            {/* 1b. EDIT/NEW PORTFOLIO PROJECT */}
            {editingProject && (
              <div className="space-y-8 bg-[#111] border border-white/8 p-8">
                <div className="flex justify-between items-center pb-4 border-b border-white/8">
                  <h2 className="font-syne font-bold text-xl text-white">{editingProject === 'new' ? 'New Portfolio Project' : 'Edit Portfolio Project'}</h2>
                  <button onClick={() => setEditingProject(null)} className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white">Cancel</button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-6">
                  {/* Basic settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Project Title</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={projectForm.title} 
                        onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select" 
                        value={projectForm.category} 
                        onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Industry</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={projectForm.industry} 
                        onChange={e => setProjectForm({ ...projectForm, industry: e.target.value })} 
                        required 
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Badge Label</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={projectForm.badge} 
                        onChange={e => setProjectForm({ ...projectForm, badge: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Short Description</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={projectForm.shortDescription} 
                      onChange={e => setProjectForm({ ...projectForm, shortDescription: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Thumbnail Background (Tailwind Class)</label>
                      <select 
                        className="form-select" 
                        value={projectForm.thumbnailBg} 
                        onChange={e => setProjectForm({ ...projectForm, thumbnailBg: e.target.value })}
                      >
                        {colors.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    {/* THUMBNAIL IMAGE */}
                    <div className="form-field">
                      <div className="flex justify-between items-baseline mb-1">
                        <label className="form-label mb-0 font-bold text-[10px] text-white/70">1. Grid Thumbnail Image</label>
                        <span className="text-[8px] text-primary font-semibold uppercase">Rec: 1:1 Square</span>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="thumbnailImageInput" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, 'imageUrl')} 
                        />
                        <label 
                          htmlFor="thumbnailImageInput" 
                          className="border border-dashed border-white/20 hover:border-white/50 text-white/50 hover:text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                        >Choose Image</label>
                        {projectForm.imageUrl && (
                          <>
                            <div className="w-12 h-12 border border-white/10 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${projectForm.imageUrl})` }}></div>
                            <button 
                              type="button" 
                              onClick={() => setProjectForm({ ...projectForm, imageUrl: "" })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                      <input 
                        type="text" 
                        className="form-input mt-2 text-xs" 
                        placeholder="Or paste thumbnail URL" 
                        value={projectForm.imageUrl || ''} 
                        onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })} 
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <label className="text-[8px] font-bold text-white/40 uppercase">Thumbnail Fit</label>
                        <select 
                          className="form-select text-[11px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-32"
                          value={projectForm.thumbnailFit || 'cover'} 
                          onChange={e => setProjectForm({ ...projectForm, thumbnailFit: e.target.value })}
                        >
                          <option value="cover">Cover (Fill)</option>
                          <option value="contain">Contain (Fit)</option>
                        </select>
                      </div>
                    </div>

                    {/* CASE STUDY BANNER */}
                    <div className="form-field">
                      <div className="flex justify-between items-baseline mb-1">
                        <label className="form-label mb-0 font-bold text-[10px] text-white/70">2. Case Study Banner Image</label>
                        <span className="text-[8px] text-primary font-semibold uppercase">Rec: 16:9 Landscape</span>
                      </div>
                      <div className="flex gap-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="bannerImageInput" 
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, 'bannerUrl')} 
                        />
                        <label 
                          htmlFor="bannerImageInput" 
                          className="border border-dashed border-white/20 hover:border-white/50 text-white/50 hover:text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                        >Choose Image</label>
                        {projectForm.bannerUrl && (
                          <>
                            <div className="w-12 h-12 border border-white/10 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${projectForm.bannerUrl})` }}></div>
                            <button 
                              type="button" 
                              onClick={() => setProjectForm({ ...projectForm, bannerUrl: "" })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                      <input 
                        type="text" 
                        className="form-input mt-2 text-xs" 
                        placeholder="Or paste banner URL" 
                        value={projectForm.bannerUrl || ''} 
                        onChange={e => setProjectForm({ ...projectForm, bannerUrl: e.target.value })} 
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <label className="text-[8px] font-bold text-white/40 uppercase">Banner Fit</label>
                        <select 
                          className="form-select text-[11px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-32"
                          value={projectForm.bannerFit || 'cover'} 
                          onChange={e => setProjectForm({ ...projectForm, bannerFit: e.target.value })}
                        >
                          <option value="cover">Cover (Crop)</option>
                          <option value="contain">Contain (Fit)</option>
                          <option value="original">Original (Full)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Case Study Details */}
                  <h3 className="font-syne font-bold text-sm text-primary uppercase tracking-wider pt-6 border-t border-white/5">Case Study Details</h3>

                  <div className="form-field">
                    <label className="form-label">Challenge</label>
                    <textarea 
                      rows="4" 
                      className="form-input resize-none" 
                      value={projectForm.caseStudy.challenge} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, challenge: e.target.value } })} 
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Objective</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={projectForm.caseStudy.objective} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, objective: e.target.value } })} 
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Creative Strategy</label>
                    <textarea 
                      rows="4" 
                      className="form-input resize-none" 
                      value={projectForm.caseStudy.creativeStrategy} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, creativeStrategy: e.target.value } })} 
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Creative Direction</label>
                    <textarea 
                      rows="4" 
                      className="form-input resize-none" 
                      value={projectForm.caseStudy.creativeDirection} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, creativeDirection: e.target.value } })} 
                    />
                  </div>

                  {/* Final Designs list builder */}
                  <div className="form-field">
                    <label className="form-label">Final Designs (One per line)</label>
                    <textarea
                      rows="4"
                      className="form-input resize-none"
                      placeholder="Line 1: High quality product shot&#10;Line 2: Story motion graphic"
                      value={projectForm.caseStudy.finalDesigns.join('\n')}
                      onChange={e => setProjectForm({
                        ...projectForm,
                        caseStudy: {
                          ...projectForm.caseStudy,
                          finalDesigns: e.target.value.split('\n')
                        }
                      })}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Creative Variations</label>
                    <textarea 
                      rows="3" 
                      className="form-input resize-none" 
                      value={projectForm.caseStudy.creativeVariations} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, creativeVariations: e.target.value } })} 
                    />
                  </div>

                  <div className="form-field bg-[#1c1c1c] p-6 border-l-2 border-primary">
                    <label className="form-label text-primary">Outcome</label>
                    <input 
                      type="text" 
                      className="form-input bg-[#0d0d0d] mt-2 border-white/10" 
                      value={projectForm.caseStudy.outcome} 
                      onChange={e => setProjectForm({ ...projectForm, caseStudy: { ...projectForm.caseStudy, outcome: e.target.value } })} 
                    />
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-white/5">
                    <button type="submit" className="btn-primary px-8 py-3.5 text-xs uppercase tracking-wider flex-1">Save Project</button>
                    <button type="button" onClick={() => setEditingProject(null)} className="border border-white/15 hover:bg-white/5 text-white px-8 py-3.5 text-xs uppercase tracking-wider">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. SETTINGS TAB */}
            {activeTab === 'settings' && settings && (
              <div className="space-y-8 bg-[#111] border border-white/8 p-8">
                <h2 className="font-syne font-bold text-xl text-white border-b border-white/8 pb-4">Edit Site Settings</h2>
                
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Branding and Logo */}
                  <h3 className="font-syne font-bold text-xs text-primary uppercase tracking-wider">Website Branding & Logo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                    <div className="form-field">
                      <label className="form-label">Brand Theme Color</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="color" 
                          className="w-12 h-10 border border-white/10 bg-transparent cursor-pointer p-0"
                          value={settings.brandColor || '#C8FF00'} 
                          onChange={e => setSettings({ ...settings, brandColor: e.target.value })} 
                        />
                        <input 
                          type="text" 
                          className="form-input flex-1"
                          placeholder="#C8FF00"
                          value={settings.brandColor || '#C8FF00'} 
                          onChange={e => setSettings({ ...settings, brandColor: e.target.value })} 
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label">Logo Upload</label>
                      <div className="flex gap-4">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="logoUploadInput" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({ ...prev, logo: data.url }));
                            })
                            .catch(err => alert(err.message));
                          }}
                        />
                        <label 
                          htmlFor="logoUploadInput" 
                          className="border border-dashed border-white/20 hover:border-white/50 text-white/50 hover:text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                        >Choose Logo</label>
                        {settings.logo && (
                          <div className="w-12 h-12 border border-white/10 shrink-0 bg-[#111] p-1 flex items-center justify-center">
                            <img src={settings.logo} className="max-w-full max-h-full object-contain" alt="Logo preview" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-syne font-bold text-xs text-primary uppercase tracking-wider">Hero Section Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Hero Eyebrow</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={settings.hero?.eyebrow || ''} 
                        onChange={e => setSettings({ ...settings, hero: { ...settings.hero, eyebrow: e.target.value } })}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Primary H1 Headline</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={settings.hero?.headline || ''} 
                        onChange={e => setSettings({ ...settings, hero: { ...settings.hero, headline: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Hero Subheading</label>
                    <textarea 
                      rows="3" 
                      className="form-input resize-none" 
                      value={settings.hero?.subheading || ''} 
                      onChange={e => setSettings({ ...settings, hero: { ...settings.hero, subheading: e.target.value } })}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-syne font-bold text-xs text-primary uppercase tracking-wider">Custom Hero Mockups / Images (Optional)</h4>
                    <p className="text-[10px] text-white/30">Upload custom images to replace the default code mockups. Leave empty to use the default code visual.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* SLOT 1 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">1. Meta Ads Card</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 1:1 Square</span>
                        </div>
                        <div className="aspect-[4/3] bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.hero?.image1 ? (
                            <>
                              <img src={settings.hero.image1} className={`w-full h-full ${settings.hero.image1Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Meta Slot" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image1: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Card</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="heroImageInput1" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                hero: { ...prev.hero, image1: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="heroImageInput1" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.hero?.image1 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image1: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.hero?.image1Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, hero: { ...settings.hero, image1Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                            <option value="original">Original Ratio (No Crop)</option>
                          </select>
                        </div>
                      </div>

                      {/* SLOT 2 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">2. E-Commerce Card</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 1:1 Square</span>
                        </div>
                        <div className="aspect-[4/3] bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.hero?.image2 ? (
                            <>
                              <img src={settings.hero.image2} className={`w-full h-full ${settings.hero.image2Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Ecom Slot" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image2: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Card</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="heroImageInput2" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                hero: { ...prev.hero, image2: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="heroImageInput2" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.hero?.image2 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image2: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.hero?.image2Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, hero: { ...settings.hero, image2Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                            <option value="original">Original Ratio (No Crop)</option>
                          </select>
                        </div>
                      </div>

                      {/* SLOT 3 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">3. Featured Concept Card</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 16:9 / 21:9</span>
                        </div>
                        <div className="aspect-[4/3] bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.hero?.image3 ? (
                            <>
                              <img src={settings.hero.image3} className={`w-full h-full ${settings.hero.image3Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Featured Slot" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image3: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Card</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="heroImageInput3" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                hero: { ...prev.hero, image3: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="heroImageInput3" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.hero?.image3 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, hero: { ...settings.hero, image3: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.hero?.image3Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, hero: { ...settings.hero, image3Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                            <option value="original">Original Ratio (No Crop)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spotlight custom visual uploads */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="font-syne font-bold text-xs text-primary uppercase tracking-wider">Spotlight Case Study Mockups / Images (Optional)</h4>
                    <p className="text-[10px] text-white/30">Upload custom images to replace the default code mockups in the Spotlight Case Study section. Leave empty to use default visuals.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* SPOTLIGHT SLOT 1 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">1. Story Format (Left)</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 9:16 vertical</span>
                        </div>
                        <div className="aspect-[9/16] bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.spotlight?.image1 ? (
                            <>
                              <img src={settings.spotlight.image1} className={`w-full h-full ${settings.spotlight.image1Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Spotlight Story" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image1: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Story visual</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="spotlightImageInput1" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                spotlight: { ...prev.spotlight, image1: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="spotlightImageInput1" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.spotlight?.image1 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image1: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.spotlight?.image1Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, spotlight: { ...settings.spotlight, image1Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                          </select>
                        </div>
                      </div>

                      {/* SPOTLIGHT SLOT 2 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">2. Square format (Right Top)</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 1:1 Square</span>
                        </div>
                        <div className="aspect-square bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.spotlight?.image2 ? (
                            <>
                              <img src={settings.spotlight.image2} className={`w-full h-full ${settings.spotlight.image2Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Spotlight Square" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image2: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Square visual</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="spotlightImageInput2" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                spotlight: { ...prev.spotlight, image2: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="spotlightImageInput2" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.spotlight?.image2 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image2: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.spotlight?.image2Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, spotlight: { ...settings.spotlight, image2Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                          </select>
                        </div>
                      </div>

                      {/* SPOTLIGHT SLOT 3 */}
                      <div className="bg-[#171717] border border-white/5 p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold tracking-[0.2em] text-primary uppercase">3. Feed Video / Landscape (Right Bottom)</span>
                          <span className="text-[8px] text-white/40 uppercase font-semibold">Rec: 16:9 Landscape</span>
                        </div>
                        <div className="aspect-[16/9] bg-[#0d0d0d] border border-white/5 overflow-hidden flex items-center justify-center relative group">
                          {settings.spotlight?.image3 ? (
                            <>
                              <img src={settings.spotlight.image3} className={`w-full h-full ${settings.spotlight.image3Fit === 'contain' ? 'object-contain' : 'object-cover'}`} alt="Spotlight Feed" />
                              <button 
                                type="button"
                                onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image3: "" } })}
                                className="absolute inset-0 bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-white/20">Default Feed visual</span>
                          )}
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="spotlightImageInput3" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            fetch('/api/upload', {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` },
                              body: formData
                            })
                            .then(async res => {
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Upload failed');
                              setSettings(prev => ({
                                ...prev,
                                spotlight: { ...prev.spotlight, image3: data.url }
                              }));
                            })
                            .catch(err => alert(err.message));
                          }} 
                        />
                        <div className="flex gap-2">
                          <label 
                            htmlFor="spotlightImageInput3" 
                            className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex-1 text-center cursor-pointer transition-colors"
                          >
                            Choose Image
                          </label>
                          {settings.spotlight?.image3 && (
                            <button 
                              type="button" 
                              onClick={() => setSettings({ ...settings, spotlight: { ...settings.spotlight, image3: "" } })}
                              className="border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-500 px-3 py-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-2">
                          <label className="text-[8px] font-bold tracking-wider text-white/40 uppercase block mb-1">Image Fit Style</label>
                          <select 
                            className="form-select text-[10px] py-1 px-2 border-white/10 bg-[#0d0d0d] text-white/80 w-full"
                            value={settings.spotlight?.image3Fit || 'cover'} 
                            onChange={e => setSettings({ ...settings, spotlight: { ...settings.spotlight, image3Fit: e.target.value } })}
                          >
                            <option value="cover">Auto Crop & Fill (Cover)</option>
                            <option value="contain">Fit Entire Image (Contain)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-syne font-bold text-xs text-primary uppercase tracking-wider pt-6 border-t border-white/5">Contact Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={settings.contact?.email || ''} 
                        onChange={e => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Location</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={settings.contact?.location || ''} 
                        onChange={e => setSettings({ ...settings, contact: { ...settings.contact, location: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-field">
                      <label className="form-label">Availability Status</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={settings.contact?.availability || ''} 
                        onChange={e => setSettings({ ...settings, contact: { ...settings.contact, availability: e.target.value } })}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">WhatsApp Number</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={settings.contact?.whatsapp || ''} 
                        onChange={e => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })}
                        placeholder="Include country code (e.g. +88017...)"
                      />
                    </div>
                  </div>

                  <h3 className="font-syne font-bold text-xs text-primary uppercase tracking-wider pt-6 border-t border-white/5">SEO settings</h3>
                  <div className="form-field">
                    <label className="form-label">Meta Description</label>
                    <textarea 
                      rows="3" 
                      className="form-input resize-none" 
                      value={settings.seo?.description || ''} 
                      onChange={e => setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-xs tracking-wider uppercase">Save Settings</button>
                </form>
              </div>
            )}

            {/* 3. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                
                {/* Form to add testimonial */}
                <div className="bg-[#111] border border-white/8 p-8">
                  <h2 className="font-syne font-bold text-xl text-white border-b border-white/8 pb-4 mb-6">Add Testimonial</h2>
                  <form onSubmit={handleAddTestimonial} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="form-field">
                        <label className="form-label">Client Name</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. John Doe"
                          value={testimonialForm.clientName} 
                          onChange={e => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })} 
                          required 
                        />
                      </div>
                      <div className="form-field">
                        <label className="form-label">Client Company / Brand</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="e.g. Shopify Apparel Co"
                          value={testimonialForm.clientCompany} 
                          onChange={e => setTestimonialForm({ ...testimonialForm, clientCompany: e.target.value })} 
                        />
                      </div>
                    </div>
                    
                    <div className="form-field">
                      <label className="form-label">Client Quote</label>
                      <textarea 
                        rows="3" 
                        className="form-input resize-none" 
                        placeholder="Write testimonial quote here..."
                        value={testimonialForm.quote} 
                        onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} 
                        required 
                      />
                    </div>
                    
                    <button type="submit" className="btn-primary py-3 w-full text-xs uppercase tracking-wider">Save Testimonial</button>
                  </form>
                </div>

                {/* List of testimonials */}
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg text-white">Manage Testimonials</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {testimonials.map(t => (
                      <div key={t.id} className="bg-[#111] border border-white/8 p-6 flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white/60 italic text-sm mb-3">"{t.quote}"</p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{t.clientName}</span>
                            <span className="text-white/30 text-xs">|</span>
                            <span className="text-primary text-xs font-bold">{t.clientCompany}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteTestimonial(t.id)} 
                          className="text-red-500 hover:text-red-400 p-2 border border-white/10 hover:border-red-500/20 bg-transparent transition-colors ml-4 shrink-0"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    {testimonials.length === 0 && (
                      <p className="text-center text-white/30 py-8 border border-dashed border-white/10">No testimonials added yet.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
