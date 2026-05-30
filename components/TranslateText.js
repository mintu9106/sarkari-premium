"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Global cache to persist translations across component mounts, page transitions, and layouts
const globalTranslationCache = {
  en: {},
  hi: {
    "Job Overview": "नौकरी का विवरण",
    "Eligibility & Qualification": "पात्रता और योग्यता",
    "Age Limit": "आयु सीमा",
    "Salary & Pay Scale": "वेतनमान",
    "How to Apply": "आवेदन कैसे करें",
    "Important Dates": "महत्वपूर्ण तिथियां",
    "Apply Online Link": "ऑनलाइन आवेदन लिंक",
    "Download Official PDF": "आधिकारिक पीडीएफ डाउनलोड करें",
    "Apply Start Date": "आवेदन शुरू होने की तिथि",
    "Last Date to Apply": "आवेदन की अंतिम तिथि",
    "Exam Date": "परीक्षा की तिथि",
    "Get the most accurate updates for government jobs without any hassle.": "बिना किसी झंझट के पाएं सरकारी नौकरी की सबसे सटीक अपडेट्स।",
    "Sarkari Premium fetches, parses, and cleans official government recruitment notifications into structured eligibility and apply guides.": "सरकारी प्रीमियम आधिकारिक सरकारी भर्ती अधिसूचनाओं को एकत्र करता है, उनका विश्लेषण करता है और उन्हें संरचित पात्रता और आवेदन गाइड में साफ करता है।",
    "Premium Gov Job Updates": "प्रीमियम सरकारी नौकरी अपडेट",
    "Active Jobs": "सक्रिय नौकरियां",
    "Exams Results": "परीक्षा परिणाम",
    "Latest Jobs": "नवीनतम नौकरियां",
    "Govt Jobs": "सरकारी नौकरियां",
    "Hall Tickets": "प्रवेश पत्र",
    "Declared": "घोषित",
    "Released": "जारी",
    "State PCS & Jobs Updates": "राज्य पीसीएस और नौकरी अपडेट",
    "Latest Updates": "नवीनतम अपडेट",
    "Download Admit Card Link": "प्रवेश पत्र डाउनलोड लिंक",
    "Check Result Link": "परिणाम चेक लिंक",
    "Admit Card Release Date": "प्रवेश पत्र जारी होने की तिथि",
    "Result Declaration Date": "परिणाम घोषित होने की तिथि",
    "Home": "होम",
    "Central Jobs": "केंद्र सरकार की नौकरियां",
    "States": "राज्य",
    "Govt Schemes": "सरकारी योजनाएं",
    "Admit Cards": "प्रवेश पत्र",
    "Results": "परिणाम",
    "Search updates...": "अपडेट खोजें...",
    "All Schemes": "सभी योजनाएं",
    "Central Schemes": "केंद्रीय योजनाएं",
    "State Schemes": "राज्यीय योजनाएं",
    "All States": "सभी राज्य",
    "Search schemes by name, benefit...": "नाम या लाभ से योजनाएं खोजें...",
    "Benefits & Assistance": "लाभ और सहायता",
    "View Details": "विवरण देखें",
    "No government schemes found matching the criteria.": "मापदंडों से मेल खाने वाली कोई सरकारी योजना नहीं मिली।",
    "Active Schemes": "सक्रिय योजनाएं",
    "Posted": "पोस्ट किया गया",
    "Get Instant Alerts on Mobile!": "मोबाइल पर तुरंत अलर्ट पाएं!",
    "Join our Telegram group and WhatsApp channel to receive instant notifications for new government jobs, admit cards, and exam results.": "नई सरकारी नौकरियों, प्रवेश पत्र और परीक्षा परिणामों के लिए तुरंत सूचनाएं प्राप्त करने के लिए हमारे टेलीग्राम समूह और व्हाट्सएप चैनल से जुड़ें।",
    "Join Telegram": "टेलीग्राम से जुड़ें",
    "Join WhatsApp": "व्हाट्सएप से जुड़ें",
    "Apply Before": "इससे पहले आवेदन करें",
    "Important Dates & Exam Calendar Tracker": "महत्वपूर्ण तिथियां और परीक्षा कैलेंडर ट्रैकर",
    "Live Schedule": "लाइव शेड्यूल",
    "No upcoming schedule events.": "कोई आगामी कार्यक्रम नहीं हैं।",
    "Download Admit Card": "प्रवेश पत्र डाउनलोड करें",
    "Check Result": "परिणाम चेक करें",
    "Apply Online": "ऑनलाइन आवेदन करें",
    "Application Links": "आवेदन लिंक्स",
    "Download Admit Card Link": "प्रवेश पत्र डाउनलोड लिंक",
    "Check Result Link": "परिणाम चेक लिंक",
    "Apply Online Link": "ऑनलाइन आवेदन लिंक",
    "Detailed Notification Tables & Info": "विस्तृत अधिसूचना तालिका और जानकारी"
  },
  bn: {
    "Job Overview": "চাকরির বিবরণ",
    "Eligibility & Qualification": "যোগ্যতা এবং মানদণ্ড",
    "Age Limit": "বয়স সীমা",
    "Salary & Pay Scale": "বেতন স্কেল",
    "How to Apply": "কিভাবে আবেদন করবেন",
    "Important Dates": "গুরুত্বপূর্ণ তারিখ",
    "Apply Online Link": "অনলাইন আবেদন লিঙ্ক",
    "Download Official PDF": "অফিসিয়াল পিডিএফ ডাউনলোড করুন",
    "Apply Start Date": "আবেদন শুরুর তারিখ",
    "Last Date to Apply": "আবেদনের শেষ তারিখ",
    "Exam Date": "পরীক্ষার তারিখ",
    "Get the most accurate updates for government jobs without any hassle.": "কোনো ঝামেলা ছাড়াই সরকারি চাকরির সবচেয়ে নির্ভুল আপডেট পান।",
    "Sarkari Premium fetches, parses, and cleans official government recruitment notifications into structured eligibility and apply guides.": "সরকারি প্রিমিয়াম অফিসিয়াল সরকারি নিয়োগের বিজ্ঞপ্তি সংগ্রহ করে, বিশ্লেষণ করে এবং একটি সুবিন্যস্ত যোগ্যতা ও আবেদন গাইডে রূপান্তর করে।",
    "Premium Gov Job Updates": "প্রিমিয়াম সরকারি চাকরি আপডেট",
    "Active Jobs": "সক্রিয় চাকরি",
    "Exams Results": "পরীক্ষার ফলাফল",
    "Latest Jobs": "সাম্প্রতিক চাকরি",
    "Govt Jobs": "সরকারি চাকরি",
    "Hall Tickets": "প্রবেশ পত্র",
    "Declared": "ঘোষিত",
    "Released": "প্রকাশিত",
    "State PCS & Jobs Updates": "রাজ্য পিসিএস এবং চাকরি আপডেট",
    "Latest Updates": "সাম্প্রতিক আপডেট",
    "Download Admit Card Link": "প্রবেশপত্র ডাউনলোড লিঙ্ক",
    "Check Result Link": "ফলাফল চেক লিঙ্ক",
    "Admit Card Release Date": "প্রবেশপত্র প্রকাশের তারিখ",
    "Result Declaration Date": "ফলাফল ঘোষণার তারিখ",
    "Home": "হোম",
    "Central Jobs": "কেন্দ্রীয় চাকরি",
    "States": "রাজ্যসমূহ",
    "Govt Schemes": "সরকারি প্রকল্প",
    "Admit Cards": "প্রবেশপত্র",
    "Results": "ফলাফল",
    "Search updates...": "আপডেট খুঁজুন...",
    "All Schemes": "সমস্ত প্রকল্প",
    "Central Schemes": "কেন্দ্রীয় প্রকল্প",
    "State Schemes": "রাজ্য প্রকল্প",
    "All States": "সমস্ত রাজ্য",
    "Search schemes by name, benefit...": "নাম বা সুবিধা দ্বারা প্রকল্প খুঁজুন...",
    "Benefits & Assistance": "সুবিধা এবং সহায়তা",
    "View Details": "বিস্তারিত দেখুন",
    "No government schemes found matching the criteria.": "নির্দিষ্ট মানদণ্ডের কোনো সরকারি প্রকল্প পাওয়া যায়নি।",
    "Active Schemes": "সক্রিয় প্রকল্প",
    "Posted": "পোস্ট করা হয়েছে",
    "Get Instant Alerts on Mobile!": "মোবাইলে তাৎক্ষণিক অ্যালার্ট পান!",
    "Join our Telegram group and WhatsApp channel to receive instant notifications for new government jobs, admit cards, and exam results.": "নতুন সরকারি চাকরি, প্রবেশপত্র এবং পরীক্ষার ফলাফলের জন্য তাৎক্ষণিক বিজ্ঞপ্তি পেতে আমাদের টেলিগ্রাম গ্রুপ এবং হোয়াটসঅ্যাপ চ্যানেলে যোগ দিন।",
    "Join Telegram": "টেলিগ্রামে যোগ দিন",
    "Join WhatsApp": "হোয়াটসঅ্যাপে যোগ দিন",
    "Apply Before": "আগে আবেদন করুন",
    "Important Dates & Exam Calendar Tracker": "গুরুত্বপূর্ণ তারিখ এবং পরীক্ষার ক্যালেন্ডার ট্র্যাকার",
    "Live Schedule": "লাইভ সময়সূচী",
    "No upcoming schedule events.": "কোনো আসন্ন সময়সূচী ইভেন্ট নেই।",
    "Download Admit Card": "প্রবেশপত্র ডাউনলোড করুন",
    "Check Result": "ফলাফল চেক করুন",
    "Apply Online": "অনলাইনে আবেদন করুন",
    "Application Links": "আবেদন লিঙ্ক",
    "Download Admit Card Link": "প্রবেশপত্র ডাউনলোড লিঙ্ক",
    "Check Result Link": "ফলাফল চেক লিঙ্ক",
    "Apply Online Link": "অনলাইন আবেদন লিঙ্ক",
    "Detailed Notification Tables & Info": "বিস্তারিত বিজ্ঞপ্তি তালিকা ও তথ্য"
  }
};

