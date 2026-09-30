/**
 * Farmer Content & Video Recommendation Engine
 * Dynamically scores and ranks agricultural video reels based on:
 * Region (State, District, Block, Panchayat) + Crop + Growth Stage + Active Weather Triggers + Season
 */

export interface FarmerReel {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'weather_risk' | 'crop_stage' | 'irrigation' | 'soil' | 'pest_alert' | 'general';
  priority: 'URGENT' | 'HIGH' | 'RECOMMENDED';
  videoUrl: string;
  posterUrl: string;

  // Agricultural context metadata
  crops: string[];
  cropStages: string[];
  states: string[];
  districts?: string[];
  weatherTriggers: string[];

  // Explanatory reasoning
  whyYouSeeThisEn: string[];
  whyYouSeeThisHi: string[];

  // 3-step Swipe to Understand: What -> Why -> Action
  step1TitleEn: string;
  step1TitleHi: string;
  step1DescEn: string;
  step1DescHi: string;

  step2TitleEn: string;
  step2TitleHi: string;
  step2DescEn: string;
  step2DescHi: string;

  step3TitleEn: string;
  step3TitleHi: string;
  step3ActionEn: string;
  step3ActionHi: string;

  voiceNarrationEn: string;
  voiceNarrationHi: string;
  durationSeconds: number;
  likesCount: number;
}

