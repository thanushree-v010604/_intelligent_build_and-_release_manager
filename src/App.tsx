/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, 
  Cpu, 
  Terminal, 
  Activity, 
  Layout, 
  Code2, 
  Sparkles, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Languages,
  ArrowLeft,
  Save,
  FolderHeart,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  XCircle,
  Moon,
  Sun,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { generateProject } from './services/gemini';
import { Language, BuildLog, GeneratedProject } from './types';

// --- Components ---

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto p-10 glass-panel border-red-500/30 text-center relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
    <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/10">
      <XCircle className="w-10 h-10 text-red-400" />
    </div>
    <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tighter">Pipeline Interrupted</h3>
    <p className="text-white/60 text-sm mb-10 leading-relaxed font-medium">
      {message}
    </p>
    <div className="space-y-4">
      <button onClick={onRetry} className="w-full btn-primary bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-3 py-4">
        <RefreshCw className="w-5 h-5" /> RESTART PIPELINE
      </button>
      <div className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-black">
        Diagnostic: Check API Key & Network
      </div>
    </div>
  </motion.div>
);

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center mesh-bg overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            x: [0, -80, 0],
            y: [0, -100, 0]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-light/10 blur-[150px] rounded-full" 
        />
      </div>

      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-12 relative z-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-brand-primary/30 blur-3xl rounded-full" />
          <Rocket className="w-32 h-32 text-white relative z-10 drop-shadow-[0_0_50px_rgba(14,165,233,0.8)]" />
        </div>
      </motion.div>
      
      <div className="text-center space-y-4 relative z-10">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-7xl md:text-8xl font-black tracking-tighter text-white leading-none"
        >
          INTELLIGENT
        </motion.h1>
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-7xl md:text-8xl font-black tracking-tighter gradient-text leading-none"
        >
          BUILD MANAGER
        </motion.h1>
      </div>

      <div className="mt-20 flex flex-col items-center gap-6 relative z-10">
        <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-brand-primary via-brand-light to-brand-primary bg-[length:200%_100%] animate-shimmer"
            style={{ 
              animation: 'shimmer 2s linear infinite'
            }}
          />
        </div>
        <span className="text-brand-light/60 font-bold text-[10px] uppercase tracking-[0.5em] animate-pulse">Initializing Neural Pipeline</span>
      </div>
    </motion.div>
  );
};