export default function TranslateText({ text = "", html = false }) {
  const { language } = useLanguage();
  
  // Ensure text is a string
  const currentText = typeof text === 'string' ? text : String(text || '');
  
  const [translated, setTranslated] = useState(() => {
    if (language === 'en') return currentText;
    return globalTranslationCache[language]?.[currentText] || currentText;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stringText = typeof text === 'string' ? text : String(text || '');

    // If language is English, restore original text instantly
    if (language === 'en') {
      setTranslated(stringText);
      return;
    }

    // If text has no translatable alphabetic characters (like dates, numbers, punctuation), bypass
    if (stringText && !/[a-zA-Z]/.test(stringText)) {
      setTranslated(stringText);
      return;
    }

    // Check if we have cached translation globally for this language and text
    if (globalTranslationCache[language]?.[stringText]) {
      setTranslated(globalTranslationCache[language][stringText]);
      return;
    }

    // Reset to original English text to prevent showing flash of old translations
    setTranslated(stringText);

    // Fetch translation dynamically from Next API
    let isMounted = true;
    const fetchTranslation = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: stringText,
            targetLang: language
          })
        });
        
        if (!response.ok) throw new Error("Translation request failed");
        
        const data = await response.json();
        if (isMounted) {
          const result = data.translatedText || stringText;
          
          // Store in global cache
          if (!globalTranslationCache[language]) {
            globalTranslationCache[language] = {};
          }
          globalTranslationCache[language][stringText] = result;
          
          setTranslated(result);
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTranslation();

    return () => {
      isMounted = false;
    };
  }, [language, text]);

  if (loading) {
    return (
      <span className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 rounded px-2 text-transparent select-none">
        {text}
      </span>
    );
  }

  // Parse basic bold markdown helper
  const parseInlineMarkdown = (str) => {
    if (!str) return "";
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-950 dark:text-white">$1</strong>');
  };

  const hasMarkdown = translated && typeof translated === 'string' && translated.includes('**');

  if (html || hasMarkdown) {
    const finalContent = html ? translated : parseInlineMarkdown(translated);
    return <span dangerouslySetInnerHTML={{ __html: finalContent }} />;
  }

  return <>{translated}</>;
}
