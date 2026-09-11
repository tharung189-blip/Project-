import React, { useState, useEffect } from 'react';
import {
  Mic, MicOff, Send, Lightbulb, Clock, CheckCircle,
  Loader2, Sparkles, AlertCircle, Brain, ChevronDown, ChevronUp
} from 'lucide-react';
import { InterviewerCard } from './InterviewerCard';
import { CodeEditor } from './CodeEditor';
import { HintModal } from './HintModal';
import { speechService } from '../services/speechService';
import { evaluateResponse, fetchHint } from '../services/geminiApi';

export function InterviewRoom({ sessionConfig, currentQuestion, onCompleteSession, onOpenPromptLab }) {
  const [questionIndex, setQuestionIndex] = useState(1);
  const [questionData, setQuestionData] = useState(currentQuestion);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [questionHistory, setQuestionHistory] = useState([]);

  const [status, setStatus] = useState('idle'); // 'idle' | 'evaluating'
  const [lastFeedback, setLastFeedback] = useState(null);

  // Timer
  const [seconds, setSeconds] = useState(0);

  // Voice Input
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  // Hint
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintData, setHintData] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);

  // Backend Thinking Trace toggle — was missing, causing crash on every submit
  const [showThinking, setShowThinking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleVoiceInput = () => {
    setVoiceError(null);
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const success = speechService.startListening(
        (transcript) => setCandidateAnswer(prev => prev ? `${prev} ${transcript}` : transcript),
        (err) => { setVoiceError(err); setIsListening(false); }
      );
      if (success) setIsListening(true);
    }
  };

  const handleRequestHint = async () => {
    setIsHintOpen(true);
    setHintLoading(true);
    try {
      const hintRes = await fetchHint({
        currentQuestion: questionData,
        candidateAnswerDraft: candidateAnswer
      });
      setHintData(hintRes);
    } catch {
      setHintData({ hint: 'Focus on the primary technical key points and state your assumptions clearly.', focusConcept: 'Core Concept' });
    } finally {
      setHintLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim() || status === 'evaluating') return;

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }

    setStatus('evaluating');
    setLastFeedback(null);
    setShowThinking(false);

    try {
      const result = await evaluateResponse({
        sessionConfig,
        currentQuestion: questionData,
        candidateAnswer,
        questionHistory,
        currentQuestionIndex: questionIndex
      });

      const historyItem = {
        questionIndex,
        question: questionData,
        candidateAnswer,
        evaluation: result.evaluation,
        interviewerFeedback: result.interviewerFeedback,
        thinking: result.thinking
      };

      const newHistory = [...questionHistory, historyItem];
      setQuestionHistory(newHistory);
      setLastFeedback(result);
      setStatus('idle');

      const isFinal = result.isFinalQuestion || questionIndex >= sessionConfig.questionCount;

      if (isFinal) {
        setTimeout(() => onCompleteSession(newHistory), 3500);
      } else {
        // Advance to next question after showing feedback
        setTimeout(() => {
          if (result.nextQuestion) {
            setQuestionData(result.nextQuestion);
            setQuestionIndex(qi => qi + 1);
            setCandidateAnswer('');
            setLastFeedback(null);
            setShowThinking(false);
          }
        }, 4000);
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      setStatus('idle');
    }
  };

  return (
    <div style={{ maxWidth: 1120, margin: '24px auto', padding: '0 20px' }}>

      {/* Progress Header */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 24px', marginBottom: 20,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          borderColor: 'rgba(0, 243, 255, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="badge badge-indigo" style={{ fontFamily: 'var(--font-tech)', fontSize: '0.85rem' }}>
            ROUND {questionIndex} / {sessionConfig.questionCount}
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}>
            {sessionConfig.applicantName && (
              <span style={{ color: 'var(--accent-cyan)', marginRight: 6 }}>
                [ {sessionConfig.applicantName} ] &bull;
              </span>
            )}
            {sessionConfig.role}{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              ({sessionConfig.level})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="badge badge-emerald">{sessionConfig.focus}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-tech)', fontSize: '1rem', letterSpacing: '0.05em' }}>
            <Clock size={16} color="var(--accent-cyan)" /> {formatTime(seconds)}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gap: 20 }}>

        {/* Interviewer Persona Card */}
        <InterviewerCard
          personaKey={sessionConfig.persona}
          status={status}
          currentSpeechText={lastFeedback ? lastFeedback.interviewerFeedback : questionData.questionText}
        />

        {/* Question Card */}
        <div className="glass-panel-glow" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 800, fontFamily: 'var(--font-tech)' }}>
              PROTOCOL CATEGORY // {questionData.category || 'Technical Deep-Dive'}
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRequestHint}
              style={{ fontSize: '0.78rem', padding: '4px 12px' }}
            >
              <Lightbulb size={14} color="var(--accent-amber)" /> REQUEST AI HINT
            </button>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.45, marginBottom: 18, color: '#fff' }}>
            "{questionData.questionText}"
          </h2>

          {questionData.expectedKeyPoints && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>TARGET KEY POINTS:</span>
              {questionData.expectedKeyPoints.map((kp, idx) => (
                <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem', padding: '2px 8px', textTransform: 'none' }}>
                  {kp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answer Workspace */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-tech)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
              CANDIDATE RESPONSE TERMINAL
            </label>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`btn-secondary ${isListening ? 'pulse-glow' : ''}`}
              style={{
                fontSize: '0.8rem',
                borderColor: isListening ? 'var(--accent-emerald)' : 'var(--border-glass)',
                color: isListening ? 'var(--accent-emerald)' : 'var(--text-main)'
              }}
            >
              {isListening ? <MicOff size={15} color="var(--accent-magenta)" /> : <Mic size={15} color="var(--accent-emerald)" />}
              <span>{isListening ? 'RECORDING AUDIO — CLICK TO STOP...' : 'VOICE INPUT'}</span>
            </button>
          </div>

          {voiceError && (
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-magenta)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-tech)' }}>
              <AlertCircle size={14} /> {voiceError}
            </div>
          )}

          <CodeEditor
            value={candidateAnswer}
            onChange={setCandidateAnswer}
            placeholder="Type or speak your answer here. Include assumptions, code snippets, and trade-offs..."
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onOpenPromptLab}
              style={{ fontSize: '0.78rem' }}
            >
              <Sparkles size={14} color="var(--accent-cyan)" /> INSPECT PROMPT LAB
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmitAnswer}
              disabled={!candidateAnswer.trim() || status === 'evaluating'}
            >
              {status === 'evaluating' ? (
                <><Loader2 size={16} className="spin" color="#000" /> EVALUATING...</>
              ) : (
                <><Send size={16} color="#000" /> SUBMIT RESPONSE</>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Panel — shown after submit */}
        {lastFeedback && (
          <div className="glass-panel-glow" style={{ padding: 26, borderLeft: '4px solid var(--accent-cyan)' }}>

            {/* Header Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={22} color="var(--accent-emerald)" />
                <span style={{ fontFamily: 'var(--font-hud)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.04em' }}>EVALUATION REPORT</span>
              </div>
              <div className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
                OVERALL SCORE: {lastFeedback.evaluation?.overallScore ?? '—'} / 100
              </div>
            </div>

            {/* Interviewer Speech */}
            <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#f1f5f9', marginBottom: 18, fontStyle: 'italic', background: 'rgba(0,0,0,0.3)', padding: 14, borderRadius: 6, borderLeft: '3px solid var(--accent-magenta)' }}>
              "{lastFeedback.interviewerFeedback}"
            </p>

            {/* ── Concept Coverage Breakdown ── */}
            {lastFeedback.evaluation?.keyPointResults?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontFamily: 'var(--font-tech)' }}>
                  CONCEPT COVERAGE MATRIX — {lastFeedback.evaluation.coverageCount} / {lastFeedback.evaluation.totalPoints} POINTS VERIFIED
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lastFeedback.evaluation.keyPointResults.map((r, i) => (
                    <div key={i} style={{
                      padding: '12px 16px',
                      borderRadius: 6,
                      border: `1px solid ${r.covered ? 'rgba(0, 255, 153, 0.4)' : 'rgba(255, 0, 127, 0.4)'}`,
                      background: r.covered ? 'rgba(0, 255, 153, 0.06)' : 'rgba(255, 0, 127, 0.06)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1rem' }}>{r.covered ? '✅' : '❌'}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: r.covered ? 'var(--accent-emerald)' : 'var(--accent-magenta)', fontFamily: 'var(--font-tech)' }}>
                            {r.keyPoint}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 800,
                          color: r.covered ? 'var(--accent-emerald)' : 'var(--accent-magenta)',
                          background: r.covered ? 'rgba(0, 255, 153, 0.15)' : 'rgba(255, 0, 127, 0.15)',
                          padding: '3px 10px', borderRadius: 4, fontFamily: 'var(--font-tech)'
                        }}>
                          {Math.round(r.coverageRatio * 100)}% MATCH
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.round(r.coverageRatio * 100)}%`,
                          background: r.covered
                            ? 'linear-gradient(90deg, #00ff99, #00f3ff)'
                            : 'linear-gradient(90deg, #ff007f, #ff4444)',
                          boxShadow: r.covered ? '0 0 10px #00ff99' : '0 0 10px #ff007f',
                          transition: 'width 0.6s ease'
                        }} />
                      </div>
                      {r.matchedTerms.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 6, fontFamily: 'var(--font-code)' }}>
                          Matched: <span style={{ color: 'var(--accent-emerald)' }}>{r.matchedTerms.join(', ')}</span>
                          {r.missedTerms.length > 0 && (
                            <> &nbsp;|&nbsp; Missing: <span style={{ color: 'var(--accent-magenta)' }}>{r.missedTerms.slice(0, 3).join(', ')}</span></>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Communication Score Badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                { label: 'Technical Accuracy', val: lastFeedback.evaluation?.accuracyScore, color: 'var(--accent-cyan)' },
                { label: 'Problem Solving',    val: lastFeedback.evaluation?.problemSolvingScore, color: 'var(--accent-emerald)' },
                { label: 'Communication',      val: lastFeedback.evaluation?.communicationScore, color: 'var(--accent-amber)' },
              ].map(m => (
                <div key={m.label} style={{ flex: '1 1 140px', background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 6, border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2, fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: m.color, fontFamily: 'var(--font-hud)' }}>{m.val ?? '—'}</div>
                </div>
              ))}
            </div>

            {/* AI Backend Thinking Trace Toggle */}
            {lastFeedback.thinking && (
              <div style={{ borderTop: '1px dashed var(--border-glass)', paddingTop: 14 }}>
                <button
                  type="button"
                  onClick={() => setShowThinking(v => !v)}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '8px 16px', width: '100%', justifyContent: 'center', gap: 8 }}
                >
                  <Brain size={14} color="var(--accent-cyan)" />
                  {showThinking ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  <span>{showThinking ? 'HIDE CHAIN-OF-THOUGHT TRACE' : 'INSPECT BACKEND CHAIN-OF-THOUGHT REASONING TRACE'}</span>
                </button>

                {showThinking && (
                  <div style={{ marginTop: 12, background: 'rgba(0,0,0,0.7)', padding: 16, borderRadius: 6, border: '1px solid rgba(0,243,255,0.3)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-tech)' }}>
                      CHAIN-OF-THOUGHT &amp; REASONING METRICS:
                    </div>
                    <pre style={{ margin: 0, fontSize: '0.78rem', color: 'var(--accent-cyan)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      <code>{lastFeedback.thinking}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Status hint */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 16, textAlign: 'right', fontFamily: 'var(--font-tech)' }}>
              {lastFeedback.isFinalQuestion || questionIndex >= sessionConfig.questionCount
                ? '✅ PROTOCOL COMPLETE — GENERATING FINAL SCORECARD...'
                : '⏭ LOADING NEXT ROUND...'}
            </div>
          </div>
        )}

      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        hintData={hintData}
        loading={hintLoading}
      />
    </div>
  );
}

