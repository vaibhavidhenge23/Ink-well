// Lightweight reading history tracker using localStorage

const HISTORY_KEY = 'inkwell_reading_history';
const TAG_COUNT_KEY = 'inkwell_tag_counts';
export function recordRead(articleId, tags) {
  const history = getHistory();
  // Avoid duplicates
  if (history.some(h => h.articleId === articleId)) return;
  history.push({
    articleId,
    tags,
    timestamp: Date.now()
  });
  // Keep last 200
  if (history.length > 200) history.splice(0, history.length - 200);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

  // Update tag counts
  const counts = getTagCounts();
  tags.forEach(t => {
    const key = t.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  localStorage.setItem(TAG_COUNT_KEY, JSON.stringify(counts));
}
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}
export function getTagCounts() {
  try {
    return JSON.parse(localStorage.getItem(TAG_COUNT_KEY) || '{}');
  } catch {
    return {};
  }
}
export function getTopTags(n = 3) {
  const counts = getTagCounts();
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n).map(([tag]) => tag);
}
export function getReadArticleIds() {
  return new Set(getHistory().map(h => h.articleId));
}