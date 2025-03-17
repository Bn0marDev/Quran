
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';

interface HadithCollectionProps {
  collections: any[];
  selectedCollection: string | null;
  onSelectCollection: (collection: string) => void;
  loading: boolean;
}

const HadithCollection = ({ collections, selectedCollection, onSelectCollection, loading }: HadithCollectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollections, setFilteredCollections] = useState(collections);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term) {
      const filtered = collections.filter(collection =>
        collection.name.toLowerCase().includes(term.toLowerCase()) ||
        collection.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCollections(filtered);
    } else {
      setFilteredCollections(collections);
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Hadith Collections</CardTitle>
          <div className="h-10 bg-secondary/50 rounded-md w-full mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-secondary/30 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hadith Collections</CardTitle>
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCollections.map((collection) => (
            <Button
              key={collection.name}
              variant={selectedCollection === collection.name ? 'primary' : 'outline'}
              className="h-auto py-3 justify-start text-left"
              onClick={() => onSelectCollection(collection.name)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{collection.title}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {collection.numHadith} hadiths
                </span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HadithCollection;
