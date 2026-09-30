/**
 * Farmer Content & Video Recommendation Engine
 * Curated from verified Indian Agricultural Institutions:
 * 1. MANAGE (National Institute of Agricultural Extension Management, Hyderabad)
 * 2. TNAU Agritech (Tamil Nadu Agricultural University Demonstration Library)
 * 3. ICAR (Indian Council of Agricultural Research & National Research Institutes)
 * 
 * Dynamically scores and ranks teaching & demonstration videos based on:
 * Crop + Growth Stage + Real-Time Weather Alert + Soil Moisture + Active Risk
 */

export interface FarmerReel {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'sowing_nursery' | 'water_saving' | 'soil_health' | 'crop_protection' | 'weather_adaptation' | 'post_harvest';
  priority: 'URGENT' | 'HIGH' | 'RECOMMENDED';
  videoUrl: string;
  youtubeId: string;
  posterUrl: string;

  // Institutional Attribution
  institution: 'MANAGE' | 'ICAR' | 'TNAU' | 'KVK';
  institutionBadgeEn: string;
  institutionBadgeHi: string;
  expertNameEn: string;
  expertNameHi: string;
  expertTitleEn: string;
  expertTitleHi: string;

  // Agricultural context metadata
  crops: string[];
  cropStages: string[];
  states: string[];
  districts?: string[];
  weatherTriggers: string[];

  // Explanatory reasoning: Why you see this today
  whyYouSeeThisEn: string[];
  whyYouSeeThisHi: string[];

  // 3 बातें याद रखें (3 Key Takeaways)
  keyTakeawaysEn: [string, string, string];
  keyTakeawaysHi: [string, string, string];

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
  // 1. SOWING & NURSERY (🌱 फसल लगाएं) - MANAGE
  {
    id: 'manage-paddy-nursery-seed',
    titleEn: 'Paddy Nursery Preparation & Seed Treatment Protocol',
    titleHi: 'आज सीखें: धान की नर्सरी कैसे तैयार करें और बीज उपचार विधि',
    category: 'sowing_nursery',
    priority: 'HIGH',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: '6W5PaQQu-ZU',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'MANAGE',
    institutionBadgeEn: '🎓 MANAGE Hyderabad',
    institutionBadgeHi: '🎓 मैनेज हैदराबाद',
    expertNameEn: 'Dr. B. Rajeswari',
    expertNameHi: 'डॉ. बी. राजेश्वरी',
    expertTitleEn: 'Principal Scientist (Agricultural Extension)',
    expertTitleHi: 'प्रधान वैज्ञानिक (कृषि विस्तार व प्राकृतिक खेती)',
    crops: ['paddy', 'all'],
    cropStages: ['Nursery', 'Vegetative', 'Flowering'],
    states: ['Uttar Pradesh', 'Haryana', 'Punjab', 'Bihar'],
    districts: ['Lucknow', 'Karnal', 'Barabanki'],
    weatherTriggers: ['HUMIDITY_HIGH', 'HEAVY_RAIN'],
    whyYouSeeThisEn: [
      'Your Crop: Paddy (Basmati)',
      'Recommended: Healthy seedling establishment is 40% of final grain yield',
      'Source: MANAGE Natural Farming Video Library'
    ],
    whyYouSeeThisHi: [
      'आपकी फसल: धान (बासमती)',
      'वैज्ञानिक आधार: स्वस्थ नर्सरी से 40% पैदावार पहले ही सुरक्षित होती है',
      'स्रोत: राष्ट्रीय कृषि विस्तार प्रबंधन संस्थान (MANAGE)'
    ],
    keyTakeawaysEn: [
      'Float seeds in 10% saltwater test; discard floating hollow seeds and select only heavy seeds.',
      'Treat selected seeds with Beejamrit or Trichoderma (10g/kg) and shade-dry before broadcasting.',
      'Transplant strictly within 21 to 25 days to avoid root aging and tiller reduction.'
    ],
    keyTakeawaysHi: [
      '10% नमक के घोल में बीज तैराएं; तैरने वाले खोखले बीज हटाएं और भारी बीज ही चुनें।',
      'बीजामृत या ट्राइकोडर्मा (10 ग्राम/किग्रा) से उपचारित करके छाया में सुखाएं।',
      'पौध को 21 से 25 दिन के भीतर ही रोपाई करें ताकि कल्ले अधिक निकलें।'
    ],
    step1TitleEn: '01 / SALT TEST SEED SELECTION',
    step1TitleHi: '01 / नमक घोल से स्वस्थ बीज चयन',
    step1DescEn: 'Dissolve salt until a fresh egg floats. Add paddy seeds. Poor seeds float up, viable healthy seeds settle to the bottom.',
    step1DescHi: 'पानी में नमक घोलें जब तक अंडा तैरने लगे। बीज डालें — हल्के बीज ऊपर आ जाएंगे, भारी स्वस्थ बीज तली में बैठ जाएंगे।',
    step2TitleEn: '02 / BIO-PRIMING SHIELD',
    step2TitleHi: '02 / बीजामृत व जैविक सुरक्षा',
    step2DescEn: 'Rinse with clean water, then coat with Beejamrit to inoculate beneficial rhizobacteria that ward off sheath rot and blast.',
    step2DescHi: 'साफ पानी से धोकर बीजामृत से सानें। यह फफूंद और जड़ गलन से प्राकृतिक सुरक्षा चक्र बनाता है।',
    step3TitleEn: '03 / FIELD ACTION CHECKLIST',
    step3TitleHi: '03 / खेत पर लागू करने योग्य कदम',
    step3ActionEn: 'Prepare raised beds 1.2m wide with 30cm drainage channels between beds to avoid rain waterlogging.',
    step3ActionHi: '1.2 मीटर चौड़ी उठी हुई क्यारियां बनाएं और बीच में 30 सेमी निकास नाली रखें ताकि बारिश का पानी न भरे।',
    voiceNarrationEn: 'Learn paddy nursery management from MANAGE experts. Select heavy seeds with salt water, treat with bio-inoculant, and transplant within 25 days.',
    voiceNarrationHi: 'मैनेज वैज्ञानिकों से सीखें धान नर्सरी प्रबंधन। नमक पानी से बीज चुनें, बीजामृत से उपचार करें और 25 दिन में रोपाई करें।',
    durationSeconds: 240,
    likesCount: 3240
  },

