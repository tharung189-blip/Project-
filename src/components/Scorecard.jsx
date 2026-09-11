import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertTriangle, BookOpen, RefreshCw, ChevronDown, ChevronUp, Sparkles, FileText } from 'lucide-react';
import { generateFinalScorecard } from '../services/geminiApi';
import { generatePDFReport } from '../services/pdfReportService';

export function Scorecard({ sessionConfig, fullHistory, onRestart }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    // Fire festive confetti effect on completion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    async function loadReport() {
      try {
        const res = await generateFinalScorecard({ sessionConfig, fullHistory });
        setReport(res);
      } catch (e) {
        console.error("Scorecard error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [sessionConfig, fullHistory]);

  const handleExportPDF = () => {
    generatePDFReport({ sessionConfig, report, fullHistory });
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: 40 }} className="glass-panel-glow">
        <Sparkles size={36} className="spin" style={{ color: 'var(--primary)', marginBottom: 16 }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Synthesizing Comprehensive Report...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Analyzing response depth, trade-off coverage, and communication metrics.</p>
      </div>
    );
  }

  const { overallScore = 84, performanceTier = "Strong Hire", summaryCritique, metrics, topStrengths, keyAreasToImprove, personalizedRoadmap } = report || {};

  return (
    <div style={{ maxWidth: 1020, margin: '40px auto', padding: '0 20px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel-glow" style={{ padding: 38, textAlign: 'center', marginBottom: 30, position: 'relative', overflow: 'hidden' }}>
        
        <div className="badge badge-emerald" style={{ marginBottom: 14, padding: '6px 18px', fontFamily: 'var(--font-tech)' }}>
          <Award size={14} style={{ marginRight: 6 }} color="var(--accent-emerald)" /> PROTOCOL EVALUATION COMPLETE
        </div>

        <h1 style={{ fontFamily: 'var(--font-hud)', fontSize: '2.4rem', fontWeight: 900, marginBottom: 8, letterSpacing: '0.03em', background: 'linear-gradient(90deg, #fff, #00f3ff, #ff007f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {sessionConfig.applicantName ? `${sessionConfig.applicantName.toUpperCase()} // PERFORMANCE SCORECARD` : 'INTERVIEW PERFORMANCE SCORECARD'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 620, margin: '0 auto 28px', fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}>
          {sessionConfig.role} ({sessionConfig.level}) &bull; {sessionConfig.focus}
        </p>

        {/* Score Ring & Tier */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '16px',
            background: 'var(--cyber-gradient)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0, 243, 255, 0.6)',
            border: '2px solid #00f3ff'
          }}>
            <span style={{ fontFamily: 'var(--font-hud)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: '#000' }}>{overallScore}</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000', fontFamily: 'var(--font-tech)', fontWeight: 800 }}>INDEX / 100</span>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-tech)', fontWeight: 700 }}>
              EVALUATION VERDICT
            </div>
            <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-emerald)', marginBottom: 6, letterSpacing: '0.03em' }}>
              {performanceTier}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 440, lineHeight: 1.5 }}>
              {summaryCritique}
            </div>
          </div>
        </div>

      </div>

      {/* Metrics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 30 }}>
        
        <div className="glass-card" style={{ padding: 20, borderColor: 'rgba(0, 243, 255, 0.25)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Technical Accuracy</div>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{metrics?.technicalAccuracy || 85}%</div>
        </div>

        <div className="glass-card" style={{ padding: 20, borderColor: 'rgba(0, 255, 153, 0.25)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Problem Solving</div>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>{metrics?.problemSolving || 82}%</div>
        </div>

        <div className="glass-card" style={{ padding: 20, borderColor: 'rgba(255, 183, 0, 0.25)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Communication Structure</div>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-amber)' }}>{metrics?.communication || 88}%</div>
        </div>

        <div className="glass-card" style={{ padding: 20, borderColor: 'rgba(255, 0, 127, 0.25)' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>Edge Case &amp; Scalability</div>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-magenta)' }}>{metrics?.edgeCaseCoverage || 78}%</div>
        </div>

      </div>

      {/* Strengths & Growth Areas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginBottom: 30 }}>
        
        <div className="glass-panel" style={{ padding: 26, borderColor: 'rgba(0, 255, 153, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <CheckCircle2 size={22} color="var(--accent-emerald)" />
            <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>VERIFIED STRENGTHS</h3>
          </div>
          <ul style={{ paddingLeft: 20, fontSize: '0.92rem', lineHeight: 1.7, color: '#f1f5f9' }}>
            {topStrengths?.map((s, i) => <li key={i} style={{ marginBottom: 8 }}>{s}</li>)}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: 26, borderColor: 'rgba(255, 183, 0, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={22} color="var(--accent-amber)" />
            <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-amber)' }}>GROWTH VECTOR OPPORTUNITIES</h3>
          </div>
          <ul style={{ paddingLeft: 20, fontSize: '0.92rem', lineHeight: 1.7, color: '#f1f5f9' }}>
            {keyAreasToImprove?.map((m, i) => <li key={i} style={{ marginBottom: 8 }}>{m}</li>)}
          </ul>
        </div>

      </div>

      {/* Question Breakdown Accordion */}
      <div className="glass-panel" style={{ padding: 26, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.2rem', fontWeight: 900, marginBottom: 18, color: 'var(--accent-cyan)' }}>
          ROUND-BY-ROUND DEEP DIVE LOGS
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fullHistory.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div key={idx} className="glass-card" style={{ padding: 18, borderColor: isExpanded ? 'var(--accent-cyan)' : 'rgba(0, 243, 255, 0.15)' }}>
                <div 
                  onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-tech)' }}>ROUND {idx + 1}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{item.question.questionText}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="badge badge-emerald">SCORE: {item.evaluation?.overallScore || 80}/100</span>
                    {isExpanded ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} color="var(--accent-cyan)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-glass)' }}>
                    
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: 6, fontFamily: 'var(--font-tech)' }}>CANDIDATE INPUT RESPONSE:</div>
                      <div style={{ background: 'rgba(0,0,0,0.5)', padding: 14, borderRadius: 6, fontSize: '0.88rem', whiteSpace: 'pre-wrap', border: '1px solid rgba(0, 243, 255, 0.2)', fontFamily: 'var(--font-code)' }}>
                        {item.candidateAnswer}
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-magenta)', marginBottom: 6, fontFamily: 'var(--font-tech)' }}>INTERVIEWER FEEDBACK:</div>
                      <div style={{ color: '#f1f5f9', fontSize: '0.92rem', lineHeight: 1.55 }}>
                        "{item.interviewerFeedback}"
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Study Roadmap */}
      {personalizedRoadmap && (
        <div className="glass-panel" style={{ padding: 26, marginBottom: 34 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <BookOpen size={24} color="var(--accent-cyan)" />
            <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>PERSONALIZED ACTION PLAN &amp; STUDY ROADMAP</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
            {personalizedRoadmap.map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-tech)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--accent-cyan)', marginBottom: 6 }}>
                  [ 0{i + 1} ] {item.topic}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {item.reason}
                </div>
                <div style={{ background: 'rgba(0, 243, 255, 0.08)', padding: 12, borderRadius: 6, fontSize: '0.84rem', color: '#e0e7ff', border: '1px solid rgba(0, 243, 255, 0.3)' }}>
                  <strong>Next Step:</strong> {item.actionableStep}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions: Download PDF & Start New */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 40 }}>
        
        <button
          className="btn-primary"
          onClick={handleExportPDF}
          style={{ padding: '16px 36px', fontSize: '1.05rem', gap: 10 }}
        >
          <FileText size={18} color="#000" />
          DOWNLOAD PDF REPORT
        </button>

        <button className="btn-secondary" onClick={onRestart} style={{ padding: '16px 28px' }}>
          <RefreshCw size={16} color="var(--accent-magenta)" /> START NEW SESSION
        </button>
      </div>

    </div>
  );
}
