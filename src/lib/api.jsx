const fallbackImages = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
];

function getCounter(key) {
  return parseInt(sessionStorage.getItem(key) || '0', 10);
}
function setCounter(key, val) {
  sessionStorage.setItem(key, String(val));
}

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Cache fetched articles in sessionStorage to avoid re-fetching
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    // Cache valid for 5 minutes
    if (Date.now() - ts < 5 * 60 * 1000) return data;
    return null;
  } catch { return null; }
}
function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function fetchDevToArticles(tag = '', page, perPage = 12) {
  const cacheKey = `devto_${tag}_${page}_${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    if (page === undefined) {
      const prev = getCounter('inkwell_devto_page');
      page = prev + 1;
      setCounter('inkwell_devto_page', page);
    }
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      ...(tag ? { tag } : {}),
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
    const res = await fetch(`https://dev.to/api/articles?${params}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error('Dev.to API failed');
    const data = await res.json();

    const articles = data.map((a, i) => ({
      id: `devto-${a.id}`,
      title: a.title,
      excerpt: a.description || 'Read this article on Dev.to',
      content: a.description || '',
      category: a.tag_list[0] ? capitalizeFirst(a.tag_list[0]) : 'Technology',
      categoryColor: 'tech',
      author: {
        name: a.user.name,
        avatar: a.user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.user.name}`,
        bio: '',
      },
      date: a.readable_publish_date,
      readTime: `${a.reading_time_minutes} min read`,
      source: 'Dev.to',
      imageUrl: a.cover_image || a.social_image || fallbackImages[i % fallbackImages.length],
      tags: a.tag_list.map(capitalizeFirst),
      externalUrl: a.url,
    }));

    setCache(cacheKey, articles);
    return articles;
  } catch {
    return [];
  }
}

// Fetch only top HN stories — single API call, no per-item fetch (much faster)
export async function fetchHackerNewsArticles(count = 8) {
  const cacheKey = `hn_${count}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error('HN failed');
    const ids = await res.json();

    const offset = getCounter('inkwell_hn_offset');
    const nextOffset = (offset + count) >= ids.length ? 0 : offset + count;
    setCounter('inkwell_hn_offset', nextOffset);
    const topIds = ids.slice(offset, offset + count);

    // Fetch stories with a timeout — skip any that take too long
    const stories = await Promise.allSettled(
      topIds.map(id =>
        Promise.race([
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json()),
          new Promise((_, reject) => setTimeout(() => reject('timeout'), 4000))
        ])
      )
    );

    const articles = stories
      .filter(r => r.status === 'fulfilled' && r.value?.title)
      .map((r, i) => {
        const s = r.value;
        return {
          id: `hn-${s.id}`,
          title: s.title,
          excerpt: s.url
            ? `${s.score} points · ${s.descendants || 0} comments on Hacker News`
            : `Discussion: ${s.score} points on Hacker News`,
          content: '',
          category: 'Technology',
          categoryColor: 'tech',
          author: {
            name: s.by || 'Anonymous',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.by}`,
            bio: '',
          },
          date: new Date(s.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: '5 min read',
          source: 'Hacker News',
          imageUrl: fallbackImages[i % fallbackImages.length],
          tags: ['Technology', 'HackerNews'],
          externalUrl: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        };
      });

    setCache(cacheKey, articles);
    return articles;
  } catch {
    return [];
  }
}

export async function fetchPersonalizedArticles(readTags, count = 6) {
  if (!readTags || readTags.length === 0) return [];
  const topTags = readTags.slice(0, 2);
  try {
    const results = await Promise.all(
      topTags.map(tag =>
        fetchDevToArticles(tag.toLowerCase(), 1, Math.ceil(count / topTags.length))
      )
    );
    return results.flat();
  } catch {
    return [];
  }
}