export const REELS_REPOSITORY: FarmerReel[] = [
  {
    id: 'reel-rain-drainage',
    titleEn: 'Incoming Rain: Drainage Management for Paddy Fields',
    titleHi: 'बारिश से पहले धान में जल निकासी नाली प्रबंधन',
    category: 'weather_risk',
    priority: 'URGENT',
    videoUrl: 'https://videos.pexels.com/video-files/7604198/7604198-hd_1920_1080_30fps.mp4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    crops: ['paddy', 'all'],
    cropStages: ['Flowering', 'Vegetative', 'Grain Filling'],
    states: ['Uttar Pradesh', 'Haryana', 'Punjab', 'Bihar'],
    districts: ['Lucknow', 'Karnal', 'Bathinda', 'Barabanki'],
    weatherTriggers: ['HEAVY_RAIN', 'WATERLOGGING'],
    whyYouSeeThisEn: [
      'Your Crop: Paddy (Basmati)',
      'Current Stage: Flowering / Heading',
      'Local Trigger: 12.4 mm rainfall expected tonight (84% probability)',
      'Region: Central Awadh & Gangetic Plain'
    ],
    whyYouSeeThisHi: [
      'आपकी फसल: धान (बासमती)',
      'वर्तमान अवस्था: फूल व बाली आना (Flowering)',
      'मौसम ट्रिगर: आज रात 12.4 मिमी वर्षा की 84% संभावना',
      'इलाका: उत्तर प्रदेश / लखनऊ क्षेत्र'
    ],
    step1TitleEn: '01 / WEATHER SITUATION',
    step1TitleHi: '01 / मौसम की स्थिति',
    step1DescEn: '12.4 mm downpour expected in the next 24 hours with peak intensity between 4 PM and 9 PM.',
    step1DescHi: 'अगले 24 घंटों में 12.4 मिमी बारिश का अनुमान है। शाम 4 से 9 बजे के बीच तेज बौछारें आ सकती हैं।',
    step2TitleEn: '02 / IMPACT ON ROOT ZONE',
    step2TitleHi: '02 / जड़ व मिट्टी पर असर',
    step2DescEn: 'Soil moisture is already at 31.4% (optimal field capacity). Standing water exceeding 5cm will suffocate root respiration.',
    step2DescHi: 'मिट्टी में पहले से 31.4% नमी है। 5 सेमी से अधिक जलभराव से जड़ों में ऑक्सीजन की कमी हो जाएगी।',
    step3TitleEn: '03 / TODAY FIELD ACTION',
    step3TitleHi: '03 / आज का जरूरी कदम',
    step3ActionEn: 'DO NOT run tubewell pumps today. Clear field drainage bunds before 3:00 PM to let excess surface runoff escape safely.',
    step3ActionHi: 'आज ट्यूबवेल पंप न चलाएं। शाम 3 बजे से पहले खेत की मेड़ की निकास नाली खोलें ताकि अतिरिक्त पानी बह सके।',
    voiceNarrationEn: 'Attention farmer. Heavy rainfall of 12 millimeters is forecast tonight. Stop tubewell pumping immediately and open field drainage channels before 3 PM to prevent waterlogging.',
    voiceNarrationHi: 'किसान भाई ध्यान दें। आज रात 12 मिमी बारिश की संभावना है। ट्यूबवेल तुरंत बंद रखें और दोपहर 3 बजे से पहले निकासी नाली साफ करें।',
    durationSeconds: 15,
    likesCount: 1420
  },
  {
    id: 'reel-paddy-flowering',
    titleEn: 'Paddy Flowering Stage: Water Balance & Nutrient Care',
    titleHi: 'धान में बाली आने पर पानी और पोटाश का सही संतुलन',
    category: 'crop_stage',
    priority: 'HIGH',
    videoUrl: 'https://videos.pexels.com/video-files/4204559/4204559-uhd_2560_1440_25fps.mp4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    crops: ['paddy'],
    cropStages: ['Flowering', 'Grain Filling'],
    states: ['Uttar Pradesh', 'Punjab', 'Haryana'],
    districts: ['Lucknow', 'Karnal'],
    weatherTriggers: ['HUMIDITY_HIGH'],
    whyYouSeeThisEn: [
      'Your Crop: Paddy (Basmati)',
      'Growth Stage: Flowering (Crucial yield determining window)',
      'Soil Health: Medium Nitrogen, High Phosphorus, Medium Potash'
    ],
    whyYouSeeThisHi: [
      'आपकी फसल: धान (बासमती)',
      'फसल अवस्था: बाली निकलना (उपज निर्धारण की नाजुक अवस्था)',
      'मृदा स्वास्थ्य: मध्यम पोटाश आवश्यकता'
    ],
    step1TitleEn: '01 / FLOWERING STAGE SENSITIVITY',
    step1TitleHi: '01 / बाली निकलने की संवेदनशीलता',
    step1DescEn: 'During flowering and anthesis, panicles are extremely sensitive to severe drought or prolonged inundation.',
    step1DescHi: 'बाली में फूल आने पर न तो खेत सूखना चाहिए और न ही 72 घंटे से अधिक जलभराव होना चाहिए।',
    step2TitleEn: '02 / PHYSIOLOGICAL NEED',
    step2TitleHi: '02 / पोषक तत्व विज्ञान',
    step2DescEn: 'Nitrogen spray must be stopped. Foliar 00:00:50 (Potash) spray accelerates grain filling and stem strength.',
    step2DescHi: 'इस समय यूरिया का छिड़काव रोक दें। 00:00:50 पोटाश का छिड़काव दानों को चमकदार व मजबूत बनाता है।',
    step3TitleEn: '03 / RECOMMENDED ACTION',
    step3TitleHi: '03 / आज का कदम',
    step3ActionEn: 'Maintain 2 to 3 cm thin water layer only. Plan 1% SOP (00:00:50) foliar application after upcoming rain clears.',
    step3ActionHi: 'खेत में केवल 2-3 सेमी पतला पानी बनाए रखें। बारिश समाप्त होने पर 1% पोटाश का स्प्रे करें।',
    voiceNarrationEn: 'Your paddy is in flowering stage. Keep only 2 to 3 cm water in the field. Avoid urea top-dressing now, and apply 1% potash spray once the rain passes.',
    voiceNarrationHi: 'आपकी धान की फसल में बालियां आ रही हैं। खेत में केवल 2 से 3 सेमी पानी रखें। यूरिया न डालें, बारिश के बाद पोटाश का छिड़काव करें।',
    durationSeconds: 18,
    likesCount: 980
  },
  {
    id: 'reel-irrigation-savings',
    titleEn: 'Skip Tubewell Today: Save ₹1,450 Energy & Protect Roots',
    titleHi: 'आज ट्यूबवेल रोकें: ₹1,450 बिजली बचाएं और फसल सुरक्षा',
    category: 'irrigation',
    priority: 'HIGH',
    videoUrl: 'https://videos.pexels.com/video-files/2499611/2499611-hd_1920_1080_24fps.mp4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    crops: ['all', 'paddy', 'wheat', 'bajra'],
    cropStages: ['all', 'Vegetative', 'Flowering'],
    states: ['Uttar Pradesh', 'Haryana', 'Rajasthan', 'Punjab'],
    districts: ['Lucknow', 'Jaipur', 'Indore'],
    weatherTriggers: ['HEAVY_RAIN'],
    whyYouSeeThisEn: [
      'Your Source: Tubewell / Borewell',
      'Energy Tariff: ~₹180/hr pump running cost',
      'Weather Sync: Free rain covers crop evapotranspiration'
    ],
    whyYouSeeThisHi: [
      'सिंचाई साधन: नलकूप / बोरवेल',
      'डीजल व बिजली खर्च: ~₹180 प्रति घंटा',
      'मौसम संतुलन: प्राकृतिक बारिश से फसल की आवश्यकता पूरी होगी'
    ],
    step1TitleEn: '01 / ET0 WATER BUDGET',
    step1TitleHi: '01 / वाष्पीकरण जल बजट',
    step1DescEn: 'Atmospheric ET0 is low (3.1 mm/day due to dense cloud cover). Soil water depletion rate is near zero.',
    step1DescHi: 'बादल छाए रहने से वाष्पीकरण दर घटकर केवल 3.1 मिमी रह गई है। खेत में पानी की खपत बहुत कम है।',
    step2TitleEn: '02 / GROUNDWATER CONSERVATION',
    step2TitleHi: '02 / भूजल व बिजली बचत',
    step2DescEn: 'Pumping today wastes 18,000 liters of groundwater per bigha which will only spill out during night rain.',
    step2DescHi: 'आज पंप चलाने से प्रति बीघा 18,000 लीटर भूजल बर्बाद होगा जो रात की बारिश में बह जाएगा।',
    step3TitleEn: '03 / SMART SAVINGS DECISION',
    step3TitleHi: '03 / समझदारी भरा फैसला',
    step3ActionEn: 'Keep the pump switched OFF for the next 48 hours. Review root-zone moisture on Wednesday morning.',
    step3ActionHi: 'अगले 48 घंटे ट्यूबवेल बंद रखें। बुधवार सुबह ऐप पर मिट्टी की नमी जांचें।',
    voiceNarrationEn: 'Soil moisture is optimal and rain is arriving tonight. Keep your borewell switched off to save diesel and electricity expenses.',
    voiceNarrationHi: 'मिट्टी में पर्याप्त नमी है और बारिश आने वाली है। नलकूप बंद रखकर अपने पैसे और समय की बचत करें।',
    durationSeconds: 14,
    likesCount: 2130
  },
  {
    id: 'reel-pest-humidity',
    titleEn: 'High Humidity Pest Alert: Stem Borer & Leaf Blast Prevention',
    titleHi: 'नमी व उमस में तना छेदक व झुलसा रोग से बचाव',
    category: 'pest_alert',
    priority: 'RECOMMENDED',
    videoUrl: 'https://videos.pexels.com/video-files/5532766/5532766-uhd_2560_1440_25fps.mp4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    crops: ['paddy', 'wheat'],
    cropStages: ['Flowering', 'Vegetative'],
    states: ['Uttar Pradesh', 'Bihar', 'West Bengal'],
    districts: ['Lucknow', 'Barabanki'],
    weatherTriggers: ['HUMIDITY_HIGH'],
    whyYouSeeThisEn: [
      'Forecast Humidity: 88% to 94%',
      'Microclimate Window: Favorable for fungal spore germination',
      'Target Pest: Yellow Stem Borer & Blast'
    ],
    whyYouSeeThisHi: [
      'अनुमानित आर्द्रता: 88% से 94% उमस',
      'मौसम प्रभाव: फफूंद और कीट प्रकोप की अनुकूल स्थिति',
      'लक्ष्य: तना छेदक व पत्ती झुलसा'
    ],
    step1TitleEn: '01 / MICROCLIMATE WARNING',
    step1TitleHi: '01 / सूक्ष्म जलवायु चेतावनी',
    step1DescEn: 'Continuous overcast sky paired with 88% relative humidity increases leaf wetness duration over 10 hours.',
    step1DescHi: 'लगातार बादल और 88% नमी से पत्तियों पर ओस 10 घंटे से अधिक ठहर रही है।',
    step2TitleEn: '02 / EARLY SYMPTOM DETECTION',
    step2TitleHi: '02 / प्रारंभिक लक्षण पहचान',
    step2DescEn: 'Inspect top leaves for spindle-shaped brown eye spots or central leaf wilting (dead heart).',
    step2DescHi: 'पत्तियों पर नाव के आकार के भूरे धब्बे या बीच की गोभ सूखने के लक्षण देखें।',
    step3TitleEn: '03 / BIO-SHIELD ACTION',
    step3TitleHi: '03 / जैविक सुरक्षा उपाय',
    step3ActionEn: 'Do not spray chemicals in rain. Post-rain, apply Tricyclazole 75% WP @ 120g/acre or Neem oil bio-shield.',
    step3ActionHi: 'बारिश में कोई केमिकल न छिड़कें। बारिश रुकने पर ट्राईसाइक्लाजोल 120 ग्राम प्रति एकड़ या नीम तेल का छिड़काव करें।',
    voiceNarrationEn: 'High humidity increases pest window. Inspect your crop for leaf spots and apply preventative spray only after the rain stops.',
    voiceNarrationHi: 'हवा में अधिक नमी से कीट का खतरा बढ़ सकता है। बारिश के तुरंत बाद खेत का मुआयना करें और सही रोकथाम करें।',
    durationSeconds: 16,
    likesCount: 840
  },
  {
    id: 'reel-bajra-moong-switch',
    titleEn: 'Climate Scenario: Why Bajra & Moong Outperform Paddy in Deficit Rain',
    titleHi: 'कम बारिश में बाजरा और मूंग क्यों हैं सबसे सुरक्षित फसलें?',
    category: 'general',
    priority: 'RECOMMENDED',
    videoUrl: 'https://videos.pexels.com/video-files/5849603/5849603-hd_1920_1080_24fps.mp4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    crops: ['all', 'bajra', 'moong', 'paddy'],
    cropStages: ['all'],
    states: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana'],
    districts: ['Jaipur', 'Lucknow', 'Indore'],
    weatherTriggers: ['DRY_SPELL', 'DEFICIT_RAIN'],
    whyYouSeeThisEn: [
      'Scenario Engine: -20% to -40% Monsoon Stress Analysis',
      'Water Footprint: Bajra needs only 350mm vs Paddy 1250mm',
      'Panchayat Suitability: Bajra (92%), Moong (88%)'
    ],
    whyYouSeeThisHi: [
      'सिनेरियो इंजन: 20-40% कम बारिश का विश्लेषण',
      'पानी की खपत: बाजरा 350 मिमी बनाम धान 1250 मिमी',
      'पंचायत उपयुक्तता: बाजरा (92%), मूंग (88%)'
    ],
    step1TitleEn: '01 / WATER STRESS COMPARISON',
    step1TitleHi: '01 / पानी की जरूरत की तुलना',
    step1DescEn: 'Paddy consumes 1,250 mm water. In drought or delayed rain, tubewell groundwater drops sharply.',
    step1DescHi: 'धान को 1,250 मिमी पानी चाहिए। सूखे में बोरवेल का पानी तेजी से नीचे गिर जाता है।',
    step2TitleEn: '02 / DROUGHT RESILIENCE',
    step2TitleHi: '02 / सूखा सहनशीलता',
    step2DescEn: 'Bajra deep roots extract subsoil moisture at 60cm, while Moong enriches soil with 30 kg/ha atmospheric Nitrogen.',
    step2DescHi: 'बाजरे की जड़ें 60 सेमी गहराई से नमी सोखती हैं और मूंग ज़मीन में 30 किग्रा नाइट्रोजन बढ़ाती है।',
    step3TitleEn: '03 / PLANNING RECOMMENDATION',
    step3TitleHi: '03 / योजना सलाह',
    step3ActionEn: 'For light soils and elevated plots, consider Bajra or Green Gram for 40% lower cost and higher net profit.',
    step3ActionHi: 'ऊंची और हल्की दोमट जमीन पर बाजरा या मूंग लगाएं — लागत कम और मुनाफा अधिक सुरक्षित।',
    voiceNarrationEn: 'Under low rainfall scenarios, Bajra and Moong require 70 percent less water than Paddy and give reliable harvest returns.',
    voiceNarrationHi: 'कम बारिश के समय बाजरा और मूंग धान से 70 प्रतिशत कम पानी में तैयार हो जाते हैं और जोखिम से बचाते हैं।',
    durationSeconds: 20,
    likesCount: 1650
  }
];

