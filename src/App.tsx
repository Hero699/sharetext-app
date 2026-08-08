import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';
import { CodeViewer } from './components/CodeViewer';
import { FeatureGrid } from './components/FeatureGrid';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { ShareData } from './lib/shareEngine';
import { 
  decodeSharePayload, 
  getShareHistory 
} from './lib/shareEngine';

export function App() {
  const [activeShare, setActiveShare] = useState<ShareData | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [history, setHistory] = useState<(ShareData & { url: string })[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const refreshHistory = () => {
    setHistory(getShareHistory());
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const parseUrlHash = () => {
    const hash = window.location.hash;
    if (hash && hash.includes('#share=')) {
      const encoded = hash.split('#share=')[1];
      if (encoded) {
        const decoded = decodeSharePayload(encoded);
        if (decoded) {
          setActiveShare(decoded);
          setShareUrl(window.location.href);
          return;
        }
      }
    }
    setActiveShare(null);
    setShareUrl('');
  };

  useEffect(() => {
    refreshHistory();
    parseUrlHash();

    const handleHashChange = () => parseUrlHash();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleShareCreated = (share: ShareData, url: string) => {
    setActiveShare(share);
    setShareUrl(url);
    window.location.hash = `share=${url.split('#share=')[1]}`;
    refreshHistory();
  };

  const handleNewShare = () => {
    setActiveShare(null);
    setShareUrl('');
    window.location.hash = '';
  };

  const handleSelectHistoryShare = (item: ShareData & { url: string }) => {
    setActiveShare(item);
    setShareUrl(item.url);
    const hashPart = item.url.split('#share=')[1];
    if (hashPart) {
      window.location.hash = `share=${hashPart}`;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar 
        onNewShare={handleNewShare}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeShare ? (
          <CodeViewer 
            share={activeShare}
            url={shareUrl}
            onShowToast={showToast}
          />
        ) : (
          <>
            <section className="hero-section">
              <h1 className="hero-title">
                Share Text & Code <span className="text-gradient">Instantly</span>
              </h1>
              <p className="hero-subtitle">
                A high-speed, free online text sharing platform. Paste text, markdown, or code below to generate a shareable link in seconds. No account, no ads, no 2FA required.
              </p>
            </section>

            <Editor 
              onShareCreated={handleShareCreated}
              onShowToast={showToast}
            />

            <FeatureGrid />
          </>
        )}
      </main>

      {/* Local History Drawer */}
      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectShare={handleSelectHistoryShare}
        onRefresh={refreshHistory}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      {/* Footer */}
      <footer className="footer">
        <p>ShareText • Free & Indefinite Text Sharing Platform</p>
      </footer>
    </div>
  );
}

export default App;
