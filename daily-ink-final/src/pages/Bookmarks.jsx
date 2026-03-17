import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { ArticleCard } from '@/components/ArticleCard';
import { Bookmark, Heart, BookOpen } from 'lucide-react';
import { getBookmarks } from '@/lib/bookmarkStore';

const tabs = ['Read Later', 'Favorites'];

const Bookmarks = () => {
  const [activeTab, setActiveTab] = useState('Read Later');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  useEffect(() => {
    setBookmarkedArticles(getBookmarks());
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-3xl px-4 py-8">
        <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-2">
          <Bookmark className="text-primary" size={28} /> Bookmarks
        </h1>

        <div className="mt-6 flex gap-1 border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-foreground'
              }`}
            >
              {tab === 'Read Later' ? <Bookmark className="inline mr-1" size={14} /> : <Heart className="inline mr-1" size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {bookmarkedArticles.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-serif text-lg font-semibold text-foreground">No bookmarks yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap the bookmark icon on any article to save it here
            </p>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-muted-foreground">{bookmarkedArticles.length} saved articles</p>
            <div className="mt-4 space-y-3">
              {bookmarkedArticles.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Bookmarks;
