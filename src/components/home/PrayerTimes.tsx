
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
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  // Calculate time remaining for next prayer
  const getTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.time) return 'Calculating...';
    
    const now = currentTime.getTime();
    const prayerTime = new Date(nextPrayer.time).getTime();
    
    // If prayer time has passed, show "Now"
    if (prayerTime < now) return 'Now';
    
    const diff = prayerTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <Card glass hover className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Prayer Times
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
            Unable to load prayer times. Please check your location settings.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Next Prayer</div>
              <div className="text-2xl font-medium mt-1">{nextPrayer?.name || 'Calculating...'}</div>
              <div className="text-lg">{nextPrayer?.timeFormatted || 'Loading...'}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Time remaining: <span className="font-medium">{getTimeRemaining()}</span>
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
                      <div className="font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">
                        {time ? new Date(time).toLocaleTimeString([], { 
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
