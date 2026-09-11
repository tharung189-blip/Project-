import React, { useState } from 'react';
import { User, Briefcase, Zap, Shield, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { INTERVIEWER_PERSONAS } from '../services/promptTemplates';

export function Onboarding({ onStartSession }) {
  const [applicantName, setApplicantName] = useState('Alex');
  const [role, setRole] = useState('Frontend Engineer');
  const [level, setLevel] = useState('Senior');
  const [focus, setFocus] = useState('Technical Coding & Systems');
  const [persona, setPersona] = useState('techLead');
  const [questionCount, setQuestionCount] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartSession({
      applicantName: applicantName.trim() || 'Candidate',
      role,
      level,
      focus,
      persona,
      questionCount: Number(questionCount)
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="badge badge-indigo" style={{ marginBottom: 16, padding: '6px 18px', fontSize: '0.82rem', fontFamily: 'var(--font-tech)' }}>
          <Sparkles size={14} style={{ marginRight: 6 }} color="var(--accent-cyan)" /> CYBERHIRE AI &bull; NEURAL INTERVIEW SIMULATOR
        </div>
        <h1 style={{ fontFamily: 'var(--font-hud)', fontSize: '2.6rem', fontWeight: 900, letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: 14, background: 'linear-gradient(90deg, #fff, #00f3ff, #ff007f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CYBERHIRE AI INTERVIEW HUD
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto', fontFamily: 'var(--font-main)' }}>
          Simulate real-world technical rounds with adaptive AI feedback, Chain-of-Thought reasoning traces, hint subroutines, and full diagnostic scorecards.
        </p>
      </div>

      {/* Main Configuration Card */}
      <form onSubmit={handleSubmit} className="glass-panel-glow" style={{ padding: 38 }}>
        
        {/* Applicant Name Input */}
        <div style={{ marginBottom: 26 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <User size={18} color="var(--accent-cyan)" /> [01] Candidate / Applicant Identifier
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your name (e.g. Tharun, Alex, Sarah)"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
            style={{ fontSize: '1rem', padding: '14px 18px', background: 'rgba(2, 6, 16, 0.95)', borderColor: 'rgba(0, 243, 255, 0.3)' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 34 }}>
          
          {/* Target Role */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Briefcase size={16} color="var(--accent-cyan)" /> Target Domain / Role
            </label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Engineer">Backend Engineer</option>
              <option value="Fullstack Engineer">Fullstack Engineer</option>
              <option value="System Architect">System Architect</option>
              <option value="Data Analyst">Data Analyst / Data Analytics</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Python Developer">Python Developer</option>
              <option value="AI Engineer">AI Engineer</option>
              <option value="ML Developer">ML Developer / ML Engineer</option>
              <option value="Prompt Engineer">Prompt Engineer</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <User size={16} color="var(--accent-cyan)" /> Seniority Clearance
            </label>
            <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="Junior / Entry">Junior / Entry Level (0-2 yrs)</option>
              <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
              <option value="Senior">Senior / Tech Lead (5+ yrs)</option>
            </select>
          </div>

          {/* Interview Focus */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Zap size={16} color="var(--accent-magenta)" /> Evaluation Protocol
            </label>
            <select className="form-select" value={focus} onChange={(e) => setFocus(e.target.value)}>
              <option value="Technical Coding & Systems">Technical Coding &amp; Systems</option>
              <option value="System Architecture & Scalability">System Architecture &amp; Scalability</option>
              <option value="Behavioral & STAR Method">Behavioral &amp; STAR Method</option>
              <option value="Full Hybrid Interview">Full Hybrid Round</option>
            </select>
          </div>

          {/* Session Length */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Shield size={16} color="var(--accent-emerald)" /> Rounds / Questions
            </label>
            <select className="form-select" value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
              <option value={3}>3 Questions (Quick Sprint)</option>
              <option value={5}>5 Questions (Standard Evaluation)</option>
              <option value={7}>7 Questions (Full Deep-Dive)</option>
            </select>
          </div>

        </div>

        {/* Persona Selection */}
        <div style={{ marginBottom: 34 }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: 14, color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            [02] Select AI Interviewer Avatar &amp; Persona Matrix
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {Object.entries(INTERVIEWER_PERSONAS).map(([key, p]) => (
              <div 
                key={key} 
                className="glass-card" 
                onClick={() => setPersona(key)}
                style={{ 
                  padding: 20, 
                  cursor: 'pointer', 
                  borderColor: persona === key ? 'var(--accent-cyan)' : 'rgba(0, 243, 255, 0.15)',
                  background: persona === key ? 'rgba(0, 243, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                  boxShadow: persona === key ? '0 0 20px rgba(0, 243, 255, 0.3)' : 'none',
                  position: 'relative'
                }}
              >
                {persona === key && (
                  <CheckCircle2 size={20} color="var(--accent-cyan)" style={{ position: 'absolute', top: 16, right: 16 }} />
                )}
                <div style={{ fontFamily: 'var(--font-tech)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 4, color: persona === key ? 'var(--accent-cyan)' : '#fff', letterSpacing: '0.03em' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {p.tagline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="btn-primary" style={{ padding: '16px 48px', fontSize: '1.1rem', gap: 12 }}>
            <Play size={20} color="#000" /> INITIALIZE INTERVIEW SESSION
          </button>
        </div>

      </form>
    </div>
  );
}

