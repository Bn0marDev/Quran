
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Calendar } from 'lucide-react';

const HijriDate = () => {
  const [date, setDate] = useState({
    hijri: '',
    gregorian: '',
  });

  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const response = await fetch('https://api.aladhan.com/v1/gToH');
        const data = await response.json();
        
        if (data.code === 200) {
          const hijriData = data.data.hijri;
          const gregorianData = data.data.gregorian;
          
          setDate({
            hijri: `${hijriData.day} ${hijriData.month.en} ${hijriData.year}`,
            gregorian: `${gregorianData.day} ${gregorianData.month.en} ${gregorianData.year}`,
          });
        }
      } catch (error) {
        console.error('Error fetching Hijri date:', error);
        
        // Fallback to calculating locally
        const now = new Date();
        setDate({
          hijri: 'Unable to fetch Hijri date',
          gregorian: now.toLocaleDateString('en-US', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          }),
        });
      }
    };

    fetchHijriDate();
    
    // Set up a timer to update the date every day
    const timer = setInterval(fetchHijriDate, 86400000); // 24 hours
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Card glass hover className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" /> Today's Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center justify-center text-2xl font-medium py-2 rounded-md bg-secondary/50 animate-pulse-subtle">
            <span className="arabic">{date.hijri || 'Loading...'}</span>
          </div>
          <div className="text-sm text-muted-foreground text-center mt-2">
            {date.gregorian || 'Loading...'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HijriDate;
