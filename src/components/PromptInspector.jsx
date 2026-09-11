import React, { useState } from 'react';
import { X, Sparkles, Copy, Check } from 'lucide-react';
import { PROMPT_ENGINEERING_TECHNIQUES } from '../data/promptDocData';
import { buildSystemPrompt } from '../services/promptTemplates';

export function PromptInspector({ isOpen, onClose, sessionConfig }) {
  const [activeTab, setActiveTab] = useState('role-persona');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentTechnique = PROMPT_ENGINEERING_TECHNIQUES.find(t => t.id === activeTab) || PROMPT_ENGINEERING_TECHNIQUES[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleSystemPrompt = sessionConfig 
    ? buildSystemPrompt(sessionConfig) 
    : buildSystemPrompt({ role: 'Frontend Engineer', level: 'Senior', focus: 'Technical Coding', persona: 'techLead', questionCount: 3 });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 16, 0.88)',
      backdropFilter: 'blur(14px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 24
    }}>
      <div className="glass-panel-glow" style={{ maxWidth: 980, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', border: '1px solid var(--accent-cyan)' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4, 10, 24, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 6, background: 'var(--cyber-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="#000" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-cyan)', letterSpacing: '0.04em' }}>PROMPT ENGINEERING HUD &amp; INSPECTOR</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}>DEEP-DIVE ANALYSIS OF SYSTEM PROMPTS, COT SCHEMAS &amp; LLM GUARDRAILS</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Navigation Sidebar */}
          <div style={{ padding: 16, borderRight: '1px solid var(--border-glass)', background: 'rgba(2, 6, 16, 0.95)', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 800, marginBottom: 14, paddingLeft: 6, fontFamily: 'var(--font-tech)' }}>
              TECHNIQUE MATRIX
            </div>

            {PROMPT_ENGINEERING_TECHNIQUES.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 4,
                  marginBottom: 8,
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: activeTab === t.id ? 800 : 500,
                  fontFamily: 'var(--font-tech)',
                  letterSpacing: '0.03em',
                  background: activeTab === t.id ? 'rgba(0, 243, 255, 0.14)' : 'transparent',
                  border: '1px solid',
                  borderColor: activeTab === t.id ? 'var(--accent-cyan)' : 'transparent',
                  color: activeTab === t.id ? 'var(--accent-cyan)' : 'var(--text-main)',
                  boxShadow: activeTab === t.id ? '0 0 12px rgba(0, 243, 255, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>{t.title}</div>
                <span className="badge badge-rose" style={{ fontSize: '0.62rem', padding: '1px 6px', marginTop: 6, textTransform: 'uppercase' }}>
                  {t.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Right Main Detail Content */}
          <div style={{ padding: 30, overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{currentTechnique.title}</h3>
              <span className="badge badge-emerald" style={{ padding: '6px 12px' }}>{currentTechnique.tag}</span>
            </div>

            <p style={{ fontSize: '1rem', lineHeight: 1.65, color: '#f0f6fc', marginBottom: 18 }}>
              {currentTechnique.summary}
            </p>

            <div style={{ background: 'rgba(0, 243, 255, 0.04)', border: '1px solid rgba(0, 243, 255, 0.25)', padding: 18, borderRadius: 6, marginBottom: 22 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: 6, fontFamily: 'var(--font-tech)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>IMPLEMENTATION RATIONALE</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
                {currentTechnique.details}
              </p>
            </div>

            {/* Prompt Code Sample */}
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  PROMPT SPECIFICATION CODE:
                </span>
                <button
                  onClick={() => handleCopy(currentTechnique.id === 'role-persona' ? sampleSystemPrompt : currentTechnique.examplePrompt)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontFamily: 'var(--font-tech)' }}
                >
                  {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                  {copied ? 'COPIED' : 'COPY PROMPT'}
                </button>
              </div>

              <pre style={{ border: '1px solid rgba(0, 243, 255, 0.25)', borderRadius: 6 }}>
                <code>
                  {currentTechnique.id === 'role-persona' ? sampleSystemPrompt : currentTechnique.examplePrompt}
                </code>
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

