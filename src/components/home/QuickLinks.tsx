
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Clock, Settings } from 'lucide-react';

const QuickLinks = () => {
  const links = [
    { 
      name: 'Quran', 
      path: '/quran', 
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Read and listen to the Quran' 
    },
    { 
      name: 'Hadith', 
      path: '/hadith', 
      icon: <Book className="w-6 h-6" />,
      description: 'Read authentic Hadiths' 
    },
    { 
      name: 'Prayer Times', 
      path: '/prayer-times', 
      icon: <Clock className="w-6 h-6" />,
      description: 'Check prayer times for your location' 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="w-6 h-6" />,
      description: 'Customize your experience' 
    }
  ];

  return (
    <Card glass hover className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {links.map((link, index) => (
            <Link
              key={link.name}
              to={link.path}
              className="p-6 hover:bg-accent/50 transition-colors flex flex-col items-center justify-center text-center"
            >
              <div className="rounded-full bg-secondary p-3 mb-3 transition-transform transform group-hover:scale-110">
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
