
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSurahs, fetchAyahs } from '@/lib/api';

interface Reciter {
  id: string;
  name: string;
  style?: string;
}

interface QuranContextType {
  surahs: any[] | null;
  loading: boolean;
  error: string | null;
  getAyahs: (surahNumber: number) => Promise<any[]>;
  recitersList: Reciter[];
  selectedReciter: Reciter | null;
  setSelectedReciter: (reciter: Reciter) => void;
}

const QuranContext = createContext<QuranContextType | undefined>(undefined);

const defaultReciters: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', style: 'Murattal' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Abdul Samad', style: 'Murattal' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdur-Rahman As-Sudais', style: 'Murattal' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify', style: 'Murattal' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', style: 'Murattal' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy', style: 'Murattal' },
];

export const QuranProvider = ({ children }: { children: React.ReactNode }) => {
  const [surahs, setSurahs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recitersList] = useState<Reciter[]>(defaultReciters);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        setLoading(true);
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (err) {
        setError('Failed to load surahs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, []);

  // Initialize selected reciter from localStorage
  useEffect(() => {
    const savedReciter = localStorage.getItem('selectedReciter');
    if (savedReciter) {
      try {
        setSelectedReciter(JSON.parse(savedReciter));
      } catch (err) {
        console.error('Error parsing saved reciter:', err);
        setSelectedReciter(defaultReciters[0]);
      }
    } else {
      setSelectedReciter(defaultReciters[0]);
    }
  }, []);

  // Save selected reciter to localStorage when changed
  useEffect(() => {
    if (selectedReciter) {
      localStorage.setItem('selectedReciter', JSON.stringify(selectedReciter));
    }
  }, [selectedReciter]);

  const getAyahs = useCallback(async (surahNumber: number) => {
    try {
      setLoading(true);
      const data = await fetchAyahs(surahNumber, selectedReciter?.id || defaultReciters[0].id);
      return data;
    } catch (err) {
      setError('Failed to load ayahs');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedReciter]);

  return (
    <QuranContext.Provider 
      value={{ 
        surahs, 
        loading, 
        error, 
        getAyahs,
        recitersList,
        selectedReciter,
        setSelectedReciter
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (context === undefined) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
