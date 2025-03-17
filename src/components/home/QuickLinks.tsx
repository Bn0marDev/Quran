
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Clock, Settings } from 'lucide-react';

const QuickLinks = () => {
  const links = [
    { 
      name: 'القرآن الكريم', 
      path: '/quran', 
      icon: <BookOpen className="w-6 h-6" />,
      description: 'قراءة واستماع للقرآن الكريم' 
    },
    { 
      name: 'الأحاديث', 
      path: '/hadith', 
      icon: <Book className="w-6 h-6" />,
      description: 'قراءة الأحاديث النبوية' 
    },
    { 
      name: 'مواقيت الصلاة', 
      path: '/prayer-times', 
      icon: <Clock className="w-6 h-6" />,
      description: 'التحقق من أوقات الصلاة في موقعك' 
    },
    { 
      name: 'الإعدادات', 
      path: '/settings', 
      icon: <Settings className="w-6 h-6" />,
      description: 'تخصيص تجربتك' 
    }
  ];

  return (
    <Card className="overflow-hidden backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass">
      <CardHeader className="pb-3">
        <CardTitle>روابط سريعة</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {links.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              className="p-6 hover:bg-accent/50 transition-colors flex flex-col items-center justify-center text-center"
            >
              <div className="rounded-full bg-secondary p-3 mb-3 transition-transform transform hover:scale-110">
                {link.icon}
              </div>
              <h3 className="font-medium">{link.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;
