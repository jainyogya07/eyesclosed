import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronUp,
  ChevronDown,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Sparkles,
  Sprout,
  Play,
  Pause,
  Info,
  ArrowRight,
  Camera,
  Upload,
  X,
  ShieldCheck,
  Layers,
  Tv,
  Check,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { rankFarmerReels, FarmerReel, REELS_REPOSITORY } from '../services/videoRecommendationEngine';

export const LearnPage: React.FC = () => {
  const { farm, playVoice, stopVoice, isSpeaking } = useFarm();
  const { language, location } = useApp();
  const en = language === 'en';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeStepTab, setActiveStepTab] = useState<'takeaways' | 'what' | 'why' | 'action'>('takeaways');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [useYoutubePlayer, setUseYoutubePlayer] = useState<boolean>(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [understoodReels, setUnderstoodReels] = useState<Record<string, boolean>>({});
  const [appliedReels, setAppliedReels] = useState<Record<string, boolean>>({});
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);
  const [appliedToast, setAppliedToast] = useState<string | null>(null);

  // Photo Diagnosis Modal
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState<boolean>(false);
  const [photoDiagnosisResult, setPhotoDiagnosisResult] = useState<any | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 6 User-specified learning categories
  const categories = [
    { id: 'all', icon: '🌟', labelEn: 'All Recommended', labelHi: '🌟 सभी सिफारिशें' },
    { id: 'sowing_nursery', icon: '🌱', labelEn: 'Sowing & Nursery', labelHi: '🌱 फसल लगाएं' },
    { id: 'water_saving', icon: '💧', labelEn: 'Water Saving & Drip', labelHi: '💧 पानी बचाएं' },
    { id: 'soil_health', icon: '🧪', labelEn: 'Soil & Jeevamrit', labelHi: '🧪 मिट्टी समझें' },
    { id: 'crop_protection', icon: '🐛', labelEn: 'Crop Protection & Pests', labelHi: '🐛 फसल बचाएं' },
    { id: 'weather_adaptation', icon: '🌦️', labelEn: 'Weather Adaptation', labelHi: '🌦️ मौसम के साथ खेती' },
    { id: 'post_harvest', icon: '🌾', labelEn: 'Post-Harvest & Storage', labelHi: '🌾 कटाई के बाद' }
  ];

  // Get ranked reels based on farmer's live context
  const { reels, fallbackNotice } = rankFarmerReels(
    {
      panchayatName: farm.isConfigured ? farm.panchayat.name : location.panchayatName,
      district: farm.isConfigured ? farm.panchayat.district : location.district,
      state: farm.isConfigured ? farm.panchayat.state : location.state,
      cropId: farm.isConfigured ? farm.crop.id : 'paddy',
      cropName: farm.isConfigured ? (farm.crop.nameEn || farm.crop.nameHi) : 'Paddy (Basmati)',
      cropStage: farm.isConfigured ? farm.crop.stage : 'Flowering',
      soilType: farm.isConfigured ? farm.soil.type : 'Sandy Loam',
      hasRainTrigger: true
    },
    activeCategory
  );

  const currentReel: FarmerReel | undefined = reels[currentIndex] || reels[0];

  useEffect(() => {
    setActiveStepTab('takeaways');
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentIndex, activeCategory]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  const lastWheelTime = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    if (e.deltaY > 18) {
      lastWheelTime.current = now;
      handleNext();
    } else if (e.deltaY < -18) {
      lastWheelTime.current = now;
      handlePrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  // Keyboard navigation for reels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === ' ' && !useYoutubePlayer) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length, isPlaying, useYoutubePlayer]);

  const handleListen = () => {
    if (!currentReel) return;
    if (isSpeaking) {
      stopVoice();
      return;
    }
    const textToSpeak = en
      ? `${currentReel.titleEn}. Three key things to remember: First, ${currentReel.keyTakeawaysEn[0]}. Second, ${currentReel.keyTakeawaysEn[1]}. Third, ${currentReel.keyTakeawaysEn[2]}.`
      : `${currentReel.titleHi}। तीन बातें याद रखें: पहली बात, ${currentReel.keyTakeawaysHi[0]}। दूसरी बात, ${currentReel.keyTakeawaysHi[1]}। तीसरी बात, ${currentReel.keyTakeawaysHi[2]}।`;
    playVoice(textToSpeak);
  };

  const handleLike = (id: string) => {
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id: string) => {
    setSavedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUnderstood = (id: string) => {
    setUnderstoodReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyToFarm = (reel: FarmerReel) => {
    setAppliedReels((prev) => ({ ...prev, [reel.id]: true }));
    const msg = en
      ? `Action added to today's farm plan: ${reel.step3ActionEn}`
      : `आज के खेत कार्य में जोड़ा गया: ${reel.step3ActionHi}`;
    setAppliedToast(msg);
    setTimeout(() => setAppliedToast(null), 3500);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Simulate Photo Diagnosis
  const handleTriggerPhotoAnalysis = () => {
    setAnalyzingPhoto(true);
    setTimeout(() => {
      setAnalyzingPhoto(false);
      setPhotoDiagnosisResult({
        diagnosisHi: 'पीलापन: आयरन की कमी (Iron Chlorosis) + प्रारंभिक जलभराव जड़ घुटन',
        diagnosisEn: 'Symptom: Iron Chlorosis accompanied by root hypoxia from soil saturation',
        confidence: '94.2%',
        immediateActionHi: 'खेत की निकास नाली तुरंत खोलें। 48 घंटे बाद चिलेटेड आयरन (Fe-EDTA 12%) 1 ग्राम/लीटर का पर्णीय छिड़काव करें। यूरिया कतई न डालें।',
        immediateActionEn: 'Open drainage bund notch immediately. Post-drainage, foliar spray Chelated Iron (12%) @ 1g/L. Strictly withhold urea.',
        expertSource: 'ICAR Soybean & Paddy Health Advisory Cell'
      });
    }, 1800);
  };

  if (!currentReel) return null;

  return (
    <div
      className="kisan-shorts-page"
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.25rem 1rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Banner: Context & 3D Twin Link */}
      <div style={{ width: '100%', maxWidth: '640px', marginBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 6px rgba(5,150,105,0.3)'
                }}
              >
                🎓 KISAN VIGYAN VIDEO FEED
              </span>
              <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>
                {en ? 'MANAGE · ICAR · TNAU Verified' : 'प्रमाणित कृषि प्रशिक्षण वीडियो'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '4px 0 0' }}>
              {en ? 'Learn: Practical Farm Demonstrations' : 'सीखें: खेत पर व्यावहारिक प्रशिक्षण'}
            </h1>
          </div>

          {/* Quick link to 3D Digital Twin */}
          <Link
            to="/digital-twin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#090d16',
              color: '#38bdf8',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              fontSize: '0.74rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={13} color="#38bdf8" />
            <span>{en ? '3D Digital Twin 🎮' : '3D डिजिटल ट्विन 🎮'}</span>
          </Link>
        </div>

        {/* Dynamic Context Card: Live Risk -> Video Connection */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
            border: '1.5px solid #a7f3d0',
            borderRadius: '16px',
            padding: '10px 14px',
            marginBottom: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 800, color: '#065f46' }}>
              <Sprout size={14} color="#059669" />
              <span>{en ? 'Live Recommendation Logic' : 'स्मार्ट वीडियो चयन का आधार'}:</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, background: '#ffffff', padding: '2px 8px', borderRadius: '999px', border: '1px solid #bae6fd' }}>
              📍 {farm.isConfigured ? (en ? farm.panchayat.name : farm.panchayat.hi) : location.panchayatName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#334155', flexWrap: 'wrap' }}>
            <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
              🌾 {en ? 'Paddy (Basmati)' : 'धान (बासमती)'}
            </span>
            <span style={{ color: '#94a3b8' }}>→</span>
            <span style={{ background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
              🌱 {en ? 'Nursery / Flowering' : 'नर्सरी व फूल अवस्था'}
            </span>
            <span style={{ color: '#94a3b8' }}>→</span>
            <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '6px', border: '1px solid #fecaca', fontWeight: 800 }}>
              🌧️ 14.8mm Rain / 32% Saturation
            </span>
            <span style={{ color: '#94a3b8' }}>→</span>
            <span style={{ color: '#059669', fontWeight: 800 }}>
              {en ? '3 Matching Teaching Videos' : '3 सटीक प्रशिक्षण वीडियो'}
            </span>
          </div>
        </div>

        {/* 6 Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setCurrentIndex(0);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected ? '#059669' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#334155',
                  border: isSelected ? '1.5px solid #047857' : '1.5px solid #cbd5e1',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 10px rgba(5,150,105,0.3)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {en ? cat.labelEn : cat.labelHi}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Reels Vertical Player Container */}
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          height: '750px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#090d16',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
          border: '2px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* VIDEO SURFACE: YouTube Embed OR MP4 Video Fallback */}
        {useYoutubePlayer && currentReel.youtubeId ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <iframe
              key={currentReel.id + '-yt'}
              title={currentReel.titleHi}
              src={`https://www.youtube-nocookie.com/embed/${currentReel.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&modestbranding=1&playsinline=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            key={currentReel.id + '-mp4'}
            src={currentReel.videoUrl}
            poster={currentReel.posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
              target.play().catch(() => {});
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer'
            }}
          />
        )}

        {/* Semi-transparent Gradient Overlay for Legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 28%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />

        {/* Top Header Inside Reel */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {/* Progress Segment Indicator */}
          <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
            {reels.map((_, idx) => (
              <div
                key={idx}
                style={{
                  height: '3.5px',
                  flex: 1,
                  background: idx === currentIndex ? '#10b981' : 'rgba(255, 255, 255, 0.35)',
                  borderRadius: '999px',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Top Bar Badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '3px 9px',
                  borderRadius: '999px',
                  letterSpacing: '0.03em',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {en ? currentReel.institutionBadgeEn : currentReel.institutionBadgeHi}
              </span>

              <span
                style={{
                  background:
                    currentReel.priority === 'URGENT'
                      ? 'rgba(239, 68, 68, 0.9)'
                      : 'rgba(245, 158, 11, 0.9)',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px'
                }}
              >
                {currentReel.priority === 'URGENT' ? '🚨 URGENT' : '⭐ RECOMMENDED'}
              </span>
            </div>

            {/* Video Mode Switcher (YouTube / Direct MP4) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setUseYoutubePlayer(!useYoutubePlayer)}
                title={useYoutubePlayer ? 'Switch to Quick Stream' : 'Switch to Official YouTube Stream'}
                style={{
                  background: useYoutubePlayer ? '#ef4444' : 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Tv size={11} />
                <span>{useYoutubePlayer ? 'YouTube HD' : 'Direct MP4'}</span>
              </button>

              <span
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                {currentIndex + 1}/{reels.length}
              </span>
            </div>
          </div>

          {/* Expert Presenter Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: '#e2e8f0', fontWeight: 700 }}>
              👨🔬 {en ? currentReel.expertNameEn : currentReel.expertNameHi}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>
              {en ? currentReel.expertTitleEn : currentReel.expertTitleHi}
            </span>
          </div>
        </div>

        {/* Right Floating Action Bar (Reel Controls) */}
        <div
          style={{
            position: 'absolute',
            right: 12,
            bottom: 110,
            zIndex: 35,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center'
          }}
        >
          {/* Scroll Up / Previous Reel Button */}
          <button
            type="button"
            onClick={handlePrev}
            title={en ? 'Previous (Scroll Up)' : 'पिछला वीडियो (ऊपर)'}
            style={{
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronUp size={22} />
          </button>

          {/* Scroll Down / Next Reel Button */}
          <button
            type="button"
            onClick={handleNext}
            title={en ? 'Next (Scroll Down)' : 'अगला वीडियो (नीचे)'}
            style={{
              background: '#059669',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.5)',
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronDown size={22} />
          </button>

          {/* Sound Mute/Unmute */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} color="#10b981" />}
          </button>

          {/* Like Button */}
          <button
            type="button"
            onClick={() => handleLike(currentReel.id)}
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: likedReels[currentReel.id] ? '#ef4444' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Heart size={18} fill={likedReels[currentReel.id] ? '#ef4444' : 'none'} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>
              {currentReel.likesCount + (likedReels[currentReel.id] ? 1 : 0)}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => handleSave(currentReel.id)}
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: savedReels[currentReel.id] ? '#f59e0b' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={18} fill={savedReels[currentReel.id] ? '#f59e0b' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Bottom Educational & Decision Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 74px 16px 16px',
            zIndex: 30,
            color: '#ffffff'
          }}
        >
          {/* Reason Badge: Why You're Seeing This */}
          <div style={{ marginBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setShowWhyModal(!showWhyModal)}
              style={{
                background: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '999px',
                padding: '3px 10px',
                color: '#a7f3d0',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={11} />
              <span>{en ? 'Why You See This Video' : 'यह वीडियो आपके लिए क्यों?'}</span>
              <Info size={11} />
            </button>

            {/* Why Modal Popup */}
            <AnimatePresence>
              {showWhyModal && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    marginTop: '6px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '0.74rem',
                    color: '#e2e8f0',
                    lineHeight: 1.4
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
                    {en ? 'Personalized Match with Active Farm' : 'आपके खेत व आज के मौसम से सीधा संबंध'}
                  </div>
                  {(en ? currentReel.whyYouSeeThisEn : currentReel.whyYouSeeThisHi).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '3px 0' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video Title */}
          <h2 style={{ fontSize: '1.05rem', fontWeight: 900, margin: '0 0 10px', lineHeight: 1.35 }}>
            {en ? currentReel.titleEn : currentReel.titleHi}
          </h2>

          {/* "सीखें → देखें → अपने खेत पर लागू करें" Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '5px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              padding: '3px',
              borderRadius: '10px',
              marginBottom: '10px'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveStepTab('takeaways')}
              style={{
                flex: 1.3,
                padding: '5px 0',
                borderRadius: '7px',
                border: 'none',
                background: activeStepTab === 'takeaways' ? '#059669' : 'transparent',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {en ? '💡 3 KEY TAKEAWAYS' : '💡 3 बातें याद रखें'}
            </button>
            <button
              type="button"
              onClick={() => setActiveStepTab('what')}
              style={{
                flex: 1,
                padding: '5px 0',
                borderRadius: '7px',
                border: 'none',
                background: activeStepTab === 'what' ? '#ffffff' : 'transparent',
                color: activeStepTab === 'what' ? '#0f172a' : '#cbd5e1',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {en ? '01 / WHAT' : '01 / स्थिति'}
            </button>
            <button
              type="button"
              onClick={() => setActiveStepTab('why')}
              style={{
                flex: 1,
                padding: '5px 0',
                borderRadius: '7px',
                border: 'none',
                background: activeStepTab === 'why' ? '#ffffff' : 'transparent',
                color: activeStepTab === 'why' ? '#0f172a' : '#cbd5e1',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {en ? '02 / WHY' : '02 / कारण'}
            </button>
            <button
              type="button"
              onClick={() => setActiveStepTab('action')}
              style={{
                flex: 1.1,
                padding: '5px 0',
                borderRadius: '7px',
                border: 'none',
                background: activeStepTab === 'action' ? '#38bdf8' : 'transparent',
                color: activeStepTab === 'action' ? '#0f172a' : '#cbd5e1',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {en ? '03 / ACTION' : '03 / खेत पर'}
            </button>
          </div>

          {/* Interactive Content Card */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              lineHeight: 1.45,
              minHeight: '82px'
            }}
          >
            {activeStepTab === 'takeaways' && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#34d399', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>🎯 {en ? '3 Rules from the Demonstration' : 'वैज्ञानिक प्रदर्शन की 3 मुख्य बातें'}:</span>
                </div>
                {(en ? currentReel.keyTakeawaysEn : currentReel.keyTakeawaysHi).map((point, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', margin: '3px 0' }}>
                    <span
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#f1f5f9' }}>{point}</span>
                  </div>
                ))}
              </div>
            )}

            {activeStepTab === 'what' && (
              <div>
                <span style={{ color: '#38bdf8', fontWeight: 800 }}>
                  {en ? currentReel.step1TitleEn : currentReel.step1TitleHi}:{' '}
                </span>
                <span>{en ? currentReel.step1DescEn : currentReel.step1DescHi}</span>
              </div>
            )}

            {activeStepTab === 'why' && (
              <div>
                <span style={{ color: '#fbbf24', fontWeight: 800 }}>
                  {en ? currentReel.step2TitleEn : currentReel.step2TitleHi}:{' '}
                </span>
                <span>{en ? currentReel.step2DescEn : currentReel.step2DescHi}</span>
              </div>
            )}

            {activeStepTab === 'action' && (
              <div>
                <span style={{ color: '#4ade80', fontWeight: 800 }}>
                  {en ? currentReel.step3TitleEn : currentReel.step3TitleHi}:{' '}
                </span>
                <span style={{ fontWeight: 800 }}>{en ? currentReel.step3ActionEn : currentReel.step3ActionHi}</span>
              </div>
            )}
          </div>

          {/* Action Row: [समझ गया] + [खेत पर लागू करें] + [फोटो भेजें] + [सुनें] */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {/* Mark as Understood [समझ गया] */}
            <button
              type="button"
              onClick={() => handleUnderstood(currentReel.id)}
              style={{
                flex: 1,
                minWidth: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '999px',
                border: understoodReels[currentReel.id] ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.3)',
                background: understoodReels[currentReel.id] ? '#059669' : 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {understoodReels[currentReel.id] ? <Check size={14} /> : <CheckCircle2 size={14} />}
              <span>{understoodReels[currentReel.id] ? (en ? 'Understood ✓' : 'समझ गया ✓') : (en ? 'Understood' : 'समझ गया')}</span>
            </button>

            {/* Apply to Farm [खेत पर लागू करें] */}
            <button
              type="button"
              onClick={() => handleApplyToFarm(currentReel)}
              style={{
                flex: 1.2,
                minWidth: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '7px 10px',
                borderRadius: '999px',
                border: appliedReels[currentReel.id] ? '1.5px solid #38bdf8' : '1.5px solid rgba(56, 189, 248, 0.6)',
                background: appliedReels[currentReel.id] ? '#0284c7' : 'rgba(2, 132, 199, 0.4)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sprout size={14} />
              <span>{appliedReels[currentReel.id] ? (en ? 'Applied ✓' : 'लागू किया ✓') : (en ? 'Apply on Farm' : 'खेत पर लागू करें')}</span>
            </button>

            {/* Voice Read Aloud [3 बातें सुनें] */}
            <button
              type="button"
              onClick={handleListen}
              style={{
                padding: '7px 12px',
                borderRadius: '999px',
                border: 'none',
                background: isSpeaking ? '#dc2626' : 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Volume2 size={13} />
              <span>{isSpeaking ? (en ? 'Stop' : 'रोकें') : en ? 'Listen' : 'सुनें'}</span>
            </button>
          </div>

          {/* Prompt: Leaf yellowing or disease check -> Send Photo */}
          {(currentReel.category === 'crop_protection' || currentReel.id.includes('yellowing') || currentReel.id.includes('disease')) && (
            <div
              onClick={() => setShowPhotoModal(true)}
              style={{
                marginTop: '8px',
                background: 'rgba(245, 158, 11, 0.25)',
                border: '1.5px solid rgba(245, 158, 11, 0.7)',
                borderRadius: '10px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} color="#fbbf24" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fef3c7' }}>
                  {en ? 'Seeing yellow leaves or pests in your field?' : 'आपके खेत में भी ऐसी समस्या दिख रही है?'}
                </span>
              </div>
              <span
                style={{
                  background: '#f59e0b',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Camera size={11} />
                <span>{en ? 'Send Photo →' : 'फोटो भेजें →'}</span>
              </span>
            </div>
          )}
        </div>

        {/* Share Toast */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{
                position: 'absolute',
                top: 60,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#059669',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 800,
                zIndex: 50,
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
              }}
            >
              {en ? 'Link copied to clipboard!' : 'लिंक कॉपी हो गया!'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applied to Farm Toast */}
        <AnimatePresence>
          {appliedToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                top: 70,
                left: '20px',
                right: '20px',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#34d399',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #10b981',
                fontSize: '0.75rem',
                fontWeight: 800,
                zIndex: 50,
                boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle2 size={16} color="#34d399" />
              <span>{appliedToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Crop Doctor Photo Diagnosis Modal */}
      <AnimatePresence>
        {showPhotoModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                maxWidth: '480px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1.5px solid #e2e8f0',
                color: '#0f172a'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900 }}>
                      {en ? 'AI Plant Health Diagnosis' : 'फसल स्वास्थ्य निदान (AI डॉक्टर)'}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                      {en ? 'Powered by ICAR & TNAU Disease Pattern Models' : 'ICAR व TNAU रोग लक्षण मॉडल पर आधारित'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowPhotoModal(false);
                    setPhotoDiagnosisResult(null);
                  }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>

              {!photoDiagnosisResult ? (
                <div>
                  <div
                    onClick={handleTriggerPhotoAnalysis}
                    style={{
                      border: '2px dashed #059669',
                      borderRadius: '16px',
                      padding: '28px 16px',
                      textAlign: 'center',
                      background: '#f0fdf4',
                      cursor: 'pointer',
                      marginBottom: '16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Upload size={32} color="#059669" style={{ margin: '0 auto 8px' }} />
                    <strong style={{ fontSize: '0.88rem', color: '#065f46', display: 'block' }}>
                      {en ? 'Click to Upload Leaf Photo / Open Camera' : 'पत्ती या तने की फोटो अपलोड करें'}
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      {en ? 'Supported: JPG, PNG, WEBP (Clear macro shot)' : 'साफ व नजदीकी फोटो लें ताकि नसें व धब्बे दिखें'}
                    </span>
                  </div>

                  {analyzingPhoto ? (
                    <div style={{ textAlign: 'center', padding: '12px', color: '#059669', fontWeight: 800, fontSize: '0.82rem' }}>
                      <Sparkles size={18} style={{ display: 'inline', marginRight: '6px' }} />
                      {en ? 'AI Scanning Symptom Features against ICAR Database...' : 'AI द्वारा ICAR डेटाबेस से लक्षणों की तुलना जारी है...'}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTriggerPhotoAnalysis}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
                      }}
                    >
                      {en ? 'Simulate Sample Leaf Scan' : 'नमूना पत्ती का तत्काल विश्लेषण करें'}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      background: '#ecfdf5',
                      border: '1.5px solid #a7f3d0',
                      borderRadius: '16px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                        ✓ {en ? 'MATCH CONFIRMED' : 'सटीक पहचान'} ({photoDiagnosisResult.confidence})
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>
                        {photoDiagnosisResult.expertSource}
                      </span>
                    </div>

                    <strong style={{ fontSize: '0.95rem', color: '#065f46', display: 'block', marginBottom: '6px' }}>
                      {en ? photoDiagnosisResult.diagnosisEn : photoDiagnosisResult.diagnosisHi}
                    </strong>

                    <div style={{ fontSize: '0.78rem', color: '#1e293b', background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                      <strong style={{ color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                        ⚡ {en ? 'Immediate Scientific Remedy' : 'तुरंत करने योग्य वैज्ञानिक उपाय'}:
                      </strong>
                      <span>{en ? photoDiagnosisResult.immediateActionEn : photoDiagnosisResult.immediateActionHi}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPhotoDiagnosisResult(null)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#475569',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {en ? 'Scan Another' : 'अन्य फोटो जांचें'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoModal(false);
                        setPhotoDiagnosisResult(null);
                        setAppliedToast(en ? 'Prescription saved to your farm card' : 'उपचार आपके खेत कार्य में सुरक्षित किया गया');
                        setTimeout(() => setAppliedToast(null), 3000);
                      }}
                      style={{
                        flex: 1.5,
                        padding: '10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#059669',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {en ? 'Save to Farm Plan' : 'खेत कार्य में जोड़ें ✓'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Region / Category Notice */}
      {fallbackNotice && (
        <div style={{ marginTop: '14px', fontSize: '0.76rem', color: '#64748b', textAlign: 'center' }}>
          {fallbackNotice}
        </div>
      )}
    </div>
  );
};

export default LearnPage;
