import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, User } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BottomNav = () => {
  const location = useLocation();
  const tabs = [{
    to: '/feed',
    icon: Home,
    label: 'Home'
  }, {
    to: '/explore',
    icon: Compass,
    label: 'Explore'
  }, {
    to: '/bookmarks',
    icon: Bookmark,
    label: 'Saved'
  }, {
    to: '/profile',
    icon: User,
    label: 'Profile'
  }];
  return /*#__PURE__*/_jsx("nav", {
    className: "fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden",
    children: /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-around py-2",
      children: tabs.map(({
        to,
        icon: Icon,
        label
      }) => {
        const active = location.pathname === to;
        return /*#__PURE__*/_jsxs(Link, {
          to: to,
          className: `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${active ? 'text-primary' : 'text-text-secondary'}`,
          children: [/*#__PURE__*/_jsx(Icon, {
            size: 20
          }), /*#__PURE__*/_jsx("span", {
            children: label
          })]
        }, to);
      })
    })
  });
};
export default BottomNav;