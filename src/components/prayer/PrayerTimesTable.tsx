
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { Clock, RefreshCw, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PrayerTimesTable = () => {
  const { prayerTimes, nextPrayer, location, loading, error, updateLocation } = usePrayerTimes();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format prayer times for display
  const formatPrayerTime = (time: string) => {
    if (!time) return '-';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate remaining time until next prayer
  const getTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.time) return 'جاري الحساب...';
    
    const now = currentTime.getTime();
    const prayerTime = new Date(nextPrayer.time).getTime();
    
    if (prayerTime < now) return 'الآن';
    
    const diff = prayerTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    } else {
      return `${minutes} دقيقة`;
    }
  };

  // Update location
  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: 'جاري تحديث الموقع',
        description: 'يرجى الانتظار قليلاً...'
      });
      
      navigator.geolocation.getCurrentPosition(
        position => {
          updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          toast({
            title: 'خطأ',
            description: 'تعذر الحصول على موقعك. يرجى التحقق من إعدادات الموقع.',
            variant: 'destructive'
          });
        }
      );
    } else {
      toast({
        title: 'غير مدعوم',
        description: 'خدمة تحديد الموقع غير مدعومة في هذا المتصفح.',
        variant: 'destructive'
      });
    }
  };

  const prayerNames = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
  };

  return (
    <Card className="backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Clock className="ml-2 h-5 w-5" /> مواقيت الصلاة
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUpdateLocation}
            className="flex items-center"
          >
            <RefreshCw className="ml-2 h-4 w-4" /> تحديث الموقع
          </Button>
        </div>
        {location?.city && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="ml-1 h-4 w-4" /> {location.city}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-secondary/50 rounded-md"></div>
            <div className="grid grid-cols-3 gap-2">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-secondary/30 rounded-md"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-6">
            <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">تعذر تحميل مواقيت الصلاة</h3>
            <p className="text-muted-foreground mb-4">
              يرجى التحقق من اتصال الإنترنت وإعدادات الموقع.
            </p>
            <Button 
              variant="secondary" 
              onClick={handleUpdateLocation}
            >
              إعادة المحاولة
            </Button>
          </div>
        ) : (
          <>
            {nextPrayer && (
              <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">الصلاة القادمة</div>
                <div className="text-2xl font-medium mt-1">{prayerNames[nextPrayer.name as keyof typeof prayerNames] || nextPrayer.name}</div>
                <div className="text-lg">{nextPrayer.timeFormatted}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  الوقت المتبقي: <span className="font-medium">{getTimeRemaining()}</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-3">
              {prayerTimes && Object.entries(prayerTimes)
                .filter(([key]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
                .map(([name, time]) => (
                  <div 
                    key={name} 
                    className={`p-3 rounded-md text-center ${nextPrayer?.name === name ? 'bg-primary/10 text-primary' : 'bg-secondary/50'}`}
                  >
                    <div className="font-medium">
                      {prayerNames[name as keyof typeof prayerNames] || name}
                    </div>
                    <div className="text-lg mt-1">{formatPrayerTime(time)}</div>
                  </div>
                ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimesTable;
