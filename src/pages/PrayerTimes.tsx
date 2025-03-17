
import { useEffect } from 'react';
import PrayerTimesTable from '@/components/prayer/PrayerTimesTable';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const PrayerTimes = () => {
  // Set document title
  useEffect(() => {
    document.title = 'Prayer Times - Quranic Cornerstone';
  }, []);

  return (
    <div className="page-container mt-24 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6">
        Prayer Times
      </h1>
      
      <div className="mb-6">
        <Card glass className="p-4 mb-6">
          <CardContent className="p-0 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Prayer times are based on your current location. Make sure to allow location access for accurate times.
            </p>
          </CardContent>
        </Card>
        
        <PrayerTimesTable />
      </div>
    </div>
  );
};

export default PrayerTimes;
