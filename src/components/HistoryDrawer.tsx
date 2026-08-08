import React from 'react';
import { X, ExternalLink, Trash2, Clock, Code, FileText } from 'lucide-react';
import type { ShareData } from '../lib/shareEngine';
import { removeShareFromHistory } from '../lib/shareEngine';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: (ShareData & { url: string })[];
  onSelectShare: (item: ShareData & { url: string }) => void;
  onRefresh: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectShare,
  onRefresh
}) => {
  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeShareFromHistory(id);
    onRefresh();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        style={{ maxWidth: '560px', width: '95%', textAlign: 'left', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
            Your Created Shares
          </h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {history.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p>No past shares saved on this device yet.</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Shares you create will automatically appear here.</p>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
            {history.map(item => (
              <div 
                key={item.id} 
                className="glass-panel"
                style={{ padding: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}
                onClick={() => { onSelectShare(item); onClose(); }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflow: 'hidden', paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={14} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title || 'Untitled Snippet'}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
                      {item.language}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {formatDate(item.createdAt)}
                    </span>
                    <span>Expires: {item.expiration}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onSelectShare(item); onClose(); }}>
                    <ExternalLink size={16} />
                  </button>
                  <button className="btn-icon" style={{ color: 'var(--accent-rose)' }} onClick={(e) => handleDelete(item.id, e)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
