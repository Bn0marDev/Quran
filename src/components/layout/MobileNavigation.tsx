
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Clock, Home, Moon, Settings, Sun } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const MobileNavigation = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useSettings();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Hide bottom nav when scrolling down, show when scrolling up
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'القرآن', path: '/quran', icon: Book },
    { name: 'مواقيت الصلاة', path: '/prayer-times', icon: Clock },
    { name: 'الإعدادات', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`fixed bottom-0 right-0 left-0 z-50 bg-background backdrop-blur-md border-t border-border transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-1 py-2">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors w-1/5 ${
              isActive(item.path) 
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={20} className="mb-1" />
            <span>{item.name}</span>
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors w-1/5 text-muted-foreground hover:text-foreground"
          aria-label="تبديل السمة"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={20} className="mb-1" />
              <span>السمة</span>
            </>
          ) : (
            <>
              <Moon size={20} className="mb-1" />
              <span>السمة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
