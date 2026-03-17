import { useParams, Link, useNavigate } from 'react-router-dom';
import { articles } from '@/data/articles';
import CategoryTag from '@/components/CategoryTag';
import { ArticleCard } from '@/components/ArticleCard';
import { Bookmark, Share2, ThumbsUp, ThumbsDown, ArrowLeft, Twitter, Linkedin, LinkIcon, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useReaderTheme, readerThemes } from '@/contexts/ReaderThemeContext';
import { recordRead } from '@/lib/readingHistory';
import { getStoredArticle } from '@/lib/articleStore';
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/bookmarkStore';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ArticleRead = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => a.id === id) || (id ? getStoredArticle(id) : undefined);
  const [progress, setProgress] = useState(0);
  const [showThemes, setShowThemes] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (id) setBookmarked(isBookmarked(id));
  }, [id]);

  const handleBookmark = () => {
    if (!article) return;
    if (bookmarked) {
      removeBookmark(article.id);
      setBookmarked(false);
    } else {
      addBookmark(article);
      setBookmarked(true);
    }
  };
  const {
    currentTheme,
    setTheme,
    fontSize,
    setFontSize
  } = useReaderTheme();

  // Record this article as read; redirect to external URL if no local content
  useEffect(() => {
    if (article) {
      recordRead(article.id, article.tags || [article.category]);
      // If article has no real content and has an external URL, open it
      if (article.externalUrl && (!article.content || article.content.length < 100)) {
        window.open(article.externalUrl, '_blank');
        navigate(-1);
      }
    }
  }, [article, navigate]);
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.min(100, scrolled * 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (!article) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex min-h-screen items-center justify-center bg-background",
      children: /*#__PURE__*/_jsx("p", {
        className: "text-text-secondary",
        children: "Article not found"
      })
    });
  }
  const related = articles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  const moreFromAuthor = articles.filter(a => a.id !== article.id && a.author.name === article.author.name).slice(0, 3);
  const renderContent = content => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('> ')) {
        return /*#__PURE__*/_jsx("blockquote", {
          className: "my-6 border-l-4 pl-4 italic text-lg",
          style: {
            borderColor: currentTheme.accent,
            color: currentTheme.secondary,
            fontFamily: currentTheme.font
          },
          children: block.replace('> ', '').replace(/"/g, '')
        }, i);
      }
      if (block.startsWith('## ')) {
        return /*#__PURE__*/_jsx("h2", {
          className: "mt-8 mb-4 font-serif text-2xl font-bold",
          style: {
            color: currentTheme.text
          },
          children: block.replace('## ', '')
        }, i);
      }
      if (block.startsWith('```')) {
        const code = block.replace(/```\w*\n?/g, '');
        return /*#__PURE__*/_jsx("pre", {
          className: "my-4 overflow-x-auto rounded-lg p-4 text-sm font-mono",
          style: {
            backgroundColor: currentTheme.card,
            color: currentTheme.text
          },
          children: /*#__PURE__*/_jsx("code", {
            children: code
          })
        }, i);
      }
      if (block.startsWith('- **') || block.startsWith('1.')) {
        const items = block.split('\n');
        return /*#__PURE__*/_jsx("ul", {
          className: "my-4 space-y-2",
          children: items.map((item, j) => /*#__PURE__*/_jsxs("li", {
            className: "flex items-start gap-2 text-lg leading-relaxed",
            style: {
              color: currentTheme.text,
              fontFamily: currentTheme.font,
              fontSize: `${fontSize}px`
            },
            children: [/*#__PURE__*/_jsx("span", {
              className: "mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full",
              style: {
                backgroundColor: currentTheme.accent
              }
            }), /*#__PURE__*/_jsx("span", {
              dangerouslySetInnerHTML: {
                __html: item.replace(/^[-\d.]+\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }
            })]
          }, j))
        }, i);
      }
      return /*#__PURE__*/_jsx("p", {
        className: "my-4 leading-relaxed",
        style: {
          color: currentTheme.text,
          fontFamily: currentTheme.font,
          fontSize: `${fontSize}px`,
          lineHeight: '1.8'
        },
        children: block
      }, i);
    });
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen",
    style: {
      backgroundColor: currentTheme.bg
    },
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed top-0 left-0 right-0 z-50 h-1",
      style: {
        backgroundColor: currentTheme.border
      },
      children: /*#__PURE__*/_jsx("div", {
        className: "h-full transition-all duration-150",
        style: {
          width: `${progress}%`,
          backgroundColor: currentTheme.accent
        }
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden flex-col gap-2 rounded-xl border p-2 lg:flex",
      style: {
        backgroundColor: currentTheme.card,
        borderColor: currentTheme.border
      },
      children: [/*#__PURE__*/_jsx("button", {
        onClick: handleBookmark,
        className: "rounded-lg p-2 transition-colors hover:opacity-80",
        style: {
          color: bookmarked ? currentTheme.accent : currentTheme.secondary
        },
        children: /*#__PURE__*/_jsx(Bookmark, {
          size: 18,
          fill: bookmarked ? currentTheme.accent : 'none'
        })
      }), /*#__PURE__*/_jsx("button", {
        className: "rounded-lg p-2 transition-colors hover:opacity-80",
        style: {
          color: currentTheme.secondary
        },
        children: /*#__PURE__*/_jsx(Share2, {
          size: 18
        })
      }), /*#__PURE__*/_jsx("div", {
        className: "h-px",
        style: {
          backgroundColor: currentTheme.border
        }
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setFontSize(Math.min(24, fontSize + 1)),
        className: "rounded-lg p-2 text-xs font-bold hover:opacity-80",
        style: {
          color: currentTheme.secondary
        },
        children: "A+"
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setFontSize(Math.max(14, fontSize - 1)),
        className: "rounded-lg p-2 text-xs font-bold hover:opacity-80",
        style: {
          color: currentTheme.secondary
        },
        children: "A-"
      }), /*#__PURE__*/_jsx("div", {
        className: "h-px",
        style: {
          backgroundColor: currentTheme.border
        }
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setShowThemes(!showThemes),
        className: "rounded-lg p-2 transition-colors hover:opacity-80",
        style: {
          color: showThemes ? currentTheme.accent : currentTheme.secondary
        },
        children: /*#__PURE__*/_jsx(Palette, {
          size: 18
        })
      })]
    }), showThemes && /*#__PURE__*/_jsxs("div", {
      className: "fixed right-16 top-1/2 -translate-y-1/2 z-40 hidden lg:block rounded-xl border p-4 w-56 max-h-[70vh] overflow-y-auto scrollbar-hide",
      style: {
        backgroundColor: currentTheme.card,
        borderColor: currentTheme.border
      },
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-xs font-semibold mb-3",
        style: {
          color: currentTheme.text
        },
        children: "Reading Theme"
      }), /*#__PURE__*/_jsx("div", {
        className: "space-y-1.5",
        children: readerThemes.map(t => /*#__PURE__*/_jsxs("button", {
          onClick: () => setTheme(t.id),
          className: "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all",
          style: {
            backgroundColor: currentTheme.id === t.id ? t.accent + '22' : 'transparent',
            border: currentTheme.id === t.id ? `1px solid ${t.accent}` : '1px solid transparent',
            color: currentTheme.id === t.id ? t.accent : currentTheme.secondary
          },
          children: [/*#__PURE__*/_jsx("span", {
            children: t.icon
          }), /*#__PURE__*/_jsx("span", {
            className: "font-medium",
            children: t.name
          }), /*#__PURE__*/_jsx("span", {
            className: "ml-auto h-3 w-3 rounded-full",
            style: {
              backgroundColor: t.bg,
              border: `1px solid ${t.border}`
            }
          })]
        }, t.id))
      })]
    }), /*#__PURE__*/_jsxs("div", {
      className: "mx-auto max-w-[680px] px-4 py-8",
      children: [/*#__PURE__*/_jsxs(Link, {
        to: "/feed",
        className: "mb-6 inline-flex items-center gap-1 text-sm transition-colors hover:opacity-80",
        style: {
          color: currentTheme.secondary
        },
        children: [/*#__PURE__*/_jsx(ArrowLeft, {
          size: 16
        }), " Back to feed"]
      }), /*#__PURE__*/_jsx(CategoryTag, {
        category: article.category,
        size: "md"
      }), /*#__PURE__*/_jsx("h1", {
        className: "mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl",
        style: {
          color: currentTheme.text
        },
        children: article.title
      }), /*#__PURE__*/_jsx("p", {
        className: "mt-3 text-lg",
        style: {
          color: currentTheme.secondary
        },
        children: article.excerpt
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-4 flex gap-2 overflow-x-auto scrollbar-hide lg:hidden pb-2",
        children: readerThemes.map(t => /*#__PURE__*/_jsxs("button", {
          onClick: () => setTheme(t.id),
          className: "flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all",
          style: {
            backgroundColor: currentTheme.id === t.id ? t.accent + '33' : t.card,
            border: currentTheme.id === t.id ? `1px solid ${t.accent}` : `1px solid ${t.border}`,
            color: currentTheme.id === t.id ? t.accent : t.secondary
          },
          children: [t.icon, " ", t.name]
        }, t.id))
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-6 flex items-center gap-3 border-b pb-6",
        style: {
          borderColor: currentTheme.border
        },
        children: [/*#__PURE__*/_jsx("img", {
          src: article.author.avatar,
          alt: article.author.name,
          className: "h-10 w-10 rounded-full"
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex-1",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "flex items-center gap-2",
            children: [/*#__PURE__*/_jsx("span", {
              className: "font-medium",
              style: {
                color: currentTheme.text
              },
              children: article.author.name
            }), /*#__PURE__*/_jsx("button", {
              className: "rounded-full border px-3 py-0.5 text-xs font-medium transition-colors hover:opacity-80",
              style: {
                borderColor: currentTheme.accent,
                color: currentTheme.accent
              },
              children: "Follow"
            })]
          }), /*#__PURE__*/_jsxs("p", {
            className: "text-xs",
            style: {
              color: currentTheme.secondary
            },
            children: [article.date, " \xB7 ", article.readTime, " \xB7 ", article.source]
          })]
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-6 overflow-hidden rounded-xl",
        children: /*#__PURE__*/_jsx("img", {
          src: article.imageUrl,
          alt: article.title,
          className: "w-full object-cover"
        })
      }), /*#__PURE__*/_jsx("article", {
        className: "mt-8",
        children: renderContent(article.content)
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-8 flex flex-wrap gap-2",
        children: article.tags.map(tag => /*#__PURE__*/_jsxs("span", {
          className: "rounded-full px-3 py-1 text-xs cursor-pointer transition-colors hover:opacity-80",
          style: {
            backgroundColor: currentTheme.card,
            color: currentTheme.secondary
          },
          children: ["#", tag]
        }, tag))
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-8 flex items-center gap-4 border-t border-b py-4",
        style: {
          borderColor: currentTheme.border
        },
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-sm",
          style: {
            color: currentTheme.secondary
          },
          children: "Was this helpful?"
        }), /*#__PURE__*/_jsx("button", {
          className: "rounded-lg p-2 transition-colors hover:opacity-80",
          style: {
            color: currentTheme.secondary
          },
          children: /*#__PURE__*/_jsx(ThumbsUp, {
            size: 18
          })
        }), /*#__PURE__*/_jsx("button", {
          className: "rounded-lg p-2 transition-colors hover:opacity-80",
          style: {
            color: currentTheme.secondary
          },
          children: /*#__PURE__*/_jsx(ThumbsDown, {
            size: 18
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-6 flex items-center gap-3",
        children: [/*#__PURE__*/_jsx("span", {
          className: "text-sm",
          style: {
            color: currentTheme.secondary
          },
          children: "Share:"
        }), /*#__PURE__*/_jsx("button", {
          className: "rounded-lg p-2 hover:opacity-80",
          style: {
            color: currentTheme.secondary
          },
          children: /*#__PURE__*/_jsx(Twitter, {
            size: 16
          })
        }), /*#__PURE__*/_jsx("button", {
          className: "rounded-lg p-2 hover:opacity-80",
          style: {
            color: currentTheme.secondary
          },
          children: /*#__PURE__*/_jsx(Linkedin, {
            size: 16
          })
        }), /*#__PURE__*/_jsx("button", {
          className: "rounded-lg p-2 hover:opacity-80",
          style: {
            color: currentTheme.secondary
          },
          children: /*#__PURE__*/_jsx(LinkIcon, {
            size: 16
          })
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "mt-8 rounded-xl border p-6",
        style: {
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.border
        },
        children: /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-3",
          children: [/*#__PURE__*/_jsx("img", {
            src: article.author.avatar,
            alt: article.author.name,
            className: "h-12 w-12 rounded-full"
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("p", {
              className: "font-serif font-semibold",
              style: {
                color: currentTheme.text
              },
              children: article.author.name
            }), /*#__PURE__*/_jsx("p", {
              className: "text-xs",
              style: {
                color: currentTheme.secondary
              },
              children: article.author.bio
            })]
          })]
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "mt-10",
        children: [moreFromAuthor.length > 0 && /*#__PURE__*/_jsxs("div", {
          className: "mb-10",
          children: [/*#__PURE__*/_jsxs("h3", {
            className: "font-serif text-xl font-bold",
            style: {
              color: currentTheme.text
            },
            children: ["More from ", article.author.name]
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-4 space-y-3",
            children: moreFromAuthor.map(a => /*#__PURE__*/_jsx(ArticleCard, {
              article: a
            }, a.id))
          })]
        }), related.length > 0 && /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-serif text-xl font-bold",
            style: {
              color: currentTheme.text
            },
            children: "Related Articles"
          }), /*#__PURE__*/_jsx("div", {
            className: "mt-4 space-y-3",
            children: related.map(a => /*#__PURE__*/_jsx(ArticleCard, {
              article: a
            }, a.id))
          })]
        })]
      })]
    })]
  });
};
export default ArticleRead;