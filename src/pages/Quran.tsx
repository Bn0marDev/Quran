
import { useState, useEffect } from 'react';
import SurahList from '@/components/quran/SurahList';
import QuranReader from '@/components/quran/QuranReader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuranProvider } from '@/hooks/useQuran';

const Quran = () => {
  const [selectedSurah, setSelectedSurah] = useState<any | null>(null);
  const [openTabs, setOpenTabs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

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
        
        // Add to tabs if not already open
        const tabId = `surah-${parsedSurah.number}`;
        if (!openTabs.some(tab => tab.id === tabId)) {
          const newTab = {
            id: tabId,
            label: parsedSurah.name,
            surah: parsedSurah
          };
          setOpenTabs([newTab]);
          setActiveTabId(tabId);
        }
      } catch (error) {
        console.error('Error parsing last read surah:', error);
      }
    }
  }, [selectedSurah]);

  useEffect(() => {
    // Ensure active tab is set when we have tabs open
    if (openTabs.length > 0 && !activeTabId) {
      setActiveTabId(openTabs[0].id);
    }
  }, [openTabs, activeTabId]);

  const handleSelectSurah = (surah: any) => {
    setSelectedSurah(surah);
    
    // Add to tabs if not already open
    const tabId = `surah-${surah.number}`;
    if (!openTabs.some(tab => tab.id === tabId)) {
      const newTab = {
        id: tabId,
        label: surah.name,
        surah: surah
      };
      setOpenTabs([...openTabs, newTab]);
    }
    
    // Activate the tab
    setActiveTabId(tabId);
    
    // Scroll to top when selecting a new surah
    window.scrollTo(0, 0);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    
    // Update selected surah based on active tab
    const tab = openTabs.find(tab => tab.id === tabId);
    if (tab) {
      setSelectedSurah(tab.surah);
    }
  };

  const handleCloseTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Find index of tab to close
    const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
    
    // Remove tab
    const newTabs = [...openTabs];
    newTabs.splice(tabIndex, 1);
    setOpenTabs(newTabs);
    
    // Handle active tab changes
    if (activeTabId === tabId) {
      // If we closed the active tab
      if (newTabs.length > 0) {
        // Select previous tab or next tab if first tab was closed
        const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1;
        setActiveTabId(newTabs[newActiveIndex].id);
        setSelectedSurah(newTabs[newActiveIndex].surah);
      } else {
        // No tabs left
        setActiveTabId(null);
        setSelectedSurah(null);
      }
    }
  };

  return (
    <QuranProvider>
      <div className="page-container mt-24 animate-fade-in">
        <h1 className="text-3xl font-heading font-bold mb-6">
          القرآن الكريم
        </h1>
        
        {openTabs.length > 0 && (
          <div className="mb-4 overflow-x-auto">
            <Tabs value={activeTabId || ''} onValueChange={handleTabChange}>
              <TabsList className="w-full justify-start">
                {openTabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="relative px-6 py-2"
                  >
                    <span className="arabic">{tab.label}</span>
                    <button 
                      className="absolute -top-1 -left-1 rounded-full p-0.5 bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => handleCloseTab(tab.id, e)}
                    >
                      <X size={14} />
                    </button>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <SurahList 
              onSelectSurah={handleSelectSurah} 
              selectedSurah={selectedSurah} 
            />
          </div>
          <div className="lg:col-span-2">
            {activeTabId ? (
              openTabs.map(tab => (
                <div key={tab.id} className={activeTabId === tab.id ? 'block' : 'hidden'}>
                  <QuranReader surah={tab.surah} />
                </div>
              ))
            ) : (
              <QuranReader surah={null} />
            )}
          </div>
        </div>
      </div>
    </QuranProvider>
  );
};

export default Quran;
