
import { useState, useEffect } from 'react';
import HadithCollection from '@/components/hadith/HadithCollection';
import HadithCard from '@/components/hadith/HadithCard';
import { useHadith } from '@/hooks/useHadith';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hadith = () => {
  const { 
    collections, 
    selectedCollection,
    setSelectedCollection,
    hadiths,
    loading,
    error,
    fetchHadithsByCollection
  } = useHadith();
  
  const [selectedHadith, setSelectedHadith] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Set document title
  useEffect(() => {
    document.title = 'الأحاديث النبوية - القرآن الكريم';
  }, []);

  useEffect(() => {
    // Reset selection when collection changes
    setSelectedHadith(null);
    setPage(1);
  }, [selectedCollection]);

  // Select first hadith when hadiths are loaded
  useEffect(() => {
    if (hadiths && hadiths.length > 0 && !selectedHadith) {
      setSelectedHadith(hadiths[0]);
    }
  }, [hadiths, selectedHadith]);

  const paginate = (array: any[], page_number: number, page_size: number) => {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  };

  const displayedHadiths = hadiths ? paginate(hadiths, page, itemsPerPage) : [];
  const totalPages = hadiths ? Math.ceil(hadiths.length / itemsPerPage) : 0;

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="page-container mt-24 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-6">
        الأحاديث النبوية
      </h1>
      
      <div className="mb-6">
        <HadithCollection 
          collections={collections} 
          selectedCollection={selectedCollection} 
          onSelectCollection={(collection) => setSelectedCollection(collection)}
          loading={loading}
        />
      </div>
      
      {selectedCollection && hadiths && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {displayedHadiths.map((hadith) => (
              <div 
                key={hadith.id} 
                onClick={() => setSelectedHadith(hadith)}
                className="cursor-pointer transition-transform hover:-translate-y-1"
              >
                <HadithCard hadith={hadith} />
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> السابق
              </Button>
              
              <span className="text-sm">
                صفحة {page} من {totalPages}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                التالي <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
      
      {!selectedCollection && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              يرجى اختيار مجموعة أحاديث للبدء في القراءة.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Hadith;
