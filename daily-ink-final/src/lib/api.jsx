const fallbackImages = ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80', 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&q=80', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80'];

// Persist page counters in sessionStorage so they survive component remounts
function getCounter(key) {
  return parseInt(sessionStorage.getItem(key) || '0', 10);
}
function setCounter(key, val) {
  sessionStorage.setItem(key, String(val));
}

// Track seen article IDs across the session to guarantee no duplicates
function getSeenIds() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem('inkwell_seen_ids') || '[]'));
  } catch {
    return new Set();
  }
}
function addSeenIds(ids) {
  const seen = getSeenIds();
  ids.forEach(id => seen.add(id));
  sessionStorage.setItem('inkwell_seen_ids', JSON.stringify([...seen]));
}
export async function fetchDevToArticles(tag = '', page, perPage = 10) {
  try {
    if (!page) {
      const prev = getCounter('inkwell_devto_page');
      page = prev + 1;
      setCounter('inkwell_devto_page', page);
    }
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      ...(tag ? {
        tag
      } : {})
    });
    const res = await fetch(`https://dev.to/api/articles?${params}`);
    if (!res.ok) throw new Error('Dev.to API failed');
    const data = await res.json();
    return data.map((a, i) => ({
      id: `devto-${a.id}`,
      title: a.title,
      excerpt: a.description || 'Read this article on Dev.to',
      content: a.description || '',
      category: a.tag_list[0] ? capitalizeFirst(a.tag_list[0]) : 'Technology',
      categoryColor: 'tech',
      author: {
        name: a.user.name,
        avatar: a.user.profile_image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.user.name}`,
        bio: ''
      },
      date: a.readable_publish_date,
      readTime: `${a.reading_time_minutes} min read`,
      source: 'Dev.to',
      imageUrl: a.cover_image || a.social_image || fallbackImages[i % fallbackImages.length],
      tags: a.tag_list.map(capitalizeFirst),
      externalUrl: a.url
    }));
  } catch {
    return [];
  }
}
export async function fetchHackerNewsArticles(count = 10) {
  try {
    const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!res.ok) throw new Error('HN API failed');
    const ids = await res.json();

    // Pick a different slice each refresh
    const offset = getCounter('inkwell_hn_offset');
    const nextOffset = offset + count;
    setCounter('inkwell_hn_offset', nextOffset >= ids.length - count ? 0 : nextOffset);
    const topIds = ids.slice(offset, offset + count);
    const stories = await Promise.all(topIds.map(id => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())));
    return stories.filter(s => s && s.title).map((s, i) => ({
      id: `hn-${s.id}`,
      title: s.title,
      excerpt: `Score: ${s.score} points on Hacker News`,
      content: '',
      category: 'Technology',
      categoryColor: 'tech',
      author: {
        name: s.by || 'Anonymous',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.by}`,
        bio: ''
      },
      date: new Date(s.time * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      readTime: '5 min read',
      source: 'Hacker News',
      imageUrl: fallbackImages[i % fallbackImages.length],
      tags: ['Technology', 'HackerNews'],
      externalUrl: s.url
    }));
  } catch {
    return [];
  }
}

// Personalization: fetch articles by tags the user has read
export async function fetchPersonalizedArticles(readTags, count = 6) {
  if (readTags.length === 0) return [];

  // Pick top 2 most-read tags
  const topTags = readTags.slice(0, 2);
  try {
    const results = await Promise.all(topTags.map(tag => fetchDevToArticles(tag.toLowerCase(), undefined, Math.ceil(count / topTags.length))));
    return results.flat();
  } catch {
    return [];
  }
}
function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}