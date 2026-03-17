import { ArticleCard } from '@/components/ArticleCard';
import CategoryTag from '@/components/CategoryTag';
import { useReaderTheme, readerThemes } from '@/contexts/ReaderThemeContext';
import { articles } from '@/data/articles';
import { getStoredArticle } from '@/lib/articleStore';
import { addBookmark, isBookmarked, removeBookmark } from '@/lib/bookmarkStore';
import { recordRead } from '@/lib/readingHistory';
import { ArrowLeft, Bookmark, ExternalLink, Palette, Share2, ThumbsUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const readerThemeGroups = [
  { group: 'Light', themes: ['paper', 'sepia', 'cream', 'contrast'] },
  { group: 'Dark', themes: ['midnight', 'charcoal', 'night', 'nord', 'ocean'] },
  { group: 'Focus', themes: ['focus', 'forest', 'amber', 'rose'] },
];

const ArticleRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(articles.find(a => a.id === id) || (id ? getStoredArticle(id) : undefined));
  const [progress, setProgress] = useState(0);
  const [showThemes, setShowThemes] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const { currentTheme, setTheme, fontSize, setFontSize } = useReaderTheme();

  useEffect(() => {
    if (id) setBookmarked(isBookmarked(id));
  }, [id]);

  useEffect(() => {
    if (article) {
      recordRead(article.id, article.tags || [article.category]);
    }
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
      setProgress(Math.min(100, scrolled * 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // If it's a devto article and we only have the excerpt in "content", fetch the full article
    if (article && article.id.startsWith('devto-') && article.content === article.excerpt) {
      const fetchFull = async () => {
        setLoadingContent(true);
        try {
          const actualId = article.id.replace('devto-', '');
          const res = await fetch(`https://dev.to/api/articles/${actualId}`);
          if (res.ok) {
            const data = await res.json();
            setArticle(prev => ({
              ...prev,
              content: data.body_markdown || prev.content,
            }));
          }
        } catch (e) {
          console.error("Failed to fetch full article", e);
        } finally {
          setLoadingContent(false);
        }
      };
      fetchFull();
    }
  }, [article?.id]);

  const handleBookmark = () => {
    if (!article) return;
    if (bookmarked) { removeBookmark(article.id); setBookmarked(false); }
    else { addBookmark(article); setBookmarked(true); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article?.title, url: article?.externalUrl || window.location.href });
    } else {
      navigator.clipboard.writeText(article?.externalUrl || window.location.href);
    }
  };

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Article not found</p>
          <Link to="/feed" className="text-primary text-sm hover:underline">← Back to feed</Link>
        </div>
      </div>
    );
  }

  const hasContent = article.content && article.content.length > 50;
  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  const renderContent = (content) => {
    if (loadingContent) {
      return (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }
    return content.split('\n').filter(Boolean).map((block, i) => {
      if (block.startsWith('> ')) {
        return (
          <blockquote key={i} className="my-6 border-l-4 pl-5 italic"
            style={{ borderColor: currentTheme.accent, color: currentTheme.secondary, fontFamily: currentTheme.font, fontSize: `${fontSize + 1}px`, lineHeight: currentTheme.lineHeight || 1.85 }}>
            {block.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }
      if (block.startsWith('## ') || block.startsWith('### ')) {
        return <h2 key={i} className="mt-10 mb-4 font-serif text-2xl font-bold" style={{ color: currentTheme.text }}>{block.replace(/^#+\s/, '')}</h2>;
      }
      if (block.startsWith('```')) {
        return (
          <pre key={i} className="my-5 overflow-x-auto rounded-xl p-4 text-sm font-mono whitespace-pre-wrap"
            style={{ backgroundColor: currentTheme.card, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>
            <code>{block.replace(/```\w*\n?/g, '').replace(/```$/, '')}</code>
          </pre>
        );
      }
      if (block.startsWith('- ') || block.startsWith('* ') || block.match(/^\d+\./)) {
        return (
          <li key={i} className="flex items-start gap-3 my-3 ml-2"
            style={{ color: currentTheme.text, fontFamily: currentTheme.font, fontSize: `${fontSize}px`, lineHeight: currentTheme.lineHeight || 1.85 }}>
            <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: currentTheme.accent }} />
            <span dangerouslySetInnerHTML={{ __html: block.replace(/^[-\d.*]+\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-sm">$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>') }} />
          </li>
        );
      }
      // Image markdown `![alt](url)`
      const imgMatch = block.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        return (
          <figure key={i} className="my-6 sm:my-8 text-center">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full max-w-full rounded-xl sm:rounded-2xl object-cover bg-secondary h-auto" loading="lazy" />
            {imgMatch[1] && <figcaption className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground px-2">{imgMatch[1]}</figcaption>}
          </figure>
        );
      }
      return (
        <p key={i} className="my-5"
          style={{ color: currentTheme.text, fontFamily: currentTheme.font, fontSize: `${fontSize}px`, lineHeight: currentTheme.lineHeight || 1.85 }}
          dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-[0.9em]">$1</code>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>') }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: currentTheme.bg }}>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ backgroundColor: currentTheme.border }}>
        <div className="h-full transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: currentTheme.accent }} />
      </div>

      {/* Floating toolbar — desktop */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden flex-col gap-1.5 rounded-2xl border p-2 lg:flex shadow-xl"
        style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
        <button onClick={handleBookmark} className="rounded-xl p-2.5 transition-colors hover:opacity-80" title="Bookmark"
          style={{ color: bookmarked ? currentTheme.accent : currentTheme.secondary }}>
          <Bookmark size={17} fill={bookmarked ? currentTheme.accent : 'none'} />
        </button>
        <button onClick={handleShare} className="rounded-xl p-2.5 transition-colors hover:opacity-80"
          style={{ color: currentTheme.secondary }}>
          <Share2 size={17} />
        </button>
        {article.externalUrl && (
          <a href={article.externalUrl} target="_blank" rel="noreferrer"
            className="rounded-xl p-2.5 transition-colors hover:opacity-80 flex items-center justify-center"
            style={{ color: currentTheme.secondary }}>
            <ExternalLink size={17} />
          </a>
        )}
        <div className="h-px my-0.5" style={{ backgroundColor: currentTheme.border }} />
        <button onClick={() => setFontSize(Math.min(24, fontSize + 1))}
          className="rounded-xl p-1.5 text-xs font-bold hover:opacity-80" style={{ color: currentTheme.secondary }}>A+</button>
        <button onClick={() => setFontSize(Math.max(14, fontSize - 1))}
          className="rounded-xl p-1.5 text-[10px] font-bold hover:opacity-80" style={{ color: currentTheme.secondary }}>A−</button>
        <div className="h-px my-0.5" style={{ backgroundColor: currentTheme.border }} />
        <button onClick={() => setShowThemes(!showThemes)}
          className="rounded-xl p-2.5 transition-colors hover:opacity-80"
          style={{ color: showThemes ? currentTheme.accent : currentTheme.secondary }}>
          <Palette size={17} />
        </button>
      </div>

      {/* Theme panel — desktop */}
      {showThemes && (
        <div className="fixed right-16 top-1/2 -translate-y-1/2 z-40 hidden lg:block rounded-2xl border p-4 w-64 max-h-[80vh] overflow-y-auto scrollbar-hide shadow-2xl"
          style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold" style={{ color: currentTheme.text }}>Reading Theme</p>
            <button onClick={() => setShowThemes(false)} style={{ color: currentTheme.secondary }}><X size={14} /></button>
          </div>
          {readerThemeGroups.map(({ group, themes: themeIds }) => (
            <div key={group} className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: currentTheme.secondary }}>{group}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {readerThemes.filter(t => themeIds.includes(t.id)).map(t => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className="flex flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-xs transition-all"
                    style={{
                      backgroundColor: currentTheme.id === t.id ? t.accent + '28' : t.bg + 'CC',
                      border: currentTheme.id === t.id ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                      color: currentTheme.id === t.id ? t.accent : t.text,
                    }}>
                    <span>{t.icon}</span>
                    <span className="font-semibold">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-3 border-t pt-3" style={{ borderColor: currentTheme.border }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: currentTheme.secondary }}>Font Size</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors"
                style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border, color: currentTheme.text }}>A−</button>
              <span className="text-xs font-medium flex-1 text-center" style={{ color: currentTheme.text }}>{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors"
                style={{ backgroundColor: currentTheme.bg, borderColor: currentTheme.border, color: currentTheme.text }}>A+</button>
            </div>
          </div>
        </div>
      )}

      {/* Article content header */}
      <div className="mx-auto max-w-[700px] px-4 sm:px-5 py-6 sm:py-10">
        <Link to="/feed" className="mb-6 sm:mb-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: currentTheme.secondary }}>
          <ArrowLeft size={15} /> Back to feed
        </Link>

        <CategoryTag category={article.category} size="md" />
        <h1 className="mt-3 sm:mt-4 font-serif font-bold leading-tight break-words" style={{ color: currentTheme.text, fontSize: `clamp(24px, ${fontSize + 10}px, 36px)` }}>
          {article.title}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed mix-blend-normal opacity-90 break-words" style={{ color: currentTheme.secondary, fontFamily: currentTheme.font, fontSize: `clamp(16px, ${fontSize + 1}px, 22px)` }}>
          {article.excerpt}
        </p>

        {/* Mobile theme bar */}
        <div className="mt-5 lg:hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: currentTheme.secondary }}>Theme</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {readerThemes.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className="flex-shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor: currentTheme.id === t.id ? t.accent + '33' : t.bg,
                  border: currentTheme.id === t.id ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                  color: currentTheme.id === t.id ? t.accent : t.text,
                  minWidth: '56px',
                }}>
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
          {/* Mobile font size */}
          <div className="flex items-center justify-between mt-4 bg-card/50 rounded-xl p-2 border" style={{ borderColor: currentTheme.border }}>
            <span className="text-[10px] font-bold uppercase tracking-widest pl-2" style={{ color: currentTheme.secondary }}>Size</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-sm border bg-background transition-colors active:scale-95" style={{ borderColor: currentTheme.border, color: currentTheme.text }}>A−</button>
              <span className="text-xs font-semibold w-8 text-center" style={{ color: currentTheme.text }}>{fontSize}</span>
              <button onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-sm border bg-background transition-colors active:scale-95" style={{ borderColor: currentTheme.border, color: currentTheme.text }}>A+</button>
            </div>
          </div>
        </div>

        {/* Author row */}
        <div className="mt-7 flex items-center gap-3 border-b pb-6" style={{ borderColor: currentTheme.border }}>
          <img src={article.author.avatar} alt={article.author.name} className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold" style={{ color: currentTheme.text }}>{article.author.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: currentTheme.border, color: currentTheme.secondary }}>{article.source}</span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: currentTheme.secondary }}>{article.date} · {article.readTime}</p>
          </div>
          {/* Mobile toolbar */}
          <div className="flex gap-2 lg:hidden">
            <button onClick={handleBookmark} className="p-2 rounded-xl" style={{ color: bookmarked ? currentTheme.accent : currentTheme.secondary }}>
              <Bookmark size={17} fill={bookmarked ? currentTheme.accent : 'none'} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-xl" style={{ color: currentTheme.secondary }}>
              <Share2 size={17} />
            </button>
          </div>
        </div>

        {/* Cover image */}
        <div className="mt-6 sm:mt-8 overflow-hidden rounded-xl sm:rounded-2xl">
          <img src={article.imageUrl} alt={article.title} className="w-full object-cover h-48 sm:h-auto max-h-[420px]" />
        </div>

        {/* Content array wrapper */}
        {hasContent ? (
          <article className="mt-6 sm:mt-8 prose-img:rounded-xl prose-img:max-w-full break-words overscroll-x-none max-w-full overflow-hidden">
            {renderContent(article.content)}
          </article>
        ) : (
          <div className="mt-10 rounded-2xl border p-8 text-center" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
            <p className="text-lg font-serif font-semibold mb-2" style={{ color: currentTheme.text }}>
              This article lives on {article.source}
            </p>
            <p className="text-sm mb-6" style={{ color: currentTheme.secondary }}>
              Click below to read the full article on the original site.
            </p>
            {article.externalUrl && (
              <a href={article.externalUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
                style={{ backgroundColor: currentTheme.accent, color: currentTheme.bg }}>
                Read Full Article <ExternalLink size={15} />
              </a>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags?.map(tag => (
            <span key={tag} className="rounded-full px-3 py-1 text-xs cursor-pointer transition-colors hover:opacity-80"
              style={{ backgroundColor: currentTheme.card, color: currentTheme.secondary, border: `1px solid ${currentTheme.border}` }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Like / share row */}
        <div className="mt-8 flex items-center flex-wrap gap-2 sm:gap-4 border-t border-b py-4" style={{ borderColor: currentTheme.border }}>
          <button onClick={() => setLiked(!liked)}
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 rounded-xl px-4 py-2.5 sm:py-2 text-sm font-medium transition-all"
            style={{
              backgroundColor: liked ? currentTheme.accent + '22' : 'transparent',
              color: liked ? currentTheme.accent : currentTheme.secondary,
              border: `1px solid ${liked ? currentTheme.accent : currentTheme.border}`,
            }}>
            <ThumbsUp size={15} fill={liked ? currentTheme.accent : 'none'} /> {liked ? 'Liked' : 'Like'}
          </button>
          <button onClick={handleBookmark}
            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 rounded-xl px-4 py-2.5 sm:py-2 text-sm font-medium transition-all"
            style={{
              backgroundColor: bookmarked ? currentTheme.accent + '22' : 'transparent',
              color: bookmarked ? currentTheme.accent : currentTheme.secondary,
              border: `1px solid ${bookmarked ? currentTheme.accent : currentTheme.border}`,
            }}>
            <Bookmark size={15} fill={bookmarked ? currentTheme.accent : 'none'} /> {bookmarked ? 'Saved' : 'Save'}
          </button>
          <button onClick={handleShare}
            className="flex-1 sm:flex-none sm:ml-auto flex justify-center items-center gap-1.5 rounded-xl px-4 py-2.5 sm:py-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: currentTheme.secondary, border: `1px solid ${currentTheme.border}40` }}>
            <Share2 size={15} /> Share
          </button>
        </div>

        {/* Author box */}
        <div className="mt-8 rounded-2xl border p-5" style={{ backgroundColor: currentTheme.card, borderColor: currentTheme.border }}>
          <div className="flex items-center gap-3">
            <img src={article.author.avatar} alt={article.author.name} className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-serif font-semibold" style={{ color: currentTheme.text }}>{article.author.name}</p>
              <p className="text-xs mt-0.5" style={{ color: currentTheme.secondary }}>
                {article.author.bio || `Writer at ${article.source}`}
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h3 className="font-serif text-xl font-bold mb-4" style={{ color: currentTheme.text }}>Related Articles</h3>
            <div className="space-y-3">
              {related.map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleRead;