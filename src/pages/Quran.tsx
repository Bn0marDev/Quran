
import { useState, useEffect } from 'react';
import SurahList from '@/components/quran/SurahList';
import QuranReader from '@/components/quran/QuranReader';

const Quran = () => {
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);

  // Set document title
  useEffect(() => {
    document.title = selectedSurah 
      ? `${selectedSurah.name} - القرآن الكريم` 
      : 'القرآن الكريم';
  }, [selectedSurah]);

  // Check for last read surah in localStorage
  useEffect(() => {
    const lastReadSurah = localStorage.getItem('lastReadSurah');
    if (lastReadSurah && !selectedSurah) {
      try {
        const parsedSurah = JSON.parse(lastReadSurah);
        setSelectedSurah(parsedSurah);
      } catch (error) {
        console.error('Error parsing last read surah:', error);
      }
    }
  }, [selectedSurah]);

  const handleSelectSurah = (surah: any) => {
    setSelectedSurah(surah);
    // Scroll to top when selecting a new surah
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-container mt-24 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6">
        القرآن الكريم
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SurahList 
            onSelectSurah={handleSelectSurah} 
            selectedSurah={selectedSurah} 
          />
        </div>
        <div className="lg:col-span-2">
          <QuranReader surah={selectedSurah} />
        </div>
      </div>
    </div>
  );
};

export default Quran;
