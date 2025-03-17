
import { useEffect } from 'react';
import HijriDate from '@/components/home/HijriDate';
import PrayerTimes from '@/components/home/PrayerTimes';
import QuickLinks from '@/components/home/QuickLinks';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Set document title
  useEffect(() => {
    document.title = 'Quranic Cornerstone - Islamic App';
  }, []);

  return (
    <div className="page-container mt-24 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
          Quranic Cornerstone
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive Islamic application with Quran, Hadiths, and Prayer Times.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <HijriDate />
        <PrayerTimes />
      </div>
      
      <div className="mb-8">
        <QuickLinks />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card glass hover className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-3">Continue Reading Quran</h2>
            <p className="text-muted-foreground mb-4">
              Pick up where you left off in your Quran reading
            </p>
            <Link to="/quran">
              <Button variant="primary" className="w-full">
                Read Quran <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card glass hover className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-3">Explore Hadiths</h2>
            <p className="text-muted-foreground mb-4">
              Discover authentic narrations from the Prophet Muhammad ﷺ
            </p>
            <Link to="/hadith">
              <Button variant="primary" className="w-full">
                Browse Hadiths <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-12 mb-6">
        <p className="text-muted-foreground">
          All data is stored locally in your browser. No account required.
        </p>
      </div>
    </div>
  );
};

export default Index;
