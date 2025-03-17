
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { fetchHijriDate } from '@/lib/api';

const HijriDate = () => {
  const [date, setDate] = useState({
    hijri: '',
    gregorian: '',
  });

  useEffect(() => {
    const getHijriDate = async () => {
      try {
        const data = await fetchHijriDate();
        
        const hijriData = data.hijri;
        const gregorianData = data.gregorian;
        
        setDate({
          hijri: `${hijriData.day} ${hijriData.month.ar} ${hijriData.year}`,
          gregorian: `${gregorianData.day} ${gregorianData.month.en} ${gregorianData.year}`,
        });
      } catch (error) {
        console.error('Error fetching Hijri date:', error);
        
        // Fallback to calculating locally
        const now = new Date();
        setDate({
          hijri: 'تعذر جلب التاريخ الهجري',
          gregorian: now.toLocaleDateString('ar-SA', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
        });
      }
    };

    getHijriDate();
    
    // Set up a timer to update the date every day
    const timer = setInterval(getHijriDate, 86400000); // 24 hours
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="overflow-hidden backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="ml-2 h-5 w-5" /> التاريخ اليوم
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center justify-center text-2xl font-medium py-2 rounded-md bg-secondary/50 animate-pulse-subtle">
            <span className="arabic">{date.hijri || 'جاري التحميل...'}</span>
          </div>
          <div className="text-sm text-muted-foreground text-center mt-2">
            {date.gregorian || 'جاري التحميل...'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HijriDate;
