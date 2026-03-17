import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Bookmark, User } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@/data/articles';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/explore?q=' + encodeURIComponent(searchQuery));
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link to="/feed" className="font-serif text-xl font-bold text-primary ink-glow">
          Inkwell
        </Link>
        <div className="flex items-center gap-1">
          {searchOpen ? (
            <input
              autoFocus
              type="text"
              placeholder="Search articles..."
              className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-text-secondary hover:bg-hover hover:text-foreground transition-colors"
            >
              <Search size={18} />
            </button>
          )}

          <Link
            to="/notifications"
            className="relative rounded-lg p-2 text-text-secondary hover:bg-hover hover:text-foreground transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/bookmarks"
            className={`rounded-lg p-2 transition-colors ${
              location.pathname === '/bookmarks' ? 'text-primary' : 'text-text-secondary hover:bg-hover hover:text-foreground'
            }`}
          >
            <Bookmark size={18} />
          </Link>
          <Link
            to="/profile"
            className={`rounded-lg p-2 transition-colors ${
              location.pathname === '/profile' ? 'text-primary' : 'text-text-secondary hover:bg-hover hover:text-foreground'
            }`}
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;