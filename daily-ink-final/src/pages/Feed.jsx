import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { FeaturedCard, ArticleCard, ArticleCardSmall } from '@/components/ArticleCard';
import { articles as dummyArticles, trendingTopics, userStats, feedCategories } from '@/data/articles';
import { fetchDevToArticles, fetchHackerNewsArticles, fetchPersonalizedArticles } from '@/lib/api';
import { getTopTags, getReadArticleIds } from '@/lib/readingHistory';
import { storeArticles } from '@/lib/articleStore';
import { Flame, RefreshCw, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const Feed = () => {
  const [activeCategory, setActiveCategory] = useState('For You');
  const [liveArticles, setLiveArticles] = useState([]);
  const [personalizedArticles, setPersonalizedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  // Deduplicate articles by ID and filter already-read ones to bottom
  const allArticles = useMemo(() => {
    const seen = new Set();
    const readIds = getReadArticleIds();
    const unread = [];
    const read = [];
    for (const a of [...personalizedArticles, ...liveArticles, ...dummyArticles]) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      if (readIds.has(a.id)) {
        read.push(a);
      } else {
        unread.push(a);
      }
    }
    return [...unread, ...read];
  }, [liveArticles, personalizedArticles]);
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'For You' || activeCategory === 'Trending' || activeCategory === 'New') {
      return allArticles;
    }
    return allArticles.filter(a => a.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [allArticles, activeCategory]);
  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const fetchLiveArticles = useCallback(async () => {
    setLoading(true);
    try {
      const topTags = getTopTags(2);
      const [devTo, hn, personalized] = await Promise.all([fetchDevToArticles('', undefined, 8), fetchHackerNewsArticles(7), fetchPersonalizedArticles(topTags, 6)]);
      setLiveArticles([...devTo, ...hn]);
      setPersonalizedArticles(personalized);
      storeArticles([...devTo, ...hn, ...personalized]);
      setLastUpdated(new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }));
    } catch {
      // fallback to dummy data only
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more articles for infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const [devTo, hn] = await Promise.all([fetchDevToArticles('', undefined, 6), fetchHackerNewsArticles(5)]);
      const newArticles = [...devTo, ...hn];
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        storeArticles(newArticles);
        setLiveArticles(prev => [...prev, ...newArticles]);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore]);
  useEffect(() => {
    fetchLiveArticles();
  }, [fetchLiveArticles]);

  // Infinite scroll observer
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        loadMore();
      }
    }, {
      rootMargin: '400px'
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading]);
  const topTag = getTopTags(1)[0];
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background pb-20 md:pb-0",
    children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsx("div", {
      className: "border-b border-border",
      children: /*#__PURE__*/_jsx("div", {
        className: "container",
        children: /*#__PURE__*/_jsx("div", {
          className: "scrollbar-hide flex gap-1 overflow-x-auto px-4 py-2",
          children: feedCategories.map(cat => /*#__PURE__*/_jsx("button", {
            onClick: () => setActiveCategory(cat),
            className: `whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:bg-hover hover:text-foreground'}`,
            children: cat
          }, cat))
        })
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "container px-4 py-6",
      children: /*#__PURE__*/_jsxs("div", {
        className: "grid gap-6 lg:grid-cols-[280px_1fr_240px]",
        children: [/*#__PURE__*/_jsxs("aside", {
          className: "hidden space-y-6 lg:block",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "rounded-xl border border-border bg-card p-4",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-serif text-sm font-semibold text-foreground",
              children: "Daily Brief"
            }), /*#__PURE__*/_jsx("p", {
              className: "text-[11px] text-muted-foreground",
              children: today
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-2 text-xs font-medium text-primary",
              children: "5 must reads today"
            }), /*#__PURE__*/_jsx("ol", {
              className: "mt-2 space-y-2",
              children: dummyArticles.slice(0, 5).map((a, i) => /*#__PURE__*/_jsxs("li", {
                className: "flex gap-2 text-xs",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "font-bold text-primary",
                  children: i + 1
                }), /*#__PURE__*/_jsx(ArticleCardSmall, {
                  article: a
                })]
              }, a.id))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl border border-border bg-card p-4",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-serif text-sm font-semibold text-foreground",
              children: "Trending Topics"
            }), /*#__PURE__*/_jsx("div", {
              className: "mt-3 space-y-2",
              children: trendingTopics.slice(0, 10).map(t => /*#__PURE__*/_jsxs("div", {
                className: "flex items-center gap-2 text-xs",
                children: [/*#__PURE__*/_jsxs("span", {
                  className: "font-bold text-primary",
                  children: ["#", t.rank]
                }), /*#__PURE__*/_jsx("span", {
                  className: "text-foreground",
                  children: t.topic
                }), /*#__PURE__*/_jsx("span", {
                  className: "ml-auto text-muted-foreground",
                  children: t.articles
                })]
              }, t.rank))
            })]
          })]
        }), /*#__PURE__*/_jsxs("main", {
          className: "space-y-4",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center justify-between",
            children: [/*#__PURE__*/_jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: [lastUpdated ? `Last updated: Today ${lastUpdated}` : 'Loading live articles...', liveArticles.length > 0 && /*#__PURE__*/_jsxs("span", {
                className: "ml-2 text-success",
                children: ["\u25CF ", liveArticles.length, " live articles"]
              })]
            }), /*#__PURE__*/_jsxs("button", {
              onClick: fetchLiveArticles,
              disabled: loading,
              className: "flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50",
              children: [loading ? /*#__PURE__*/_jsx(Loader2, {
                size: 12,
                className: "animate-spin"
              }) : /*#__PURE__*/_jsx(RefreshCw, {
                size: 12
              }), " Refresh"]
            })]
          }), loading && !liveArticles.length ? /*#__PURE__*/_jsxs("div", {
            className: "space-y-4",
            children: [/*#__PURE__*/_jsx(Skeleton, {
              className: "h-56 w-full rounded-xl"
            }), [1, 2, 3].map(i => /*#__PURE__*/_jsx(Skeleton, {
              className: "h-28 w-full rounded-lg"
            }, i))]
          }) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [featured && /*#__PURE__*/_jsx(FeaturedCard, {
              article: featured
            }), topTag && /*#__PURE__*/_jsxs("div", {
              className: "rounded-lg bg-secondary/50 px-3 py-2 text-xs text-text-secondary",
              children: ["\uD83D\uDD25 Because you read about ", /*#__PURE__*/_jsx("span", {
                className: "font-semibold text-primary capitalize",
                children: topTag
              })]
            }), !topTag && /*#__PURE__*/_jsx("div", {
              className: "rounded-lg bg-secondary/50 px-3 py-2 text-xs text-text-secondary",
              children: "\uD83D\uDD25 Trending in Technology"
            }), /*#__PURE__*/_jsx("div", {
              className: "space-y-3",
              children: rest.map(article => /*#__PURE__*/_jsx(ArticleCard, {
                article: article
              }, article.id))
            }), /*#__PURE__*/_jsxs("div", {
              ref: sentinelRef,
              className: "py-4",
              children: [loadingMore && /*#__PURE__*/_jsxs("div", {
                className: "flex items-center justify-center gap-2 text-xs text-muted-foreground",
                children: [/*#__PURE__*/_jsx(Loader2, {
                  size: 14,
                  className: "animate-spin"
                }), " Loading more articles..."]
              }), !hasMore && /*#__PURE__*/_jsx("p", {
                className: "text-center text-xs text-muted-foreground",
                children: "You've reached the end \u2014 for now!"
              })]
            })]
          })]
        }), /*#__PURE__*/_jsxs("aside", {
          className: "hidden space-y-6 xl:block",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "rounded-xl border border-border bg-card p-4",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-serif text-sm font-semibold text-foreground",
              children: "Your Reading Stats"
            }), /*#__PURE__*/_jsxs("div", {
              className: "mt-3 space-y-2 text-xs",
              children: [/*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-text-secondary",
                  children: "Articles this week"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-semibold text-foreground",
                  children: "12"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-text-secondary",
                  children: "Reading streak"
                }), /*#__PURE__*/_jsxs("span", {
                  className: "font-semibold text-foreground",
                  children: [userStats.streak, " days ", /*#__PURE__*/_jsx(Flame, {
                    className: "inline h-3 w-3 text-accent"
                  })]
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-text-secondary",
                  children: "Favorite topic"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-semibold text-primary",
                  children: topTag || userStats.favoriteTopic
                })]
              }), /*#__PURE__*/_jsxs("div", {
                className: "flex justify-between",
                children: [/*#__PURE__*/_jsx("span", {
                  className: "text-text-secondary",
                  children: "Total read time"
                }), /*#__PURE__*/_jsx("span", {
                  className: "font-semibold text-foreground",
                  children: userStats.totalReadTime
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl border border-border bg-card p-4",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-serif text-sm font-semibold text-foreground",
              children: "Editor's Pick"
            }), /*#__PURE__*/_jsx("div", {
              className: "mt-3 space-y-2",
              children: dummyArticles.slice(3, 6).map(a => /*#__PURE__*/_jsx(ArticleCardSmall, {
                article: a
              }, a.id))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "rounded-xl border border-border bg-card p-4",
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-serif text-sm font-semibold text-foreground",
              children: "Popular This Week"
            }), /*#__PURE__*/_jsx("div", {
              className: "mt-3 space-y-2",
              children: dummyArticles.slice(7, 11).map(a => /*#__PURE__*/_jsx(ArticleCardSmall, {
                article: a
              }, a.id))
            })]
          })]
        })]
      })
    }), /*#__PURE__*/_jsx(BottomNav, {})]
  });
};
export default Feed;