import CategoryTag from '@/components/CategoryTag';
import BottomNav from '@/components/layout/BottomNav';
import Navbar from '@/components/layout/Navbar';
import { articles as dummyArticles } from '@/data/articles';
import { Loader2, Search, TrendingUp, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Dev.to search uses ?tag= for single word tags
// For multi-word or title search, we search locally + by tag
async function searchDevTo(query) {
  const tag = query.toLowerCase().trim().replace(/\s+/g, '');
  const urls = [
    `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=12&page=1`,
    `https://dev.to/api/articles?per_page=20&page=1`,
  ];
  try {
    const res = await Promise.race([
      fetch(urls[0]),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 7000))
    ]);
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    return data.map((a, i) => ({
      id: `devto-${a.id}`,
      title: a.title,
      excerpt: a.description || '',
      content: a.description || '',
      category: a.tag_list?.[0] ? cap(a.tag_list[0]) : 'Technology',
      categoryColor: 'tech',
      author: { name: a.user?.name || 'Author', avatar: a.user?.profile_image || '', bio: '' },
      date: a.readable_publish_date || '',
      readTime: `${a.reading_time_minutes || 3} min read`,
      source: 'Dev.to',
      imageUrl: a.cover_image || a.social_image || `https://images.unsplash.com/photo-1518770660439-4636190af475?w=400`,
      tags: a.tag_list || [],
      externalUrl: a.url,
    }));
  } catch {
    return [];
  }
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

// Local search across all available articles
function localSearch(query, pool) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return pool.filter(a =>
    a.title?.toLowerCase().includes(q) ||
    a.excerpt?.toLowerCase().includes(q) ||
    a.category?.toLowerCase().includes(q) ||
    (a.tags || []).some(t => t?.toLowerCase().includes(q)) ||
    a.author?.name?.toLowerCase().includes(q)
  );
}

const CATEGORIES = [
  { name: 'Technology', emoji: '💻', tag: 'webdev', color: 'border-cat-tech' },
  { name: 'AI', emoji: '🤖', tag: 'ai', color: 'border-cat-tech' },
  { name: 'Science', emoji: '🔬', tag: 'science', color: 'border-cat-science' },
  { name: 'Business', emoji: '📈', tag: 'career', color: 'border-cat-business' },
  { name: 'Health', emoji: '🧠', tag: 'health', color: 'border-cat-health' },
  { name: 'Design', emoji: '🎨', tag: 'design', color: 'border-cat-design' },
  { name: 'Finance', emoji: '💰', tag: 'finance', color: 'border-cat-finance' },
  { name: 'Philosophy', emoji: '🪐', tag: 'philosophy', color: 'border-cat-philosophy' },
];

const TRENDING = ['React', 'AI', 'Python', 'Design', 'Startups', 'Health', 'Bitcoin', 'Rust'];

