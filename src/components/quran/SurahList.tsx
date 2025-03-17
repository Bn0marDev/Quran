
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
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
        surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <CardTitle>Surahs</CardTitle>
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
          <CardTitle>Surahs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Error loading Surahs. Please try again later.
            <Button variant="primary" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Surahs</CardTitle>
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Search surah..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 -mr-2">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors hover:bg-accent ${
                selectedSurah?.number === surah.number ? 'bg-primary/10 text-primary' : ''
              }`}
              onClick={() => onSelectSurah(surah)}
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center h-8 w-8 mr-3 rounded-full bg-secondary text-sm">
                  {surah.number}
                </div>
                <div>
                  <div className="font-medium">{surah.englishName}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-between">
                    <span>{surah.englishNameTranslation}</span>
                    <span className="arabic text-base">{surah.name}</span>
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
