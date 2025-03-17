
// ملف لوظائف API المختلفة

// Function to get cached data
const getCachedData = (key: string) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // Return cached data if it's less than 1 hour old
      if (now - timestamp < 60 * 60 * 1000) {
        console.log(`Using cached data for ${key}`);
        return data;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error reading cache for ${key}:`, error);
    return null;
  }
};

// Function to set cached data
const setCachedData = (key: string, data: any) => {
  try {
    const cacheItem = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error(`Error caching data for ${key}:`, error);
  }
};

// API لجلب قائمة السور
export const fetchSurahs = async () => {
  try {
    // Check cache first
    const cachedSurahs = getCachedData('surahs');
    if (cachedSurahs) return cachedSurahs;
    
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    
    if (!response.ok) {
      throw new Error('فشل في جلب بيانات السور');
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.status === 'OK') {
      // Cache the response
      setCachedData('surahs', data.data);
      return data.data;
    } else {
      throw new Error('بيانات السور غير صالحة');
    }
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// API لجلب آيات سورة معينة
export const fetchAyahs = async (surahNumber: number, reciterId: string = 'ar.alafasy') => {
  try {
    // Check cache first
    const cacheKey = `ayahs-${surahNumber}-${reciterId}`;
    const cachedAyahs = getCachedData(cacheKey);
    if (cachedAyahs) return cachedAyahs;
    
    // جلب نص الآيات
    const textResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    
    if (!textResponse.ok) {
      throw new Error('فشل في جلب آيات السورة');
    }
    
    const textData = await textResponse.json();
    
    // جلب صوت الآيات
    const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`);
    
    if (!audioResponse.ok) {
      throw new Error('فشل في جلب الصوت');
    }
    
    const audioData = await audioResponse.json();
    
    // جلب الترجمة
    const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.muyassar`);
    
    if (!translationResponse.ok) {
      throw new Error('فشل في جلب الترجمة');
    }
    
    const translationData = await translationResponse.json();
    
    // دمج البيانات
    if (textData.code === 200 && audioData.code === 200 && translationData.code === 200) {
      const ayahs = textData.data.ayahs.map((ayah: any, index: number) => {
        const audioAyah = audioData.data.ayahs[index];
        const translationAyah = translationData.data.ayahs[index];
        
        return {
          ...ayah,
          audio: audioAyah?.audio || null,
          translation: translationAyah?.text || ''
        };
      });
      
      // Cache the response
      setCachedData(cacheKey, ayahs);
      return ayahs;
    } else {
      throw new Error('بيانات الآيات غير صالحة');
    }
  } catch (error) {
    console.error(`Error fetching ayahs for surah ${surahNumber}:`, error);
    throw error;
  }
};

// API لجلب التاريخ الهجري
export const fetchHijriDate = async () => {
  try {
    // Check cache first - but with shorter expiry time (1 day)
    const cachedDate = getCachedData('hijri-date');
    if (cachedDate) {
      // Check if it's still the same day
      const now = new Date();
      const cachedDay = new Date(cachedDate.timestamp).getDate();
      if (now.getDate() === cachedDay) {
        return cachedDate;
      }
    }
    
    const response = await fetch('https://api.aladhan.com/v1/gToH');
    
    if (!response.ok) {
      throw new Error('فشل في جلب التاريخ الهجري');
    }
    
    const data = await response.json();
    
    if (data.code === 200) {
      // Cache the response
      setCachedData('hijri-date', data.data);
      return data.data;
    } else {
      throw new Error('بيانات التاريخ غير صالحة');
    }
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
    throw error;
  }
};

// API لجلب مواقيت الصلاة
export const fetchPrayerTimes = async (latitude: number, longitude: number) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const cacheKey = `prayer-times-${date}-${latitude.toFixed(2)}-${longitude.toFixed(2)}`;
    
    // Check cache first
    const cachedTimes = getCachedData(cacheKey);
    if (cachedTimes) return cachedTimes;
    
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error('فشل في جلب مواقيت الصلاة');
    }
    
    const data = await response.json();
    
    if (data.code === 200) {
      // Cache the response
      setCachedData(cacheKey, data.data);
      return data.data;
    } else {
      throw new Error('بيانات مواقيت الصلاة غير صالحة');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

// API لجلب الأحاديث
export const fetchHadithsByCollection = async (collection: string, limit = 20) => {
  try {
    const cacheKey = `hadiths-${collection}-${limit}`;
    
    // Check cache first
    const cachedHadiths = getCachedData(cacheKey);
    if (cachedHadiths) return cachedHadiths;
    
    const response = await fetch(`https://api.hadith.gading.dev/books/${collection}?range=1-${limit}`);
    
    if (!response.ok) {
      throw new Error('فشل في جلب الأحاديث');
    }
    
    const data = await response.json();
    
    // تحويل البيانات إلى الشكل المطلوب
    const hadiths = data.hadiths?.map((hadith: any) => ({
      id: hadith.number.toString(),
      title: `حديث رقم ${hadith.number}`,
      text: hadith.arab,
      translation: hadith.id,
      number: hadith.number,
      reference: collection
    })) || [];
    
    // Cache the response
    setCachedData(cacheKey, hadiths);
    return hadiths;
  } catch (error) {
    console.error(`Error fetching hadiths for collection ${collection}:`, error);
    // Return fallback data
    return generateFallbackHadiths();
  }
};

// Generate fallback hadiths data when API fails
const generateFallbackHadiths = () => {
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
};
