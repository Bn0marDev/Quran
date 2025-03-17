
import { useEffect } from 'react';
import HijriDate from '@/components/home/HijriDate';
import PrayerTimes from '@/components/home/PrayerTimes';
import QuickLinks from '@/components/home/QuickLinks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Set document title
  useEffect(() => {
    document.title = 'القرآن الكريم - تطبيق إسلامي';
  }, []);

  return (
    <div className="page-container mt-24 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3">
          القرآن الكريم
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          تطبيق إسلامي شامل يحتوي على القرآن الكريم والأحاديث النبوية ومواقيت الصلاة
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
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-3">متابعة قراءة القرآن</h2>
            <p className="text-muted-foreground mb-4">
              استأنف قراءة القرآن من حيث توقفت
            </p>
            <Link to="/quran">
              <Button variant="primary" className="w-full">
                قراءة القرآن <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-medium mb-3">استكشاف الأحاديث</h2>
            <p className="text-muted-foreground mb-4">
              اكتشف الأحاديث الصحيحة للنبي محمد ﷺ
            </p>
            <Link to="/hadith">
              <Button variant="primary" className="w-full">
                تصفح الأحاديث <ArrowRight className="mr-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center mt-12 mb-6">
        <p className="text-muted-foreground">
          جميع البيانات مخزنة محليًا في متصفحك. لا تحتاج إلى حساب.
        </p>
      </div>
    </div>
  );
};

export default Index;
