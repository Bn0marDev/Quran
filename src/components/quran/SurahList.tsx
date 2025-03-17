
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useQuran } from '@/hooks/useQuran';

interface SurahListProps {
  onSelectSurah: (surah: any) => void;
  selectedSurah: any | null;
}

const SurahList = ({ onSelectSurah, selectedSurah }: SurahListProps) => {
  const { surahs, loading, error } = useQuran();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState<any[]>([]);

  useEffect(() => {
    if (!surahs) return;
    
    if (searchTerm) {
      const filtered = surahs.filter(surah => 
        surah.name.includes(searchTerm) ||
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
      );
      setFilteredSurahs(filtered);
    } else {
      setFilteredSurahs(surahs);
    }
  }, [searchTerm, surahs]);

  if (loading) {
    return (
      <Card className="h-full animate-pulse">
        <CardHeader>
          <CardTitle>السور</CardTitle>
          <div className="h-10 bg-secondary/50 rounded-md w-full mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary/30 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>السور</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            خطأ في تحميل السور. يرجى المحاولة مرة أخرى لاحقًا.
            <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>السور</CardTitle>
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="البحث عن سورة..."
            className="w-full h-10 pr-10 pl-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pl-2 -ml-2">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              className={`w-full text-right px-4 py-3 rounded-md transition-colors hover:bg-accent ${
                selectedSurah?.number === surah.number ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => onSelectSurah(surah)}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 ml-3 rounded-full bg-secondary text-sm">
                  {surah.number}
                </div>
                <div>
                  <div className="font-medium arabic text-base">{surah.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>{surah.englishNameTranslation === 'The Opening' ? 'الفاتحة' : surah.englishNameTranslation}</span>
                    <span className="mr-2">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurahList;