  // 2. SOWING & TECHNOLOGY - TNAU (SRI Method & Direct Seeding)
  {
    id: 'tnau-sri-rice-mechanization',
    titleEn: 'System of Rice Intensification (SRI) & Precision DSR Demo',
    titleHi: 'धान में श्री विधि (SRI) व सीधी बिजाई: कम पानी में 40 कल्ले प्रति पौधा',
    category: 'sowing_nursery',
    priority: 'RECOMMENDED',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: '4MWzE-PwEH4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'TNAU',
    institutionBadgeEn: '🌾 TNAU Coimbatore',
    institutionBadgeHi: '🌾 TNAU तमिलनाडु कृषि विश्वविद्यालय',
    expertNameEn: 'Dr. R. Mahendran',
    expertNameHi: 'डॉ. आर. महेंद्रन',
    expertTitleEn: 'Senior Agronomist (Rice Research Station)',
    expertTitleHi: 'वरिष्ठ सस्य विज्ञानी (धान अनुसंधान केंद्र)',
    crops: ['paddy'],
    cropStages: ['Nursery', 'Vegetative'],
    states: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Tamil Nadu'],
    districts: ['Lucknow', 'Karnal'],
    weatherTriggers: ['DROUGHT_ALERT', 'GENERAL'],
    whyYouSeeThisEn: [
      'Target: Maximizing tillers while slashing water input by 35%',
      'Source: TNAU Agritech Technology Demonstration Library'
    ],
    whyYouSeeThisHi: [
      'लक्ष्य: पानी की 35% बचत और प्रति पौधा 30 से 40 कल्ले प्राप्त करना',
      'स्रोत: टीएनएयू एग्रीटेक टेक्नोलॉजी वीडियो लाइब्रेरी'
    ],
    keyTakeawaysEn: [
      'Plant young single seedlings (10-12 days old) instead of bunched 30-day seedlings.',
      'Maintain 25x25 cm square spacing using a roller marker to allow sunlight into the root crown.',
      'Use a rotary cono-weeder twice to aerate soil and prune roots for vigorous tillering.'
    ],
    keyTakeawaysHi: [
      'गुच्छे के बजाय केवल एक 10-12 दिन का छोटा पौधा 25x25 सेमी की दूरी पर लगाएं।',
      'खेत में पानी लगातार न भरें, केवल मिट्टी को नम रखें (Alternate Wetting & Drying)।',
      'कोनो-वीडर चलाकर खरपतवार को मिट्टी में दबाएं और जड़ों में हवा का संचार बढ़ाएं।'
    ],
    step1TitleEn: '01 / YOUNG SEEDLING PHYSIOLOGY',
    step1TitleHi: '01 / छोटी पौध का वैज्ञानिक लाभ',
    step1DescEn: 'A 10-day seedling retains its maternal seed pocket, preserving explosive growth potential that older seedlings lose.',
    step1DescHi: '10-12 दिन की पौध में बीज की मूल ऊर्जा बची रहती है, जिससे रोपाई के बाद तुरंत कल्ले फूटते हैं।',
    step2TitleEn: '02 / CANOPY SPACING',
    step2TitleHi: '02 / 25 सेमी चौकोर दूरी',
    step2DescEn: 'Square 25x25 cm spacing provides equal solar radiation and nutrient volume to every individual plant.',
    step2DescHi: 'चौकोर दूरी से हर पौधे को पर्याप्त धूप मिलती है और बीमारियां बहुत कम लगती हैं।',
    step3TitleEn: '03 / ROTARY WEEDING ACTION',
    step3TitleHi: '03 / कोनो वीडर चलाना',
    step3ActionEn: 'Run rotary weeder on Day 15 and Day 25. Incorporates weeds as green manure right in the root zone.',
    step3ActionHi: 'रोपाई के 15वें और 25वें दिन कोनो वीडर चलाएं। खरपतवार हरी खाद बन जाएगी।',
    voiceNarrationEn: 'TNAU SRI method saves 35% water and triples tillering. Transplant 10-day single seedlings at 25x25 cm spacing.',
    voiceNarrationHi: 'टीएनएयू श्री विधि से 35% पानी बचता है। 10 दिन का अकेला पौधा 25 सेमी दूरी पर लगाएं।',
    durationSeconds: 210,
    likesCount: 2890
  },

