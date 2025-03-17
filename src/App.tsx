
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/hooks/useSettings";
import { QuranProvider } from "@/hooks/useQuran";
import Index from "./pages/Index";
import Quran from "./pages/Quran";
import Hadith from "./pages/Hadith";
import PrayerTimes from "./pages/PrayerTimes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import MobileNavigation from "./components/layout/MobileNavigation";

// Configure QueryClient with caching settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <QuranProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pb-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/quran" element={<Quran />} />
                  <Route path="/hadith" element={<Hadith />} />
                  <Route path="/prayer-times" element={<PrayerTimes />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <MobileNavigation />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QuranProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
