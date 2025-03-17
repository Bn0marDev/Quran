
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

// Define types for Hadith data
type HadithCollection = {
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
  { id: 'bukhari', name: 'Sahih al-Bukhari', hadiths_count: 7563 },
  { id: 'muslim', name: 'Sahih Muslim', hadiths_count: 5362 },
  { id: 'abu-dawud', name: 'Sunan Abi Dawud', hadiths_count: 4590 },
  { id: 'tirmidhi', name: 'Jami' at-Tirmidhi', hadiths_count: 3891 },
  { id: 'nasai', name: "Sunan an-Nasa'i", hadiths_count: 5662 },
  { id: 'ibn-majah', name: 'Sunan Ibn Majah', hadiths_count: 4332 },
  { id: 'malik', name: 'Muwatta Malik', hadiths_count: 1594 },
  { id: 'riyad', name: 'Riyad as-Saliheen', hadiths_count: 1896 }
];

// Function to fetch hadiths by collection
const fetchHadithsByCollection = async (collection: string) => {
  if (!collection) return [];

  try {
    // Normally we would call an external API, but for now we'll return mock data
    // In a real application, replace this with a fetch call to a real API
    return [
      {
        id: '1',
        title: 'The Book of Faith',
        text: 'Umar ibn al-Khattab reported: We were sitting with the Messenger of Allah, peace and blessings be upon him, one day when a man with very white clothes and very black hair came to us. There were no signs of travel on him and none of us recognized him. He sat down in front of the Prophet, rested his knees against the knees of the Prophet, and placed his hands on the thighs of the Prophet. The man said, "O Muhammad, tell me about Islam." The Prophet said, "Islam is to testify there is no God but Allah and Muhammad is the Messenger of Allah, to establish prayer, to give charity, to fast the month of Ramadan, and to perform pilgrimage to the House if you have the means."',
        chapter: 'Faith',
        number: 1,
        reference: 'Bukhari 1, Muslim 8',
        grade: 'Sahih'
      },
      {
        id: '2',
        title: 'Deeds are by Intentions',
        text: 'Umar ibn Al-Khattab reported: The Messenger of Allah, peace and blessings be upon him, said, "Verily, deeds are only with intentions. Verily, every person will have only what they intended. Whoever emigrated to Allah and his messenger, then his emigration is for Allah and his messenger. Whoever emigrated to get something in the world or to marry a woman, then his emigration is for whatever he emigrated for."',
        chapter: 'Revelation',
        number: 1,
        reference: 'Bukhari 1, Muslim 1907',
        grade: 'Sahih'
      },
      {
        id: '3',
        title: 'The Angel of Death',
        text: 'Abu Huraira reported: The Messenger of Allah, peace and blessings be upon him, said, "The Angel of Death used to come visibly to people to take their souls, so he came to Moses, upon him be peace. Moses struck him and knocked out his eye. The angel returned to Allah, saying: You have sent me to a servant who does not want to die. Allah restored his eye and said: Return to him and tell him to place his hand on the back of an ox, for every hair his hand touches will be a year he may live."',
        chapter: 'Prophets',
        number: 339,
        reference: 'Bukhari 3407, Muslim 2372',
        grade: 'Sahih'
      },
      {
        id: '4',
        title: 'The Seven Destructive Sins',
        text: 'Abu Huraira reported: The Messenger of Allah, peace and blessings be upon him, said, "Avoid the seven destructive sins." They asked, "O Messenger of Allah, what are they?" The Prophet said, "Associating partners with Allah, magic, killing a soul that Allah has forbidden except by right, consuming usury, consuming the wealth of an orphan, fleeing from the battlefield, and slandering chaste, unwary, believing women."',
        chapter: 'Faith',
        number: 85,
        reference: 'Bukhari 2766, Muslim 89',
        grade: 'Sahih'
      },
      {
        id: '5',
        title: 'Five Natural Practices',
        text: 'Abu Huraira reported: The Messenger of Allah, peace and blessings be upon him, said, "Five practices are from natural instinct: circumcision, shaving the pubic hair, clipping the nails, plucking the underarm hair, and trimming the mustache."',
        chapter: 'Purification',
        number: 53,
        reference: 'Bukhari 5889, Muslim 257',
        grade: 'Sahih'
      }
    ];
  } catch (error) {
    console.error(`Error fetching hadiths for collection ${collection}:`, error);
    throw error;
  }
};

export const useHadith = () => {
  const [selectedCollection, setSelectedCollection] = useState<HadithCollection | null>(null);

  // Fetch collections (in a real app, this would come from an API)
  const collections = HADITH_COLLECTIONS;

  // Fetch hadiths for the selected collection
  const {
    data: hadiths,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['hadiths', selectedCollection?.id],
    queryFn: () => fetchHadithsByCollection(selectedCollection?.id || ''),
    enabled: !!selectedCollection,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false
  });

  const fetchHadiths = useCallback(async () => {
    if (!selectedCollection) return;
    
    try {
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch hadiths. Please try again later.',
        variant: 'destructive'
      });
    }
  }, [selectedCollection, refetch]);

  // When collection changes, fetch hadiths
  useEffect(() => {
    // Check for last selected collection in localStorage
    const lastSelectedCollection = localStorage.getItem('lastSelectedHadithCollection');
    if (lastSelectedCollection && !selectedCollection) {
      try {
        const parsedCollection = JSON.parse(lastSelectedCollection);
        setSelectedCollection(parsedCollection);
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