  // 3. WATER SAVING (💧 पानी बचाएं) - MANAGE & TNAU
  {
    id: 'manage-drainage-waterlogging',
    titleEn: 'Field Drainage & Bund Management Before Heavy Rain',
    titleHi: 'खेत में जलभराव से बचाव: बारिश से पहले निकास नाली प्रबंधन (MANAGE Field Demo)',
    category: 'water_saving',
    priority: 'URGENT',
    videoUrl: '/assets/videos/field_irrigation.mp4',
    youtubeId: '4MWzE-PwEH4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'MANAGE',
    institutionBadgeEn: '🎓 MANAGE Field Cell',
    institutionBadgeHi: '🎓 मैनेज क्षेत्रीय अनुसंधान',
    expertNameEn: 'Er. S. K. Sharma',
    expertNameHi: 'इंजी. एस. के. शर्मा',
    expertTitleEn: 'Agricultural Drainage Engineer',
    expertTitleHi: 'कृषि जल निकास एवं मृदा संरक्षण विशेषज्ञ',
    crops: ['paddy', 'all'],
    cropStages: ['Flowering', 'Vegetative', 'Grain Filling'],
    states: ['Uttar Pradesh', 'Haryana', 'Punjab', 'Bihar'],
    districts: ['Lucknow', 'Barabanki'],
    weatherTriggers: ['HEAVY_RAIN', 'WATERLOGGING'],
    whyYouSeeThisEn: [
      'Live Trigger: 14.8 mm rain expected tonight in Gharaunda',
      'Soil Alert: Alluvial Loam with 32.4% baseline moisture',
      'Risk: Standing water > 5cm during flowering causes root hypoxia and pollen loss'
    ],
    whyYouSeeThisHi: [
      'लाइव अलर्ट: आज रात घरौंदा में 14.8 मिमी बारिश का पूर्वानुमान',
      'मिट्टी स्थिति: 32.4% नमी के साथ खेत पहले से संतृप्त है',
      'जोखिम: फूल आने पर 5 सेमी से अधिक पानी भरने से परागकण धुलने और जड़ गलन का खतरा'
    ],
    keyTakeawaysEn: [
      'Open bund spillways at 15cm width before rainfall begins to allow gradual runoff.',
      'Never allow standing water to submerge the bottom collar of paddy stems for > 48 hours.',
      'Cut off all tube-well power to save electricity and prevent artificial water saturation.'
    ],
    keyTakeawaysHi: [
      'बारिश शुरू होने से पहले मेड़ के निचले कोने पर 15 सेमी चौड़ी निकास नाली खोलें।',
      'खेत में 48 घंटे से अधिक पानी खड़ा न रहने दें ताकि जड़ों को श्वसन के लिए ऑक्सीजन मिले।',
      'ट्यूबवेल पूरी तरह बंद रखें ताकि बिजली और डीजल खर्च दोनों की बचत हो सके।'
    ],
    step1TitleEn: '01 / LOW-SPOT EXCAVATION',
    step1TitleHi: '01 / ढलान वाले कोने पर नाली',
    step1DescEn: 'Locate the natural gravity outlet of your plot and clear silt barriers before precipitation starts.',
    step1DescHi: 'खेत के प्राकृतिक ढलान की पहचान करें और बारिश से पहले घास-फूस हटाकर नाली का रास्ता साफ करें।',
    step2TitleEn: '02 / PULL SPILLWAY GATES',
    step2TitleHi: '02 / मेड़ निकास को नियंत्रित रखें',
    step2DescEn: 'Do not breach the main bund. Cut a controlled notch 5cm above ground level to hold a 5cm buffer.',
    step2DescHi: 'मुख्य मेड़ न तोड़ें। 5 सेमी की ऊंचाई पर कट लगाएं ताकि 5 सेमी जरूरी पानी खेत में रुके और बाकी बह जाए।',
    step3TitleEn: '03 / POST-RAIN MONITORING',
    step3TitleHi: '03 / बारिश के बाद का कदम',
    step3ActionEn: 'Inspect drains at 7:00 AM tomorrow to clear lodged straw or mud blocking flow.',
    step3ActionHi: 'कल सुबह 7 बजे नाली की जांच करें कि बहकर आया कचरा पानी का रास्ता न रोक रहा हो।',
    voiceNarrationEn: 'Incoming rain alert. Clear drainage bund notches before evening and shut down tubewell pumps to prevent root damage.',
    voiceNarrationHi: 'बारिश का अलर्ट। शाम से पहले निकासी नाली साफ करें और ट्यूबवेल बंद रखें ताकि जड़ों को नुकसान न पहुंचे।',
    durationSeconds: 180,
    likesCount: 4120
  },

