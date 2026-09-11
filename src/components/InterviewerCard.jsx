import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Bot, Loader2 } from 'lucide-react';
import { speechService } from '../services/speechService';
import { INTERVIEWER_PERSONAS } from '../services/promptTemplates';

export function InterviewerCard({ personaKey, status, currentSpeechText }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const persona = INTERVIEWER_PERSONAS[personaKey] || INTERVIEWER_PERSONAS.techLead;

  useEffect(() => {
    if (currentSpeechText && !isMuted && status === 'idle') {
      setIsSpeaking(true);
      speechService.speak(currentSpeechText, () => {
        setIsSpeaking(false);
      });
    }
    return () => {
      speechService.stopSpeaking();
    };
  }, [currentSpeechText, isMuted, status]);

  const toggleMute = () => {
    if (!isMuted) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="glass-card" style={{ padding: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, borderColor: 'rgba(0, 243, 255, 0.3)', background: 'rgba(4, 10, 24, 0.9)' }}>

      {/* Left Avatar & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

        {/* Avatar Ring */}
        <div style={{ position: 'relative' }}>
          <div className={isSpeaking ? 'pulse-glow' : ''} style={{
            width: 58,
            height: 58,
            borderRadius: '12px',
            background: 'var(--cyber-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #00f3ff',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
          }}>
            <Bot size={30} color="#000" />
          </div>

          {/* Status Indicator Dot */}
          <div style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: status === 'thinking' ? 'var(--accent-amber)' : isSpeaking ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            border: '2px solid var(--bg-dark)',
            boxShadow: `0 0 10px ${status === 'thinking' ? 'var(--accent-amber)' : isSpeaking ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}`
          }} />
        </div>

        {/* Persona Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-tech)', fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '0.04em' }}>{persona.name}</span>
            <span className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>AI LEAD AGENT</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}>
            {status === 'thinking' ? (
              <span style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Loader2 size={13} className="spin" /> EVALUATING RESPONSE VIA CHAIN-OF-THOUGHT...
              </span>
            ) : isSpeaking ? (
              <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 6 }}>
                SYNTHESIZING AUDIO SPEECH...
              </span>
            ) : (
              <span style={{ color: 'var(--accent-cyan)' }}>STANDBY // READY FOR CANDIDATE INPUT</span>
            )}
          </div>
        </div>

      </div>

      {/* Speech Audio Visualizer & Mute Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

        {/* Animated Wave bars when speaking */}
        {isSpeaking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 24, padding: '0 8px' }}>
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
            <div className="voice-wave-bar" />
          </div>
        )}

        <button
          onClick={toggleMute}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          title={isMuted ? 'Unmute Audio Speech' : 'Mute Speech Output'}
        >
          {isMuted ? <VolumeX size={16} color="var(--accent-magenta)" /> : <Volume2 size={16} color="var(--accent-emerald)" />}
          <span>{isMuted ? 'MUTE' : 'TTS VOICE ON'}</span>
        </button>

      </div>

    </div>
  );
}

