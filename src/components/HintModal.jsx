import React from 'react';
import { Lightbulb, X, Sparkles } from 'lucide-react';

export function HintModal({ isOpen, onClose, hintData, loading }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 16, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }}>
      <div className="glass-panel-glow" style={{ maxWidth: 560, width: '100%', padding: 30, position: 'relative', border: '1px solid var(--accent-amber)', boxShadow: '0 0 30px rgba(255, 183, 0, 0.3)' }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} color="var(--accent-amber)" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 6, background: 'rgba(255, 183, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accent-amber)' }}>
            <Lightbulb size={22} color="var(--accent-amber)" />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '0.04em' }}>AI CONCEPT HINT SUBROUTINE</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>NON-SPOILER GUIDANCE ASSISTANT</div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)' }}>
            <Sparkles size={26} className="spin" style={{ marginBottom: 12, color: 'var(--accent-amber)' }} />
            <div>GENERATING CONCEPTUAL HINT...</div>
          </div>
        ) : hintData ? (
          <div>
            {hintData.focusConcept && (
              <div className="badge badge-amber" style={{ marginBottom: 14 }}>
                FOCUS CONCEPT // {hintData.focusConcept}
              </div>
            )}
            <div style={{
              background: 'rgba(255, 183, 0, 0.08)',
              border: '1px solid rgba(255, 183, 0, 0.35)',
              padding: 18,
              borderRadius: 6,
              fontSize: '0.96rem',
              lineHeight: 1.6,
              color: '#fffef0',
              marginBottom: 22,
              fontStyle: 'italic'
            }}>
              "{hintData.hint}"
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={onClose}>
                BACK TO ANSWER TERMINAL
              </button>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
            Unable to generate hint at this moment.
          </div>
        )}

      </div>
    </div>
  );
}