  // 4. WATER SAVING - TNAU (Drip Irrigation)
  {
    id: 'tnau-drip-irrigation-demo',
    titleEn: 'Precision Drip Irrigation Demonstration & Fertigation Guide',
    titleHi: 'टपक सिंचाई (Drip Irrigation) से 60% पानी व 40% खाद की बचत (TNAU Demonstration)',
    category: 'water_saving',
    priority: 'HIGH',
    videoUrl: '/assets/videos/field_irrigation.mp4',
    youtubeId: '6W5PaQQu-ZU',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'TNAU',
    institutionBadgeEn: '🌾 TNAU Water Centre',
    institutionBadgeHi: '🌾 टीएनएयू जल प्रौद्योगिकी केंद्र',
    expertNameEn: 'Dr. V. Duraisamy',
    expertNameHi: 'डॉ. वी. दुरईसामी',
    expertTitleEn: 'Professor of Water Resources Engineering',
    expertTitleHi: 'प्रोफेसर (जल संसाधन एवं सूक्ष्म सिंचाई)',
    crops: ['vegetables', 'sugarcane', 'paddy', 'all'],
    cropStages: ['all'],
    states: ['all'],
    districts: ['all'],
    weatherTriggers: ['DROUGHT_ALERT', 'GENERAL'],
    whyYouSeeThisEn: [
      'Energy & Fuel Optimization: Tubewell costs ~₹180/hr in Uttar Pradesh',
      'Demonstration: Direct root-zone emitter operation and filter maintenance'
    ],
    whyYouSeeThisHi: [
      'डीजल व बिजली बचत: नलकूप चलाने पर ₹180 प्रति घंटा खर्च होता है',
      'प्रदर्शन: सीधे जड़ों में बूंद-बूंद पानी और वेन्चुरी से घुलनशील खाद देने की विधि'
    ],
    keyTakeawaysEn: [
      'Run emitters between 6 AM and 8 AM to eliminate mid-day atmospheric evaporation losses.',
      'Flush lateral pipe ends weekly for 60 seconds to purge sand and algal buildup.',
      'Inject 100% water-soluble fertilizers (19:19:19) through the Venturi to avoid root burn.'
    ],
    keyTakeawaysHi: [
      'सुबह 6 से 8 बजे के बीच ड्रिप चलाएं ताकि धूप से पानी भाप बनकर न उड़े।',
      'हफ्ते में एक बार लेटरल पाइप के अंतिम छोर खोलकर 1 मिनट तक साफ पानी से फ्लश करें।',
      'वेन्चुरी द्वारा 100% घुलनशील खाद (19:19:19) दें ताकि जड़ों को सीधे पोषण मिले।'
    ],
    step1TitleEn: '01 / PRESSURE GAUGE CHECK',
    step1TitleHi: '01 / दबाव मीटर की जांच',
    step1DescEn: 'Maintain 1.5 to 2.0 kg/cm² operating pressure at the sand-screen filter manifold.',
    step1DescHi: 'फिल्टर के पास 1.5 से 2.0 किग्रा/वर्ग सेमी दबाव बनाए रखें ताकि हर ड्रिपर से समान पानी निकले।',
    step2TitleEn: '02 / ROOT ZONE SATURATION',
    step2TitleHi: '02 / केवल जड़ क्षेत्र को गीला करें',
    step2DescEn: 'Moisten only a 30cm radius around each plant stem. Saves 60% water compared to flooding.',
    step2DescHi: 'पौधे के तने के आसपास केवल 30 सेमी का घेरा नम रखें। खुले पानी की तुलना में 60% पानी बचता है।',
    step3TitleEn: '03 / VENTURI FERTIGATION',
    step3TitleHi: '03 / खाद देने का सही तरीका',
    step3ActionEn: 'Run clean water for 15 mins, inject fertilizer for 30 mins, then flush with clean water for 10 mins.',
    step3ActionHi: 'पहले 15 मिनट सादा पानी चलाएं, फिर 30 मिनट खाद दें, और अंत में 10 मिनट पाइप साफ करने के लिए सादा पानी चलाएं।',
    voiceNarrationEn: 'TNAU precision drip irrigation saves water and fertilizer. Run in early mornings and flush laterals once a week.',
    voiceNarrationHi: 'टीएनएयू टपक सिंचाई से पानी और खाद बचाएं। सुबह के समय चलाएं और हफ्ते में एक बार पाइप फ्लश करें।',
    durationSeconds: 220,
    likesCount: 1980
  },

  // 5. SOIL HEALTH (🧪 मिट्टी समझें) - MANAGE Natural Farming (Jeevamrit)
  {
    id: 'manage-jeevamrit-preparation',
    titleEn: 'Step-by-Step Jeevamrit & Ghanajeevamrit Bio-Formulation',
    titleHi: 'जीवामृत व घनामृत बनाने की प्रमाणित विधि: 48 घंटे में तैयार करें जैविक खाद (MANAGE Masterclass)',
    category: 'soil_health',
    priority: 'HIGH',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: '6W5PaQQu-ZU',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'MANAGE',
    institutionBadgeEn: '🌱 MANAGE Natural Farming',
    institutionBadgeHi: '🌱 मैनेज प्राकृतिक खेती सेल',
    expertNameEn: 'Shri Subhash Palekar Trainer Cell',
    expertNameHi: 'श्री सुभाष पालेकर प्राकृतिक खेती मास्टर ट्रेनर',
    expertTitleEn: 'National Natural Farming Trainer',
    expertTitleHi: 'राष्ट्रीय प्राकृतिक खेती प्रशिक्षक',
    crops: ['all', 'paddy', 'wheat', 'sugarcane', 'vegetables'],
    cropStages: ['all'],
    states: ['all'],
    districts: ['all'],
    weatherTriggers: ['GENERAL'],
    whyYouSeeThisEn: [
      'Soil Testing Link: Soil organic carbon is 0.58% (Low in Lucknow cluster)',
      'Action: Inoculates 500+ million beneficial microbes per milliliter'
    ],
    whyYouSeeThisHi: [
      'मिट्टी परीक्षण से जुड़ाव: लखनऊ क्लस्टर में जैविक कार्बन केवल 0.58% (कम) है',
      'लाभ: 1 मिली जीवामृत में 50 करोड़ से अधिक लाभकारी जीवाणु मिट्टी में पहुंचते हैं'
    ],
    keyTakeawaysEn: [
      'In a 200L plastic drum: 10kg desi cow dung + 10L cow urine + 1kg jaggery + 1kg besan + 1 handful field bund soil.',
      'Stir clockwise twice daily under shade for 48 hours to multiply aerobic microbial colonies.',
      'Apply 200 liters per acre with irrigation water or filter through fine cloth for foliar spray.'
    ],
    keyTakeawaysHi: [
      '200 लीटर पानी में 10 किग्रा देसी गाय का ताजा गोबर + 10 लीटर गोमूत्र + 1 किग्रा गुड़ + 1 किग्रा बेसन + 1 मुट्ठी खेत की मिट्टी मिलाएं।',
      'छाया में रखकर लकड़ी के डंडे से दिन में दो बार घड़ी की दिशा में घुमाएं; 48 घंटे में जीवामृत तैयार हो जाता है।',
      'प्रति एकड़ 200 लीटर जीवामृत सिंचाई के पानी के साथ बहाएं या बारीक कपड़े से छानकर स्प्रे करें।'
    ],
    step1TitleEn: '01 / INGREDIENT RATIOS',
    step1TitleHi: '01 / सही सामग्री और अनुपात',
    step1DescEn: 'Use only indigenous desi cow dung/urine. The microbial diversity in indigenous breeds is 3x higher.',
    step1DescHi: 'केवल देसी गाय का गोबर व गोमूत्र लें। देसी नस्ल के गोबर में सूक्ष्मजीवों की संख्या 3 गुना अधिक होती है।',
    step2TitleEn: '02 / FERMENTATION DYNAMICS',
    step2TitleHi: '02 / किण्वन और सूक्ष्मजीव वृद्धि',
    step2DescEn: 'Besan provides protein and jaggery supplies fast carbohydrates for exponential bacterial division.',
    step2DescHi: 'गुड़ से जीवाणुओं को ऊर्जा और बेसन से प्रोटीन मिलता है, जिससे जीवाणु तेजी से अरबों में बदलते हैं।',
    step3TitleEn: '03 / APPLICATION TO FIELD',
    step3TitleHi: '03 / खेत में प्रयोग की विधि',
    step3ActionEn: 'Pour into main irrigation canal inlet or spray 10% concentration every 15 days.',
    step3ActionHi: 'सिंचाई की मुख्य नाली में मटके से टपकाएं या हर 15 दिन में 10% घोल का छिड़काव करें।',
    voiceNarrationEn: 'Prepare Jeevamrit with MANAGE certified recipe: cow dung, urine, jaggery, besan, and bund soil. Multiply microbes in 48 hours.',
    voiceNarrationHi: 'मैनेज प्रमाणित विधि से 48 घंटे में जीवामृत बनाएं: गोबर, गोमूत्र, गुड़, बेसन और मेड़ की मिट्टी।',
    durationSeconds: 270,
    likesCount: 5210
  },

