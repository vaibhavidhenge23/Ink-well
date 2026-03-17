import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { Flame, BookOpen, Clock, Trophy, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getHistory, getTopTags } from '@/lib/readingHistory';
import { getBookmarks } from '@/lib/bookmarkStore';

const badges = [
  { emoji: '🔥', name: '7 Day Streak', earned: true },
  { emoji: '📚', name: '100 Articles Read', earned: false },
  { emoji: '🌍', name: 'World Explorer', earned: true },
  { emoji: '⚡', name: 'Speed Reader', earned: false },
];

const Profile = () => {
  const [userName, setUserName] = useState('Reader');
  const [userEmail, setUserEmail] = useState('');
  const [articlesRead, setArticlesRead] = useState(0);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [favoriteTopic, setFavoriteTopic] = useState('Technology');
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    setUserName(localStorage.getItem('inkwell_user_name') || 'Reader');
    setUserEmail(localStorage.getItem('inkwell_user_email') || '');
    const history = getHistory();
    setArticlesRead(history.length);
    setTotalMinutes(history.length * 5);
    setBookmarksCount(getBookmarks().length);
    const topTag = getTopTags(1)[0];
    if (topTag) setFavoriteTopic(topTag.charAt(0).toUpperCase() + topTag.slice(1));
  }, []);

  const interests = getTopTags(6).map(t => t.charAt(0).toUpperCase() + t.slice(1));

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-2xl px-4 py-8">
        <div className="flex items-center gap-4">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="User" className="h-16 w-16 rounded-full border-2 border-primary" />
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">{userName}</h1>
            <p className="text-sm text-text-secondary">{userEmail || 'Inkwell Reader'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Member · Inkwell</p>
          </div>
          <Link to="/settings" className="ml-auto rounded-lg border border-border p-2 text-text-secondary hover:bg-hover transition-colors">
            <Settings size={18} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: BookOpen, label: 'Articles Read', value: articlesRead },
            { icon: Clock, label: 'Minutes Read', value: `${totalMinutes}m` },
            { icon: Flame, label: 'Streak', value: '1 day' },
            { icon: Trophy, label: 'Bookmarks', value: bookmarksCount },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
              <s.icon className="mx-auto mb-1 text-primary" size={18} />
              <p className="font-serif text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-4">
          <h3 className="font-serif text-sm font-semibold text-foreground">Favorite Topic</h3>
          <p className="mt-1 text-lg font-bold text-primary">{favoriteTopic}</p>
        </div>

        {interests.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <h3 className="font-serif text-sm font-semibold text-foreground mb-3">Your Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map(i => (
                <span key={i} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground">{i}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <h3 className="font-serif text-sm font-semibold text-foreground mb-3">Badges</h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map(b => (
              <div key={b.name} className={`flex items-center gap-3 rounded-lg p-3 ${b.earned ? 'bg-primary/10' : 'opacity-40 bg-secondary'}`}>
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.earned ? 'Earned' : 'Locked'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
