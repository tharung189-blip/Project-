import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Onboarding } from './components/Onboarding';
import { InterviewRoom } from './components/InterviewRoom';
import { Scorecard } from './components/Scorecard';
import { PromptInspector } from './components/PromptInspector';
import { fetchFirstQuestion } from './services/geminiApi';
import { Loader2 } from 'lucide-react';

export function App() {
  const [sessionStage, setSessionStage] = useState('onboarding'); // 'onboarding' | 'interviewing' | 'scorecard'
  const [sessionConfig, setSessionConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [fullHistory, setFullHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [isPromptLabOpen, setIsPromptLabOpen] = useState(false);

  const handleStartSession = async (config) => {
    setSessionConfig(config);
    setLoading(true);

    try {
      const firstQ = await fetchFirstQuestion({ sessionConfig: config });
      setCurrentQuestion(firstQ);
      setSessionStage('interviewing');
    } catch (e) {
      console.error("Error launching session:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = (history) => {
    setFullHistory(history);
    setSessionStage('scorecard');
  };

  const handleResetSession = () => {
    setSessionStage('onboarding');
    setSessionConfig(null);
    setCurrentQuestion(null);
    setFullHistory([]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <Navbar 
        onOpenPromptLab={() => setIsPromptLabOpen(true)}
        sessionActive={sessionStage !== 'onboarding'}
        onResetSession={handleResetSession}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {loading ? (
          <div style={{ maxWidth: 500, margin: '100px auto', textAlign: 'center', padding: 40 }} className="glass-panel-glow">
            <Loader2 size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Initializing AI Interview Environment...</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
              Setting up interviewer persona and preparing first tailored question.
            </p>
          </div>
        ) : sessionStage === 'onboarding' ? (
          <Onboarding 
            onStartSession={handleStartSession}
          />
        ) : sessionStage === 'interviewing' ? (
          <InterviewRoom 
            sessionConfig={sessionConfig}
            currentQuestion={currentQuestion}
            onCompleteSession={handleCompleteSession}
            onOpenPromptLab={() => setIsPromptLabOpen(true)}
          />
        ) : (
          <Scorecard 
            sessionConfig={sessionConfig}
            fullHistory={fullHistory}
            onRestart={handleResetSession}
          />
        )}
      </main>

      {/* Prompt Inspector Educational Modal */}
      <PromptInspector 
        isOpen={isPromptLabOpen}
        onClose={() => setIsPromptLabOpen(false)}
        sessionConfig={sessionConfig}
      />

      {/* Footer */}
      <footer style={{ padding: '20px 0', textAlign: 'center', borderTop: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.82rem', fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}>
        CyberHire AI &bull; Neural AI Technical Interview Platform
      </footer>

    </div>
  );
}

export default App;