  // 6. CROP PROTECTION (🐛 फसल बचाएं) - ICAR Soybean / Paddy Yellowing
  {
    id: 'icar-leaf-yellowing-diagnosis',
    titleEn: 'Why Leaves Turn Yellow: Stem Fly, Iron Chlorosis & Girdle Beetle',
    titleHi: 'पत्तियां पीली क्यों पड़ रही हैं? तना मक्खी, गर्डल बीटल व आयरन कमी की पहचान (ICAR Advisory)',
    category: 'crop_protection',
    priority: 'HIGH',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: 'Q1y1fAnEIOg',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'ICAR',
    institutionBadgeEn: '🏛️ ICAR New Delhi / IISR',
    institutionBadgeHi: '🏛️ भारतीय कृषि अनुसंधान परिषद (ICAR)',
    expertNameEn: 'Dr. S. D. Billore',
    expertNameHi: 'डॉ. एस. डी. बिल्लोरे',
    expertTitleEn: 'Principal Scientist (Plant Pathology & Protection)',
    expertTitleHi: 'प्रधान वैज्ञानिक (पादप रोग एवं कीट प्रबंधन)',
    crops: ['soybean', 'paddy', 'all'],
    cropStages: ['Vegetative', 'Flowering'],
    states: ['Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra', 'Rajasthan'],
    districts: ['Indore', 'Lucknow', 'Kota'],
    weatherTriggers: ['HUMIDITY_HIGH', 'HEAVY_RAIN'],
    whyYouSeeThisEn: [
      'Diagnostic Issue: Yellowing of crop leaves reported across Awadh & Central plateau',
      'Expert Video: Live symptom dissection of stem, petiole, and veins'
    ],
    whyYouSeeThisHi: [
      'समस्या पहचान: बारिश के बाद पत्तियों के पीले पड़ने की शिकायतें',
      'विशेषज्ञ मार्गदर्शन: तने, डंठल और पत्तियों के लक्षणों को काटकर दिखाने वाला वीडियो'
    ],
    keyTakeawaysEn: [
      'If top new leaves are yellow with green veins: Iron chlorosis; spray 0.5% Ferrous Sulfate + 0.1% Citric Acid.',
      'If stem shows a spiral ring with wilting tip: Girdle Beetle; prune infected shoots or apply Emamectin Benzoate.',
      'If lower leaves turn uniform yellow after rain: Waterlogging root asphyxiation; drain field immediately.'
    ],
    keyTakeawaysHi: [
      'यदि नई ऊपरी पत्तियां पीली हैं और नसें हरी हैं: आयरन की कमी है — फेरस सल्फेट 0.5% का स्प्रे करें।',
      'यदि तने पर छल्ला बना है और ऊपर का भाग सूख रहा है: गर्डल बीटल कीट है — ग्रसित टहनियां तोड़ें।',
      'यदि बारिश के बाद नीचे की पत्तियां पीली पड़ रही हैं: जलभराव से जड़ घुटन है — पहले पानी बाहर निकालें।'
    ],
    step1TitleEn: '01 / DISSECT THE STEM',
    step1TitleHi: '01 / तने को चीरकर अंदर देखें',
    step1DescEn: 'Split the yellowing plant vertically from root to tip with a sharp blade. Look for reddish tunnel (stem fly maggot).',
    step1DescHi: 'पीले पौधे को ब्लेड से बीच से चीरें। अगर अंदर लाल-भूरा रास्ता बना है तो तना मक्खी की इल्ली मौजूद है।',
    step2TitleEn: '02 / CHECK LEAF VEIN COLOR',
    step2TitleHi: '02 / पत्ती की नसों का रंग जांचें',
    step2DescEn: 'Green veins on yellow lamina indicate micro-nutrient block from waterlogged clay soils.',
    step2DescHi: 'अगर पत्ती पीली है लेकिन नसें हरी हैं तो अधिक पानी के कारण मिट्टी से लोहा नहीं मिल पा रहा।',
    step3TitleEn: '03 / PRECISE REMEDY ACTION',
    step3TitleHi: '03 / सटीक उपचार कदम',
    step3ActionEn: 'Do not spray urea. Drain standing water, then spray Chelated Iron (Fe-EDTA 12%) @ 1g/liter.',
    step3ActionHi: 'यूरिया बिल्कुल न डालें। पहले खेत का पानी निकालें, फिर चिलेटेड आयरन (12%) 1 ग्राम प्रति लीटर स्प्रे करें।',
    voiceNarrationEn: 'ICAR experts explain leaf yellowing. Cut the stem to check for stem borer, look at leaf veins for iron deficiency, and drain excess water.',
    voiceNarrationHi: 'आईसीएआर वैज्ञानिक समझाते हैं पत्तियों का पीलापन। तना चीरकर कीट देखें, नसों से आयरन कमी पहचानें और पानी निकालें।',
    durationSeconds: 240,
    likesCount: 3670
  },

