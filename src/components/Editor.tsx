import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, Clock, Code, Clipboard, Trash2, FileCode2 } from 'lucide-react';
import type { ShareData } from '../lib/shareEngine';
import { generateShareId, encodeSharePayload, saveShareToHistory } from '../lib/shareEngine';

interface EditorProps {
  onShareCreated: (share: ShareData, url: string) => void;
  onShowToast: (msg: string) => void;
}

const LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'javascript', label: 'JavaScript / TS' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML / XML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'cpp', label: 'C / C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'yaml', label: 'YAML' }
];

export const Editor: React.FC<EditorProps> = ({ onShareCreated, onShowToast }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [expiration, setExpiration] = useState('Never');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        onShowToast('Pasted text from clipboard!');
      }
    } catch {
      onShowToast('Clipboard access denied or unavailable.');
    }
  };

  const handleLoadSample = () => {
    setTitle('Welcome to ShareText');
    setLanguage('markdown');
    setContent(`# Welcome to ShareText! 🚀\n\nShareText is a modern, high-speed text and code sharing platform that runs **indefinitely for free**.\n\n### Features Included:\n* **Markdown Support**: Headers, lists, blockquotes, and tables.\n* **Syntax Highlighting**: Over 30+ programming languages.\n* **Zero Server Overhead**: Snippets are compressed and stored securely.\n* **Instant QR Code**: Share links with mobile devices seamlessly.\n\n\`\`\`javascript\n// Quick code example\nfunction shareAwesomeText(input) {\n  console.log("Sharing text instantly:", input);\n  return { status: 200, success: true };\n}\n\`\`\`\n\nPaste your text or code above to create your share link!`);
    onShowToast('Loaded sample Markdown document');
  };

  const handleCreateShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      onShowToast('Please enter some text or code to share.');
      return;
    }

    setIsSubmitting(true);

    const shareId = generateShareId();
    const shareData: ShareData = {
      id: shareId,
      title: title.trim() || 'Untitled Snippet',
      content: content,
      language: language,
      expiration: expiration,
      createdAt: Date.now()
    };

    const encoded = encodeSharePayload(shareData);
    const fullUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;

    saveShareToHistory(shareData, fullUrl);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#ec4899']
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onShareCreated(shareData, fullUrl);
      onShowToast('Share created successfully! Link copied.');
    }, 300);
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="glass-panel editor-container">
      <form onSubmit={handleCreateShare}>
        <div className="toolbar">
          <div className="toolbar-group" style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Title or description (optional)..."
              className="form-input"
              style={{ flex: 1, minWidth: '200px' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Code size={16} color="var(--text-muted)" />
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="var(--text-muted)" />
              <select
                className="form-select"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
              >
                <option value="Never">Expires: Never (Default)</option>
                <option value="1 Hour">Expires: 1 Hour</option>
                <option value="24 Hours">Expires: 24 Hours</option>
                <option value="7 Days">Expires: 7 Days</option>
                <option value="30 Days">Expires: 30 Days</option>
                <option value="Burn After Reading">Burn After Reading</option>
              </select>
            </div>
          </div>

          <div className="toolbar-group">
            <button
              type="button"
              className="btn btn-glass btn-sm"
              onClick={handlePasteClipboard}
              title="Paste from clipboard"
            >
              <Clipboard size={16} />
              <span>Paste</span>
            </button>

            {content && (
              <button
                type="button"
                className="btn btn-glass btn-sm"
                onClick={() => setContent('')}
                title="Clear editor"
              >
                <Trash2 size={16} color="var(--accent-rose)" />
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Creating...' : 'Create Share'}</span>
            </button>
          </div>
        </div>

        <div className="editor-wrapper">
          <textarea
            className="code-textarea"
            placeholder="Paste or type your text, code, or markdown here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-glass)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>{lineCount} lines</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>

          <button
            type="button"
            className="btn btn-glass btn-sm"
            onClick={handleLoadSample}
            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
          >
            <FileCode2 size={14} />
            <span>Load Sample Text</span>
          </button>
        </div>
      </form>
    </div>
  );
};
