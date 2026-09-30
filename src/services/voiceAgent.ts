/**
 * Mausam Setu Voice Engine
 * Functional core adapted from voiceBus / speakFallback / sarthiAssist architecture
 * Zero external UI dependencies - pure client-side STT & TTS for Indian Farmers
 */

let lastUtterance: SpeechSynthesisUtterance | null = null;
let recognitionInstance: any = null;

export function stopSpeaking() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
  lastUtterance = null;
}

/**
 * Text-to-Speech with regional Indian voice preference (Hindi/English)
 */
export function speakFarmerAdvice(text: string, lang: 'hi-IN' | 'en-IN' = 'hi-IN'): boolean {
  const line = String(text || '')
    .replace(/<<[^>]+>>/g, ' ')
    .replace(/[#*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!line || typeof window === 'undefined' || !('speechSynthesis' in window)) return false;

  try {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(line.slice(0, 500));
    utterance.lang = lang;
    utterance.rate = 0.92; // Slightly slower, calm cadence for clear comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const prefix = lang.slice(0, 2).toLowerCase();

    // Prefer native Indian voice (hi-IN or en-IN)
    const voice =
      voices.find((v) => String(v.lang || '').toLowerCase() === lang.toLowerCase()) ||
      voices.find((v) => String(v.lang || '').toLowerCase().startsWith(prefix)) ||
      voices.find((v) => String(v.name || '').toLowerCase().includes('india'));

    if (voice) {
      utterance.voice = voice;
    }

    lastUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('[VoiceAgent] Speech synthesis failed:', err);
    return false;
  }
}

export interface VoiceQueryContext {
  panchayatName?: string;
  cropName?: string;
  rainProbability?: number;
  rainAmountMm?: number;
  soilMoisturePct?: number;
  recommendedCrop?: string;
  isHoldIrrigation?: boolean;
}

/**
 * Vernacular Intent Parser for Farmers (Hindi + Hinglish + English)
 */
export function processAgriVoiceQuery(
  rawQuery: string,
  ctx: VoiceQueryContext = {}
): { replyText: string; actionTab?: string; lang: 'hi-IN' | 'en-IN' } {
  const q = String(rawQuery || '').toLowerCase().trim();
  const panchayat = ctx.panchayatName || 'Mohanlalganj';
  const crop = ctx.cropName || 'धान (Paddy)';
  const rainProb = ctx.rainProbability ?? 84;
  const rainMm = ctx.rainAmountMm ?? 12.4;
  const soilMoist = ctx.soilMoisturePct ?? 31.4;

  const isHindi = !/^(what|is|how|should|can|tell|why|when)\b/.test(q);

  // Intent 1: Irrigation / Water ("paani", "sinchai", "tubewell", "irrigation", "water")
  if (/paani|pani|sinchai|tubewell|tubvel|water|irrigate|pump/.test(q)) {
    if (isHindi) {
      return {
        replyText: `किसान भाई, ${panchayat} में अगले 24 घंटे में ${rainMm} मिलीमीटर बारिश की ${rainProb} प्रतिशत संभावना है। मिट्टी में ${soilMoist} प्रतिशत नमी पहले से है। आज ट्यूबवेल मत चलाएं, इससे आपका लगभग ₹1,450 बचेगा।`,
        actionTab: 'sinchai',
        lang: 'hi-IN'
      };
    }
    return {
      replyText: `Farmer friend, ${panchayat} has an ${rainProb}% probability of ${rainMm} mm rain. Root-zone soil moisture is ${soilMoist}%. Hold irrigation today to save approximately ₹1,450.`,
      actionTab: 'sinchai',
      lang: 'en-IN'
    };
  }

  // Intent 2: Crop Recommendation / Sowing ("kya lagau", "kya bou", "fasal", "seed", "crop", "sow")
  if (/fasal|crop|bou|lagau|bona|kya lagana|bajra|dhan|sow|seed/.test(q)) {
    if (isHindi) {
      return {
        replyText: `${panchayat} की मिट्टी और जलवायु के हिसाब से इस समय बाजरा और मूंग सबसे उपयुक्त हैं। बाजरा में पानी की 65 प्रतिशत बचत होती है और फसल खराब होने का जोखिम न्यूनतम है।`,
        actionTab: 'fasal',
        lang: 'hi-IN'
      };
    }
    return {
      replyText: `Based on soil and rainfall in ${panchayat}, Pearl Millet (Bajra) and Moong are top-ranked. Bajra requires 65% less water with high profit resilience.`,
      actionTab: 'fasal',
      lang: 'en-IN'
    };
  }

  // Intent 3: Weather Forecast ("mausam", "barish", "dhoop", "rain", "temperature", "forecast")
  if (/mausam|barish|barsat|dhoop|weather|rain|temp|forecast/.test(q)) {
    if (isHindi) {
      return {
        replyText: `${panchayat} में तापमान 31.8 डिग्री सेल्सियस है। हवा 14 किलोमीटर प्रति घंटा है। शाम तक 12.4 मिलीमीटर बारिश की संभावना 84 प्रतिशत है।`,
        actionTab: 'mausam',
        lang: 'hi-IN'
      };
    }
    return {
      replyText: `In ${panchayat}, temperature is 31.8°C with wind at 14 km/h. There is an 84% probability of 12.4 mm rainfall by evening.`,
      actionTab: 'mausam',
      lang: 'en-IN'
    };
  }

  // Intent 4: Hazards / Pests / Drought ("keeda", "roga", "baadh", "sookha", "alert", "danger", "risk")
  if (/keeda|roga|bimari|baadh|sookha|risk|alert|danger|pala/.test(q)) {
    if (isHindi) {
      return {
        replyText: `${panchayat} में भारी बारिश के कारण खेतों में जलभराव का मध्यम जोखिम है। आज शाम से पहले नालियों की निकासी साफ रखें और कीटनाशक का छिड़काव रोक दें।`,
        actionTab: 'alerts',
        lang: 'hi-IN'
      };
    }
    return {
      replyText: `Moderate waterlogging hazard detected in ${panchayat}. Clear field drainage before rainfall and hold chemical sprays until winds calm.`,
      actionTab: 'alerts',
      lang: 'en-IN'
    };
  }

  // Default fallback answer
  if (isHindi) {
    return {
      replyText: `नमस्ते! मैं आपका मौसम सेतु साथी हूँ। आप मुझसे पूछ सकते हैं: "आज पानी दूँ या नहीं?", "कौन सी फसल लगाऊँ?", या "बारिश कब होगी?".`,
      actionTab: 'sinchai',
      lang: 'hi-IN'
    };
  }
  return {
    replyText: `Hello! I am your Mausam Setu voice assistant. Ask me: "Should I irrigate today?", "Which crop should I sow?", or "Is rain expected?".`,
    actionTab: 'sinchai',
    lang: 'en-IN'
  };
}

/**
 * Speech Recognition Listener (STT) using Web Speech API
 */
export function startVoiceListening(
  onTranscript: (transcript: string) => void,
  onFinalResponse: (query: string, reply: string, actionTab?: string) => void,
  onError?: (error: string) => void,
  ctx: VoiceQueryContext = {}
): () => void {
  if (typeof window === 'undefined') return () => {};

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Speech Recognition is not supported in this browser. Please use Chrome/Edge.');
    return () => {};
  }

  try {
    stopSpeaking();
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch {}
    }

    const recognition = new SpeechRecognition();
    recognitionInstance = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN'; // Default to Indic recognition, easily handles English words

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const activeText = final || interim;
      if (activeText) {
        onTranscript(activeText);
      }

      if (final) {
        const result = processAgriVoiceQuery(final, ctx);
        speakFarmerAdvice(result.replyText, result.lang);
        onFinalResponse(final, result.replyText, result.actionTab);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[VoiceAgent] Recognition error:', event.error);
      if (onError) onError(event.error || 'Mic error');
    };

    recognition.onend = () => {
      recognitionInstance = null;
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionInstance = null;
    };
  } catch (err: any) {
    if (onError) onError(err?.message || 'Could not start mic');
    return () => {};
  }
}
