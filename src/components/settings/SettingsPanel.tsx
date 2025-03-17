
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Moon, Sun, Volume2, RefreshCw, Trash2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useQuran } from '@/hooks/useQuran';

const SettingsPanel = () => {
  const { theme, toggleTheme } = useSettings();
  const { recitersList, selectedReciter, setSelectedReciter } = useQuran();
  const [cacheSize, setCacheSize] = useState('Calculating...');

  useEffect(() => {
    // Calculate localStorage usage
    const calculateStorageUsage = () => {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length * 2; // UTF-16 = 2 bytes per character
        }
      }
      
      // Convert to KB or MB
      if (total < 1024 * 1024) {
        setCacheSize(`${(total / 1024).toFixed(2)} KB`);
      } else {
        setCacheSize(`${(total / (1024 * 1024)).toFixed(2)} MB`);
      }
    };
    
    calculateStorageUsage();
  }, []);

  const handleClearCache = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to clear all cached data? This will reset all your preferences.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <Card glass hover>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className="text-sm text-muted-foreground">Choose between light and dark theme</p>
            </div>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="min-w-[120px]"
            >
              {theme === 'dark' ? (
                <><Sun className="mr-2 h-4 w-4" /> Light Mode</>
              ) : (
                <><Moon className="mr-2 h-4 w-4" /> Dark Mode</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card glass hover>
        <CardHeader>
          <CardTitle>Quran Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="font-medium mb-2">Reciter</h3>
              <p className="text-sm text-muted-foreground mb-4">Select your preferred Quran reciter</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recitersList.map((reciter) => (
                  <Button
                    key={reciter.id}
                    variant={selectedReciter?.id === reciter.id ? 'primary' : 'outline'}
                    className="justify-start h-auto py-3"
                    onClick={() => setSelectedReciter(reciter)}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div>{reciter.name}</div>
                      <div className="text-xs text-muted-foreground">{reciter.style}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card glass hover>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Cached Data</h3>
                <p className="text-sm text-muted-foreground">Total storage used</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{cacheSize}</div>
                <p className="text-xs text-muted-foreground">Local storage</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh App
              </Button>
              <Button variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive/10" onClick={handleClearCache}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cache
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