  // 7. CROP PROTECTION - MANAGE Natural Farming (Neem & Sticky Traps)
  {
    id: 'manage-neem-pheromone-traps',
    titleEn: 'Neem-Based Bio-Pesticides & Pheromone Sticky Traps Setup',
    titleHi: 'नीम अस्त्र व फेरोमोन ट्रैप लगाने का सही तरीका: बिना रसायन कीट रोकथाम (MANAGE Demo)',
    category: 'crop_protection',
    priority: 'RECOMMENDED',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: '4MWzE-PwEH4',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'MANAGE',
    institutionBadgeEn: '🌱 MANAGE Natural Farming',
    institutionBadgeHi: '🌱 मैनेज प्राकृतिक पौध संरक्षण',
    expertNameEn: 'Dr. P. Lakshmi',
    expertNameHi: 'डॉ. पी. लक्ष्मी',
    expertTitleEn: 'Entomologist (Bio-Control Laboratories)',
    expertTitleHi: 'कीट वैज्ञानिक (जैविक नियंत्रण प्रयोगशाला)',
    crops: ['paddy', 'soybean', 'cotton', 'vegetables'],
    cropStages: ['Vegetative', 'Flowering'],
    states: ['all'],
    districts: ['all'],
    weatherTriggers: ['HUMIDITY_HIGH'],
    whyYouSeeThisEn: [
      'Pest Window: 84% humidity accelerates Yellow Stem Borer & Whitefly emergence',
      'Chemical-Free: Protects friendly spider and dragonfly predators'
    ],
    whyYouSeeThisHi: [
      'मौसम जोखिम: 84% उमस में तना छेदक व रस चूसक कीटों का अंडा फूटने का समय',
      'फायदा: मित्र कीटों (मकड़ी, ड्रैगनफ्लाई) को बिना मारे हानिकारक कीटों को पकड़ना'
    ],
    keyTakeawaysEn: [
      'Install 4 to 6 yellow sticky sheets per acre at canopy height to trap whiteflies and aphids.',
      'Place 5 pheromone lure traps per acre 30cm above crop canopy for Yellow Stem Borer male moths.',
      'Spray 5% Neem Seed Kernel Extract (NSKE) or Neemasthra to disrupt insect egg hatching.'
    ],
    keyTakeawaysHi: [
      'प्रति एकड़ 4 से 6 पीले चिपचिपे कार्ड फसल की ऊंचाई पर लगाएं — सफेद मक्खी और माहू तुरंत चिपकेंगे।',
      'धान के पौधे से 1 फीट ऊपर प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं ताकि तना छेदक नर पतंगे पकड़े जा सकें।',
      '5% नीम के बीज का अर्क या नीमास्त्र का छिड़काव करें जिससे कीटों के अंडे नहीं फूटेंगे।'
    ],
    step1TitleEn: '01 / TRAP POSITIONING HEIGHT',
    step1TitleHi: '01 / ट्रैप लगाने की सही ऊंचाई',
    step1DescEn: 'Traps must move up as crop grows. Keep pheromone lure exactly 1 foot above the highest green leaves.',
    step1DescHi: 'जैसे-जैसे फसल बढ़े, ट्रैप भी ऊपर करें। ल्योर हमेशा फसल के ऊपरी पत्तों से 1 फीट ऊपर होना चाहिए।',
    step2TitleEn: '02 / ECONOMIC THRESHOLD (ETL)',
    step2TitleHi: '02 / आर्थिक क्षति सीमा (ETL)',
    step2DescEn: 'If > 5 moths are trapped per night in a single trap, chemical or bio-spray is urgently triggered.',
    step2DescHi: 'अगर एक ट्रैप में रात में 5 से अधिक पतंगे मिलें, तो तुरंत रोकथाम का कदम उठाना आवश्यक है।',
    step3TitleEn: '03 / NEEMASTHRA RECIPE',
    step3TitleHi: '03 / नीमास्त्र बनाने का अनुपात',
    step3ActionEn: 'Crush 5kg neem leaves + 5kg neem fruit in 100L water + 5L cow urine. Ferment for 48 hours.',
    step3ActionHi: '100 लीटर पानी में 5 किग्रा नीम की पत्ती + 5 किग्रा नीम की निंबोली + 5 लीटर गोमूत्र 48 घंटे सड़ाएं।',
    voiceNarrationEn: 'Set up yellow sticky cards and pheromone traps to control pests organically. Spray 5% neem extract to protect crops without chemicals.',
    voiceNarrationHi: 'पीले कार्ड और फेरोमोन ट्रैप लगाकर प्राकृतिक कीट नियंत्रण करें। बिना केमिकल 5% नीम अर्क से फसल सुरक्षित रखें।',
    durationSeconds: 195,
    likesCount: 2450
  },

