
// ملف لوظائف API المختلفة

// API لجلب قائمة السور
export const fetchSurahs = async () => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    
    if (!response.ok) {
      throw new Error('فشل في جلب بيانات السور');
    }
    
    const data = await response.json();
    
    if (data.code === 200 && data.status === 'OK') {
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
    // جلب نص الآيات
    const textResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    
    if (!textResponse.ok) {
      throw new Error('فشل في جلب آيات السورة');
    }
    
    const textData = await textResponse.json();
    
    // جلب صوت الآيات
    const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
    
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
    const response = await fetch('https://api.aladhan.com/v1/gToH');
    
    if (!response.ok) {
      throw new Error('فشل في جلب التاريخ الهجري');
    }
    
    const data = await response.json();
    
    if (data.code === 200) {
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
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=2`
    );
    
    if (!response.ok) {
      throw new Error('فشل في جلب مواقيت الصلاة');
    }
    
    const data = await response.json();
    
    if (data.code === 200) {
      return data.data;
    } else {
      throw new Error('بيانات مواقيت الصلاة غير صالحة');
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};
