import CategoryTag from './CategoryTag';
import { Link } from 'react-router-dom';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const FeaturedCard = ({
  article
}) => /*#__PURE__*/_jsx(Link, {
  to: `/article/${article.id}`,
  className: "group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/30",
  children: /*#__PURE__*/_jsxs("div", {
    className: "relative aspect-[16/9] overflow-hidden",
    children: [/*#__PURE__*/_jsx("img", {
      src: article.imageUrl,
      alt: article.title,
      className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
      loading: "lazy"
    }), /*#__PURE__*/_jsx("div", {
      className: "absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent"
    }), /*#__PURE__*/_jsxs("div", {
      className: "absolute bottom-4 left-4 right-4",
      children: [/*#__PURE__*/_jsx(CategoryTag, {
        category: article.category,
        size: "md"
      }), /*#__PURE__*/_jsx("h2", {
        className: "mt-2 font-serif text-2xl font-bold leading-tight text-foreground line-clamp-2",
        children: article.title
      }), /*#__PURE__*/_jsx("p", {
        className: "mt-1 text-sm text-text-secondary line-clamp-2",
        children: article.excerpt
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
        children: [/*#__PURE__*/_jsx("img", {
          src: article.author.avatar,
          alt: article.author.name,
          className: "h-5 w-5 rounded-full"
        }), /*#__PURE__*/_jsx("span", {
          children: article.author.name
        }), /*#__PURE__*/_jsx("span", {
          children: "\xB7"
        }), /*#__PURE__*/_jsx("span", {
          children: article.date
        }), /*#__PURE__*/_jsx("span", {
          children: "\xB7"
        }), /*#__PURE__*/_jsx("span", {
          children: article.readTime
        })]
      })]
    })]
  })
});
export const ArticleCard = ({
  article
}) => /*#__PURE__*/_jsxs(Link, {
  to: `/article/${article.id}`,
  className: "group card-hover flex gap-4 rounded-lg border border-border bg-card p-4",
  children: [/*#__PURE__*/_jsxs("div", {
    className: "flex-1 min-w-0",
    children: [/*#__PURE__*/_jsx(CategoryTag, {
      category: article.category
    }), /*#__PURE__*/_jsx("h3", {
      className: "mt-1.5 font-serif text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors",
      children: article.title
    }), /*#__PURE__*/_jsx("p", {
      className: "mt-1 text-xs text-text-secondary line-clamp-2",
      children: article.excerpt
    }), /*#__PURE__*/_jsxs("div", {
      className: "mt-2 flex items-center gap-2 text-[11px] text-muted-foreground",
      children: [/*#__PURE__*/_jsx("img", {
        src: article.author.avatar,
        alt: article.author.name,
        className: "h-4 w-4 rounded-full"
      }), /*#__PURE__*/_jsx("span", {
        children: article.author.name
      }), /*#__PURE__*/_jsx("span", {
        children: "\xB7"
      }), /*#__PURE__*/_jsx("span", {
        children: article.readTime
      }), /*#__PURE__*/_jsx("span", {
        children: "\xB7"
      }), /*#__PURE__*/_jsx("span", {
        className: "rounded bg-tag-bg px-1.5 py-0.5",
        children: article.source
      })]
    })]
  }), /*#__PURE__*/_jsx("div", {
    className: "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg",
    children: /*#__PURE__*/_jsx("img", {
      src: article.imageUrl,
      alt: "",
      className: "h-full w-full object-cover",
      loading: "lazy"
    })
  })]
});
export const ArticleCardSmall = ({
  article
}) => /*#__PURE__*/_jsx(Link, {
  to: `/article/${article.id}`,
  className: "group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-hover",
  children: /*#__PURE__*/_jsxs("div", {
    className: "flex-1 min-w-0",
    children: [/*#__PURE__*/_jsx("h4", {
      className: "font-serif text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors",
      children: article.title
    }), /*#__PURE__*/_jsxs("p", {
      className: "mt-0.5 text-[11px] text-muted-foreground",
      children: [article.readTime, " \xB7 ", article.source]
    })]
  })
});