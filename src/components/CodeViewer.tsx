import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { marked } from 'marked';
import 'highlight.js/styles/atom-one-dark.css';
import { Copy, QrCode, FileCode, Check, Globe } from 'lucide-react';
import type { ShareData } from '../lib/shareEngine';

interface CodeViewerProps {
  share: ShareData;
  url: string;
  onOpenQR: () => void;
  onShowToast: (msg: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  share,
  url,
  onOpenQR,
  onShowToast
}) => {
  const [viewMode, setViewMode] = React.useState<'formatted' | 'markdown' | 'raw'>(
    share.language === 'markdown' ? 'markdown' : 'formatted'
  );
  const [copied, setCopied] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (viewMode === 'formatted' && codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [share.content, share.language, viewMode]);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback to execCommand if clipboard API fails
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(share.content);
    setCopied(true);
    onShowToast('Text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUrl = async () => {
    await copyToClipboard(url);
    setLinkCopied(true);
    onShowToast('Shareable link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownload = (ext: string) => {
    const filename = `${(share.title || 'sharetext').toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`;
    const blob = new Blob([share.content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    onShowToast(`Downloaded as ${filename}`);
  };

  const lineCount = share.content.split('\n').length;
  const wordCount = share.content.trim() ? share.content.trim().split(/\s+/).length : 0;
  const charCount = share.content.length;

  const renderMarkdown = () => {
    try {
      return { __html: marked.parse(share.content) as string };
    } catch {
      return { __html: share.content };
    }
  };

  return (
    <div className="glass-panel" style={{ width: '100%', marginBottom: '2rem' }}>
      {/* Header bar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <FileCode size={20} color="var(--accent-cyan)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
              {share.title || 'Untitled Snippet'}
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Language: <strong style={{ color: 'var(--accent-cyan)' }}>{share.language}</strong></span>
              <span>•</span>
              <span>Expires: <strong style={{ color: 'var(--accent-amber)' }}>{share.expiration}</strong></span>
              <span>•</span>
              <span>Created: {new Date(share.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="toolbar-group">
          {/* View Toggles */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
            <button
              className={`btn btn-sm ${viewMode === 'formatted' ? 'btn-secondary' : 'btn-glass'}`}
              style={{ border: 'none' }}
              onClick={() => setViewMode('formatted')}
            >
              Code View
            </button>

            {share.language === 'markdown' && (
              <button
                className={`btn btn-sm ${viewMode === 'markdown' ? 'btn-secondary' : 'btn-glass'}`}
                style={{ border: 'none' }}
                onClick={() => setViewMode('markdown')}
              >
                Markdown
              </button>
            )}

            <button
              className={`btn btn-sm ${viewMode === 'raw' ? 'btn-secondary' : 'btn-glass'}`}
              style={{ border: 'none' }}
              onClick={() => setViewMode('raw')}
            >
              Raw Text
            </button>
          </div>

          <button onClick={onOpenQR} className="btn btn-glass btn-sm" title="Show QR Code">
            <QrCode size={16} />
            <span>QR Code</span>
          </button>

          <button onClick={handleCopyUrl} className="btn btn-secondary btn-sm">
            {linkCopied ? <Check size={16} /> : <Globe size={16} />}
            <span>{linkCopied ? 'Link Copied' : 'Copy Link'}</span>
          </button>

          <button onClick={handleCopy} className="btn btn-primary btn-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      <div className="code-scroll-area">
        {viewMode === 'markdown' ? (
          <div className="formatted-output markdown-body" dangerouslySetInnerHTML={renderMarkdown()} />
        ) : viewMode === 'raw' ? (
          <pre style={{ padding: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.925rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--text-main)', margin: 0 }}>
            {share.content}
          </pre>
        ) : (
          <pre style={{ margin: 0, padding: 0 }}>
            <code ref={codeRef} className={`language-${share.language} hljs`} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {share.content}
            </code>
          </pre>
        )}
      </div>

      {/* Footer stats bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>Download as:</span>
          <button className="btn btn-glass btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDownload('txt')}>.txt</button>
          <button className="btn btn-glass btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDownload('md')}>.md</button>
          <button className="btn btn-glass btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDownload('json')}>.json</button>
        </div>
      </div>
    </div>
  );
};
