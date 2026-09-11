import React from 'react';
import { Sparkles, RefreshCw, Cpu, Terminal, Radio } from 'lucide-react';

export function Navbar({ onOpenPromptLab, sessionActive, onResetSession }) {
  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 28px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(0, 243, 255, 0.3)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={onResetSession}>
          <div style={{ 
            width: 42, 
            height: 42, 
            borderRadius: 6, 
            background: 'var(--cyber-gradient)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.6)',
            border: '1px solid #00f3ff'
          }}>
            <Cpu size={24} color="#000" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.06em', background: 'linear-gradient(90deg, #00f3ff, #ff007f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center' }}>
              CYBERHIRE_AI <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '2px 8px', marginLeft: 8, fontFamily: 'var(--font-tech)' }}>v2.0 HUD</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={12} color="var(--accent-cyan)" /> NEURAL AI INTERVIEW PLATFORM
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          
          {/* Status Indicator */}
          <div className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px' }}>
            <Radio size={12} className="spin" color="var(--accent-emerald)" />
            <span>SYS // ONLINE</span>
          </div>

          {/* Prompt Lab Button */}
          <button 
            className="btn-secondary" 
            onClick={onOpenPromptLab}
            title="Inspect Prompt Engineering Techniques & System Prompts"
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>PROMPT LAB</span>
            <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '2px 6px', marginLeft: 4 }}>5 PROMPTS</span>
          </button>

          {/* Reset Session */}
          {sessionActive && (
            <button 
              className="btn-secondary" 
              onClick={onResetSession}
              title="Start New Interview Session"
              style={{ padding: '10px 14px' }}
            >
              <RefreshCw size={16} color="var(--accent-magenta)" />
            </button>
          )}

        </div>
      </div>
    </nav>
  );
}

