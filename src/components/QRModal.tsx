import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, Check } from 'lucide-react';

interface QRModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ url, isOpen, onClose, onCopy }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#0e131f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'sharetext-qr.png';
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>Mobile QR Share</h3>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '1.5rem' }}>
          <QRCodeSVG id="qr-code-svg" value={url} size={200} level="H" />
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          Scan this QR code with any camera to view or transfer this snippet to a mobile device instantly.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={handleCopy} className="btn btn-glass btn-sm">
            {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
          </button>

          <button onClick={downloadQR} className="btn btn-secondary btn-sm">
            <Download size={16} />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
