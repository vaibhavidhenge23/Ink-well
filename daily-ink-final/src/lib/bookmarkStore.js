const STORAGE_KEY = 'inkwell_bookmarks';

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function addBookmark(article) {
  const bookmarks = getBookmarks();
  if (!bookmarks.find(b => b.id === article.id)) {
    bookmarks.unshift(article);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(id) {
  const bookmarks = getBookmarks().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(id) {
  return getBookmarks().some(b => b.id === id);
}
