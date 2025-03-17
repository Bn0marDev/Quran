
// API functions for Quran data

// Function to fetch the list of Surahs
export const fetchSurahs = async () => {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    
    if (data.code === 200 && data.status === 'OK') {
      return data.data;
    } else {
      throw new Error('Failed to fetch surahs');
    }
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

// Function to fetch Ayahs for a specific Surah
export const fetchAyahs = async (surahNumber: number, reciterId: string = 'ar.alafasy') => {
  try {
    // Fetch Arabic text
    const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`);
    const arabicData = await arabicResponse.json();
    
    // Fetch English translation
    const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`);
    const translationData = await translationResponse.json();
    
    // Fetch Audio URLs
    const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${reciterId}`);
    const audioData = await audioResponse.json();
    
    if (
      arabicData.code === 200 && 
      translationData.code === 200 && 
      audioData.code === 200
    ) {
      // Combine data
      return arabicData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[index].text,
        audio: audioData.data.ayahs[index].audio,
        page: ayah.page
      }));
    } else {
      throw new Error('Failed to fetch ayahs');
    }
  } catch (error) {
    console.error(`Error fetching ayahs for surah ${surahNumber}:`, error);
    throw error;
  }
};
