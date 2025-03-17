
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'القرآن', path: '/quran' },
    { name: 'الأحاديث', path: '/hadith' },
    { name: 'مواقيت الصلاة', path: '/prayer-times' },
    { name: 'الإعدادات', path: '/settings' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-white/30 dark:bg-black/30 border-b border-white/20 dark:border-white/10 shadow-glass py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-xl font-heading font-medium">القرآن الكريم</span>
        </Link>

        {/* سطح المكتب */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="تبديل السمة"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </nav>

        {/* الهاتف المحمول */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full ml-2"
            aria-label="تبديل السمة"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-full"
            aria-label="فتح/إغلاق القائمة"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* قائمة الهاتف المحمول */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-md bg-white/80 dark:bg-black/80 mt-2 mx-4 rounded-lg overflow-hidden animate-fade-in">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`py-3 px-4 ${
                  location.pathname === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
