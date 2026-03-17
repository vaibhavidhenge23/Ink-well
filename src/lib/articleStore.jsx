// In-memory store for live-fetched articles so ArticleRead can find them

const store = new Map();
export function storeArticles(articles) {
  for (const a of articles) {
    store.set(a.id, a);
  }
}
export function getStoredArticle(id) {
  return store.get(id);
}