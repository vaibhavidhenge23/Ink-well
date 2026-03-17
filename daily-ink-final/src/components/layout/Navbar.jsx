import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Bookmark, User } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@/data/articles';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Navbar = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;
  return /*#__PURE__*/_jsx("nav", {
    className: "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
    children: /*#__PURE__*/_jsxs("div", {
      className: "container flex h-14 items-center justify-between px-4",
      children: [/*#__PURE__*/_jsx(Link, {
        to: "/feed",
        className: "font-serif text-xl font-bold text-primary ink-glow",
        children: "Inkwell"
      }), /*#__PURE__*/_jsxs("div", {
        className: "flex items-center gap-1",
        children: [searchOpen ? /*#__PURE__*/_jsx("input", {
          autoFocus: true,
          type: "text",
          placeholder: "Search articles...",
          className: "rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary",
          onBlur: () => setSearchOpen(false)
        }) : /*#__PURE__*/_jsx("button", {
          onClick: () => setSearchOpen(true),
          className: "rounded-lg p-2 text-text-secondary hover:bg-hover hover:text-foreground transition-colors",
          children: /*#__PURE__*/_jsx(Search, {
            size: 18
          })
        }), /*#__PURE__*/_jsxs(Link, {
          to: "/notifications",
          className: "relative rounded-lg p-2 text-text-secondary hover:bg-hover hover:text-foreground transition-colors",
          children: [/*#__PURE__*/_jsx(Bell, {
            size: 18
          }), unreadCount > 0 && /*#__PURE__*/_jsx("span", {
            className: "absolute -top-0 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground",
            children: unreadCount
          })]
        }), /*#__PURE__*/_jsx(Link, {
          to: "/bookmarks",
          className: `rounded-lg p-2 transition-colors ${location.pathname === '/bookmarks' ? 'text-primary' : 'text-text-secondary hover:bg-hover hover:text-foreground'}`,
          children: /*#__PURE__*/_jsx(Bookmark, {
            size: 18
          })
        }), /*#__PURE__*/_jsx(Link, {
          to: "/profile",
          className: `rounded-lg p-2 transition-colors ${location.pathname === '/profile' ? 'text-primary' : 'text-text-secondary hover:bg-hover hover:text-foreground'}`,
          children: /*#__PURE__*/_jsx(User, {
            size: 18
          })
        })]
      })]
    })
  });
};
export default Navbar;