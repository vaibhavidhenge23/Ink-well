import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReaderThemeProvider } from "./contexts/ReaderThemeContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Feed from "./pages/Feed";
import ArticleRead from "./pages/ArticleRead";
import Explore from "./pages/Explore";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const queryClient = new QueryClient();
const App = () => /*#__PURE__*/_jsx(QueryClientProvider, {
  client: queryClient,
  children: /*#__PURE__*/_jsx(TooltipProvider, {
    children: /*#__PURE__*/_jsxs(ReaderThemeProvider, {
      children: [/*#__PURE__*/_jsx(Toaster, {}), /*#__PURE__*/_jsx(Sonner, {}), /*#__PURE__*/_jsx(BrowserRouter, {
        children: /*#__PURE__*/_jsxs(Routes, {
          children: [/*#__PURE__*/_jsx(Route, {
            path: "/",
            element: /*#__PURE__*/_jsx(Landing, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/login",
            element: /*#__PURE__*/_jsx(Login, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/onboarding",
            element: /*#__PURE__*/_jsx(Onboarding, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/feed",
            element: /*#__PURE__*/_jsx(Feed, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/article/:id",
            element: /*#__PURE__*/_jsx(ArticleRead, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/explore",
            element: /*#__PURE__*/_jsx(Explore, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/bookmarks",
            element: /*#__PURE__*/_jsx(Bookmarks, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/notifications",
            element: /*#__PURE__*/_jsx(Notifications, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/profile",
            element: /*#__PURE__*/_jsx(Profile, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/settings",
            element: /*#__PURE__*/_jsx(SettingsPage, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "*",
            element: /*#__PURE__*/_jsx(NotFound, {})
          })]
        })
      })]
    })
  })
});
export default App;