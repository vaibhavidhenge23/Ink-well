import { ArticleCard, ArticleCardSmall, FeaturedCard } from '@/components/ArticleCard';
import BottomNav from '@/components/layout/BottomNav';
import Navbar from '@/components/layout/Navbar';
import { articles as dummyArticles, feedCategories, trendingTopics, userStats } from '@/data/articles';
import { fetchDevToArticles, fetchHackerNewsArticles, fetchPersonalizedArticles } from '@/lib/api';
import { storeArticles } from '@/lib/articleStore';
import { getReadArticleIds, getTopTags } from '@/lib/readingHistory';
import { Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const Feed = () => {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [liveArticles, setLiveArticles] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [liveLoading, setLiveLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  // Show dummy articles immediately, then replace/augment with live
  const allArticles = useMemo(() => {
    const seen = new Set();
    const readIds = getReadArticleIds();
    const unread = [];
    const read = [];

    for (const a of [...liveArticles, ...dummyArticles]) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      if (readIds.has(a.id)) read.push(a);
      else unread.push(a);
    }
    return [...unread, ...read];
  }, [liveArticles]);

  const filteredArticles = useMemo(() => {
    if (['For You', 'Trending', 'New'].includes(activeCategory)) return allArticles;
    return allArticles.filter(a =>
      a.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      a.tags?.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  }, [allArticles, activeCategory]);

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const fetchLiveArticles = useCallback(async () => {
    setLiveLoading(true);
    try {
      const topTags = getTopTags(2);
      const [devTo, hn, personalized] = await Promise.all([
        fetchDevToArticles('', undefined, 10),
        fetchHackerNewsArticles(6),
        fetchPersonalizedArticles(topTags, 4),
      ]);
      const combined = [...personalized, ...devTo, ...hn];
      storeArticles(combined);
      setLiveArticles(combined);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    } catch {
      // fallback to dummy
    } finally {
      setLiveLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const [devTo, hn] = await Promise.all([
        fetchDevToArticles('', undefined, 8),
        fetchHackerNewsArticles(4),
      ]);
      const newArticles = [...devTo, ...hn];
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        storeArticles(newArticles);
        setLiveArticles(prev => [...prev, ...newArticles]);
      }
    } catch {}
    finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    fetchLiveArticles();
  }, [fetchLiveArticles]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && !liveLoading) loadMore(); },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, liveLoading]);

  const topTag = getTopTags(1)[0];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />

      {/* Category tabs */}
      <div className="border-b border-border sticky top-0 z-30 bg-background/95 backdrop-blur">
        <div className="container">
          <div className="scrollbar-hide flex gap-1 overflow-x-auto px-4 py-2">
            {feedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:bg-hover hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr_220px]">

          {/* Left sidebar */}
          <aside className="hidden space-y-5 lg:block">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-serif text-sm font-semibold text-foreground">Daily Brief</h3>
              <p className="text-[11px] text-muted-foreground">{today}</p>
              <ol className="mt-3 space-y-2">
                {dummyArticles.slice(0, 5).map((a, i) => (
                  <li key={a.id} className="flex gap-2 text-xs">
                    <span className="font-bold text-primary shrink-0">{i + 1}</span>
                    <ArticleCardSmall article={a} />
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-serif text-sm font-semibold text-foreground">Trending Topics</h3>
              <div className="mt-3 space-y-2">
                {trendingTopics.slice(0, 8).map(t => (
                  <div key={t.rank} className="flex items-center gap-2 text-xs cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setActiveCategory(t.topic.split(' ')[0])}>
                    <span className="font-bold text-primary">#{t.rank}</span>
                    <span className="text-foreground">{t.topic}</span>
                    <span className="ml-auto text-muted-foreground">{t.articles}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main feed */}
          <main className="space-y-4 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                {liveLoading ? (
                  <><Loader2 size={11} className="animate-spin" /> Fetching latest articles...</>
                ) : (
                  <><span className="text-success">●</span> {liveArticles.length} live · updated {lastUpdated}</>
                )}
              </p>
              <button
                onClick={fetchLiveArticles}
                disabled={liveLoading}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-40"
              >
                {liveLoading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                Refresh
              </button>
            </div>

            {/* Always show content — dummy first, then live loads in */}
            {featured && <FeaturedCard article={featured} />}

            {topTag ? (
              <div className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-text-secondary">
                🔥 Because you read about <span className="font-semibold text-primary capitalize">{topTag}</span>
              </div>
            ) : (
              <div className="rounded-lg bg-secondary/50 px-3 py-2 text-xs text-text-secondary">
                🔥 Trending in Technology
              </div>
            )}

            <div className="space-y-3">
              {rest.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="py-2">
              {loadingMore && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
                  <Loader2 size={14} className="animate-spin" /> Loading more...
                </div>
              )}
              {!hasMore && (
                <p className="text-center text-xs text-muted-foreground py-4">You've caught up! Check back later.</p>
              )}
            </div>
          </main>

          {/* Right sidebar */}
          <aside className="hidden space-y-5 xl:block">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-3">Your Stats</h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Articles this week', value: Math.max(0, getTopTags(0).length) || 12 },
                  { label: 'Streak', value: `${userStats.streak} days 🔥` },
                  { label: 'Favorite topic', value: topTag || userStats.favoriteTopic, isPrimary: true },
                  { label: 'Read time', value: userStats.totalReadTime },
                ].map(s => (
                  <div key={s.label} className="flex justify-between">
                    <span className="text-text-secondary">{s.label}</span>
                    <span className={`font-semibold ${s.isPrimary ? 'text-primary capitalize' : 'text-foreground'}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-serif text-sm font-semibold text-foreground mb-2">Editor's Pick</h3>
              <div className="space-y-2">
                {dummyArticles.slice(3, 6).map(a => <ArticleCardSmall key={a.id} article={a} />)}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Feed;