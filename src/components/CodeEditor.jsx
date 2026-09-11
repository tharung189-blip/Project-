import React, { useState } from 'react';
import { Code2, Type, FileCode, Copy, Check } from 'lucide-react';

export function CodeEditor({ value, onChange, placeholder }) {
  const [mode, setMode] = useState('text'); // 'text' | 'code'
  const [language, setLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const insertCodeTemplate = () => {
    const templates = {
      javascript: `// Solution Implementation\nfunction solution(input) {\n  // TODO: Implement solution\n  return true;\n}`,
      python: `# Solution Implementation\ndef solution(input):\n    # TODO: Implement solution\n    return True`,
      typescript: `interface Config {\n  id: string;\n}\n\nfunction solution(input: Config): boolean {\n  return true;\n}`,
      sql: `SELECT id, name, COUNT(*)\nFROM orders\nGROUP BY id, name\nHAVING COUNT(*) > 1;`
    };

    const snippet = templates[language] || templates.javascript;
    onChange(value ? `${value}\n\n\`\`\`${language}\n${snippet}\n\`\`\`` : `\`\`\`${language}\n${snippet}\n\`\`\``);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-glass)', background: 'rgba(2, 6, 16, 0.95)' }}>
      
      {/* Editor Toolbar */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(4, 10, 24, 0.95)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }}>
        
        {/* Toggle Text vs Code Snippet Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', padding: 4, borderRadius: 4, border: '1px solid rgba(0,243,255,0.2)' }}>
          <button
            type="button"
            onClick={() => setMode('text')}
            style={{
              padding: '6px 12px',
              borderRadius: 2,
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: mode === 'text' ? 'var(--accent-cyan)' : 'transparent',
              color: mode === 'text' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Type size={13} style={{ marginRight: 4 }} /> TEXT ANSWER
          </button>

          <button
            type="button"
            onClick={() => { setMode('code'); if (!value.includes('```')) insertCodeTemplate(); }}
            style={{
              padding: '6px 12px',
              borderRadius: 2,
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-tech)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: mode === 'code' ? 'var(--accent-cyan)' : 'transparent',
              color: mode === 'code' ? '#000' : 'var(--text-muted)'
            }}
          >
            <Code2 size={13} style={{ marginRight: 4 }} /> CODE BLOCK
          </button>
        </div>

        {/* Language selector & Code Template insert */}
        {mode === 'code' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.78rem', height: 'auto', width: 'auto', background: 'rgba(0,0,0,0.7)', borderColor: 'var(--accent-cyan)' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
            </select>

            <button
              type="button"
              className="btn-secondary"
              onClick={insertCodeTemplate}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              <FileCode size={13} /> INSERT BOILERPLATE
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleCopy}
          style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontFamily: 'var(--font-tech)', letterSpacing: '0.04em' }}
        >
          {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>

      </div>

      {/* Textarea Input */}
      <textarea
        className="form-textarea"
        rows={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Structure your answer here. State key architectural points, time/space complexity, trade-offs, or pseudocode..."}
        style={{
          border: 'none',
          borderRadius: 0,
          background: 'transparent',
          fontFamily: mode === 'code' ? 'var(--font-code)' : 'var(--font-main)',
          fontSize: '0.94rem',
          lineHeight: 1.6,
          resize: 'vertical',
          padding: 18,
          color: '#f0f6fc'
        }}
      />

    </div>
  );
}

