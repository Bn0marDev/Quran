
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

const PrayerTimes = () => {
  const { prayerTimes, nextPrayer, loading, error } = usePrayerTimes();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Calculate time remaining for next prayer
  const getTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.time) return 'جاري الحساب...';
    
    const now = currentTime.getTime();
    const prayerTime = new Date(nextPrayer.time).getTime();
    
    // If prayer time has passed, show "Now"
    if (prayerTime < now) return 'الآن';
    
    const diff = prayerTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} ساعة ${minutes} دقيقة`;
    } else {
      return `${minutes} دقيقة`;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Clock className="ml-2 h-5 w-5" /> مواقيت الصلاة
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-10 bg-secondary/50 rounded-md"></div>
            <div className="h-6 bg-secondary/30 rounded-md w-3/4 mx-auto"></div>
            <div className="h-6 bg-secondary/30 rounded-md w-1/2 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-sm text-muted-foreground">
            تعذر تحميل مواقيت الصلاة. يرجى التحقق من إعدادات الموقع.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">الصلاة القادمة</div>
              <div className="text-2xl font-medium mt-1">{nextPrayer?.name || 'جاري الحساب...'}</div>
              <div className="text-lg">{nextPrayer?.timeFormatted || 'جاري التحميل...'}</div>
              <div className="text-sm text-muted-foreground mt-1">
                الوقت المتبقي: <span className="font-medium">{getTimeRemaining()}</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-3 mt-3">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                {prayerTimes && Object.entries(prayerTimes)
                  .filter(([key]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
                  .map(([name, time]) => (
                    <div 
                      key={name} 
                      className={`p-2 rounded-md ${nextPrayer?.name === name ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <div className="font-medium">
                        {name === 'Fajr' ? 'الفجر' : 
                         name === 'Dhuhr' ? 'الظهر' : 
                         name === 'Asr' ? 'العصر' : 
                         name === 'Maghrib' ? 'المغرب' : 
                         name === 'Isha' ? 'العشاء' : name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {time ? new Date(time).toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          hour12: true 
                        }) : '-'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimes;
