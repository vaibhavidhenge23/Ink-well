import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { ChevronRight } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sections = [{
  title: 'Account',
  items: ['Edit Profile', 'Change Password', 'Connected Accounts']
}, {
  title: 'Reading Preferences',
  items: ['Default Reading Mode', 'Font Size', 'Article Length Preference', 'Content Language']
}, {
  title: 'Notifications',
  items: ['Daily Digest Time', 'Breaking News Alerts', 'Author Updates', 'Weekly Report']
}, {
  title: 'Content Preferences',
  items: ['Edit Interests', 'Exclude Topics', 'Content Filters']
}, {
  title: 'Privacy',
  items: ['Reading History', 'Data & Analytics', 'Delete Account']
}];
const SettingsPage = () => {
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background pb-20 md:pb-0",
    children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsxs("div", {
      className: "container max-w-2xl px-4 py-8",
      children: [/*#__PURE__*/_jsx("h1", {
        className: "font-serif text-3xl font-bold text-foreground",
        children: "Settings"
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-8 space-y-8",
        children: sections.map(section => /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h2", {
            className: "font-serif text-sm font-semibold text-muted-foreground uppercase tracking-wider",
            children: section.title
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-2 divide-y divide-border rounded-xl border border-border bg-card overflow-hidden",
            children: section.items.map(item => /*#__PURE__*/_jsxs("button", {
              className: "flex w-full items-center justify-between px-4 py-3 text-sm text-foreground hover:bg-hover transition-colors",
              children: [item, /*#__PURE__*/_jsx(ChevronRight, {
                size: 16,
                className: "text-muted-foreground"
              })]
            }, item))
          })]
        }, section.title))
      })]
    }), /*#__PURE__*/_jsx(BottomNav, {})]
  });
};
export default SettingsPage;