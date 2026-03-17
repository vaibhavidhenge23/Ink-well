import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import { notifications } from '@/data/articles';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Notifications = () => {
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background pb-20 md:pb-0",
    children: [/*#__PURE__*/_jsx(Navbar, {}), /*#__PURE__*/_jsxs("div", {
      className: "container max-w-2xl px-4 py-8",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsx("h1", {
          className: "font-serif text-3xl font-bold text-foreground",
          children: "Notifications"
        }), /*#__PURE__*/_jsx("button", {
          className: "text-xs text-primary hover:text-primary/80 transition-colors",
          children: "Mark all read"
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-6 space-y-2",
        children: notifications.map(n => /*#__PURE__*/_jsxs("div", {
          className: `flex items-start gap-3 rounded-lg border p-4 transition-colors ${n.unread ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'}`,
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-xl",
            children: n.icon
          }), /*#__PURE__*/_jsxs("div", {
            className: "flex-1",
            children: [/*#__PURE__*/_jsx("p", {
              className: `text-sm ${n.unread ? 'text-foreground font-medium' : 'text-text-secondary'}`,
              children: n.text
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-1 text-xs text-muted-foreground",
              children: n.time
            })]
          }), n.unread && /*#__PURE__*/_jsx("span", {
            className: "mt-1 h-2 w-2 rounded-full bg-primary"
          })]
        }, n.id))
      })]
    }), /*#__PURE__*/_jsx(BottomNav, {})]
  });
};
export default Notifications;