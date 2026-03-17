import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interests, interestGroups } from '@/data/interests';
import { Check } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Onboarding = () => {
  const [selected, setSelected] = useState(new Set());
  const navigate = useNavigate();
  const toggle = id => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background",
    children: [/*#__PURE__*/_jsx("div", {
      className: "sticky top-0 z-50 h-1 bg-secondary",
      children: /*#__PURE__*/_jsx("div", {
        className: "h-full gold-gradient transition-all duration-300",
        style: {
          width: `${Math.min(100, selected.size / 5 * 100)}%`
        }
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "container max-w-4xl px-4 py-12",
      children: [/*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 20
        },
        animate: {
          opacity: 1,
          y: 0
        },
        className: "text-center mb-10",
        children: [/*#__PURE__*/_jsx("h1", {
          className: "font-serif text-4xl font-bold text-foreground",
          children: "What moves your mind?"
        }), /*#__PURE__*/_jsx("p", {
          className: "mt-2 text-text-secondary",
          children: "Pick at least 5 interests to personalize your feed"
        }), /*#__PURE__*/_jsxs("p", {
          className: "mt-4 text-sm font-medium text-primary",
          children: [selected.size, " selected ", selected.size >= 5 && '✓']
        })]
      }), interestGroups.map(group => /*#__PURE__*/_jsxs("div", {
        className: "mb-8",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "mb-3 font-serif text-lg font-semibold text-foreground",
          children: group
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
          children: interests.filter(i => i.group === group).map(interest => {
            const isSelected = selected.has(interest.id);
            return /*#__PURE__*/_jsxs(motion.button, {
              whileTap: {
                scale: 0.97
              },
              onClick: () => toggle(interest.id),
              className: `relative flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-text-secondary hover:border-primary/30 hover:bg-hover'}`,
              children: [/*#__PURE__*/_jsx("span", {
                className: "text-lg",
                children: interest.emoji
              }), /*#__PURE__*/_jsx("span", {
                className: "flex-1 font-medium",
                children: interest.name
              }), isSelected && /*#__PURE__*/_jsx(Check, {
                size: 14,
                className: "text-primary"
              })]
            }, interest.id);
          })
        })]
      }, group)), /*#__PURE__*/_jsx("div", {
        className: "sticky bottom-4 mt-8 flex justify-center",
        children: /*#__PURE__*/_jsxs("button", {
          onClick: () => navigate('/feed'),
          disabled: selected.size < 5,
          className: `rounded-lg px-10 py-3 font-semibold transition-all ${selected.size >= 5 ? 'gold-gradient text-primary-foreground hover:scale-105' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`,
          children: ["Continue (", selected.size, "/5)"]
        })
      })]
    })]
  });
};
export default Onboarding;