// Compact article row
const ArticleRow = ({ article }) => (
  <Link to={`/article/${article.id}`}
    className="flex gap-3 rounded-xl border border-border bg-card p-3 hover:bg-hover transition-colors group">
    <img src={article.imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-secondary" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-1">
        <CategoryTag category={article.category} size="sm" />
        <span className="text-[10px] text-muted-foreground">{article.source}</span>
      </div>
      <p className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
        {article.title}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1">{article.readTime} · {article.author?.name}</p>
    </div>
  </Link>
);

const Explore = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catArticles, setCatArticles] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // All articles pool = dummy + session-stored
  const allPool = dummyArticles;

  const runSearch = (q) => {
    if (!q.trim()) {
      setResults([]);
      setSearchDone(false);
      setSearching(false);
      return;
    }
    setSearching(true);
    setSearchDone(false);

    // Show local results immediately
    const localResults = localSearch(q, allPool);
    setResults(localResults);

    // Then fetch from Dev.to
    searchDevTo(q).then(live => {
      const merged = [...localSearch(q, allPool), ...live]
        .filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);
      setResults(merged);
      setSearching(false);
      setSearchDone(true);
    }).catch(() => {
      setSearching(false);
      setSearchDone(true);
    });
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setResults([]);
      setSearchDone(false);
      setSearching(false);
      return;
    }
    // Show local instantly, debounce API
    const localResults = localSearch(val, allPool);
    setResults(localResults);
    debounceRef.current = setTimeout(() => runSearch(val), 500);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearchDone(false);
    setSearching(false);
    clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  const handleCategoryClick = async (cat) => {
    if (selectedCat?.name === cat.name) {
      setSelectedCat(null);
      setCatArticles([]);
      return;
    }
    setSelectedCat(cat);
    setCatLoading(true);
    const localCat = allPool.filter(a =>
      a.category?.toLowerCase() === cat.name.toLowerCase() ||
      (a.tags || []).some(t => t?.toLowerCase() === cat.tag)
    );
    setCatArticles(localCat);
    try {
      const live = await searchDevTo(cat.tag);
      const merged = [...localCat, ...live].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i);
      setCatArticles(merged);
    } catch {}
    setCatLoading(false);
  };

  const isSearchMode = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-3xl px-4 py-6">

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="Search articles, topics, authors..."
            autoComplete="off"
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
          {searching && !query.length === 0 && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin pointer-events-none" size={16} />
          )}
          {query.length > 0 && (
            <button onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-hover transition-colors">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Trending pill tags */}
        {!isSearchMode && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Trending:</span>
            {TRENDING.map(tag => (
              <button key={tag} onClick={() => { setQuery(tag); runSearch(tag); }}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-text-secondary hover:text-primary hover:bg-hover transition-colors">
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* ── SEARCH MODE ── */}
        {isSearchMode && (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              {searching ? (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" />
                  Searching for "{query}"...
                  {results.length > 0 && <span className="text-primary">({results.length} so far)</span>}
                </p>
              ) : searchDone ? (
                <p className="text-sm font-semibold text-foreground">
                  {results.length > 0 ? `${results.length} results for "${query}"` : `No results for "${query}"`}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Showing local results…</p>
              )}
            </div>

            {results.length === 0 && !searching && searchDone && (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <Search className="mx-auto mb-3 text-muted-foreground/30" size={32} />
                <p className="text-sm text-muted-foreground">No articles found for "{query}"</p>
                <button onClick={clearSearch} className="mt-3 text-sm text-primary hover:underline">
                  Clear search
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              {results.map(a => <ArticleRow key={a.id} article={a} />)}
            </div>
          </div>
        )}

        {/* ── BROWSE MODE ── */}
        {!isSearchMode && (
          <>
            <h2 className="mt-8 font-serif text-lg font-bold text-foreground">Browse by Category</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CATEGORIES.map(cat => (
                <button key={cat.name} onClick={() => handleCategoryClick(cat)}
                  className={`rounded-2xl border-l-[3px] ${cat.color} border border-border p-3.5 text-left transition-all ${
                    selectedCat?.name === cat.name
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-card hover:bg-hover'
                  }`}>
                  <span className="text-xl">{cat.emoji}</span>
                  <p className="mt-1.5 font-semibold text-sm text-foreground">{cat.name}</p>
                </button>
              ))}
            </div>

            {/* Category results */}
            {selectedCat && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {selectedCat.emoji} {selectedCat.name}
                  </h3>
                  {catLoading && <Loader2 size={14} className="animate-spin text-primary" />}
                </div>
                {catArticles.length === 0 && catLoading && (
                  <div className="space-y-2.5">
                    {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />)}
                  </div>
                )}
                <div className="space-y-2.5">
                  {catArticles.map(a => <ArticleRow key={a.id} article={a} />)}
                </div>
              </div>
            )}

            {/* Trending articles when no category selected */}
            {!selectedCat && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={17} className="text-primary" />
                  <h2 className="font-serif text-lg font-bold text-foreground">Trending Articles</h2>
                </div>
                <div className="space-y-2.5">
                  {dummyArticles.slice(0, 8).map(a => <ArticleRow key={a.id} article={a} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Explore;