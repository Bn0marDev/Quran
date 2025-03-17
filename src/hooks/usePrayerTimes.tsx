
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

type Location = {
  latitude: number;
  longitude: number;
  city?: string;
};

type PrayerTimesType = Record<string, string>;

interface NextPrayer {
  name: string;
  time: string;
  timeFormatted: string;
}

interface PrayerTimesResult {
  prayerTimes: PrayerTimesType | null;
  nextPrayer: NextPrayer | null;
  date: string;
  loading: boolean;
  error: Error | null;
  location: Location | null;
  updateLocation: (location: Location) => void;
}

// Function to fetch prayer times from the API
const fetchPrayerTimes = async (location: Location): Promise<PrayerTimesType> => {
  try {
    const { latitude, longitude } = location;
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    
    // Using Aladhan API to fetch prayer times
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.timings) {
      throw new Error('Invalid prayer times data');
    }
    
    return data.data.timings;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// Function to get city name from coordinates
const fetchCityName = async (location: Location): Promise<string> => {
  try {
    const { latitude, longitude } = location;
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location info');
    }
    
    const data = await response.json();
    return data.city || data.locality || 'Unknown Location';
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown Location';
  }
};

// Function to find the next prayer
const getNextPrayer = (prayerTimes: PrayerTimesType): NextPrayer | null => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const prayers = [
    { name: 'Fajr', time: prayerTimes['Fajr'] },
    { name: 'Dhuhr', time: prayerTimes['Dhuhr'] },
    { name: 'Asr', time: prayerTimes['Asr'] },
    { name: 'Maghrib', time: prayerTimes['Maghrib'] },
    { name: 'Isha', time: prayerTimes['Isha'] }
  ];
  
  // Convert prayer times to Date objects for comparison
  const prayerDateTimes = prayers.map(prayer => {
    const [hours, minutes] = prayer.time.split(':');
    const prayerDate = new Date(todayStr);
    prayerDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return {
      name: prayer.name,
      time: prayerDate.toISOString(),
      timeFormatted: prayerDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      })
    };
  });
  
  // Find the next prayer that hasn't passed yet
  for (const prayer of prayerDateTimes) {
    const prayerTime = new Date(prayer.time).getTime();
    if (prayerTime > now.getTime()) {
      return prayer;
    }
  }
  
  // If all prayers today have passed, return the first prayer for tomorrow
  return prayerDateTimes[0];
};

export const usePrayerTimes = (): PrayerTimesResult => {
  const [location, setLocation] = useState<Location | null>(null);

  // Initialize location on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('prayerLocation');
    
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          try {
            const city = await fetchCityName(newLocation);
            const locationWithCity = { ...newLocation, city };
            
            setLocation(locationWithCity);
            localStorage.setItem('prayerLocation', JSON.stringify(locationWithCity));
          } catch (error) {
            setLocation(newLocation);
            localStorage.setItem('prayerLocation', JSON.stringify(newLocation));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: 'Location Error',
            description: 'Unable to get your location. Please enable location services.',
            variant: 'destructive'
          });
        }
      );
    }
  }, []);

  // Fetch prayer times using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ['prayerTimes', location?.latitude, location?.longitude],
    queryFn: () => location ? fetchPrayerTimes(location) : Promise.reject('No location'),
    enabled: !!location,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  // Update location function
  const updateLocation = async (newLocation: Location) => {
    try {
      if (!newLocation.city) {
        const city = await fetchCityName(newLocation);
        newLocation = { ...newLocation, city };
      }
      
      setLocation(newLocation);
      localStorage.setItem('prayerLocation', JSON.stringify(newLocation));
      
      toast({
        title: 'Location Updated',
        description: `Prayer times will now be shown for ${newLocation.city || 'your location'}.`
      });
    } catch (error) {
      setLocation(newLocation);
      localStorage.setItem('prayerLocation', JSON.stringify(newLocation));
    }
  };

  // Calculate next prayer
  const nextPrayer = data ? getNextPrayer(data) : null;
  
  return {
    prayerTimes: data || null,
    nextPrayer,
    date: new Date().toISOString(),
    loading: isLoading,
    error: error as Error | null,
    location,
    updateLocation
  };
};
