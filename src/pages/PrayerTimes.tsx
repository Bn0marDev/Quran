
import { useEffect } from 'react';
import PrayerTimesTable from '@/components/prayer/PrayerTimesTable';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const PrayerTimes = () => {
  // Set document title
  useEffect(() => {
    document.title = 'مواقيت الصلاة - القرآن الكريم';
  }, []);

  return (
    <div className="page-container mt-24 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6">
        مواقيت الصلاة
      </h1>
      
      <div className="mb-6">
        <Card className="p-4 mb-6">
          <CardContent className="p-0 flex items-center">
            <MapPin className="h-5 w-5 ml-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              تعتمد مواقيت الصلاة على موقعك الحالي. تأكد من السماح بالوصول إلى الموقع للحصول على أوقات دقيقة.
            </p>
          </CardContent>
        </Card>
        
        <PrayerTimesTable />
      </div>
    </div>
  );
};

export default PrayerTimes;
