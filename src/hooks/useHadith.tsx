
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { fetchHadithsByCollection } from '@/lib/api';

// Define types for Hadith data
export type HadithCollection = {
  id: string;
  name: string;
  hadiths_count: number;
};

type Hadith = {
  id: string;
  title: string;
  text: string;
  chapter?: string;
  number?: number;
  reference?: string;
  grade?: string;
};

const HADITH_COLLECTIONS = [
  { id: 'bukhari', name: 'صحيح البخاري', hadiths_count: 7563 },
  { id: 'muslim', name: 'صحيح مسلم', hadiths_count: 5362 },
  { id: 'abu-dawud', name: 'سنن أبي داود', hadiths_count: 4590 },
  { id: 'tirmidhi', name: 'جامع الترمذي', hadiths_count: 3891 },
  { id: 'nasai', name: 'سنن النسائي', hadiths_count: 5662 },
  { id: 'ibn-majah', name: 'سنن ابن ماجه', hadiths_count: 4332 },
  { id: 'malik', name: 'موطأ مالك', hadiths_count: 1594 },
  { id: 'riyad', name: 'رياض الصالحين', hadiths_count: 1896 }
];

export const useHadith = () => {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Fetch collections (in a real app, this would come from an API)
  const collections = HADITH_COLLECTIONS;

  // Fetch hadiths for the selected collection
  const {
    data: hadiths,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['hadiths', selectedCollection],
    queryFn: () => selectedCollection ? fetchHadithsByCollection(selectedCollection, 20) : Promise.resolve([]),
    enabled: !!selectedCollection,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false
  });

  const fetchHadiths = useCallback(async () => {
    if (!selectedCollection) return;
    
    try {
      refetch();
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في جلب الأحاديث. يرجى المحاولة مرة أخرى لاحقًا.',
        variant: 'destructive'
      });
    }
  }, [selectedCollection, refetch]);

  // When component mounts, check for last selected collection in localStorage
  useEffect(() => {
    const lastSelectedCollection = localStorage.getItem('lastSelectedHadithCollection');
    if (lastSelectedCollection && !selectedCollection) {
      try {
        setSelectedCollection(JSON.parse(lastSelectedCollection));
      } catch (error) {
        console.error('Error parsing last selected hadith collection:', error);
      }
    }
  }, [selectedCollection]);

  // Save selected collection to localStorage when changed
  useEffect(() => {
    if (selectedCollection) {
      localStorage.setItem('lastSelectedHadithCollection', JSON.stringify(selectedCollection));
    }
  }, [selectedCollection]);

  return {
    collections,
    selectedCollection,
    setSelectedCollection,
    hadiths,
    loading,
    error: error as Error | null,
    fetchHadithsByCollection: fetchHadiths
  };
};
