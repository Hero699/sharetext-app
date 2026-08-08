import React from 'react';
import { Share2, History, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onNewShare: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewShare, onOpenHistory, historyCount }) => {
  return (
    <header className="navbar">
      <a href="#" onClick={(e) => { e.preventDefault(); onNewShare(); }} className="logo-group">
        <div className="logo-icon">
          <Share2 size={22} />
        </div>
        <div>
          <span className="logo-text">ShareText</span>
        </div>
        <span className="badge-tag">Pro / Free</span>
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={onOpenHistory} className="btn btn-glass btn-sm">
          <History size={16} />
          <span>My Shares ({historyCount})</span>
        </button>

        <button onClick={onNewShare} className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          <span>New Share</span>
        </button>
      </div>
    </header>
  );
};
