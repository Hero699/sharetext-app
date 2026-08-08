import LZString from 'lz-string';

export interface ShareData {
  id: string;
  title: string;
  content: string;
  language: string;
  expiration: string;
  createdAt: number;
  viewCount?: number;
  isEncrypted?: boolean;
}

export function generateShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function encodeSharePayload(data: Omit<ShareData, 'id'>): string {
  const jsonString = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodeSharePayload(encoded: string): ShareData | null {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encoded);
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('Failed to decode share payload', err);
    return null;
  }
}

// Local Storage History helper
const HISTORY_KEY = 'sharetext_history_v1';

export function saveShareToHistory(share: ShareData, url: string) {
  try {
    const history = getShareHistory();
    const updated = [{ ...share, url }, ...history.filter(h => h.id !== share.id)].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to local storage history', e);
  }
}

export function getShareHistory(): (ShareData & { url: string })[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeShareFromHistory(id: string) {
  try {
    const history = getShareHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove item from history', e);
  }
}
