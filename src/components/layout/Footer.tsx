import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TikTok } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 backdrop-blur-sm mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">ركن القرآن</h3>
            <p className="text-sm text-muted-foreground">
              تطبيق إسلامي أنيق يحتوي على القرآن الكريم، الحديث، وأوقات الصلاة.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link></li>
              <li><Link to="/quran" className="hover:text-primary transition-colors">القرآن</Link></li>
              <li><Link to="/hadith" className="hover:text-primary transition-colors">الحديث</Link></li>
              <li><Link to="/prayer-times" className="hover:text-primary transition-colors">أوقات الصلاة</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">مصادر الآيات والتفسيرات</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://quran.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Quran.com</a></li>
              <li><a href="https://sunnah.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Sunnah.com</a></li>
              <li><a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Aladhan.com</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">الإعدادات</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/settings" className="hover:text-primary transition-colors">التفضيلات</Link></li>
              <li><button className="hover:text-primary transition-colors">مسح الذاكرة المؤقتة</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            <a href="https://www.tiktok.com/@m0usa_0mar" target="_blank" rel="noopener noreferrer" className="flex items-center">
              <TikTok className="mr-2" /> {/* استخدام أيقونة TikTok */}
              m0usa_0mar
            </a>
          </p>
          <p className="flex items-center text-sm text-muted-foreground mt-2 md:mt-0">
            برمجة وتطوير Bn0mar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
