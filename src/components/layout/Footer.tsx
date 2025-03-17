
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quranic Cornerstone</h3>
            <p className="text-sm text-muted-foreground">
              An elegant Islamic application with Quran, Hadith, and Prayer Times.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/quran" className="hover:text-primary transition-colors">Quran</Link></li>
              <li><Link to="/hadith" className="hover:text-primary transition-colors">Hadith</Link></li>
              <li><Link to="/prayer-times" className="hover:text-primary transition-colors">Prayer Times</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Quran.com</a></li>
              <li><a href="https://sunnah.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Sunnah.com</a></li>
              <li><a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Aladhan.com</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settings</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/settings" className="hover:text-primary transition-colors">Preferences</Link></li>
              <li><button className="hover:text-primary transition-colors">Clear Cache</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {year} Quranic Cornerstone. All rights reserved.
          </p>
          <p className="flex items-center text-sm text-muted-foreground mt-2 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for the Ummah
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
