import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const OLLAMA_URL = "http://localhost:11434/api/generate";

async function translateWithGemini(text, targetLang, apiKey) {
  const langName = targetLang === 'hi' ? 'Hindi' : 'Bengali';
  const prompt = `Translate the following text into natural, professional, and human-like ${langName}. Keep government-specific technical terms (like 'admit card', 'pay scale', 'eligibility') in standard usage (either transliterated or with the English term in parentheses if appropriate). Do not make it sound like robotic translation.
  
  Text:
  ${text}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini translation error: ${err}`);
  }

  const json = await response.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || text;
}

async function translateWithOllama(text, targetLang) {
  const langName = targetLang === 'hi' ? 'Hindi' : 'Bengali';
  const prompt = `Translate the following text into natural, professional, and human-like ${langName}. Keep English technical terms in parentheses if necessary. Output only the translated text.
  
  Text:
  ${text}`;

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "llama3:8b",
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error("Ollama connection failed");
  }

  const json = await response.json();
  return json.response?.trim() || text;
}

// Simple fallback dictionary for testing/production offline fallback
const mockDict = {
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
    "Result Declaration Date": "परिणाम घोषित होने की तिथि"
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
    "Result Declaration Date": "ফলাফল ঘোষণার তারিখ"
  }
};

export async function POST(req) {
  try {
    const { text, targetLang } = await req.json();
    
    if (!text || !targetLang || targetLang === 'en') {
      return NextResponse.json({ translatedText: text });
    }

    // 1. Check dictionary first (fastest and saves API quota)
    const dict = mockDict[targetLang];
    if (dict && dict[text]) {
      return NextResponse.json({ translatedText: dict[text] });
    }

    // 2. Try Free Google Translate API (fast, reliable, no API key, high limits)
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const translatedText = data[0].map(x => x[0]).join('');
        // If translation succeeded and did not just return the original English text
        if (translatedText && (translatedText.toLowerCase() !== text.toLowerCase() || !/[a-zA-Z]/.test(text))) {
          return NextResponse.json({ translatedText });
        }
      }
    } catch (e) {
      console.error("Free Google Translate API failed, falling back:", e.message);
    }

    // 3. Fallback: Try Gemini if API key is provided and Google Translate failed
    if (GEMINI_API_KEY) {
      try {
        console.log("Translating via Gemini API...");
        const result = await translateWithGemini(text, targetLang, GEMINI_API_KEY);
        return NextResponse.json({ translatedText: result });
      } catch (e) {
        console.error("Gemini translation failed:", e.message);
      }
    }

    // 4. Try Local Ollama if available
    try {
      console.log("Translating via local Ollama...");
      const result = await translateWithOllama(text, targetLang);
      return NextResponse.json({ translatedText: result });
    } catch (e) {
      // Local Ollama is either not running or not reachable (normal in production)
    }

    // Default fallback to original text
    return NextResponse.json({ 
      translatedText: text 
    });

  } catch (err) {
    console.error("Translation API handler error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
