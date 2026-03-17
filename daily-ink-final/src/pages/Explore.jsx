import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { articles } from '@/data/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { Search } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const categoryCards = [{
  name: 'Technology',
  count: 45,
  color: 'border-cat-tech'
}, {
  name: 'Science',
  count: 32,
  color: 'border-cat-science'
}, {
  name: 'Business',
  count: 28,
  color: 'border-cat-business'
}, {
  name: 'Health',
  count: 22,
  color: 'border-cat-health'
}, {
  name: 'Philosophy',
  count: 18,
  color: 'border-cat-philosophy'
}, {
  name: 'Design',
  count: 15,
  color: 'border-cat-design'
}, {
  name: 'Finance',
  count: 20,
  color: 'border-cat-finance'
}, {
  name: 'Culture',
  count: 25,
  color: 'border-cat-culture'
}];
const trendingSearches = ['GPT-5', 'Mars Mission', 'Rust Programming', 'Cold Plunge', 'Remote Work', 'Bitcoin', 'Stoicism', 'Sleep Science'];
const Explore = () => {
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background pb-20 md:pb-0",
    children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsxs("div", {
      className: "container max-w-4xl px-4 py-8",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "relative",
        children: [/*#__PURE__*/_jsx(Search, {
          className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
          size: 20
        }), /*#__PURE__*/_jsx("input", {
          type: "text",
          placeholder: "Search articles, topics, authors...",
          className: "w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-4 flex flex-wrap gap-2",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-xs text-muted-foreground mr-1",
          children: "Trending:"
        }), trendingSearches.map(s => /*#__PURE__*/_jsx("span", {
          className: "rounded-full bg-tag-bg px-3 py-1 text-xs text-text-secondary hover:text-primary cursor-pointer transition-colors",
          children: s
        }, s))]
      }), /*#__PURE__*/_jsx("h2", {
        className: "mt-10 font-serif text-xl font-bold text-foreground",
        children: "Browse by Category"
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
        children: categoryCards.map(cat => /*#__PURE__*/_jsxs("div", {
          className: `rounded-xl border-l-2 ${cat.color} border border-border bg-card p-4 cursor-pointer hover:bg-hover transition-colors`,
          children: [/*#__PURE__*/_jsx("p", {
            className: "font-serif font-semibold text-foreground",
            children: cat.name
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: [cat.count, " articles"]
          })]
        }, cat.name))
      }), /*#__PURE__*/_jsx("h2", {
        className: "mt-10 font-serif text-xl font-bold text-foreground",
        children: "Trending Articles"
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-4 space-y-3",
        children: articles.slice(0, 4).map(a => /*#__PURE__*/_jsx(ArticleCard, {
          article: a
        }, a.id))
      }), /*#__PURE__*/_jsx("h2", {
        className: "mt-10 font-serif text-xl font-bold text-foreground",
        children: "Most Bookmarked"
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-4 space-y-3",
        children: articles.slice(5, 9).map(a => /*#__PURE__*/_jsx(ArticleCard, {
          article: a
        }, a.id))
      }), /*#__PURE__*/_jsx("h2", {
        className: "mt-10 font-serif text-xl font-bold text-foreground",
        children: "Hidden Gems"
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-4 space-y-3",
        children: articles.slice(10, 14).map(a => /*#__PURE__*/_jsx(ArticleCard, {
          article: a
        }, a.id))
      })]
    }), /*#__PURE__*/_jsx(BottomNav, {})]
  });
};
export default Explore;