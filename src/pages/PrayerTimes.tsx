
import { useEffect } from 'react';
import PrayerTimesTable from '@/components/prayer/PrayerTimesTable';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <Card className="p-4 mb-6 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass">
          <CardContent className="p-0 flex items-center">
            <MapPin className="h-5 w-5 ml-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              تعتمد مواقيت الصلاة على موقعك الحالي. تأكد من السماح بالوصول إلى الموقع للحصول على أوقات دقيقة.
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="daily">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">اليومية</TabsTrigger>
            <TabsTrigger value="weekly">الأسبوعية</TabsTrigger>
            <TabsTrigger value="monthly">الشهرية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <PrayerTimesTable />
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card className="text-center py-12 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass">
              <CardContent>
                <p className="text-muted-foreground">
                  مواقيت الصلاة الأسبوعية ستكون متاحة قريباً.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            <Card className="text-center py-12 backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass">
              <CardContent>
                <p className="text-muted-foreground">
                  مواقيت الصلاة الشهرية ستكون متاحة قريباً.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrayerTimes;
