import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  Layout, User, FileText, Globe, Settings, LogOut, ArrowRight, CheckCircle, 
  Sparkles, Layers, Sliders, Play, Download, Search, Heart, Briefcase, Eye, ChevronRight,
  Server, Cpu, Smartphone, Shield
} from 'lucide-react';
import API from './services/api';
import TemplateRenderer from './components/TemplateRenderer';

// Common Navigation / Layout wrapper for authenticated dashboard
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Overview', icon: Layers },
    { path: '/builder', label: 'Portfolio Builder', icon: Globe },
    { path: '/analyzer', label: 'Resume Analyzer', icon: FileText },
    { path: '/showcase', label: 'Community Showcase', icon: Eye },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Control', icon: Shield });
  }

  return (
    <div className="flex min-h-screen bg-dark-bg text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-dark-border flex flex-col z-20">
        <div className="p-6 border-b border-dark-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center font-display font-bold text-white text-xl">
            D
          </div>
          <span className="font-display font-bold text-xl text-gradient">DevLaunch</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-200 text-dark-bg flex items-center justify-center font-bold text-xs uppercase">
                {user ? user.username.slice(0, 2) : 'DV'}
              </div>
              <div className="truncate w-28">
                <p className="text-xs font-semibold truncate">{user ? user.username : 'Developer'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user ? user.email : 'dev@devlaunch.com'}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-dark-border px-8 flex items-center justify-between glass z-10 sticky top-0">
          <h2 className="font-display font-semibold text-lg">
            {navItems.find(item => item.path === location.pathname)?.label || 'DevLaunch'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded bg-brand-500/20 text-brand-200 border border-brand-500/30">
              MVP Preview
            </span>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route Guard Wrapper
const OnboardingPage = () => {
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rolesList = [
    { id: 'frontend', title: 'Frontend Developer', desc: 'Focus on UI, UX, interactive features, design systems, and animations.', icon: Globe, color: 'text-brand-500 bg-brand-500/10 border-brand-500/20' },
    { id: 'backend', title: 'Backend Developer', desc: 'Build APIs, database query patterns, server engines, security, and integrations.', icon: Server, color: 'text-accent-500 bg-accent-500/10 border-accent-500/20' },
    { id: 'fullstack', title: 'Full Stack Developer', desc: 'Work across the entire stack—designing frontend UI and backend architecture.', icon: Sparkles, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { id: 'ai-ml', title: 'AI / ML Engineer', desc: 'Integrate LLMs, neural networks, neural architectures, data analysis, and pipelines.', icon: Cpu, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { id: 'mobile', title: 'Mobile Developer', desc: 'Build native and cross-platform apps for iOS and Android environments.', icon: Smartphone, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { id: 'devops', title: 'DevOps Engineer', desc: 'Automate build operations, containerization, deployments, and cloud architectures.', icon: Settings, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  const handleLaunch = async () => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      const response = await API.put('/user/role', { developerRole: selectedRole });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full glass p-8 lg:p-12 rounded-3xl border-glow space-y-8 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200">
            <Sparkles size={14} className="text-accent-500 animate-pulse" />
            Developer Branding Profile Onboarding
          </div>
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-white">Choose Your Primary Track</h2>
          <p className="text-sm text-gray-400">
            DevLaunch tailmarks templates, resume checklists, and community showcase filters depending on your selected track.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rolesList.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-2xl border text-left flex flex-col justify-between transition-all h-52 relative group ${
                  isSelected 
                    ? 'border-brand-500 bg-brand-500/5 shadow-lg shadow-brand-500/10' 
                    : 'border-dark-border bg-white/5 hover:bg-white/10 hover:border-gray-500'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 border ${role.color}`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-display font-bold text-white text-md mb-2">{role.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{role.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute right-4 top-4 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-6 border-t border-dark-border flex items-center justify-between">
          <div className="text-xs text-gray-400">
            You can always change your developer track in settings later.
          </div>
          <button
            onClick={handleLaunch}
            disabled={!selectedRole || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              selectedRole && !isSubmitting
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:translate-x-1 duration-200'
                : 'bg-white/5 text-gray-500 border border-dark-border cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Launching...' : 'Launch Dashboard'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Protected Route Guard Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  // If no user, redirect to landing/login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Onboarding guard redirect
  if (user.developerRole === 'none') {
    return <OnboardingPage />;
  }

  return children;
};

// Pages
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center font-display font-bold text-white text-2xl">
            D
          </div>
          <span className="font-display font-bold text-2xl text-gradient">DevLaunch</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 flex flex-col lg:flex-row items-center gap-16 justify-center">
        <div className="flex-1 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-dark-border text-xs text-brand-200">
            <Sparkles size={14} className="text-accent-500 animate-pulse" />
            Empowering students to stand out
          </div>
          <h1 className="font-display font-extrabold text-5xl lg:text-7xl leading-tight text-white tracking-tight">
            Build a <span className="text-gradient">Stunning Portfolio</span> and ATS-Proof Resume
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            DevLaunch is the Developer Branding Platform built for placements. Launch high-fidelity portfolio websites, analyze resumes instantly, and stand out to recruiters.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/signup" className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all hover:translate-x-1 duration-200">
              Create Your Account <ArrowRight size={18} />
            </Link>
            <Link to="/showcase" className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-dark-border font-semibold transition-all">
              Explore Showcase
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid (visual wow factor) */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-2xl border-glow flex flex-col justify-between h-64">
            <div>
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">No-Code Portfolio Builder</h3>
              <p className="text-xs text-gray-400">Choose professional developer templates, customize theme colors, ordering and fonts in real-time.</p>
            </div>
            <span className="text-xs text-brand-500 font-semibold inline-flex items-center gap-1">JSON-driven layouts <Sparkles size={12} /></span>
          </div>

          <div className="glass p-8 rounded-2xl border-glow flex flex-col justify-between h-64">
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 text-accent-500 flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">ATS Resume Analyzer</h3>
              <p className="text-xs text-gray-400">Upload PDF resume, evaluate structure and keywords. Get Gemini AI recommendations for enhancements.</p>
            </div>
            <span className="text-xs text-accent-500 font-semibold inline-flex items-center gap-1">Rule-based + AI feedback <Sparkles size={12} /></span>
          </div>

          <div className="glass p-8 rounded-2xl border-glow flex flex-col justify-between h-64">
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center mb-6">
                <Layers size={24} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Use as Template</h3>
              <p className="text-xs text-gray-400">Instantly clone design architectures, section formats, and themes from other portfolios with one click.</p>
            </div>
            <span className="text-xs text-green-400 font-semibold inline-flex items-center gap-1">Zero info leaks <Sparkles size={12} /></span>
          </div>

          <div className="glass p-8 rounded-2xl border-glow flex flex-col justify-between h-64">
            <div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-6">
                <Download size={24} />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Full Code Export</h3>
              <p className="text-xs text-gray-400">Export clean, structured Vite + React + Tailwind template source code in a ZIP bundle.</p>
            </div>
            <span className="text-xs text-yellow-400 font-semibold inline-flex items-center gap-1">100% self-hosted ready <Sparkles size={12} /></span>
          </div>
        </div>
      </section>
    </div>
  );
};

const LoginPage = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ success: true, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (!res.success) {
      setStatus({ success: false, message: res.error });
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-6">
      <div className="w-full max-w-md glass p-8 rounded-2xl border-glow space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto">
            D
          </div>
          <h2 className="font-display font-bold text-2xl text-white">Welcome back</h2>
          <p className="text-xs text-gray-400">Enter your credentials to manage your developer brand</p>
        </div>

        {status.message && (
          <div className={`p-3 rounded-lg text-xs border ${status.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" 
              placeholder="you@example.com" 
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" 
              placeholder="••••••••" 
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-500/15"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Don't have an account? <Link to="/signup" className="text-brand-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const { user, signup } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ success: true, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signup(username, email, password);
    if (!res.success) {
      setStatus({ success: false, message: res.error });
    }
  };

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-6">
      <div className="w-full max-w-md glass p-8 rounded-2xl border-glow space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center font-display font-bold text-white text-2xl mx-auto">
            D
          </div>
          <h2 className="font-display font-bold text-2xl text-white">Create Account</h2>
          <p className="text-xs text-gray-400">Launch your professional portfolio builder</p>
        </div>

        {status.message && (
          <div className={`p-3 rounded-lg text-xs border ${status.success ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" 
              placeholder="alexdev" 
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" 
              placeholder="alex@example.com" 
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-500 transition-colors" 
              placeholder="••••••••" 
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-brand-500/15"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center">
          Already have an account? <Link to="/login" className="text-brand-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState({ score: 0, checks: {}, counts: {} });
  const [portfolio, setPortfolio] = useState(null);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [scoreRes, portRes, resumeRes] = await Promise.all([
        API.get('/portfolio/score'),
        API.get('/portfolio/me'),
        API.get('/resume/history')
      ]);
      setScoreData(scoreRes.data.data);
      setPortfolio(portRes.data.data);
      setResumeHistory(resumeRes.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const roleDisplayNames = {
    frontend: 'Frontend Developer',
    backend: 'Backend Developer',
    fullstack: 'Full Stack Developer',
    'ai-ml': 'AI/ML Engineer',
    mobile: 'Mobile Developer',
    devops: 'DevOps Engineer',
    none: 'Developer'
  };

  const roleName = user?.developerRole ? roleDisplayNames[user.developerRole] : 'Developer';

  const getActionableSteps = () => {
    const steps = [];
    const { checks } = scoreData;

    if (!user?.developerRole || user.developerRole === 'none') {
      steps.push({
        text: 'Set your targeted developer role in settings to unlock customized templates',
        status: 'Pending',
        color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
      });
    }

    if (!checks.hasGithub) {
      steps.push({
        text: 'Add your GitHub profile URL in the About section of the Builder to showcase code repositories (+15 pts)',
        status: 'Recommended',
        color: 'text-brand-400 border-brand-500/20 bg-brand-500/5'
      });
    }

    if (!checks.hasLinkedin) {
      steps.push({
        text: 'Add your LinkedIn profile URL in the About section of the Builder for professional networking (+15 pts)',
        status: 'Recommended',
        color: 'text-brand-400 border-brand-500/20 bg-brand-500/5'
      });
    }

    if (!checks.hasProjects) {
      steps.push({
        text: `Add at least 2 featured project cards in the Builder to demonstrate hands-on placement readiness (+15 pts, currently: ${scoreData.counts?.projects || 0})`,
        status: 'Action Required',
        color: 'text-red-400 border-red-500/20 bg-red-500/5'
      });
    }

    if (!checks.hasExperience) {
      steps.push({
        text: 'Add at least 1 job experience entry in the Builder to outline your professional history (+10 pts)',
        status: 'Recommended',
        color: 'text-brand-400 border-brand-500/20 bg-brand-500/5'
      });
    }

    if (!checks.hasSkills) {
      steps.push({
        text: 'Add at least 1 skill category with core technologies in the Builder (+10 pts)',
        status: 'Recommended',
        color: 'text-brand-400 border-brand-500/20 bg-brand-500/5'
      });
    }

    if (steps.length === 0) {
      steps.push({
        text: '🎉 Outstanding job! Your developer portfolio achieves a 100/100 profile strength score and is fully ready for placement!',
        status: 'Completed',
        color: 'text-green-400 border-green-500/20 bg-green-500/5'
      });
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  const stepsList = getActionableSteps();

  return (
    <div className="space-y-8 text-left">
      {/* Header Panel */}
      <div className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 font-semibold uppercase tracking-wider font-sans">
            {roleName} Track
          </div>
          <h3 className="font-display font-bold text-2xl lg:text-3xl text-white">
            Welcome back, {user ? user.username : 'Developer'}!
          </h3>
          <p className="text-xs text-gray-400 max-w-xl">
            Track your profile scores, build templates recommendation pathways, or analyze resume ATS layouts.
          </p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-dark-border text-gray-300 font-medium font-sans">
          Role: <strong className="text-white capitalize">{user?.developerRole || 'none'}</strong>
        </span>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1: Portfolio Status */}
        <div className="glass p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Portfolio Status</p>
            <h4 className={`text-xl font-bold ${portfolio?.isPublished ? 'text-green-400' : 'text-yellow-400'}`}>
              {portfolio ? (portfolio.isPublished ? 'Published' : 'Draft') : 'Not Started'}
            </h4>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${portfolio?.isPublished ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
            <Globe size={20} />
          </div>
        </div>

        {/* Stat 2: Resume History Count */}
        <div className="glass p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Resume Analyses</p>
            <h4 className="text-xl font-bold text-green-400 font-sans">
              {resumeHistory.length} Scanned
            </h4>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center">
            <FileText size={20} />
          </div>
        </div>

        {/* Stat 3: Profile Strength Score */}
        <div className="glass p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-1">Profile Strength Score</p>
            <h4 className={`text-xl font-bold ${
              scoreData.score >= 80 ? 'text-green-400 font-sans' :
              scoreData.score >= 50 ? 'text-yellow-400 font-sans' : 'text-red-400 font-sans'
            }`}>
              {scoreData.score || 0}/100
            </h4>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            scoreData.score >= 80 ? 'bg-green-500/10 text-green-400' :
            scoreData.score >= 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
          }`}>
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Recommended steps */}
      <div className="space-y-4">
        <h4 className="font-display font-semibold text-lg text-white">Next Steps for Placement Readiness</h4>
        <div className="space-y-3">
          {stepsList.map((step, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${step.color}`}>
              <span className="text-xs font-semibold text-gray-200">{step.text}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-white/10 border border-white/5 shrink-0 self-start sm:self-auto font-sans">
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BuilderPage = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // content, style, layout, template
  const [activeSectionEdit, setActiveSectionEdit] = useState('hero'); // hero, about, skills, projects, experience, contact, footer
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Preset Colors for Quick Selection
  const colorPresets = [
    { primary: '#6366f1', secondary: '#a855f7', label: 'Indigo / Purple' },
    { primary: '#10b981', secondary: '#3b82f6', label: 'Emerald / Blue' },
    { primary: '#f59e0b', secondary: '#ef4444', label: 'Amber / Red' },
    { primary: '#ec4899', secondary: '#8b5cf6', label: 'Pink / Violet' },
    { primary: '#06b6d4', secondary: '#10b981', label: 'Cyan / Emerald' }
  ];

  useEffect(() => {
    const loadBuilderData = async () => {
      try {
        const [portResponse, tempResponse] = await Promise.all([
          API.get('/portfolio/me'),
          API.get('/portfolio/templates')
        ]);
        setPortfolio(portResponse.data.data);
        setTemplates(tempResponse.data.data);
      } catch (err) {
        console.error('Error loading builder data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBuilderData();
  }, []);

  const handleInitialize = async (templateId) => {
    setLoading(true);
    try {
      const response = await API.post('/portfolio/initialize', { templateId });
      setPortfolio(response.data.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to initialize portfolio.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const response = await API.put('/portfolio/save', {
        portfolioId: portfolio._id,
        title: portfolio.title,
        theme: portfolio.theme,
        sections: portfolio.sections
      });
      setPortfolio(response.data.data);
      setSaveMessage('Draft saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const response = await API.put('/portfolio/publish', {
        portfolioId: portfolio._id,
        isPublished: !portfolio.isPublished
      });
      setPortfolio({ ...portfolio, isPublished: response.data.data.isPublished });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExportCode = async () => {
    try {
      const response = await API.get('/portfolio/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'devlaunch-portfolio-source.zip');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to export portfolio source code.');
    }
  };

  const updateTheme = (key, value) => {
    setPortfolio({
      ...portfolio,
      theme: {
        ...portfolio.theme,
        [key]: value
      }
    });
  };

  const applyPreset = (preset) => {
    setPortfolio({
      ...portfolio,
      theme: {
        ...portfolio.theme,
        primary: preset.primary,
        secondary: preset.secondary
      }
    });
  };

  const toggleSectionVisible = (index) => {
    const newSections = [...portfolio.sections];
    newSections[index].visible = !newSections[index].visible;
    setPortfolio({ ...portfolio, sections: newSections });
  };

  const moveSection = (index, direction) => {
    const newSections = [...portfolio.sections];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap order property
    const tempOrder = newSections[index].order;
    newSections[index].order = newSections[targetIndex].order;
    newSections[targetIndex].order = tempOrder;

    // Swap position in array
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setPortfolio({ ...portfolio, sections: newSections });
  };

  const updateSectionContent = (sectionName, key, value) => {
    const newSections = portfolio.sections.map(s => {
      if (s.name === sectionName) {
        return {
          ...s,
          content: {
            ...s.content,
            [key]: value
          }
        };
      }
      return s;
    });
    setPortfolio({ ...portfolio, sections: newSections });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  // 1. RENDER PORTFOLIO INITIALIZER SELECTOR
  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        <div className="glass p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10"></div>
          <h3 className="font-display font-extrabold text-2xl text-white mb-2">Initialize Your Developer Portfolio</h3>
          <p className="text-sm text-gray-400">
            Choose a design layout to begin branding your developer profile. We recommend templates matching your onboarding developer track.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((tpl) => {
            const isRecommended = tpl.recommendedRoles.includes(user?.developerRole);
            return (
              <div 
                key={tpl._id} 
                className={`glass p-8 rounded-2xl border flex flex-col justify-between h-72 relative group hover:-translate-y-1 transition-all duration-300 ${
                  isRecommended ? 'border-brand-500/50 shadow-lg shadow-brand-500/5' : 'border-dark-border'
                }`}
              >
                {isRecommended && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-200 border border-brand-500/30">
                    Recommended Track
                  </span>
                )}
                <div>
                  <h4 className="font-display font-bold text-white text-lg mb-2 capitalize">{tpl.displayName}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">{tpl.description}</p>
                </div>
                <button 
                  onClick={() => handleInitialize(tpl._id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 transition-all"
                >
                  Choose Layout <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Helper values for content form checks
  const heroSection = portfolio.sections.find(s => s.name === 'hero');
  const aboutSection = portfolio.sections.find(s => s.name === 'about');
  const skillsSection = portfolio.sections.find(s => s.name === 'skills');
  const projectsSection = portfolio.sections.find(s => s.name === 'projects');
  const experienceSection = portfolio.sections.find(s => s.name === 'experience');
  const contactSection = portfolio.sections.find(s => s.name === 'contact');
  const footerSection = portfolio.sections.find(s => s.name === 'footer');

  // 2. RENDER WORKSPACE CUSTOMIZER AND PREVIEW
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-[calc(100vh-10rem)] text-left relative">
      {/* Settings Control Sidebar Workspace */}
      <div className="lg:col-span-2 glass rounded-2xl flex flex-col h-[78vh] overflow-hidden border border-dark-border z-10">
        {/* Customizer Tabs Sub Header */}
        <div className="flex bg-white/5 border-b border-dark-border overflow-x-auto">
          {['content', 'style', 'layout', 'template'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 capitalize text-center ${
                activeTab === tab 
                  ? 'border-brand-500 text-brand-400 bg-white/5' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content screens */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* TAB 1: CONTENT EDITORS */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Content selector */}
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block mb-2">Select Section Content</label>
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.sections.map((sec) => (
                    <button
                      key={sec.name}
                      onClick={() => setActiveSectionEdit(sec.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-colors ${
                        activeSectionEdit === sec.name
                          ? 'bg-brand-600 border-brand-500 text-white'
                          : 'bg-white/5 border-dark-border text-gray-400 hover:text-gray-200 hover:border-gray-500'
                      }`}
                    >
                      {sec.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                {/* 1.1 Hero Section Content Form */}
                {activeSectionEdit === 'hero' && heroSection && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Section Title (Header)</label>
                      <input 
                        type="text"
                        value={heroSection.title}
                        onChange={(e) => {
                          const newSections = portfolio.sections.map(s => s.name === 'hero' ? { ...s, title: e.target.value } : s);
                          setPortfolio({ ...portfolio, sections: newSections });
                        }}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Your Name</label>
                      <input 
                        type="text" 
                        value={heroSection.content.name || ''} 
                        onChange={(e) => updateSectionContent('hero', 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Professional Role Title</label>
                      <input 
                        type="text" 
                        value={heroSection.content.role || ''} 
                        onChange={(e) => updateSectionContent('hero', 'role', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Tagline Description</label>
                      <textarea 
                        value={heroSection.content.tagline || ''} 
                        onChange={(e) => updateSectionContent('hero', 'tagline', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">CTA Button Text</label>
                      <input 
                        type="text" 
                        value={heroSection.content.ctaText || ''} 
                        onChange={(e) => updateSectionContent('hero', 'ctaText', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 1.2 About Section Content Form */}
                {activeSectionEdit === 'about' && aboutSection && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Biography Statement</label>
                      <textarea 
                        value={aboutSection.content.bio || ''} 
                        onChange={(e) => updateSectionContent('about', 'bio', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Avatar Image Link URL</label>
                      <input 
                        type="text" 
                        value={aboutSection.content.avatarUrl || ''} 
                        onChange={(e) => updateSectionContent('about', 'avatarUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">GitHub Link URL</label>
                      <input 
                        type="text" 
                        value={aboutSection.content.github || ''} 
                        onChange={(e) => updateSectionContent('about', 'github', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">LinkedIn Link URL</label>
                      <input 
                        type="text" 
                        value={aboutSection.content.linkedin || ''} 
                        onChange={(e) => updateSectionContent('about', 'linkedin', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 1.3 Skills Section Content Form */}
                {activeSectionEdit === 'skills' && skillsSection && (
                  <div className="space-y-4">
                    {skillsSection.content.categories?.map((cat, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-brand-400">Category {idx + 1} Name</label>
                          <input 
                            type="text"
                            value={cat.name}
                            onChange={(e) => {
                              const newCats = [...skillsSection.content.categories];
                              newCats[idx].name = e.target.value;
                              updateSectionContent('skills', 'categories', newCats);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Skills Tags (comma separated)</label>
                          <textarea 
                            value={cat.items?.join(', ') || ''}
                            onChange={(e) => {
                              const newCats = [...skillsSection.content.categories];
                              newCats[idx].items = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                              updateSectionContent('skills', 'categories', newCats);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1.4 Projects Section Content Form */}
                {activeSectionEdit === 'projects' && projectsSection && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-semibold">Project Cards List</span>
                      <button
                        onClick={() => {
                          const newItems = [...(projectsSection.content.items || [])];
                          newItems.push({ title: 'New Project Title', description: 'Brief description.', link: '', tags: ['HTML', 'JS'] });
                          updateSectionContent('projects', 'items', newItems);
                        }}
                        className="px-2 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-bold text-[10px] transition-colors"
                      >
                        + Add Project
                      </button>
                    </div>

                    {projectsSection.content.items?.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3 relative">
                        <button
                          onClick={() => {
                            const newItems = projectsSection.content.items.filter((_, i) => i !== idx);
                            updateSectionContent('projects', 'items', newItems);
                          }}
                          className="absolute right-3 top-3 text-[10px] text-red-400 hover:text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Project Title</label>
                          <input 
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const newItems = [...projectsSection.content.items];
                              newItems[idx].title = e.target.value;
                              updateSectionContent('projects', 'items', newItems);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Project Description</label>
                          <textarea 
                            value={proj.description}
                            onChange={(e) => {
                              const newItems = [...projectsSection.content.items];
                              newItems[idx].description = e.target.value;
                              updateSectionContent('projects', 'items', newItems);
                            }}
                            rows={2}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none resize-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Project Link URL</label>
                          <input 
                            type="text"
                            value={proj.link}
                            onChange={(e) => {
                              const newItems = [...projectsSection.content.items];
                              newItems[idx].link = e.target.value;
                              updateSectionContent('projects', 'items', newItems);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Tags (comma separated)</label>
                          <input 
                            type="text"
                            value={proj.tags?.join(', ') || ''}
                            onChange={(e) => {
                              const newItems = [...projectsSection.content.items];
                              newItems[idx].tags = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                              updateSectionContent('projects', 'items', newItems);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1.5 Experience Section Content Form */}
                {activeSectionEdit === 'experience' && experienceSection && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-semibold">Experience Cards List</span>
                      <button
                        onClick={() => {
                          const newItems = [...(experienceSection.content.items || [])];
                          newItems.push({ company: 'New Company', role: 'Role Name', duration: 'Jun 2026 - Present', tasks: ['Task 1 details.'] });
                          updateSectionContent('experience', 'items', newItems);
                        }}
                        className="px-2 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-bold text-[10px] transition-colors"
                      >
                        + Add Work
                      </button>
                    </div>

                    {experienceSection.content.items?.map((job, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3 relative">
                        <button
                          onClick={() => {
                            const newItems = experienceSection.content.items.filter((_, i) => i !== idx);
                            updateSectionContent('experience', 'items', newItems);
                          }}
                          className="absolute right-3 top-3 text-[10px] text-red-400 hover:text-red-300 hover:underline"
                        >
                          Delete
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300">Company Name</label>
                            <input 
                              type="text"
                              value={job.company}
                              onChange={(e) => {
                                const newItems = [...experienceSection.content.items];
                                newItems[idx].company = e.target.value;
                                updateSectionContent('experience', 'items', newItems);
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-300">Role Title</label>
                            <input 
                              type="text"
                              value={job.role}
                              onChange={(e) => {
                                const newItems = [...experienceSection.content.items];
                                newItems[idx].role = e.target.value;
                                updateSectionContent('experience', 'items', newItems);
                              }}
                              className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Duration Range</label>
                          <input 
                            type="text"
                            value={job.duration}
                            onChange={(e) => {
                              const newItems = [...experienceSection.content.items];
                              newItems[idx].duration = e.target.value;
                              updateSectionContent('experience', 'items', newItems);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300">Tasks Accomplished (One task per line)</label>
                          <textarea 
                            value={job.tasks?.join('\n') || ''}
                            onChange={(e) => {
                              const newItems = [...experienceSection.content.items];
                              newItems[idx].tasks = e.target.value.split('\n').filter(line => line.trim().length > 0);
                              updateSectionContent('experience', 'items', newItems);
                            }}
                            rows={3}
                            className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 1.6 Contact Section Content Form */}
                {activeSectionEdit === 'contact' && contactSection && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Professional Email Address</label>
                      <input 
                        type="email" 
                        value={contactSection.content.email || ''} 
                        onChange={(e) => updateSectionContent('contact', 'email', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Phone Contact</label>
                      <input 
                        type="text" 
                        value={contactSection.content.phone || ''} 
                        onChange={(e) => updateSectionContent('contact', 'phone', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Geographic Location</label>
                      <input 
                        type="text" 
                        value={contactSection.content.location || ''} 
                        onChange={(e) => updateSectionContent('contact', 'location', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 1.7 Footer Section Content Form */}
                {activeSectionEdit === 'footer' && footerSection && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Footer Copyright Notice</label>
                      <input 
                        type="text" 
                        value={footerSection.content.copyright || ''} 
                        onChange={(e) => updateSectionContent('footer', 'copyright', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: STYLE EDITORS */}
          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Color Presets */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Palette Theme Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="p-2 border border-dark-border hover:border-gray-500 rounded-lg text-[10px] font-medium text-left flex items-center justify-between bg-white/5"
                    >
                      <span>{preset.label}</span>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hex Color Selectors */}
              <div className="space-y-3">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Accent Theme Colors</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-semibold">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={portfolio.theme.primary} 
                        onChange={(e) => updateTheme('primary', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] uppercase">{portfolio.theme.primary}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-semibold">Secondary Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={portfolio.theme.secondary} 
                        onChange={(e) => updateTheme('secondary', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] uppercase">{portfolio.theme.secondary}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-semibold">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={portfolio.theme.background} 
                        onChange={(e) => updateTheme('background', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] uppercase">{portfolio.theme.background}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-semibold">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={portfolio.theme.text} 
                        onChange={(e) => updateTheme('text', e.target.value)}
                        className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] uppercase">{portfolio.theme.text}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Family Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Global Font Family</label>
                <select 
                  value={portfolio.theme.fontFamily}
                  onChange={(e) => updateTheme('fontFamily', e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="Inter, sans-serif" className="bg-dark-bg text-white">Inter (Sans-Serif)</option>
                  <option value="Outfit, sans-serif" className="bg-dark-bg text-white">Outfit (Premium Display)</option>
                  <option value="Fira Code, monospace" className="bg-dark-bg text-white">Fira Code (Monospace)</option>
                  <option value="Consolas, monospace" className="bg-dark-bg text-white">Consolas (Console)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT / SECTION MANAGER */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Drag & Order Layout Sections</label>
              <div className="space-y-2">
                {portfolio.sections.map((sec, idx) => (
                  <div key={sec.name} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={sec.visible} 
                        onChange={() => toggleSectionVisible(idx)}
                        className="w-4 h-4 rounded text-brand-500 border-dark-border cursor-pointer bg-transparent"
                      />
                      <span className="font-semibold text-gray-200 capitalize">{sec.name} ({sec.title})</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => moveSection(idx, -1)}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:border-gray-500 flex items-center justify-center font-bold disabled:opacity-30 disabled:hover:border-white/5"
                      >
                        ↑
                      </button>
                      <button 
                        onClick={() => moveSection(idx, 1)}
                        disabled={idx === portfolio.sections.length - 1}
                        className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:border-gray-500 flex items-center justify-center font-bold disabled:opacity-30 disabled:hover:border-white/5"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEMPLATE SELECTOR */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Switch Portfolio Design Layout</label>
              <div className="space-y-3">
                {templates.map((tpl) => {
                  const isCurrent = portfolio.template?._id === tpl._id || portfolio.template === tpl._id || portfolio.template?.name === tpl.name;
                  const isRecommended = tpl.recommendedRoles.includes(user?.developerRole);
                  return (
                    <button
                      key={tpl._id}
                      onClick={async () => {
                        setPortfolio({
                          ...portfolio,
                          template: tpl
                        });
                        setIsSaving(true);
                        try {
                          const response = await API.put('/portfolio/save', {
                            portfolioId: portfolio._id,
                            templateId: tpl._id
                          });
                          setPortfolio(response.data.data);
                          setSaveMessage('Template switched successfully!');
                          setTimeout(() => setSaveMessage(''), 3000);
                        } catch (err) {
                          console.error(err);
                          alert('Failed to switch template.');
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      className={`w-full p-4 border rounded-xl text-left flex flex-col justify-between transition-all hover:bg-white/5 relative ${
                        isCurrent 
                          ? 'border-brand-500 bg-brand-500/5' 
                          : 'border-white/5 bg-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="font-bold text-xs text-white capitalize">{tpl.displayName}</span>
                        {isRecommended && (
                          <span className="text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-200">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed mt-1.5">{tpl.description}</p>
                      {isCurrent && (
                        <span className="text-[8px] font-bold uppercase tracking-wider text-green-400 mt-2 flex items-center gap-1">
                          ✓ Currently Selected Layout
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Builder bottom triggers (Save Draft, Publish) */}
        <div className="p-4 border-t border-dark-border bg-white/5 flex gap-3 items-center">
          <button 
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button 
            onClick={handlePublishToggle}
            disabled={isPublishing}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all border ${
              portfolio.isPublished 
                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                : 'bg-white/5 border-dark-border text-gray-300 hover:bg-white/10'
            }`}
          >
            {isPublishing ? 'Updating...' : (portfolio.isPublished ? 'Unpublish' : 'Publish')}
          </button>
        </div>
      </div>

      {/* Live Preview Canvas Panel */}
      <div className="lg:col-span-3 glass rounded-2xl flex flex-col h-[78vh] overflow-hidden border border-dark-border">
        <div className="h-12 bg-white/5 border-b border-dark-border flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live Preview</span>
            {saveMessage && (
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider animate-pulse">
                {saveMessage}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportCode}
              className="px-2.5 py-1.5 text-[9px] uppercase font-bold tracking-wider rounded bg-brand-500/10 border border-brand-500/20 text-brand-200 hover:bg-brand-500 hover:text-white transition-all flex items-center gap-1 font-sans"
            >
              <Download size={10} /> Export Code
            </button>
            {portfolio.isPublished ? (
              <a 
                href={`/public/${portfolio.slug}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] font-bold text-brand-400 hover:underline flex items-center gap-1"
              >
                /public/{portfolio.slug} <Globe size={10} />
              </a>
            ) : (
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Draft Mode</span>
            )}
            
            <div className="flex gap-1.5 pl-2 border-l border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
          </div>
        </div>

        {/* Live Canvas Viewport Rendering the actual template live */}
        <div className="flex-1 overflow-y-auto bg-gray-900/40">
          <TemplateRenderer 
            templateName={portfolio.template?.name || 'modern'} 
            theme={portfolio.theme} 
            sections={portfolio.sections} 
            isPreview={true}
          />
        </div>
      </div>
    </div>
  );
};

const PublicPortfolioPage = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const response = await API.get(`/portfolio/public/${slug}`);
        setPortfolio(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'Portfolio not found or is set to private.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full glass p-8 rounded-2xl border-glow space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
            <Globe size={24} />
          </div>
          <h3 className="font-display font-bold text-xl text-white">Portfolio Private</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            {error || 'This developer portfolio is currently offline or set to draft mode.'}
          </p>
          <div className="pt-2">
            <Link to="/" className="inline-flex px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors">
              Go to DevLaunch
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TemplateRenderer 
      templateName={portfolio.template?.name || 'modern'} 
      theme={portfolio.theme} 
      sections={portfolio.sections} 
      isPreview={false}
    />
  );
};

const AnalyzerPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await API.get('/resume/history');
      setHistory(response.data.data);
    } catch (err) {
      console.error('Error fetching resume history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await API.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentAnalysis(response.data.data);
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to analyze resume PDF.');
    } finally {
      setLoading(false);
    }
  };

  const renderSuggestions = (mdText) => {
    if (!mdText) return null;
    const lines = mdText.split('\n');
    return (
      <div className="space-y-4">
        {lines.map((line, idx) => {
          if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            const cleanLine = line.replace(/^[\s*-]+/, '').trim();
            const parts = cleanLine.split('**');
            return (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed pl-1">
                <span className="text-brand-500 font-bold mt-1 shrink-0">•</span>
                <span>
                  {parts.map((part, pIdx) => 
                    pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part
                  )}
                </span>
              </div>
            );
          }
          if (line.trim().startsWith('###')) {
            return (
              <h5 key={idx} className="text-xs font-bold text-brand-400 mt-4 mb-2 uppercase tracking-wider font-display">
                {line.replace('###', '').trim()}
              </h5>
            );
          }
          if (line.trim().startsWith('##')) {
            return (
              <h4 key={idx} className="text-sm font-bold text-white mt-5 mb-2 uppercase tracking-wide font-display">
                {line.replace('##', '').trim()}
              </h4>
            );
          }
          if (!line.trim()) return null;
          return <p key={idx} className="text-xs text-gray-400 my-1">{line}</p>;
        })}
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-500/20 bg-green-500/5';
    if (score >= 50) return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      {/* Upload & History Side Bar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Upload Box */}
        <div className="glass p-6 rounded-2xl border border-dark-border text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-white">Upload Resume PDF</h4>
            <p className="text-[10px] text-gray-400 max-w-[200px] mx-auto mt-1">
              Select or drop a physical PDF to analyze parsing filters.
            </p>
          </div>
          
          <label className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-brand-500/15">
            <Sliders size={12} /> {loading ? 'Scanning PDF...' : 'Choose PDF'}
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              disabled={loading}
              className="hidden" 
            />
          </label>
        </div>

        {/* History Panel */}
        <div className="glass p-6 rounded-2xl border border-dark-border space-y-4 flex flex-col max-h-[50vh] overflow-hidden">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Analysis History</h4>
          <div className="flex-1 overflow-y-auto space-y-2.5">
            {history.length === 0 ? (
              <p className="text-[10px] text-gray-500 italic py-4 text-center">No past uploads scanned.</p>
            ) : (
              history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => setCurrentAnalysis(item)}
                  className={`w-full p-3 rounded-xl border text-left flex flex-col justify-between hover:bg-white/5 transition-all ${
                    currentAnalysis?._id === item._id 
                      ? 'border-brand-500 bg-brand-500/5' 
                      : 'border-white/5 bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-semibold text-xs text-gray-200 truncate max-w-[120px]">{item.fileName}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${getScoreColor(item.ruleBasedResults?.score)}`}>
                      {item.ruleBasedResults?.score || 0}/100
                    </span>
                  </div>
                  <span className="text-[8px] text-gray-500 mt-2">
                    Scanned: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results Display Panel */}
      <div className="lg:col-span-2">
        {!currentAnalysis ? (
          <div className="glass p-12 rounded-2xl border border-dark-border h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
            <Sparkles size={48} className="text-gray-600 animate-pulse" />
            <h4 className="text-white font-bold text-md">Resume Analyzer Diagnostics</h4>
            <p className="text-xs text-gray-400 max-w-sm">
              Upload your developer resume on the left. The compiler checks ATS constraints, analyzes action verbs, and executes Gemini AI feedback models.
            </p>
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border border-dark-border space-y-6">
            {/* Upper score title details */}
            <div className="flex justify-between items-start border-b border-dark-border pb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white capitalize">{currentAnalysis.fileName}</h3>
                <p className="text-xs text-gray-400 mt-1">Length Check: <span className="text-white font-semibold">{currentAnalysis.ruleBasedResults?.lengthCheck}</span></p>
              </div>
              <button 
                onClick={() => setCurrentAnalysis(null)} 
                className="text-[10px] text-gray-400 hover:text-white border border-dark-border px-2 py-1 rounded bg-white/5"
              >
                Close View
              </button>
            </div>

            {/* Score Ring Gauge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 border border-dark-border rounded-xl bg-white/5">
                <span className="text-xs text-gray-400 font-semibold mb-2">Overall Score</span>
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-xl font-bold ${
                  currentAnalysis.ruleBasedResults?.score >= 80 ? 'border-green-500 text-green-400 shadow-md shadow-green-500/5' :
                  currentAnalysis.ruleBasedResults?.score >= 50 ? 'border-yellow-500 text-yellow-400' : 'border-red-500 text-red-400'
                }`}>
                  {currentAnalysis.ruleBasedResults?.score || 0}
                </div>
              </div>

              {/* Status Section Indicators */}
              <div className="sm:col-span-2 grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Contact Info', exists: currentAnalysis.ruleBasedResults?.hasContactInfo },
                  { label: 'Education Section', exists: currentAnalysis.ruleBasedResults?.hasEducation },
                  { label: 'Projects Section', exists: currentAnalysis.ruleBasedResults?.hasProjects },
                  { label: 'Skills Section', exists: currentAnalysis.ruleBasedResults?.hasSkills }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 border border-white/5 bg-white/5 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${item.exists ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-gray-300 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Sections and Weak Verbs lists */}
            {(currentAnalysis.ruleBasedResults?.missingSections?.length > 0 || currentAnalysis.ruleBasedResults?.weakActionVerbs?.length > 0) && (
              <div className="space-y-4 pt-4 border-t border-dark-border">
                {currentAnalysis.ruleBasedResults?.missingSections?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Missing ATS Sections</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.ruleBasedResults.missingSections.map((sec, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] text-red-300">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentAnalysis.ruleBasedResults?.weakActionVerbs?.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-yellow-400 uppercase font-bold tracking-wider">Passive Action Verbs Found</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.ruleBasedResults.weakActionVerbs.map((verb, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-300">
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gemini AI Suggestions Bullet Panel */}
            <div className="pt-4 border-t border-dark-border space-y-3 text-xs leading-relaxed text-left">
              <span className="text-[10px] text-brand-400 uppercase font-bold tracking-wider block font-display">Gemini AI Placement Insights</span>
              <div className="p-4 border border-brand-500/10 bg-brand-500/5 rounded-xl">
                {renderSuggestions(currentAnalysis.aiSuggestions)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ShowcasePage = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [track, setTrack] = useState('');
  const [skill, setSkill] = useState('');
  const [likedPortfolios, setLikedPortfolios] = useState({}); // Tracking locally which ones we liked to prevent spam
  const [isCloning, setIsCloning] = useState(false);

  const handleClone = async (targetPortfolioId) => {
    setIsCloning(true);
    try {
      await API.post('/portfolio/clone', { targetPortfolioId });
      navigate('/builder');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to clone template.');
    } finally {
      setIsCloning(false);
    }
  };

  const fetchShowcase = async () => {
    try {
      const response = await API.get('/portfolio/showcase', {
        params: {
          search,
          track,
          skill
        }
      });
      setPortfolios(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchShowcase();
    }, 300); // 300ms debounce for search terms

    return () => clearTimeout(delayDebounceFn);
  }, [search, track, skill]);

  const handleLike = async (portfolioId) => {
    if (likedPortfolios[portfolioId]) return; // already liked
    try {
      const response = await API.put(`/portfolio/like/${portfolioId}`);
      setLikedPortfolios(prev => ({ ...prev, [portfolioId]: true }));
      setPortfolios(prev => prev.map(p => {
        if (p._id === portfolioId) {
          return { ...p, likes: response.data.data.likes };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const getSkillsFromPortfolio = (p) => {
    const skillsSection = p.sections?.find(s => s.name === 'skills');
    if (!skillsSection || !skillsSection.content?.categories) return [];
    
    // Flatten skill items
    return skillsSection.content.categories.reduce((acc, cat) => {
      return [...acc, ...(cat.items || [])];
    }, []).slice(0, 5); // limit to first 5
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header and Search Filters */}
      <div className="glass p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search by name, role, bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Track selection */}
          <select
            value={track}
            onChange={(e) => setTrack(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
          >
            <option value="" className="bg-dark-bg text-white">All Tracks</option>
            <option value="frontend" className="bg-dark-bg text-white">Frontend</option>
            <option value="backend" className="bg-dark-bg text-white">Backend</option>
            <option value="fullstack" className="bg-dark-bg text-white">Full Stack</option>
            <option value="ai-ml" className="bg-dark-bg text-white">AI/ML</option>
            <option value="mobile" className="bg-dark-bg text-white">Mobile</option>
            <option value="devops" className="bg-dark-bg text-white">DevOps</option>
          </select>

          {/* Skill Filter input */}
          <input
            type="text"
            placeholder="Filter by skill (e.g. React)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-dark-border rounded-lg text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
        </div>
      ) : portfolios.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center text-gray-400 space-y-4">
          <Globe size={40} className="mx-auto text-gray-500 animate-pulse" />
          <h4 className="text-white font-bold text-md">No Published Portfolios Found</h4>
          <p className="text-xs text-gray-500">Be the first to publish your customizable developer branding profile layout!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((p) => {
            const heroData = p.sections?.find(s => s.name === 'hero')?.content || {};
            const skillsList = getSkillsFromPortfolio(p);
            return (
              <div 
                key={p._id} 
                className="glass p-6 rounded-2xl border-glow flex flex-col justify-between min-h-[15rem] hover:-translate-y-1 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-display font-bold text-white text-md tracking-tight capitalize group-hover:text-brand-400 transition-colors">
                        {heroData.name || p.user?.username}
                      </h4>
                      <p className="text-xs text-brand-400 font-semibold">{heroData.role || 'Software Engineer'}</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-sans">
                      {p.template?.displayName || 'modern'}
                    </span>
                  </div>
                  
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 mb-6">
                    {skillsList.map((skillItem, idx) => (
                      <span key={idx} className="text-[9px] bg-brand-500/10 border border-brand-500/20 text-brand-200 px-2 py-0.5 rounded-full font-sans">
                        {skillItem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dark-border pt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleLike(p._id)}
                      disabled={likedPortfolios[p._id]}
                      className={`flex items-center gap-1 hover:text-white transition-colors ${likedPortfolios[p._id] ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-red-400'}`}
                    >
                      <Heart size={12} className={likedPortfolios[p._id] ? 'fill-red-400 stroke-red-400' : ''} /> 
                      <span>{p.likes?.length || 0}</span>
                    </button>
                    <span className="text-gray-500">|</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {p.views || 0}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleClone(p._id)}
                      disabled={isCloning}
                      className="text-brand-500 hover:underline font-bold flex items-center gap-0.5 text-[11px] transition-colors"
                    >
                      Clone Layout <ChevronRight size={12} />
                    </button>
                    <a 
                      href={`/public/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white font-bold flex items-center gap-0.5 text-[11px] transition-colors"
                    >
                      View Live <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, portfolios: 0, publishedPortfolios: 0, resumes: 0, reports: 0 });
  const [users, setUsers] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPortfolios = async () => {
    try {
      const response = await API.get('/admin/portfolios');
      setPortfolios(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await API.get('/admin/reports');
      setReports(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchPortfolios(),
      fetchReports()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this developer and all their portfolios/resumes? This action cannot be undone.')) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  const handleTogglePublish = async (portfolioId, currentStatus) => {
    try {
      const response = await API.put(`/admin/portfolios/${portfolioId}/publish`, {
        isPublished: !currentStatus
      });
      setPortfolios(portfolios.map(p => {
        if (p._id === portfolioId) {
          return { ...p, isPublished: response.data.data.isPublished };
        }
        return p;
      }));
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to update portfolio publish status.');
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) return;
    try {
      await API.delete(`/admin/portfolios/${portfolioId}`);
      setPortfolios(portfolios.filter(p => p._id !== portfolioId));
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to delete portfolio.');
    }
  };

  const handleResolveReport = async (reportId, newStatus) => {
    try {
      await API.put(`/admin/reports/${reportId}`, { status: newStatus });
      setReports(reports.map(r => {
        if (r._id === reportId) {
          return { ...r, status: newStatus };
        }
        return r;
      }));
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('Failed to update report status.');
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div>
        <h3 className="font-display font-bold text-2xl text-white">System Control Panel</h3>
        <p className="text-xs text-gray-400">Moderate registered developer portfolios, manage template setups, and review bug/spam logs.</p>
      </div>

      <div className="flex bg-white/5 border border-dark-border rounded-xl p-1 gap-1">
        {['overview', 'users', 'portfolios', 'reports'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all capitalize ${
              activeTab === tab 
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/10' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass p-6 rounded-xl border border-dark-border">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Developers</p>
            <h4 className="text-2xl font-bold text-white">{stats.users}</h4>
          </div>
          <div className="glass p-6 rounded-xl border border-dark-border">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Total Portfolios</p>
            <h4 className="text-2xl font-bold text-white">{stats.portfolios} ({stats.publishedPortfolios} Live)</h4>
          </div>
          <div className="glass p-6 rounded-xl border border-dark-border">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Resume Scans</p>
            <h4 className="text-2xl font-bold text-white">{stats.resumes}</h4>
          </div>
          <div className="glass p-6 rounded-xl border border-dark-border">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Pending Flags</p>
            <h4 className={`text-2xl font-bold ${stats.reports > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>{stats.reports}</h4>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass rounded-2xl border border-dark-border overflow-hidden">
          <div className="p-4 border-b border-dark-border bg-white/5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Registered Developers</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Username</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Developer Track</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-dark-border hover:bg-white/5 transition-colors text-gray-200">
                    <td className="p-4 font-bold text-white capitalize">{u.username}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize text-brand-400 font-semibold">{u.developerRole}</td>
                    <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-semibold"
                      >
                        Delete User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'portfolios' && (
        <div className="glass rounded-2xl border border-dark-border overflow-hidden">
          <div className="p-4 border-b border-dark-border bg-white/5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Developer Portfolios</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Portfolio Title</th>
                  <th className="p-4">Owner</th>
                  <th className="p-4">Template Layout</th>
                  <th className="p-4">Slug URL</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map(p => (
                  <tr key={p._id} className="border-b border-dark-border hover:bg-white/5 transition-colors text-gray-200">
                    <td className="p-4 font-bold text-white">{p.title}</td>
                    <td className="p-4 capitalize">{p.user?.username || 'unknown'}</td>
                    <td className="p-4 capitalize font-semibold text-brand-400">{p.template?.displayName || 'modern'}</td>
                    <td className="p-4 font-mono text-[10px]">/public/{p.slug}</td>
                    <td className="p-4 font-sans">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        p.isPublished ? 'text-green-400 border-green-500/20 bg-green-500/5' : 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
                      }`}>
                        {p.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublish(p._id, p.isPublished)}
                        className={`px-3 py-1 rounded transition-all font-semibold border ${
                          p.isPublished 
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20' 
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20'
                        }`}
                      >
                        {p.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(p._id)}
                        className="px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="glass rounded-2xl border border-dark-border overflow-hidden">
          <div className="p-4 border-b border-dark-border bg-white/5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Flag Reports & Platform Feedbacks</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-border text-gray-400 uppercase tracking-wider font-semibold">
                  <th className="p-4">Type</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Target Profile</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r._id} className="border-b border-dark-border hover:bg-white/5 transition-colors text-gray-200">
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold font-sans ${
                        r.type === 'inappropriate' ? 'text-red-400 border-red-500/20 bg-red-500/5' :
                        r.type === 'spam' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' :
                        r.type === 'bug' ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' : 'text-gray-400 border-white/10'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4">{r.reporter?.username || 'Guest'}</td>
                    <td className="p-4 font-mono text-[10px]">
                      {r.reportedPortfolio ? `/public/${r.reportedPortfolio.slug}` : 'N/A'}
                    </td>
                    <td className="p-4 font-bold text-white">{r.subject}</td>
                    <td className="p-4 max-w-[200px] truncate" title={r.description}>{r.description}</td>
                    <td className="p-4 font-sans">
                      <span className={`px-2 py-0.5 rounded border uppercase text-[9px] font-bold ${
                        r.status === 'pending' ? 'text-red-400 border-red-500/20 bg-red-500/5 animate-pulse' :
                        r.status === 'resolved' ? 'text-green-400 border-green-500/20 bg-green-500/5' : 'text-gray-500 border-white/5'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      {r.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleResolveReport(r._id, 'resolved')}
                            className="px-2.5 py-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 transition-all font-semibold"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleResolveReport(r._id, 'ignored')}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 border border-dark-border transition-all font-semibold"
                          >
                            Ignore
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Route controller orchestrating layouts
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Authenticated Pages */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout>
            <DashboardOverview />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AdminPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/builder" element={
        <ProtectedRoute>
          <DashboardLayout>
            <BuilderPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/analyzer" element={
        <ProtectedRoute>
          <DashboardLayout>
            <AnalyzerPage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/showcase" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ShowcasePage />
          </DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <DashboardLayout>
            <div className="text-left glass p-6 rounded-xl">
              <h3 className="font-display font-bold text-lg text-white mb-2">Account Settings</h3>
              <p className="text-xs text-gray-400">Configure your branding platform and developer role mapping configurations.</p>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Public Unauthenticated Portfolio Render Route */}
      <Route path="/public/:slug" element={<PublicPortfolioPage />} />

      {/* Fallback to Dashboard/Landing */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
