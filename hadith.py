import requests
import random

# مفتاح API الخاص بك
api_key = "$2y$10$XaiRFhIUSXWTeWqYL9XZucornX3e5QkctRFrrUF7ifXFShQLdbE2"

# الرابط الأساسي للـ API
url = f"https://www.hadithapi.com/public/api/hadiths/?apiKey={api_key}"

# إرسال الطلب إلى API
response = requests.get(url)

# التحقق من نجاح الطلب
if response.status_code == 200:
    data = response.json()
    
    # طباعة البيانات للتأكد من الهيكل
    print(data)

    # تحقق مما إذا كانت هناك بيانات لحديث
    if 'hadiths' in data:
        random_hadith = random.choice(data['hadiths'])

        # عرض الحديث و ترجمته
        print(f"الحديث: {random_hadith['hadithArabic']}")
        print(f"الترجمة: {random_hadith['hadithEnglish']}")
        print(f"المصدر: {random_hadith['book']}")
    else:
        print("لم يتم العثور على أحاديث.")
else:
    print(f"حدث خطأ في الاتصال بالـ API: {response.status_code}")