export interface FarmerContextInput {
  panchayatName?: string;
  district?: string;
  state?: string;
  cropId?: string;
  cropName?: string;
  cropStage?: string;
  soilType?: string;
  hasRainTrigger?: boolean;
}

/**
 * Score and order reels for a specific farmer context
 */
export function rankFarmerReels(
  farmerCtx: FarmerContextInput,
  categoryFilter?: string
): { reels: FarmerReel[]; fallbackNotice?: string } {
  const crop = (farmerCtx.cropId || farmerCtx.cropName || '').toLowerCase();
  const stage = farmerCtx.cropStage || 'Vegetative';
  const state = farmerCtx.state || 'Uttar Pradesh';
  const district = farmerCtx.district || 'Lucknow';

  let filtered = REELS_REPOSITORY;

  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((r) => r.category === categoryFilter);
  }

  // Calculate Relevance Score
  const scored = filtered.map((reel) => {
    let score = 0;

    // 1. Regional match
    if (reel.districts?.some((d) => d.toLowerCase() === district.toLowerCase())) {
      score += 45;
    } else if (reel.states?.some((s) => s.toLowerCase() === state.toLowerCase())) {
      score += 25;
    } else {
      score += 10;
    }

    // 2. Crop match
    if (reel.crops.includes('all')) {
      score += 15;
    } else if (reel.crops.some((c) => crop.includes(c))) {
      score += 35;
    }

    // 3. Stage match
    if (reel.cropStages.includes('all')) {
      score += 10;
    } else if (reel.cropStages.some((s) => s.toLowerCase() === stage.toLowerCase())) {
      score += 25;
    }

    // 4. Weather trigger match (rain priority)
    if (farmerCtx.hasRainTrigger && reel.weatherTriggers.includes('HEAVY_RAIN')) {
      score += 40;
    }

    // Priority bonus
    if (reel.priority === 'URGENT') score += 20;
    if (reel.priority === 'HIGH') score += 10;

    return { reel, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const fallbackNotice =
    farmerCtx.panchayatName && district
      ? `Calibrated for ${farmerCtx.panchayatName}, ${district} (${state}) agro-climatic conditions.`
      : undefined;

  return {
    reels: scored.map((s) => s.reel),
    fallbackNotice
  };
}
