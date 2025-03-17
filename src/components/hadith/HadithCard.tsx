
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, ExternalLink, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HadithCardProps {
  hadith: any;
}

const HadithCard = ({ hadith }: HadithCardProps) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    if (!hadith) return;
    
    const content = `${hadith.title}\n\n${hadith.text}\n\n${hadith.reference}`;
    navigator.clipboard.writeText(content);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الحديث إلى الحافظة",
    });
  };
  
  const handleShare = async () => {
    if (!hadith) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: hadith.title,
          text: `${hadith.text}\n\n${hadith.reference}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
      toast({
        title: "تم النسخ",
        description: "تم نسخ الحديث للمشاركة لأن المتصفح لا يدعم ميزة المشاركة",
      });
    }
  };

  if (!hadith) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center max-w-md mx-auto">
            <BookOpen className="h-12 w-12 mx-auto opacity-20 mb-4" />
            <h3 className="text-xl font-medium mb-2">اختر حديثًا</h3>
            <p className="text-muted-foreground">
              اختر مجموعة وحديثًا للبدء في القراءة.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle>{hadith.title || 'حديث'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {hadith.arabic && (
          <p dir="rtl" className="arabic text-lg mb-4 leading-relaxed">
            {hadith.arabic}
          </p>
        )}
        <p className="mb-4">{hadith.text}</p>
        <div className="text-sm text-muted-foreground">
          <p><strong>المرجع:</strong> {hadith.reference}</p>
          {hadith.grade && <p><strong>الدرجة:</strong> {hadith.grade}</p>}
        </div>
      </CardContent>
      <CardFooter className="border-t border-border bg-secondary/10 p-3 flex justify-between">
        <div className="text-sm text-muted-foreground">
          حديث #{hadith.number}
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" /> نسخ
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> مشاركة
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HadithCard;
