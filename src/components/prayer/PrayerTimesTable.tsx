
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, Bell, BellOff } from 'lucide-react';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

const PrayerTimesTable = () => {
  const { prayerTimes, date, loading, error, location, updateLocation } = usePrayerTimes();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true
  });

  const toggleNotification = (prayer: string) => {
    setNotifications(prev => {
      const newNotifications = { ...prev, [prayer]: !prev[prayer] };
      // Save to localStorage
      localStorage.setItem('prayerNotifications', JSON.stringify(newNotifications));
      return newNotifications;
    });
  };

  useEffect(() => {
    const savedNotifications = localStorage.getItem('prayerNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const formatTime = (timeString: string) => {
    if (!timeString) return '--:--';
    const date = new Date(timeString);
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Show toast notification
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Show toast notification
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Clock className="ml-2 h-5 w-5" /> مواقيت الصلاة
          </CardTitle>
          <div className="text-sm">
            <span className="text-muted-foreground mr-2">
              <Calendar className="inline-block ml-1 h-4 w-4" />
              {date ? new Date(date).toLocaleDateString('ar-SA') : 'اليوم'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 text-sm bg-secondary/30 p-3 rounded-md">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 ml-1" />
            {location?.city || 'الموقع غير محدد'}
          </div>
          <Button size="sm" variant="outline" onClick={handleDetectLocation}>
            {loading ? 'جاري التحديد...' : 'تحديد الموقع'}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-secondary/30 rounded-md"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-3">
              تعذر تحميل مواقيت الصلاة. يرجى التحقق من إعدادات الموقع.
            </p>
            <Button variant="primary" onClick={handleDetectLocation}>
              إعادة المحاولة مع تحديد الموقع
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {prayerTimes && Object.entries(prayerTimes)
              .filter(([key]) => ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(key))
              .map(([name, time]) => (
                <div 
                  key={name} 
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <div className="font-medium">
                      {name === 'Fajr' ? 'الفجر' : 
                       name === 'Sunrise' ? 'الشروق' :
                       name === 'Dhuhr' ? 'الظهر' : 
                       name === 'Asr' ? 'العصر' : 
                       name === 'Maghrib' ? 'المغرب' : 
                       name === 'Isha' ? 'العشاء' : name}
                    </div>
                    {name !== 'Sunrise' && (
                      <div className="text-xs text-muted-foreground">
                        {name === 'Fajr' ? 'صلاة الفجر' : 
                         name === 'Dhuhr' ? 'صلاة الظهر' : 
                         name === 'Asr' ? 'صلاة العصر' : 
                         name === 'Maghrib' ? 'صلاة المغرب' : 
                         name === 'Isha' ? 'صلاة العشاء' : ''}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-lg font-medium">
                      {formatTime(time)}
                    </div>
                    {name !== 'Sunrise' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-2"
                        onClick={() => toggleNotification(name)}
                      >
                        {notifications[name] ? 
                          <Bell className="h-4 w-4 text-primary" /> : 
                          <BellOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerTimesTable;
