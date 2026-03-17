import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { ChevronRight, Check, Type, Bell, Trash2, ArrowLeft, LogOut } from 'lucide-react';
import { useReaderTheme, readerThemes } from '@/contexts/ReaderThemeContext';

// Safe localStorage helpers
function lsGet(key, fallback) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, String(val)); } catch {}
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch {}
}

// Toggle switch component
const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${checked ? 'bg-primary' : 'bg-muted'}`}
  >
    <span className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { currentTheme, setTheme, fontSize, setFontSize } = useReaderTheme();

  const [notifDigest, setNotifDigest] = useState(lsGet('inkwell_notif_digest', 'true') !== 'false');
  const [notifBreaking, setNotifBreaking] = useState(lsGet('inkwell_notif_breaking', 'false') === 'true');
  const [lang, setLang] = useState(lsGet('inkwell_lang', 'English'));
  const [historyCleared, setHistoryCleared] = useState(false);
  const [bmCleared, setBmCleared] = useState(false);

  const clearHistory = () => {
    lsRemove('inkwell_reading_history');
    lsRemove('inkwell_tag_counts');
    setHistoryCleared(true);
    setTimeout(() => setHistoryCleared(false), 2500);
  };

  const clearBookmarks = () => {
    lsRemove('inkwell_bookmarks');
    setBmCleared(true);
    setTimeout(() => setBmCleared(false), 2500);
  };

  const handleLogout = () => {
    lsRemove('inkwell_logged_in');
    navigate('/login');
  };

  // Group themes safely
  const groups = [
    { label: 'Light', ids: ['paper', 'sepia', 'cream', 'contrast'] },
    { label: 'Dark', ids: ['midnight', 'charcoal', 'night', 'nord', 'ocean'] },
    { label: 'Focus', ids: ['focus', 'forest', 'amber', 'rose'] },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-xl px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/profile" className="p-2 rounded-xl hover:bg-hover transition-colors text-muted-foreground">
            <ArrowLeft size={17} />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
        </div>

        <div className="space-y-6">

          {/* ── READING THEME ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Reading Theme</p>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
              {groups.map(({ label, ids }) => {
                const themes = readerThemes.filter(t => ids.includes(t.id));
                return (
                  <div key={label}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className="relative flex flex-col items-center gap-1.5 rounded-xl p-2.5 transition-all"
                          style={{
                            backgroundColor: t.bg,
                            border: `${currentTheme.id === t.id ? 2 : 1}px solid ${currentTheme.id === t.id ? t.accent : t.border}`,
                          }}
                        >
                          <span className="text-base">{t.icon}</span>
                          <span className="text-[10px] font-semibold leading-none" style={{ color: t.text }}>{t.name}</span>
                          {currentTheme.id === t.id && (
                            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ backgroundColor: t.accent }}>
                              <Check size={8} color={t.bg} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── FONT SIZE ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Font Size</p>
            <div className="rounded-2xl border border-border bg-card px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground" style={{ fontSize: '14px' }}>Aa</span>
                <span className="text-sm font-semibold text-primary">{fontSize}px</span>
                <span className="text-muted-foreground" style={{ fontSize: '20px' }}>Aa</span>
              </div>
              <input
                type="range" min={14} max={24} step={1} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 rounded-full cursor-pointer accent-primary"
                style={{ background: `linear-gradient(to right, hsl(var(--primary)) ${((fontSize - 14) / 10) * 100}%, hsl(var(--secondary)) 0%)` }}
              />
              <div className="flex justify-between mt-1 mb-3">
                <span className="text-[10px] text-muted-foreground">Small (14)</span>
                <span className="text-[10px] text-muted-foreground">Large (24)</span>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2.5">
                <p style={{ fontSize: `${fontSize}px`, fontFamily: currentTheme.font, lineHeight: 1.7, color: 'hsl(var(--foreground))' }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>
          </div>

          {/* ── NOTIFICATIONS ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Notifications</p>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Bell size={15} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Daily Digest</p>
                  <p className="text-xs text-muted-foreground">Morning summary of top articles</p>
                </div>
                <Toggle checked={notifDigest} onChange={v => { setNotifDigest(v); lsSet('inkwell_notif_digest', v); }} />
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Bell size={15} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Breaking News</p>
                  <p className="text-xs text-muted-foreground">Alerts for trending stories</p>
                </div>
                <Toggle checked={notifBreaking} onChange={v => { setNotifBreaking(v); lsSet('inkwell_notif_breaking', v); }} />
              </div>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Content</p>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Type size={15} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Language</p>
                </div>
                <select
                  value={lang}
                  onChange={e => { setLang(e.target.value); lsSet('inkwell_lang', e.target.value); }}
                  className="text-xs bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {['English', 'Hindi', 'Spanish', 'French', 'German'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── PRIVACY ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Privacy & Data</p>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <button onClick={clearHistory} className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-hover transition-colors text-left">
                <Trash2 size={15} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Clear Reading History</p>
                  <p className="text-xs text-muted-foreground">Reset interests and progress</p>
                </div>
                {historyCleared
                  ? <span className="text-xs text-success font-semibold">✓ Cleared</span>
                  : <ChevronRight size={15} className="text-muted-foreground" />
                }
              </button>
              <button onClick={clearBookmarks} className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-hover transition-colors text-left">
                <Trash2 size={15} className="text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Clear Bookmarks</p>
                  <p className="text-xs text-muted-foreground">Delete all saved articles</p>
                </div>
                {bmCleared
                  ? <span className="text-xs text-success font-semibold">✓ Cleared</span>
                  : <ChevronRight size={15} className="text-muted-foreground" />
                }
              </button>
            </div>
          </div>

          {/* ── ACCOUNT ── */}
          <div>
            <p className="px-1 mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Account</p>
            <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3.5 hover:bg-hover transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Edit Profile</p>
                </div>
                <ChevronRight size={15} className="text-muted-foreground" />
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-hover transition-colors text-left">
                <LogOut size={15} className="text-destructive flex-shrink-0" />
                <p className="text-sm font-medium text-destructive">Sign Out</p>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground py-2">Inkwell · Your personal reading space</p>

        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SettingsPage;