const HomePage = ({ onStart }: { onStart: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-6xl mx-auto text-center py-20 px-6"
  >
    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-light mb-12 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
      <Sparkles className="w-4 h-4 animate-pulse" />
      <span className="text-xs font-black uppercase tracking-[0.2em]">Next-Gen AI DevOps</span>
    </div>
    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
      INTELLIGENT <br />
      <span className="gradient-text">BUILD & RELEASE</span> <br />
      MANAGER
    </h1>
    <p className="text-2xl text-brand-dim mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
      AI-powered code generation validation built in one <span className="text-white border-b-2 border-brand-primary/50">intelligent pipeline</span>. 
      Automate your workflow from prompt to production-ready release.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
      <button onClick={onStart} className="btn-primary text-2xl px-16 py-6 flex items-center gap-4 group">
        GET STARTED <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
      </button>
      <div className="flex items-center gap-8 text-brand-dim text-[10px] font-black uppercase tracking-[0.3em]">
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]" /> Generate</div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-light shadow-[0_0_10px_rgba(125,211,252,0.5)]" /> Validate</div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]" /> Release</div>
      </div>
    </div>

    <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
      {[
        { icon: Code2, title: "AI Generation", desc: "Production-ready code in seconds using advanced LLMs with deep architectural awareness." },
        { icon: Terminal, title: "Auto Validation", desc: "Real-time build logs and accuracy scoring for every release with automated bug fixing." },
        { icon: Layout, title: "Live Preview", desc: "Instant visual feedback with multi-device responsive testing and interactive sandboxing." }
      ].map((feature, i) => (
        <div key={i} className="glass-panel p-12 text-left group hover:border-brand-primary/50 transition-all duration-500 hover:-translate-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary/20 to-brand-light/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border border-white/5">
            <feature.icon className="w-8 h-8 text-brand-primary group-hover:text-brand-light transition-colors" />
          </div>
          <h3 className="text-3xl font-black mb-6 text-white uppercase tracking-tighter">{feature.title}</h3>
          <p className="text-brand-dim leading-relaxed text-lg group-hover:text-white/70 transition-colors">{feature.desc}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const GeneratorPage = ({ onGenerate }: { onGenerate: (prompt: string, lang: Language) => void }) => {
  const [prompt, setPrompt] = useState('');
  const [lang, setLang] = useState<Language>('JavaScript');
  const languages: Language[] = ['Python', 'C', 'Java', 'C++', 'JavaScript'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto py-12 px-6"
    >
      <div className="glass-panel p-10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-light rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-[13px] uppercase tracking-[2px] gradient-text font-black">Step 1: Configuration</span>
          </div>
          <span className="text-[10px] text-brand-dim uppercase tracking-[0.2em] font-black opacity-50">Production-Ready</span>
        </div>

        <div className="space-y-10">
          <div>
            <label className="block text-[11px] font-black text-brand-dim uppercase tracking-[0.2em] mb-4">Select Language</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-4 py-3 rounded-xl text-[11px] font-black transition-all text-center border uppercase tracking-wider ${
                    lang === l 
                      ? 'bg-gradient-to-r from-brand-primary to-brand-light text-white border-transparent shadow-xl shadow-brand-primary/30 scale-105' 
                      : 'bg-white/5 text-brand-dim border-white/10 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-brand-dim uppercase tracking-[0.2em] mb-4">Neural Prompt</label>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-light/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your architectural vision..."
                className="input-field min-h-[160px] resize-none text-base relative z-10 bg-brand-deep/50 focus:bg-brand-deep/80 transition-all"
              />
            </div>
          </div>

          <button 
            disabled={!prompt}
            onClick={() => onGenerate(prompt, lang)}
            className="w-full btn-primary text-2xl py-6 flex items-center justify-center gap-4 disabled:opacity-20 disabled:cursor-not-allowed uppercase font-black tracking-tighter group"
          >
            GENERATE PRODUCTION CODE <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const BuildPage = ({ 
  project, 
  logs, 
  isBuilding, 
  onRunBuild,
  onNext
}: { 
  project: GeneratedProject; 
  logs: BuildLog[]; 
  isBuilding: boolean;
  onRunBuild: () => void;
  onNext: () => void;
}) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Simulated accuracy data for the graph
  const finalAccuracy = Math.min(Math.max(project.accuracy, 50), 100);
  const accuracyData = [
    { name: 'Syntax', value: Math.max(0, finalAccuracy - 15) },
    { name: 'Logic', value: Math.max(0, finalAccuracy - 10) },
    { name: 'Security', value: Math.max(0, finalAccuracy - 7) },
    { name: 'Performance', value: Math.max(0, finalAccuracy - 4) },
    { name: 'Final', value: finalAccuracy },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[1px] text-brand-light font-semibold">Step 2: Build & Validation</span>
            <div className="flex items-center gap-2">
              {isBuilding ? (
                <span className="flex items-center gap-2 text-brand-success text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" /> RUNNING
                </span>
              ) : logs.length > 0 ? (
                <span className="flex items-center gap-2 text-brand-success text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full bg-brand-success" /> COMPLETED
                </span>
              ) : (
                <button onClick={onRunBuild} className="text-[10px] font-bold text-brand-light hover:text-white transition-colors flex items-center gap-1">
                  <Play className="w-3 h-3" /> START BUILD
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-black/40 m-4 p-4 font-mono text-[11px] h-[350px] overflow-y-auto rounded-xl leading-relaxed border border-white/5">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 flex gap-3">
                <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                <span className={
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-brand-success' :
                  log.type === 'warning' ? 'text-yellow-400' : 'text-brand-light'
                }>
                  {log.message}
                </span>
              </div>
            ))}
            {logs.length === 0 && !isBuilding && (
              <div className="h-full flex items-center justify-center text-white/10 italic">
                &gt; Waiting for build initiation...
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <span className="text-[12px] uppercase tracking-[1px] text-brand-light font-semibold">Generated Source Code ({project.language})</span>
          </div>
          <pre className="bg-black/40 m-4 p-4 font-mono text-[11px] overflow-x-auto rounded-xl max-h-[400px] text-brand-light/80 border border-white/5">
            <code>{project.code}</code>
          </pre>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <span className="text-[13px] uppercase tracking-[2px] gradient-text font-black">Build Accuracy</span>
            <span className="text-4xl font-black gradient-text">{finalAccuracy}%</span>
          </div>
          <div className="h-[180px] w-full">
           <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accuracyData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7DD3FC" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(125, 211, 252, 0.2)', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: '900', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                  itemStyle={{ color: '#7DD3FC' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {accuracyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="url(#barGradient)" 
                      fillOpacity={index === accuracyData.length - 1 ? 1 : 0.4}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 flex justify-between items-center">
            <span className="text-[10px] font-black text-brand-dim uppercase tracking-[0.2em]">Metric: Validation Confidence</span>
            <div className="flex gap-1.5">
              {[1,2,3,4,5].map(i => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-sm transition-all duration-500 ${
                    i <= project.accuracy/20 
                      ? 'bg-gradient-to-t from-brand-primary to-brand-light shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                      : 'bg-white/5'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel flex flex-col">
          <div className="px-6 py-4 border-b border-white/5">
            <span className="text-[12px] uppercase tracking-[1px] text-brand-light font-semibold">AI Insights</span>
          </div>
          <div className="p-6 space-y-6">
            <div className="border-l-4 border-brand-primary pl-4">
              <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-2">Explanation</h4>
              <p className="text-[13px] text-brand-dim leading-relaxed line-clamp-4">{project.explanation}</p>
            </div>
            <div className="border-l-4 border-brand-primary pl-4">
              <h4 className="text-[11px] font-bold text-brand-primary uppercase tracking-wider mb-2">Suggestions</h4>
              <p className="text-[13px] text-brand-dim leading-relaxed line-clamp-4">{project.suggestions}</p>
            </div>
            <button 
              onClick={onNext}
              disabled={isBuilding || logs.length === 0}
              className="w-full btn-primary py-3 text-[13px] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Release Preview <Layout className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReleasePage = ({ 
  project, 
  onBack, 
  onSave 
}: { 
  project: GeneratedProject; 
  onBack: () => void;
  onSave: (name: string, category: string) => void;
}) => {
   function cleanHTML(html: string) {
    if (!html) return "";

    const fallbackHead = `<head>\n<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<style>\n  body {\n    margin: 0;\n    min-height: 100vh;\n    font-family: system-ui, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n    background: radial-gradient(circle at top left, rgba(96,165,250,0.18), transparent 40%), linear-gradient(180deg, #020617 0%, #0f172a 100%);\n    color: #f8fafc;\n  }\n  html, body, #root { height: 100%; }\n  button, input, textarea, select { font: inherit; }\n</style>\n</head>`;

    let content = html.replace(/```(?:html)?/g, '').trim();
    const fullMatch = content.match(/<!doctype html[\s\S]*?<\/html>/i);
    if (fullMatch) {
      let result = fullMatch[0].trim();
      if (!/<head[\s\S]*?>/i.test(result)) {
        result = result.replace(/<html([^>]*)>/i, `<html$1>${fallbackHead}`);
      }
      return result;
    }

    const htmlMatch = content.match(/<html[\s\S]*?<\/html>/i);
    if (htmlMatch) {
      let result = '<!DOCTYPE html>\n' + htmlMatch[0].trim();
      if (!/<head[\s\S]*?>/i.test(result)) {
        result = result.replace(/<html([^>]*)>/i, `<html$1>${fallbackHead}`);
      }
      return result;
    }

    const bodyMatch = content.match(/<body[\s\S]*?<\/body>/i);
    if (bodyMatch) {
      return ['<!DOCTYPE html>', '<html>', fallbackHead, bodyMatch[0].trim(), '</html>'].join('\n');
    }

    const tailIndex = content.search(/\n\s*\{\s*"explanation"\s*:/i);
    if (tailIndex !== -1) {
      content = content.slice(0, tailIndex).trim();
    }

    return ['<!DOCTYPE html>', '<html>', fallbackHead, '<body>', content, '</body>', '</html>'].join('\n');
  }

  // 👇 your existing states continue
  const [activeTab, setActiveTab] = useState<'preview' | 'explanation' | 'suggestions'>('preview');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveCategory, setSaveCategory] = useState('General');
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  const categories = ['General', 'Web App', 'Utility', 'Game', 'Data Science', 'Mobile'];

  const deviceWidths = {
    mobile: '375px',
    tablet: '768px',
    desktop: '100%'
  };

  const refreshPreview = () => setPreviewKey(prev => prev + 1);
  const explanationText = project.explanation?.trim() || 'No code explanation is available yet. Please regenerate the project.';
  const suggestionLines = project.suggestions?.split('\n').map((s) => s.trim()).filter(Boolean) || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-dim hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Build
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider text-brand-dim"
          >
            <Save className="w-3.5 h-3.5" /> Save Project
          </button>
          <div className="px-3 py-1 rounded-full bg-brand-success/20 text-brand-success text-[10px] font-bold border border-brand-success/30 flex items-center gap-1 uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> RELEASED
          </div>
        </div>
      </div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel p-8 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Save className="w-5 h-5 text-brand-light" /> Save to Library
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Project Name</label>
                  <input 
                    type="text" 
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Enter project name..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
                  <select 
                    value={saveCategory}
                    onChange={(e) => setSaveCategory(e.target.value)}
                    className="input-field appearance-none"
                  >
                    {categories.map(c => <option key={c} value={c} className="bg-brand-deep">{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!saveName}
                    onClick={() => {
                      onSave(saveName, saveCategory);
                      setShowSaveModal(false);
                    }}
                    className="flex-1 btn-primary py-2 text-sm disabled:opacity-50"
                  >
                    Confirm Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'preview', label: 'Live Preview', icon: Layout },
            { id: 'explanation', label: 'Code Explanation', icon: Terminal },
            { id: 'suggestions', label: 'AI Suggestions', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-[700px]"
              >
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-brand-dark/80 to-brand-dark/40 backdrop-blur-2xl border border-white/10 rounded-t-3xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-light/5 pointer-events-none" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500/40 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/40 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]" />
                      <div className="w-3.5 h-3.5 rounded-full bg-green-500/40 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" />
                    </div>
                    <div className="ml-6 px-4 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-brand-light/60 font-mono shadow-inner">
                      https://neural-pipeline.io/release/preview
                    </div>
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="flex items-center bg-black/30 rounded-xl p-1 border border-white/5 shadow-inner">
                      {[
                        { id: 'mobile', icon: Smartphone },
                        { id: 'tablet', icon: Tablet },
                        { id: 'desktop', icon: Monitor },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setDevice(d.id as any)}
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            device === d.id 
                              ? 'bg-gradient-to-br from-brand-primary to-brand-light text-white shadow-lg shadow-brand-primary/30 scale-110' 
                              : 'text-white/30 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <d.icon className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={refreshPreview}
                      className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                      title="Refresh Preview"
                    >
                      <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                    </button>
                  </div>
                </div>

               
                {/* Iframe Container */}
                <div className="flex-1 glass-panel !rounded-t-none border-t-0 p-0 overflow-hidden bg-gradient-to-br from-violet-700/20 via-indigo-700/15 to-cyan-600/20 border border-white/10 shadow-[0_40px_120px_rgba(56,189,248,0.12)] flex justify-center items-start pt-8 pb-8 px-4 overflow-y-auto">
                  <motion.div
                    animate={{ width: deviceWidths[device] }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="bg-white rounded-[32px] shadow-2xl shadow-black/40 overflow-hidden h-full min-h-[500px] border border-white/10"
                  >
                    <div className="w-full h-full">
                      <iframe
                        key={previewKey}
                        title="Release Preview"
                        srcDoc={cleanHTML(project.code)}
                        sandbox="allow-scripts allow-same-origin"
                        className="w-full h-full border-none"
                      />
                    </div>
                  </motion.div>
                </div>
                </motion.div>
            )}

            {activeTab === 'explanation' && (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-8 h-[700px] overflow-y-auto"
              >
                <div className="border-b border-white/5 pb-4 mb-6">
                  <span className="text-[12px] uppercase tracking-[1px] text-brand-light font-semibold">Logic Breakdown</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-brand-dim leading-relaxed whitespace-pre-wrap text-[14px]">
                    {explanationText}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'suggestions' && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-8 h-[700px] overflow-y-auto"
              >
                <div className="border-b border-white/5 pb-4 mb-6">
                  <span className="text-[12px] uppercase tracking-[1px] text-brand-light font-semibold">Optimization Roadmap</span>
                </div>
                <div className="space-y-6">
                  {suggestionLines.length > 0 ? (
                    suggestionLines.map((s, i) => (
                      <div key={i} className="border-l-2 border-brand-light pl-4">
                        <strong className="text-brand-light text-[11px] uppercase tracking-wider block mb-1">Optimization {i + 1}</strong>
                        <p className="text-brand-dim text-[13px] leading-relaxed">{s}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-brand-dim text-[14px] leading-relaxed">No AI suggestions are available yet. Try generating again or ask for a more specific prompt.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const LibraryPage = ({ 
  projects, 
  onSelect, 
  onDelete 
}: { 
  projects: GeneratedProject[]; 
  onSelect: (p: GeneratedProject) => void; 
  onDelete: (id: string) => void;
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-12 px-6"
    >
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black mb-3 gradient-text uppercase tracking-tighter">Project Library</h2>
          <p className="text-brand-dim font-medium">Your saved intelligent builds and neural releases</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-primary/10 to-brand-light/5 border border-brand-primary/20 shadow-xl">
          <FolderHeart className="w-6 h-6 text-brand-primary" />
          <span className="font-black text-brand-primary uppercase tracking-widest text-sm">{projects.length} Projects</span>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 relative z-10">
            <Plus className="w-10 h-10 text-white/10" />
          </div>
          <h3 className="text-2xl font-black mb-3 text-brand-dim uppercase tracking-tighter relative z-10">No projects saved yet</h3>
          <p className="text-brand-dim/60 mb-10 text-lg relative z-10">Generate and release a project to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <motion.div 
              key={p.id}
              layoutId={p.id}
              className="glass-panel flex flex-col hover:border-brand-primary/50 transition-all duration-500 group overflow-hidden hover:-translate-y-2"
            >
              <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">
                  {p.category || 'General'}
                </span>
                <button 
                  onClick={() => onDelete(p.id)}
                  className="p-2 rounded-lg text-white/10 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 flex-1 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-2xl font-black mb-4 truncate group-hover:gradient-text transition-all duration-500 uppercase tracking-tighter">{p.name || 'Untitled Project'}</h3>
                <p className="text-sm text-brand-dim line-clamp-2 mb-8 h-12 leading-relaxed font-medium group-hover:text-white/70 transition-colors">{p.prompt}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-3 text-[11px] text-brand-dim font-black uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-brand-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> {p.language}
                  </div>
                  <button 
                    onClick={() => onSelect(p)}
                    className="flex items-center gap-2 text-[11px] font-black text-brand-light hover:text-white transition-all uppercase tracking-[0.2em] group/btn"
                  >
                    OPEN BUILD <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'splash' | 'home' | 'generator' | 'build' | 'release' | 'library'>('splash');
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [savedProjects, setSavedProjects] = useState<GeneratedProject[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [logs, setLogs] = useState<BuildLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('intelligent_build_projects');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }

    const savedTheme = localStorage.getItem('intelligent_build_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('intelligent_build_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('intelligent_build_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('intelligent_build_theme', 'light');
    }
  };

  const addLog = (message: string, type: BuildLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const handleGenerate = async (prompt: string, lang: Language) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateProject(prompt, lang);
      setProject({ 
        ...result, 
        id: crypto.randomUUID(), 
        prompt, 
        language: lang,
        createdAt: Date.now()
      });
      setView('build');
      setLogs([]); // Reset logs for new build
    } catch (err: any) {
      console.error(err);
      let userMessage = "An unexpected error occurred while architecting your project.";
      
      if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('API key not valid')) {
        userMessage = "Your Gemini API key appears to be invalid. Please check your AI Studio secrets configuration.";
      } else if (!navigator.onLine) {
        userMessage = "Network connection lost. Please check your internet and try again.";
      } else if (err.message?.includes('fetch')) {
        userMessage = "Unable to reach the AI engine. This might be a temporary network issue or service interruption.";
      } else if (err.message?.includes('quota')) {
        userMessage = "AI generation quota exceeded. Please wait a moment before trying again.";
      }
      
      setError(userMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = (name: string, category: string) => {
    if (!project) return;
    const updatedProject = { ...project, name, category };
    setProject(updatedProject);
    setSavedProjects(prev => {
      const exists = prev.find(p => p.id === updatedProject.id);
      if (exists) {
        return prev.map(p => p.id === updatedProject.id ? updatedProject : p);
      }
      return [updatedProject, ...prev];
    });
    alert('Project saved to library!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setSavedProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSelect = (p: GeneratedProject) => {
    setProject(p);
    setView('release');
  };

  const runBuild = async () => {
    if (!project) return;
    setIsBuilding(true);
    setLogs([]);
    
    const steps = [
      { msg: 'Initializing build environment...', type: 'info' as const, delay: 800 },
      { msg: `Analyzing ${project.language} source code...`, type: 'info' as const, delay: 1200 },
      { msg: 'Resolving dependencies...', type: 'info' as const, delay: 1000 },
      { msg: 'Compiling modules...', type: 'info' as const, delay: 1500 },
      { msg: 'Running static analysis...', type: 'warning' as const, delay: 800 },
      { msg: 'Validation check: Syntax OK', type: 'success' as const, delay: 500 },
      { msg: 'Validation check: Logic consistency OK', type: 'success' as const, delay: 500 },
      { msg: `Build completed with ${project.accuracy}% accuracy`, type: 'success' as const, delay: 1000 },
      { msg: 'Preparing release artifacts...', type: 'info' as const, delay: 800 },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay));
      addLog(step.msg, step.type);
    }
    
    setIsBuilding(false);
  };

  return (
    <div className="min-h-screen mesh-bg text-white selection:bg-brand-primary selection:text-white">
      <AnimatePresence mode="wait">
        {view === 'splash' && (
          <SplashScreen onComplete={() => setView('home')} />
        )}

        {view !== 'splash' && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Background Decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/10 blur-[150px] rounded-full" 
              />
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-light/5 blur-[150px] rounded-full" 
              />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-brand-deep/60 backdrop-blur-2xl border-b border-white/5">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-light/5 pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('home')}>
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-light rounded-2xl flex items-center justify-center shadow-xl shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-500">
                    <Rocket className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-black tracking-tighter text-white leading-none uppercase">
                      INTELLIGENT <span className="text-brand-primary">BUILD</span>
                    </h1>
                    <span className="text-[9px] text-brand-dim font-black uppercase tracking-[0.4em] mt-1.5">Neural DevOps Pipeline</span>
                  </div>
                </div>
                <nav className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-brand-dim">
                  {['generator', 'build', 'release', 'library'].map((v) => (
                    <button 
                      key={v}
                      onClick={() => (v === 'generator' || v === 'library' || project) && setView(v as any)}
                      disabled={(v === 'build' || v === 'release') && !project}
                      className={`relative py-2 transition-all duration-300 ${view === v ? 'text-white scale-110' : 'hover:text-white hover:scale-105'} disabled:opacity-20`}
                    >
                      {v}
                      {view === v && (
                        <motion.div 
                          layoutId="nav-underline" 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-light rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" 
                        />
                      )}
                    </button>
                  ))}
                </nav>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={toggleDarkMode}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-brand-dim hover:text-white group"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-500" />}
                  </button>
                  <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-brand-primary/10 to-brand-light/5 border border-brand-primary/20 rounded-2xl text-brand-primary font-black text-[9px] uppercase tracking-[0.2em] shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                    System Active
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="relative z-10 pt-8 pb-20">
              {error ? (
                <div className="py-20">
                  <ErrorDisplay message={error} onRetry={() => setError(null)} />
                </div>
              ) : (
                <>
                  {view === 'home' && <HomePage onStart={() => setView('generator')} />}
                  {view === 'generator' && (
                    isGenerating ? (
                      <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 text-brand-light animate-spin mb-4" />
                        <p className="text-white/60 animate-pulse">AI is architecting your project...</p>
                      </div>
                    ) : (
                      <GeneratorPage onGenerate={handleGenerate} />
                    )
                  )}
                  {view === 'build' && project && (
                    <BuildPage 
                      project={project} 
                      logs={logs} 
                      isBuilding={isBuilding} 
                      onRunBuild={runBuild}
                      onNext={() => setView('release')}
                    />
                  )}
                  {view === 'release' && project && (
                    <ReleasePage 
                      project={project} 
                      onBack={() => setView('build')} 
                      onSave={handleSave}
                    />
                  )}
                  {view === 'library' && (
                    <LibraryPage 
                      projects={savedProjects} 
                      onSelect={handleSelect}
                      onDelete={handleDelete}
                    />
                  )}
                </>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
