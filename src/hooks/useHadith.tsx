
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

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

// Function to fetch hadiths by collection
const fetchHadithsByCollection = async (collection: string) => {
  if (!collection) return [];

  try {
    // Normally we would call an external API, but for now we'll return mock data
    // In a real application, replace this with a fetch call to a real API
    return [
      {
        id: '1',
        title: 'كتاب الإيمان',
        text: 'عن عمر بن الخطاب رضي الله عنه قال: بينما نحن جلوس عند رسول الله صلى الله عليه وسلم ذات يوم إذ طلع علينا رجل شديد بياض الثياب شديد سواد الشعر لا يرى عليه أثر السفر ولا يعرفه منا أحد حتى جلس إلى النبي صلى الله عليه وسلم فأسند ركبتيه إلى ركبتيه ووضع كفيه على فخذيه وقال: يا محمد أخبرني عن الإسلام. فقال رسول الله صلى الله عليه وسلم: "الإسلام أن تشهد أن لا إله إلا الله وأن محمداً رسول الله وتقيم الصلاة وتؤتي الزكاة وتصوم رمضان وتحج البيت إن استطعت إليه سبيلا".',
        chapter: 'الإيمان',
        number: 1,
        reference: 'البخاري 1، مسلم 8',
        grade: 'صحيح'
      },
      {
        id: '2',
        title: 'إنما الأعمال بالنيات',
        text: 'عن عمر بن الخطاب رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى. فمن كانت هجرته إلى الله ورسوله فهجرته إلى الله ورسوله، ومن كانت هجرته لدنيا يصيبها أو امرأة ينكحها فهجرته إلى ما هاجر إليه".',
        chapter: 'الوحي',
        number: 1,
        reference: 'البخاري 1، مسلم 1907',
        grade: 'صحيح'
      },
      {
        id: '3',
        title: 'ملك الموت',
        text: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "كان ملك الموت يأتي الناس عياناً، فأتى موسى عليه السلام فلطمه ففقأ عينه، فرجع إلى ربه فقال: أرسلتني إلى عبد لا يريد الموت. فرد الله عليه عينه وقال: ارجع إليه وقل له يضع يده على متن ثور، فله بكل شعرة تغطيها يده سنة يعيشها".',
        chapter: 'الأنبياء',
        number: 339,
        reference: 'البخاري 3407، مسلم 2372',
        grade: 'صحيح'
      },
      {
        id: '4',
        title: 'السبع الموبقات',
        text: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "اجتنبوا السبع الموبقات". قالوا: يا رسول الله وما هن؟ قال: "الشرك بالله، والسحر، وقتل النفس التي حرم الله إلا بالحق، وأكل الربا، وأكل مال اليتيم، والتولي يوم الزحف، وقذف المحصنات المؤمنات الغافلات".',
        chapter: 'الإيمان',
        number: 85,
        reference: 'البخاري 2766، مسلم 89',
        grade: 'صحيح'
      },
      {
        id: '5',
        title: 'خمس من الفطرة',
        text: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: "خمس من الفطرة: الختان، والاستحداد، وقص الشارب، ونتف الإبط، وتقليم الأظفار".',
        chapter: 'الطهارة',
        number: 53,
        reference: 'البخاري 5889، مسلم 257',
        grade: 'صحيح'
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
        title: 'خطأ',
        description: 'فشل في جلب الأحاديث. يرجى المحاولة مرة أخرى لاحقًا.',
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
