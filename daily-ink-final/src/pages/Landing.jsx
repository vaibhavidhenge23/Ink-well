import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const featuredCategories = ['Tech', 'Science', 'Business', 'Design', 'Health', 'Philosophy', 'Culture', 'Finance'];
const stats = [{
  value: '50+',
  label: 'Categories'
}, {
  value: '10,000+',
  label: 'Daily Articles'
}, {
  value: 'Zero',
  label: 'Paywalls'
}, {
  value: '100%',
  label: 'Personalized'
}];
const Landing = () => {
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-background",
    children: [/*#__PURE__*/_jsxs("section", {
      className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4",
      children: [/*#__PURE__*/_jsx("div", {
        className: "absolute inset-0 overflow-hidden",
        children: [...Array(6)].map((_, i) => /*#__PURE__*/_jsx("div", {
          className: "absolute rounded-xl bg-card/40 backdrop-blur-sm border border-border/20",
          style: {
            width: `${150 + i * 30}px`,
            height: `${100 + i * 20}px`,
            left: `${10 + i * 15}%`,
            top: `${15 + i % 3 * 25}%`,
            transform: `rotate(${-10 + i * 5}deg)`,
            opacity: 0.15 + i * 0.03
          }
        }, i))
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          opacity: 0,
          y: 30
        },
        animate: {
          opacity: 1,
          y: 0
        },
        transition: {
          duration: 0.8
        },
        className: "relative z-10 text-center",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "mb-6 flex items-center justify-center gap-2",
          children: [/*#__PURE__*/_jsx(Droplet, {
            className: "h-10 w-10 text-primary fill-primary/30"
          }), /*#__PURE__*/_jsx("h1", {
            className: "font-serif text-6xl font-bold text-primary ink-glow md:text-8xl",
            children: "Inkwell"
          })]
        }), /*#__PURE__*/_jsx("p", {
          className: "font-serif text-xl text-foreground md:text-2xl",
          children: "Read What Matters. Every Single Day."
        }), /*#__PURE__*/_jsx("p", {
          className: "mt-3 max-w-md mx-auto text-sm text-text-secondary",
          children: "Personalized articles across 50+ topics, curated by AI, delivered fresh daily"
        }), /*#__PURE__*/_jsxs("div", {
          className: "mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center",
          children: [/*#__PURE__*/_jsx(Link, {
            to: "/login",
            className: "gold-gradient rounded-lg px-8 py-3 font-sans font-semibold text-primary-foreground transition-transform hover:scale-105",
            children: "Start Reading Free"
          }), /*#__PURE__*/_jsx(Link, {
            to: "/explore",
            className: "rounded-lg border border-primary/40 px-8 py-3 font-sans font-semibold text-primary transition-colors hover:bg-primary/10",
            children: "Explore Topics"
          })]
        })]
      }), /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0
        },
        animate: {
          opacity: 1
        },
        transition: {
          delay: 1.5
        },
        className: "absolute bottom-8 text-muted-foreground text-xs",
        children: "Scroll to learn more \u2193"
      })]
    }), /*#__PURE__*/_jsx("section", {
      className: "border-t border-border bg-secondary/50 py-16",
      children: /*#__PURE__*/_jsx("div", {
        className: "container grid grid-cols-2 gap-6 px-4 md:grid-cols-4",
        children: stats.map((stat, i) => /*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            y: 20
          },
          whileInView: {
            opacity: 1,
            y: 0
          },
          viewport: {
            once: true
          },
          transition: {
            delay: i * 0.1
          },
          className: "text-center",
          children: [/*#__PURE__*/_jsx("p", {
            className: "font-serif text-3xl font-bold text-gold-gradient",
            children: stat.value
          }), /*#__PURE__*/_jsx("p", {
            className: "mt-1 text-sm text-text-secondary",
            children: stat.label
          })]
        }, stat.label))
      })
    }), /*#__PURE__*/_jsx("section", {
      className: "py-16",
      children: /*#__PURE__*/_jsxs("div", {
        className: "container px-4",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-center font-serif text-2xl font-bold text-foreground",
          children: "Featured Categories"
        }), /*#__PURE__*/_jsx("div", {
          className: "mt-8 flex flex-wrap items-center justify-center gap-3",
          children: featuredCategories.map(cat => /*#__PURE__*/_jsx("span", {
            className: "rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary cursor-pointer",
            children: cat
          }, cat))
        })]
      })
    }), /*#__PURE__*/_jsxs("section", {
      className: "border-t border-border py-16 text-center",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "font-serif text-3xl font-bold text-foreground",
        children: "Ready to dive in?"
      }), /*#__PURE__*/_jsx("p", {
        className: "mt-2 text-text-secondary",
        children: "Join thousands of curious readers"
      }), /*#__PURE__*/_jsx(Link, {
        to: "/login",
        className: "mt-6 inline-block gold-gradient rounded-lg px-8 py-3 font-sans font-semibold text-primary-foreground transition-transform hover:scale-105",
        children: "Get Started \u2014 It's Free"
      })]
    })]
  });
};
export default Landing;