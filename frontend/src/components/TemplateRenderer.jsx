import React from 'react';
import { Globe, GitBranch, Linkedin, Github, Terminal, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

const TemplateRenderer = ({ templateName, theme, sections, isPreview = false }) => {
  if (!sections || sections.length === 0) return null;

  // Filter visible sections and sort by order
  const activeSections = sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  // Dynamic CSS variables mapper
  const styleVars = {
    '--color-primary': theme.primary,
    '--color-secondary': theme.secondary,
    '--color-bg': theme.background,
    '--color-text': theme.text,
    '--color-card': theme.card,
    fontFamily: theme.fontFamily || 'Inter, sans-serif'
  };

  // Section Content Extractors
  const getSection = (name) => sections.find(s => s.name === name);

  // 1. MODERN MINIMALIST TEMPLATE RENDERER
  const renderModern = () => {
    return (
      <div 
        style={styleVars} 
        className="w-full text-[var(--color-text)] bg-[var(--color-bg)] transition-all duration-300 min-h-screen text-left"
      >
        {activeSections.map((section) => {
          const { name, title, content } = section;

          switch (name) {
            case 'hero':
              return (
                <section key={name} className="py-24 px-8 md:px-16 max-w-5xl mx-auto flex flex-col justify-center min-h-[60vh] border-b border-white/5">
                  <div className="space-y-6">
                    <span className="text-[var(--color-primary)] font-semibold uppercase tracking-wider text-sm">{content.role || 'Developer'}</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                      Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">{content.name || 'Your Name'}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                      {content.tagline || 'Your tagline goes here.'}
                    </p>
                    <div className="pt-4">
                      <button className="px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 font-semibold transition-all shadow-lg shadow-[var(--color-primary)]/20">
                        {content.ctaText || 'View Projects'}
                      </button>
                    </div>
                  </div>
                </section>
              );

            case 'about':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto border-b border-white/5 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-display border-l-4 border-[var(--color-primary)] pl-3">{title}</h2>
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    {content.avatarUrl && (
                      <img 
                        src={content.avatarUrl} 
                        alt="Profile Avatar" 
                        className="w-40 h-40 rounded-2xl object-cover border border-white/10 shadow-lg"
                      />
                    )}
                    <div className="flex-1 space-y-6">
                      <p className="text-gray-400 leading-relaxed text-md">{content.bio || 'Your biography.'}</p>
                      <div className="flex gap-4">
                        {content.github && (
                          <a href={content.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--color-primary)] hover:text-white transition-all">
                            <Github size={20} />
                          </a>
                        )}
                        {content.linkedin && (
                          <a href={content.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[var(--color-primary)] hover:text-white transition-all">
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto border-b border-white/5 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-display border-l-4 border-[var(--color-primary)] pl-3">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.categories && content.categories.map((cat, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[var(--color-card)] border border-white/5 space-y-4">
                        <h4 className="font-bold text-white text-md tracking-wide uppercase text-xs text-[var(--color-primary)]">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.items && cat.items.map((item, itemIdx) => (
                            <span key={itemIdx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs hover:border-[var(--color-primary)] hover:text-white transition-colors">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto border-b border-white/5 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-display border-l-4 border-[var(--color-primary)] pl-3">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.items && content.items.map((proj, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[var(--color-card)] border border-white/5 flex flex-col justify-between h-52 hover:border-white/20 transition-all group">
                        <div className="space-y-3">
                          <h4 className="font-bold text-white text-lg group-hover:text-[var(--color-primary)] transition-colors">{proj.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{proj.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {proj.tags && proj.tags.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] flex items-center gap-0.5 text-xs font-bold hover:underline">
                              Repo <GitBranch size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto border-b border-white/5 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-display border-l-4 border-[var(--color-primary)] pl-3">{title}</h2>
                  <div className="space-y-8 border-l border-white/10 pl-6 ml-4">
                    {content.items && content.items.map((job, idx) => (
                      <div key={idx} className="relative space-y-3 text-left">
                        {/* Dot timeline indicator */}
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[var(--color-primary)] border border-[var(--color-bg)]" />
                        <div>
                          <span className="text-xs text-[var(--color-primary)] font-semibold">{job.duration}</span>
                          <h4 className="font-bold text-white text-lg">{job.role}</h4>
                          <h5 className="text-sm text-gray-300 font-medium">{job.company}</h5>
                        </div>
                        <ul className="list-disc list-inside text-xs text-gray-400 space-y-1.5 leading-relaxed pl-2">
                          {job.tasks && job.tasks.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto border-b border-white/5 space-y-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-display border-l-4 border-[var(--color-primary)] pl-3">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.email && (
                      <div className="p-6 rounded-xl bg-[var(--color-card)] border border-white/5 flex items-center gap-4 hover:border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                          <Mail size={18} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] text-gray-500 font-semibold uppercase">Email Address</p>
                          <p className="text-xs text-white font-medium truncate">{content.email}</p>
                        </div>
                      </div>
                    )}

                    {content.phone && (
                      <div className="p-6 rounded-xl bg-[var(--color-card)] border border-white/5 flex items-center gap-4 hover:border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                          <Phone size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-semibold uppercase">Phone Number</p>
                          <p className="text-xs text-white font-medium">{content.phone}</p>
                        </div>
                      </div>
                    )}

                    {content.location && (
                      <div className="p-6 rounded-xl bg-[var(--color-card)] border border-white/5 flex items-center gap-4 hover:border-white/10">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-semibold uppercase">Location</p>
                          <p className="text-xs text-white font-medium">{content.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

            case 'footer':
              return (
                <footer key={name} className="py-12 px-8 max-w-5xl mx-auto text-center border-t border-white/5 mt-10">
                  <p className="text-xs text-gray-500">{content.copyright || '© Your Name.'}</p>
                </footer>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // 2. CONSOLE TERMINAL TEMPLATE RENDERER
  const renderDeveloper = () => {
    return (
      <div 
        style={styleVars} 
        className="w-full text-[var(--color-text)] bg-[var(--color-bg)] transition-all duration-300 min-h-screen text-left p-6 font-mono border border-white/10"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mock Console Top Bar */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4 text-xs text-gray-500">
            <span className="flex items-center gap-2"><Terminal size={14} className="text-[var(--color-primary)]" /> devlaunch-console-v1.0.0</span>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
          </div>

          {activeSections.map((section) => {
            const { name, title, content } = section;

            switch (name) {
              case 'hero':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)] animate-pulse" />
                      <span>sh system_boot.sh</span>
                    </div>
                    <div className="p-6 bg-[var(--color-card)] rounded-lg border border-white/5 space-y-4 shadow-md">
                      <p className="text-xs text-[var(--color-primary)]">SYS-BOOT-INIT: COMPLETED</p>
                      <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                        $ cat developer_profile.json
                      </h1>
                      <div className="pl-6 space-y-2 text-xs md:text-sm">
                        <p><span className="text-[var(--color-secondary)]">"name"</span>: "{content.name || 'Your Name'}",</p>
                        <p><span className="text-[var(--color-secondary)]">"title"</span>: "{content.role || 'Developer'}",</p>
                        <p><span className="text-[var(--color-secondary)]">"tagline"</span>: "{content.tagline || 'Tagline details.'}"</p>
                      </div>
                      <div className="pt-3">
                        <button className="px-4 py-2 border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs rounded transition-all">
                          {content.ctaText || 'View Repo'}
                        </button>
                      </div>
                    </div>
                  </section>
                );

              case 'about':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)]" />
                      <span>cat about.md</span>
                    </div>
                    <div className="p-6 bg-[var(--color-card)] rounded-lg border border-white/5 space-y-6">
                      <p className="text-xs text-gray-300 leading-relaxed leading-6">{content.bio || 'Biography.'}</p>
                      <div className="flex flex-wrap gap-6 text-xs border-t border-white/5 pt-4">
                        {content.github && (
                          <a href={content.github} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline flex items-center gap-1.5">
                            <Github size={14} /> GitHub: {content.github.replace('https://', '')}
                          </a>
                        )}
                        {content.linkedin && (
                          <a href={content.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-secondary)] hover:underline flex items-center gap-1.5">
                            <Linkedin size={14} /> LinkedIn: {content.linkedin.replace('https://', '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </section>
                );

              case 'skills':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)]" />
                      <span>ls -la ./skills/</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {content.categories && content.categories.map((cat, idx) => (
                        <div key={idx} className="p-4 bg-[var(--color-card)] rounded-lg border border-white/5">
                          <p className="text-xs text-[var(--color-primary)] mb-3 font-bold">{cat.name}.sh</p>
                          <ul className="text-xs space-y-1.5 text-gray-400">
                            {cat.items && cat.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-center gap-2">
                                <span className="text-[var(--color-secondary)]">-</span> {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'projects':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)]" />
                      <span>git clone -b production ./projects/</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.items && content.items.map((proj, idx) => (
                        <div key={idx} className="p-5 bg-[var(--color-card)] rounded-lg border border-white/5 flex flex-col justify-between h-48 hover:border-[var(--color-primary)] transition-all">
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              <Terminal size={12} className="text-[var(--color-secondary)]" /> {proj.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">{proj.description}</p>
                          </div>
                          <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px]">
                            <span className="text-gray-500">[{proj.tags?.join(', ')}]</span>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">
                                clone &gt;
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'experience':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)]" />
                      <span>history | grep "work_experience"</span>
                    </div>
                    <div className="p-6 bg-[var(--color-card)] rounded-lg border border-white/5 space-y-6">
                      {content.items && content.items.map((job, idx) => (
                        <div key={idx} className="space-y-2 border-l border-[var(--color-primary)]/30 pl-4 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-white">{job.role} @ {job.company}</p>
                              <p className="text-[10px] text-gray-500">{job.duration}</p>
                            </div>
                          </div>
                          <ul className="space-y-1 text-gray-400 list-none">
                            {job.tasks && job.tasks.map((task, tIdx) => (
                              <li key={tIdx} className="flex gap-2">
                                <span className="text-[var(--color-primary)]">&gt;</span> {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'contact':
                return (
                  <section key={name} className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ChevronRight size={14} className="text-[var(--color-primary)]" />
                      <span>ping -c 3 dev_gateway</span>
                    </div>
                    <div className="p-6 bg-[var(--color-card)] rounded-lg border border-white/5 space-y-2 text-xs text-gray-300">
                      <p>PING dev_gateway IP_ADDR [64 bytes payload]</p>
                      <p className="flex items-center gap-2 pl-4"><ChevronRight size={10} className="text-[var(--color-primary)]" /> EMAIL: <span className="text-white">{content.email}</span></p>
                      <p className="flex items-center gap-2 pl-4"><ChevronRight size={10} className="text-[var(--color-primary)]" /> PHONE: <span className="text-white">{content.phone}</span></p>
                      <p className="flex items-center gap-2 pl-4"><ChevronRight size={10} className="text-[var(--color-primary)]" /> ADDR: <span className="text-white">{content.location}</span></p>
                    </div>
                  </section>
                );

              case 'footer':
                return (
                  <footer key={name} className="text-center text-xs text-gray-600 border-t border-white/5 pt-6 mt-10">
                    <p>{content.copyright || '© Developer'}</p>
                  </footer>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  // 3. VIBRANT GRADIENT (CREATIVE) TEMPLATE RENDERER
  const renderCreative = () => {
    return (
      <div 
        style={styleVars} 
        className="w-full text-[var(--color-text)] bg-gradient-to-br from-[#0c0a1c] via-[#1a0b2e] to-[#05020c] transition-all duration-300 min-h-screen text-left"
      >
        {activeSections.map((section) => {
          const { name, title, content } = section;

          switch (name) {
            case 'hero':
              return (
                <section key={name} className="py-28 px-8 md:px-16 max-w-5xl mx-auto flex flex-col justify-center min-h-[70vh] relative overflow-hidden">
                  <div className="absolute top-20 right-10 w-72 h-72 bg-[var(--color-secondary)]/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  <div className="absolute bottom-10 left-10 w-60 h-60 bg-[var(--color-primary)]/20 rounded-full blur-3xl -z-10"></div>
                  <div className="space-y-6">
                    <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest">{content.role || 'Creative Developer'}</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">
                      Hello, I'm <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[#f43f5e] to-[var(--color-secondary)] animate-gradient">{content.name || 'Your Name'}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                      {content.tagline || 'Tagline description.'}
                    </p>
                    <div className="pt-4">
                      <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:opacity-90 font-bold transition-all shadow-lg shadow-[var(--color-primary)]/30 hover:scale-105 duration-200">
                        {content.ctaText || 'Get in Touch'}
                      </button>
                    </div>
                  </div>
                </section>
              );

            case 'about':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white tracking-tight">{title}</h2>
                  <div className="flex flex-col md:flex-row gap-10 items-center">
                    {content.avatarUrl && (
                      <div className="relative group">
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-40 blur group-hover:opacity-75 transition duration-300"></div>
                        <img 
                          src={content.avatarUrl} 
                          alt="Avatar" 
                          className="relative w-44 h-44 rounded-2xl object-cover border border-white/10"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-6">
                      <p className="text-gray-300 leading-relaxed text-md">{content.bio}</p>
                      <div className="flex gap-4">
                        {content.github && (
                          <a href={content.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all">
                            <Github size={20} />
                          </a>
                        )}
                        {content.linkedin && (
                          <a href={content.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 transition-all">
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white tracking-tight">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.categories?.map((cat, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[#130f26]/60 border border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 transition-all duration-300 shadow-xl space-y-4">
                        <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-sm tracking-widest uppercase">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.items?.map((item, itemIdx) => (
                            <span key={itemIdx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-[var(--color-primary)] text-xs text-gray-300 hover:text-white transition-colors">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white tracking-tight">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {content.items?.map((proj, idx) => (
                      <div key={idx} className="p-6 rounded-2xl bg-[#130f26]/40 border border-white/5 hover:border-[var(--color-secondary)]/30 hover:shadow-lg hover:shadow-[var(--color-secondary)]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-56">
                        <div className="space-y-3">
                          <h4 className="font-extrabold text-white text-xl hover:text-[var(--color-primary)] transition-colors">{proj.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{proj.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {proj.tags?.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] flex items-center gap-1 text-xs font-bold hover:underline">
                              Repo <GitBranch size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white tracking-tight">{title}</h2>
                  <div className="space-y-8 border-l-2 border-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] pl-6 ml-4 font-sans">
                    {content.items?.map((job, idx) => (
                      <div key={idx} className="relative space-y-3 text-left">
                        <div className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] border border-[#0c0a1c]" />
                        <div>
                          <span className="text-xs text-[var(--color-secondary)] font-bold">{job.duration}</span>
                          <h4 className="font-extrabold text-white text-lg">{job.role}</h4>
                          <h5 className="text-sm text-gray-300 font-semibold">{job.company}</h5>
                        </div>
                        <ul className="list-disc list-inside text-xs text-gray-400 space-y-1.5 leading-relaxed pl-2">
                          {job.tasks?.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key={name} className="py-20 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white tracking-tight">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.email && (
                      <div className="p-6 rounded-2xl bg-[#130f26]/40 border border-white/5 flex items-center gap-4 hover:border-[var(--color-primary)]/20 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center">
                          <Mail size={20} />
                        </div>
                        <div className="truncate">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</p>
                          <p className="text-xs text-white font-medium truncate">{content.email}</p>
                        </div>
                      </div>
                    )}
                    {content.phone && (
                      <div className="p-6 rounded-2xl bg-[#130f26]/40 border border-white/5 flex items-center gap-4 hover:border-[var(--color-primary)]/20 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Phone</p>
                          <p className="text-xs text-white font-medium">{content.phone}</p>
                        </div>
                      </div>
                    )}
                    {content.location && (
                      <div className="p-6 rounded-2xl bg-[#130f26]/40 border border-white/5 flex items-center gap-4 hover:border-[var(--color-primary)]/20 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</p>
                          <p className="text-xs text-white font-medium">{content.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

            case 'footer':
              return (
                <footer key={name} className="py-12 px-8 max-w-5xl mx-auto text-center border-t border-white/5 mt-10">
                  <p className="text-xs text-gray-500">{content.copyright}</p>
                </footer>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // 4. DARK GLASSMORPHISM (SLEEK) TEMPLATE RENDERER
  const renderSleek = () => {
    return (
      <div 
        style={styleVars} 
        className="w-full text-slate-200 bg-[#020617] transition-all duration-300 min-h-screen text-left"
      >
        {activeSections.map((section) => {
          const { name, title, content } = section;

          switch (name) {
            case 'hero':
              return (
                <section key={name} className="py-24 px-8 md:px-16 max-w-5xl mx-auto flex flex-col justify-center min-h-[65vh]">
                  <div className="space-y-6 backdrop-blur-md bg-white/5 border border-white/10 p-10 md:p-14 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
                    <span className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">{content.role}</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                      Hello, I am <span className="text-cyan-400 font-display">{content.name}</span>
                    </h1>
                    <p className="text-md md:text-lg text-slate-400 max-w-xl leading-relaxed">
                      {content.tagline}
                    </p>
                    <div className="pt-2">
                      <button className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10">
                        {content.ctaText}
                      </button>
                    </div>
                  </div>
                </section>
              );

            case 'about':
              return (
                <section key={name} className="py-16 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">{title}</h2>
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-10 items-center">
                    {content.avatarUrl && (
                      <img 
                        src={content.avatarUrl} 
                        alt="Avatar" 
                        className="w-36 h-36 rounded-full object-cover border border-white/20"
                      />
                    )}
                    <div className="flex-1 space-y-6">
                      <p className="text-slate-300 leading-relaxed text-sm">{content.bio}</p>
                      <div className="flex gap-4">
                        {content.github && (
                          <a href={content.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Github size={22} />
                          </a>
                        )}
                        {content.linkedin && (
                          <a href={content.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                            <Linkedin size={22} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'skills':
              return (
                <section key={name} className="py-16 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.categories?.map((cat, idx) => (
                      <div key={idx} className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/20 transition-colors space-y-4">
                        <h4 className="font-bold text-cyan-400 text-xs tracking-wider uppercase">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.items?.map((item, itemIdx) => (
                            <span key={itemIdx} className="px-2.5 py-1 rounded bg-slate-900/60 border border-white/5 text-xs text-slate-300">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'projects':
              return (
                <section key={name} className="py-16 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.items?.map((proj, idx) => (
                      <div key={idx} className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between h-52 hover:border-cyan-500/20 transition-all">
                        <div className="space-y-3">
                          <h4 className="font-bold text-white text-lg">{proj.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{proj.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {proj.tags?.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-cyan-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-cyan-400 flex items-center gap-1 text-xs hover:underline">
                              View <GitBranch size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'experience':
              return (
                <section key={name} className="py-16 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">{title}</h2>
                  <div className="space-y-6">
                    {content.items?.map((job, idx) => (
                      <div key={idx} className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row md:justify-between items-start gap-4">
                        <div className="space-y-2 max-w-lg">
                          <h4 className="font-bold text-white text-md">{job.role}</h4>
                          <h5 className="text-xs text-slate-400">{job.company}</h5>
                          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 leading-relaxed pt-2">
                            {job.tasks?.map((task, tIdx) => (
                              <li key={tIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{job.duration}</span>
                      </div>
                    ))}
                  </div>
                </section>
              );

            case 'contact':
              return (
                <section key={name} className="py-16 px-8 md:px-16 max-w-5xl mx-auto space-y-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {content.email && (
                      <div className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                        <Mail size={18} className="text-cyan-400" />
                        <div className="truncate">
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Email</p>
                          <p className="text-xs text-white truncate">{content.email}</p>
                        </div>
                      </div>
                    )}
                    {content.phone && (
                      <div className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                        <Phone size={18} className="text-cyan-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Phone</p>
                          <p className="text-xs text-white">{content.phone}</p>
                        </div>
                      </div>
                    )}
                    {content.location && (
                      <div className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                        <MapPin size={18} className="text-cyan-400" />
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">Location</p>
                          <p className="text-xs text-white">{content.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

            case 'footer':
              return (
                <footer key={name} className="py-12 px-8 max-w-5xl mx-auto text-center border-t border-white/10 mt-10">
                  <p className="text-xs text-slate-500">{content.copyright}</p>
                </footer>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  // 5. CLASSIC PAPER TEMPLATE RENDERER
  const renderClassic = () => {
    return (
      <div 
        style={{ fontFamily: 'Georgia, serif' }} 
        className="w-full text-slate-800 bg-[#faf9f6] transition-all duration-300 min-h-screen text-left py-16 px-8 md:px-16"
      >
        <div className="max-w-3xl mx-auto space-y-10 bg-white p-12 shadow-xl border border-slate-200 rounded">
          {activeSections.map((section) => {
            const { name, title, content } = section;

            switch (name) {
              case 'hero':
                return (
                  <section key={name} className="text-center space-y-4 pb-6 border-b border-slate-300">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase font-sans">
                      {content.name}
                    </h1>
                    <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase font-sans">
                      {content.role} | {getSection('contact')?.content.location || ''}
                    </p>
                    <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed italic">
                      "{content.tagline}"
                    </p>
                  </section>
                );

              case 'about':
                return (
                  <section key={name} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">{title}</h2>
                    <p className="text-xs text-slate-700 leading-relaxed">{content.bio}</p>
                    <div className="flex gap-4 text-xs font-sans text-slate-500 pt-1">
                      {content.github && <a href={content.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub: {content.github.replace('https://', '')}</a>}
                      {content.linkedin && <a href={content.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn: {content.linkedin.replace('https://', '')}</a>}
                    </div>
                  </section>
                );

              case 'skills':
                return (
                  <section key={name} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">{title}</h2>
                    <div className="space-y-2 text-xs">
                      {content.categories?.map((cat, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-1">
                          <strong className="min-w-[150px] text-slate-900 font-sans">{cat.name}:</strong>
                          <span className="text-slate-700">{cat.items?.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'projects':
                return (
                  <section key={name} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">{title}</h2>
                    <div className="space-y-4">
                      {content.items?.map((proj, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline font-sans">
                            <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:underline">
                                Link
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider font-sans">Tech: {proj.tags?.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'experience':
                return (
                  <section key={name} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">{title}</h2>
                    <div className="space-y-4">
                      {content.items?.map((job, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline font-sans">
                            <div>
                              <strong className="text-xs text-slate-950">{job.role}</strong>
                              <span className="text-xs text-slate-500 font-medium"> at {job.company}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold">{job.duration}</span>
                          </div>
                          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-2">
                            {job.tasks?.map((task, tIdx) => (
                              <li key={tIdx}>{task}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                );

              case 'contact':
                return (
                  <section key={name} className="space-y-3">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 font-sans">{title}</h2>
                    <div className="flex flex-wrap justify-between text-xs text-slate-600 font-sans gap-2">
                      {content.email && <span>Email: {content.email}</span>}
                      {content.phone && <span>Phone: {content.phone}</span>}
                      {content.location && <span>Location: {content.location}</span>}
                    </div>
                  </section>
                );

              case 'footer':
                return (
                  <footer key={name} className="pt-6 border-t border-slate-300 text-center font-sans text-[10px] text-slate-400">
                    <p>{content.copyright}</p>
                  </footer>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    );
  };

  // Template Router Resolver Switch
  switch (templateName) {
    case 'developer':
      return renderDeveloper();
    case 'creative':
      return renderCreative();
    case 'sleek':
      return renderSleek();
    case 'classic':
      return renderClassic();
    case 'modern':
    default:
      return renderModern();
  }
};

export default TemplateRenderer;
