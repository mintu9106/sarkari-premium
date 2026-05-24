"use client";

import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function TranslateText({ text = "", html = false }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);
  const [loading, setLoading] = useState(false);
  const cache = useRef({ en: text });

  useEffect(() => {
    // If language is English, restore original text instantly
    if (language === 'en') {
      setTranslated(text);
      return;
    }

    // Check if we have cached translation for this language
    if (cache.current[language]) {
      setTranslated(cache.current[language]);
      return;
    }

    // Otherwise, fetch translation dynamically from Next API
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
            text: text,
            targetLang: language
          })
        });
        
        if (!response.ok) throw new Error("Translation request failed");
        
        const data = await response.json();
        if (isMounted) {
          const result = data.translatedText || text;
          cache.current[language] = result;
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

  if (html) {
    return <span dangerouslySetInnerHTML={{ __html: translated }} />;
  }

  return <>{translated}</>;
}
