import React from 'react';
import { Zap, ShieldCheck, Code2, QrCode, Download, Clock } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  return (
    <section className="features-grid">
      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <Zap size={22} />
        </div>
        <h3 className="feature-title">Instant Share Links</h3>
        <p className="feature-desc">
          Paste any text or code snippet and generate an ultra-fast, shareable link in milliseconds without registration or delays.
        </p>
      </div>

      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <Code2 size={22} />
        </div>
        <h3 className="feature-title">Syntax Highlighting</h3>
        <p className="feature-desc">
          Built-in support for 30+ programming languages including JS, TS, Python, Rust, C++, SQL, HTML, CSS, and Markdown.
        </p>
      </div>

      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <ShieldCheck size={22} />
        </div>
        <h3 className="feature-title">100% Free & Indefinite</h3>
        <p className="feature-desc">
          Zero database cold starts, zero forced 2FA requirements, and zero subscription costs. Your text stays alive as long as you need.
        </p>
      </div>

      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <QrCode size={22} />
        </div>
        <h3 className="feature-title">Instant QR Codes</h3>
        <p className="feature-desc">
          Every share automatically builds a high-definition SVG/PNG QR code for scanning and transferring text to mobile devices.
        </p>
      </div>

      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <Download size={22} />
        </div>
        <h3 className="feature-title">Multi-Format Exports</h3>
        <p className="feature-desc">
          Download any shared document directly to your device as clean <code style={{ color: 'var(--accent-cyan)' }}>.txt</code>, <code style={{ color: 'var(--accent-cyan)' }}>.md</code>, or <code style={{ color: 'var(--accent-cyan)' }}>.json</code> files.
        </p>
      </div>

      <div className="glass-panel feature-card">
        <div className="feature-icon">
          <Clock size={22} />
        </div>
        <h3 className="feature-title">Flexible Expiration Control</h3>
        <p className="feature-desc">
          Set snippets to last forever (Default: Never), or choose auto-expiry options ranging from 1 hour to 30 days or burn-after-reading.
        </p>
      </div>
    </section>
  );
};
