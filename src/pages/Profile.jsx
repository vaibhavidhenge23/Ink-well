import BottomNav from '@/components/layout/BottomNav';
import Navbar from '@/components/layout/Navbar';
import { getBookmarks } from '@/lib/bookmarkStore';
import { getHistory, getTopTags } from '@/lib/readingHistory';
import { Bookmark, BookOpen, Check, Clock, Edit2, Flame, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BADGE_RULES = [
  { emoji: '📖', name: 'First Read', desc: 'Read your first article', check: (h) => h.length >= 1 },
  { emoji: '🔥', name: '5 Articles', desc: 'Read 5 articles', check: (h) => h.length >= 5 },
  { emoji: '📚', name: 'Bookworm', desc: 'Read 20 articles', check: (h) => h.length >= 20 },
  { emoji: '🌍', name: 'Explorer', desc: 'Read 3+ categories', check: (h, tags) => tags.length >= 3 },
  { emoji: '⚡', name: 'Speed Reader', desc: 'Read 10 articles', check: (h) => h.length >= 10 },
  { emoji: '💎', name: 'Dedicated', desc: 'Save 5 bookmarks', check: (h, tags, bm) => bm >= 5 },
];

const Profile = () => {
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('Reader');
  const [userEmail, setUserEmail] = useState('');
  const [stats, setStats] = useState({ articlesRead: 0, minutes: 0, bookmarks: 0, streak: 1 });
  const [topTags, setTopTags] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem('inkwell_user_name') || 'Reader';
    const email = localStorage.getItem('inkwell_user_email') || '';
    setUserName(name);
    setUserEmail(email);
    setNameInput(name);

    const history = getHistory();
    const tags = getTopTags(8);
    const bookmarks = getBookmarks();

    setTopTags(tags.map(t => t.charAt(0).toUpperCase() + t.slice(1)));
    setStats({
      articlesRead: history.length,
      minutes: history.length * 5,
      bookmarks: bookmarks.length,
      streak: Math.max(1, Math.min(history.length, 7)),
    });

    const earned = BADGE_RULES.map(b => ({
      ...b,
      earned: b.check(history, tags, bookmarks.length),
    }));
    setBadges(earned);
  }, []);

  const saveName = () => {
    const trimmed = nameInput.trim() || 'Reader';
    setUserName(trimmed);
    localStorage.setItem('inkwell_user_name', trimmed);
    setEditingName(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('inkwell_logged_in');
    navigate('/login');
  };

  const favTopic = topTags[0] || 'Technology';

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-2xl px-4 py-8 space-y-5">

        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=e8a838&textColor=ffffff`}
                alt={userName}
                className="h-16 w-16 rounded-full border-2 border-primary"
              />
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                    autoFocus
                    className="rounded-lg border border-primary bg-background px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none w-full"
                  />
                  <button onClick={saveName} className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1.5 rounded-lg hover:bg-hover text-muted-foreground">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl font-bold text-foreground truncate">{userName}</h1>
                  <button onClick={() => setEditingName(true)}
                    className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-hover transition-colors">
                    <Edit2 size={13} />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground truncate mt-0.5">{userEmail || 'inkwell reader'}</p>
              <p className="text-xs text-primary mt-0.5 font-medium">Favorite: {favTopic}</p>
            </div>
            <Link to="/settings"
              className="rounded-xl border border-border p-2.5 text-muted-foreground hover:bg-hover hover:text-foreground transition-colors flex-shrink-0">
              <Settings size={17} />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: BookOpen, label: 'Read', value: stats.articlesRead },
            { icon: Clock, label: 'Minutes', value: `${stats.minutes}` },
            { icon: Flame, label: 'Streak', value: `${stats.streak}d` },
            { icon: Bookmark, label: 'Saved', value: stats.bookmarks },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-3 text-center">
              <s.icon className="mx-auto mb-1.5 text-primary" size={17} />
              <p className="font-serif text-lg font-bold text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reading interests */}
        {topTags.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <span>📌</span> Your Reading Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map((tag, i) => (
                <span key={tag}
                  className="rounded-full px-3 py-1 text-xs font-medium border"
                  style={{
                    backgroundColor: i === 0 ? 'hsl(33 88% 60% / 0.15)' : undefined,
                    borderColor: i === 0 ? 'hsl(33 88% 60% / 0.5)' : undefined,
                    color: i === 0 ? 'hsl(33 88% 60%)' : undefined,
                    ...(i !== 0 ? { backgroundColor: 'hsl(var(--secondary))', borderColor: 'transparent', color: 'hsl(var(--foreground))' } : {})
                  }}>
                  {i === 0 && '★ '}{tag}
                </span>
              ))}
            </div>
            {topTags.length === 0 && (
              <p className="text-xs text-muted-foreground">Start reading articles to build your interests</p>
            )}
          </div>
        )}

        {topTags.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-center">
            <p className="text-sm text-muted-foreground">Read some articles to see your interests here</p>
            <Link to="/feed" className="mt-2 inline-block text-sm text-primary hover:underline">Go to Feed →</Link>
          </div>
        )}

        {/* Badges */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <span>🏅</span> Badges
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {badges.map(b => (
              <div key={b.name}
                className={`rounded-xl p-3 flex flex-col items-center text-center gap-1.5 border transition-all ${
                  b.earned
                    ? 'border-primary/30 bg-primary/8'
                    : 'border-border bg-secondary/30 opacity-45'
                }`}>
                <span className="text-2xl">{b.emoji}</span>
                <p className="text-xs font-semibold text-foreground leading-tight">{b.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{b.desc}</p>
                {b.earned && <span className="text-[10px] font-bold text-primary">✓ Earned</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Link to="/bookmarks" className="flex items-center justify-between px-4 py-3.5 hover:bg-hover transition-colors border-b border-border">
            <div className="flex items-center gap-3">
              <Bookmark size={16} className="text-primary" />
              <span className="text-sm text-foreground">My Bookmarks</span>
            </div>
            <span className="text-xs text-muted-foreground">{stats.bookmarks} saved →</span>
          </Link>
          <Link to="/settings" className="flex items-center justify-between px-4 py-3.5 hover:bg-hover transition-colors border-b border-border">
            <div className="flex items-center gap-3">
              <Settings size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">Settings</span>
            </div>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3.5 hover:bg-hover transition-colors text-left">
            <span className="text-destructive text-sm">Sign Out</span>
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;