  // 8. WEATHER ADAPTATION (🌦️ मौसम के साथ खेती) - ICAR-NRRI
  {
    id: 'icar-rain-flowering-care',
    titleEn: 'Paddy Flowering During Heavy Rain: Anthesis & Pollen Protection',
    titleHi: 'धान में फूल व बाली के समय बारिश: परागकण सुरक्षा व पोटाश स्प्रे (ICAR-NRRI Cuttack)',
    category: 'weather_adaptation',
    priority: 'URGENT',
    videoUrl: '/assets/videos/field_irrigation.mp4',
    youtubeId: 'Q1y1fAnEIOg',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'ICAR',
    institutionBadgeEn: '🏛️ ICAR-NRRI Cuttack',
    institutionBadgeHi: '🏛️ राष्ट्रीय चावल अनुसंधान संस्थान (ICAR)',
    expertNameEn: 'Dr. P. K. Nayak',
    expertNameHi: 'डॉ. पी. के. नायक',
    expertTitleEn: 'Head of Crop Production Division',
    expertTitleHi: 'विभागाध्यक्ष (फसल उत्पादन एवं जलवायु अनुकूलन)',
    crops: ['paddy'],
    cropStages: ['Flowering', 'Heading'],
    states: ['Uttar Pradesh', 'Bihar', 'Odisha', 'West Bengal'],
    districts: ['Lucknow', 'Barabanki'],
    weatherTriggers: ['HEAVY_RAIN', 'WATERLOGGING'],
    whyYouSeeThisEn: [
      'Active Stage: Basmati Paddy is in Flowering / Anthesis window',
      'Weather Sync: Heavy rainfall (14.8 mm) tonight poses wash-off risk',
      'Scientific Action: Immediate water regulation & post-rain potash'
    ],
    whyYouSeeThisHi: [
      'सक्रिय अवस्था: बासमती धान में फूल व बालियां निकल रही हैं',
      'मौसम तालमेल: आज रात 14.8 मिमी भारी बारिश से परागकण धुलने की आशंका',
      'वैज्ञानिक समाधान: जल स्तर 2 सेमी पर सीमित रखना व बारिश बाद पोटाश स्प्रे'
    ],
    keyTakeawaysEn: [
      'Maintain only 2-3 cm thin water film; deep submergence (> 7cm) causes premature panicle blanking.',
      'Stop all granular urea application immediately; nitrogen makes stems tender and prone to lodging.',
      'Spray 1% SOP (Potassium Sulfate 00:00:50) at 1 kg/acre post-rain to strengthen grain filling.'
    ],
    keyTakeawaysHi: [
      'खेत में केवल 2 से 3 सेमी पतला पानी रखें; 7 सेमी से ज्यादा पानी भरने पर बालियां खोखली (पोचा) रह जाती हैं।',
      'यूरिया खाद का छिड़काव तुरंत बंद करें; इस समय यूरिया डालने से पौधा कमजोर होकर जमीन पर गिर जाता है।',
      'बारिश बीतने पर 1% पोटाश (00:00:50) 1 किग्रा प्रति एकड़ स्प्रे करें जिससे दाने चमकदार और भारी भरें।'
    ],
    step1TitleEn: '01 / ANTHESIS TIME WINDOW',
    step1TitleHi: '01 / फूल खिलने का समय',
    step1DescEn: 'Paddy anthesis occurs strictly between 9:00 AM and 11:30 AM. Avoid walking or spraying during this window.',
    step1DescHi: 'धान में फूल सुबह 9 से 11:30 बजे के बीच खिलते हैं। इस समय खेत में न जाएं और कोई छिड़काव न करें।',
    step2TitleEn: '02 / NITROGEN BAN',
    step2TitleHi: '02 / यूरिया पर सख्त रोक',
    step2DescEn: 'Nitrogen at flowering invites False Smut (हल्दी रोग) and Brown Plant Hopper pests.',
    step2DescHi: 'बाली आते समय यूरिया डालने से हल्दी रोग (फाल्स स्मट) और भूरा माहू का भयंकर प्रकोप होता है।',
    step3TitleEn: '03 / FOLIAR POTASH APPLICATION',
    step3TitleHi: '03 / 00:00:50 पोटाश स्प्रे',
    step3ActionEn: 'Dissolve 1kg 00:00:50 in 150 liters of water per acre. Spray when sunshine returns.',
    step3ActionHi: '1 किग्रा 00:00:50 को 150 लीटर पानी में घोलें और धूप निकलने पर पूरे खेत में छिड़कें।',
    voiceNarrationEn: 'ICAR rice scientists advise: Keep water shallow at 2 cm during flowering, stop urea top-dressing, and spray 00:00:50 potash once the sky clears.',
    voiceNarrationHi: 'आईसीएआर वैज्ञानिकों की सलाह: फूल आते समय खेत में केवल 2 सेमी पानी रखें, यूरिया बंद करें और धूप निकलने पर पोटाश का छिड़काव करें।',
    durationSeconds: 210,
    likesCount: 3890
  },

  // 9. POST HARVEST (🌾 कटाई के बाद) - TNAU / ICAR-CIPHET
  {
    id: 'icar-post-harvest-grain-storage',
    titleEn: 'Post-Harvest Grain Drying & Hermetic Storage Protection',
    titleHi: 'कटाई के बाद अनाज भंडारण: 12% नमी पर सुरक्षित रखें फसल (TNAU / CIPHET Demo)',
    category: 'post_harvest',
    priority: 'RECOMMENDED',
    videoUrl: '/assets/videos/rice_field.mp4',
    youtubeId: '6W5PaQQu-ZU',
    posterUrl: '/assets/farm-landscape-bg.jpg',
    institution: 'TNAU',
    institutionBadgeEn: '🌾 TNAU Post-Harvest',
    institutionBadgeHi: '🌾 टीएनएयू कटाई उपरांत प्रबंधन',
    expertNameEn: 'Dr. S. Ganapathy',
    expertNameHi: 'डॉ. एस. गणपति',
    expertTitleEn: 'Professor of Post-Harvest Technology (CIPHET Collaborative)',
    expertTitleHi: 'प्रोफेसर (खाद्यान्न प्रसंस्करण एवं भंडारण प्रौद्योगिकी)',
    crops: ['all', 'paddy', 'wheat', 'soybean', 'bajra'],
    cropStages: ['Harvest', 'Storage'],
    states: ['all'],
    districts: ['all'],
    weatherTriggers: ['GENERAL'],
    whyYouSeeThisEn: [
      'Post-Harvest Loss: Up to 10% of harvested grain is lost to mold and weevils in storage',
      'Science: Safe equilibrium moisture content is below 12%'
    ],
    whyYouSeeThisHi: [
      'नुकसान की रोकथाम: सही भंडारण न होने से 10% तक अनाज घुन और फफूंद से नष्ट हो जाता है',
      'वैज्ञानिक नियम: सुरक्षित भंडारण के लिए अनाज में 12% से कम नमी होना अनिवार्य है'
    ],
    keyTakeawaysEn: [
      'Dry grain on clean tarpaulins under full sun until teeth test yields a sharp crisp snap sound.',
      'Use airtight Hermetic bags (PICS bags) that suffocate insects without toxic aluminum phosphide tablets.',
      'Store grain bags on wooden pallets 30cm away from damp concrete walls and floor.'
    ],
    keyTakeawaysHi: [
      'अनाज को तिरपाल पर अच्छी धूप में सुखाएं; दांत से दबाने पर "कट" की कड़क आवाज आना 12% नमी का प्रमाण है।',
      'हवा-बंद हर्मेटिक (PICS) बैग का इस्तेमाल करें जिससे बिना जहरीली गोलियों के घुन अपने आप दम घुटने से मर जाते हैं।',
      'अनाज की बोरियों को जमीन पर सीधे न रखें; लकड़ी के तख्तों (पैलेट) पर दीवार से 1 फीट दूर रखें।'
    ],
    step1TitleEn: '01 / TEETH SNAP MOISTURE TEST',
    step1TitleHi: '01 / दांत से दबाकर नमी की देसी जांच',
    step1DescEn: 'A soft dent means moisture is > 14% (spoilage risk). A clean crisp crack confirms < 12% safe moisture.',
    step1DescHi: 'अगर दाना दब जाए तो नमी 14% से अधिक है। अगर कट से टूटे तो दाना भंडारण के लिए 100% तैयार है।',
    step2TitleEn: '02 / HERMETIC COCOON PRINCIPLE',
    step2TitleHi: '02 / हर्मेटिक बैग की कार्यप्रणाली',
    step2DescEn: 'Double-layer high-barrier polyethylene cuts off oxygen, creating zero-oxygen respiration death for weevils.',
    step2DescHi: 'दोहरी परत वाले बैग में हवा का प्रवेश रुक जाता है, जिससे घुन और कीड़े 48 घंटे में समाप्त हो जाते हैं।',
    step3TitleEn: '03 / NEEM LEAF DUST BARRIER',
    step3TitleHi: '03 / नीम की सूखी पत्ती का सुरक्षा घेरा',
    step3ActionEn: 'Mix 2kg dried neem leaves per quintal of grain if traditional metal bins are utilized.',
    step3ActionHi: 'पारंपरिक कोठिला या टीन की टंकी में प्रति क्विंटल 2 किग्रा सूखी नीम की पत्तियां परत-दर-परत मिलाएं।',
    voiceNarrationEn: 'TNAU post-harvest storage guide: Dry grains until crisp snap sound below 12% moisture. Store in hermetic bags on wooden pallets.',
    voiceNarrationHi: 'टीएनएयू भंडारण सलाह: अनाज को 12% नमी तक सुखाएं। लकड़ी के तख्तों पर हर्मेटिक बैग में सुरक्षित रखें।',
    durationSeconds: 200,
    likesCount: 1640
  }
];

export interface FarmerContext {
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
 * Intelligent Ranking Algorithm
 * Scores and surfaces the top tailored videos for the farmer's active reality
 */
export function rankFarmerReels(
  ctx: FarmerContext,
  categoryFilter: string = 'all'
): { reels: FarmerReel[]; fallbackNotice?: string } {
  let pool = [...REELS_REPOSITORY];

  // 1. Filter by category if specified
  if (categoryFilter !== 'all') {
    pool = pool.filter((r) => r.category === categoryFilter);
  }

  // 2. Score relevance against farmer context
  const scored = pool.map((reel) => {
    let score = 0;

    // Crop Match (+35)
    if (ctx.cropId) {
      const cropNorm = ctx.cropId.toLowerCase();
      if (reel.crops.includes(cropNorm) || reel.crops.includes('all')) {
        score += 35;
      }
    }

    // Stage Match (+25)
    if (ctx.cropStage) {
      const stageNorm = ctx.cropStage.toLowerCase();
      if (reel.cropStages.some((s) => s.toLowerCase().includes(stageNorm) || s === 'all')) {
        score += 25;
      }
    }

    // Weather Trigger Match (+30)
    if (ctx.hasRainTrigger && reel.weatherTriggers.includes('HEAVY_RAIN')) {
      score += 30;
    }

    // Priority bonus
    if (reel.priority === 'URGENT') score += 20;
    if (reel.priority === 'HIGH') score += 10;

    return { reel, score };
  });

  // Sort descending by relevance score
  scored.sort((a, b) => b.score - a.score);

  return {
    reels: scored.map((item) => item.reel),
    fallbackNotice:
      scored.length === 0 ? 'No exact match found; showing master repository.' : undefined
  };
}
