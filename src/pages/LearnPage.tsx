import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowRight
} from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { rankFarmerReels, FarmerReel } from '../services/videoRecommendationEngine';

export const LearnPage: React.FC = () => {
  const { farm, playVoice, stopVoice, isSpeaking } = useFarm();
  const { language, location, speakText } = useApp();
  const en = language === 'en';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeStepTab, setActiveStepTab] = useState<'what' | 'why' | 'action'>('what');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    setActiveStepTab('what');
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
    if (now - lastWheelTime.current < 380) return;
    if (e.deltaY > 15) {
      lastWheelTime.current = now;
      handleNext();
    } else if (e.deltaY < -15) {
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
    if (diff > 35) {
      handleNext();
    } else if (diff < -35) {
      handlePrev();
    }
  };

  // Keyboard navigation for reels
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length, isPlaying]);

  const handleListen = () => {
    if (!currentReel) return;
    const textToSpeak = en ? currentReel.voiceNarrationEn : currentReel.voiceNarrationHi;
    playVoice(textToSpeak);
  };

  const handleLike = (id: string) => {
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id: string) => {
    setSavedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const categories = [
    { id: 'all', labelEn: '🌟 All For My Farm', labelHi: '🌟 मेरे खेत के लिए' },
    { id: 'weather_risk', labelEn: '🌧️ Rain Alert', labelHi: '🌧️ बारिश अलर्ट' },
    { id: 'crop_stage', labelEn: '🌾 Crop Stage', labelHi: '🌾 फसल अवस्था' },
    { id: 'irrigation', labelEn: '💧 Irrigation & Energy', labelHi: '💧 सिंचाई व बचत' },
    { id: 'pest_alert', labelEn: '🐛 Pest Defense', labelHi: '🐛 कीट सुरक्षा' }
  ];

  if (!currentReel) return null;

  return (
    <div
      className="kisan-shorts-page"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.25rem 1rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Top Context & Category Bar */}
      <div style={{ width: '100%', maxWidth: '520px', marginBottom: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em'
                }}
              >
                KISAN SHORTS
              </span>
              <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>
                {en ? 'Context-Aware Decision Feed' : 'निर्णय-आधारित वीडियो फीड'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '3px 0 0' }}>
              {en ? 'Today For Your Farm' : 'आज आपके खेत के लिए'}
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '5px 12px',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#065f46'
            }}
          >
            <MapPin size={12} color="#059669" />
            <span>{farm.isConfigured ? (en ? farm.panchayat.name : farm.panchayat.hi) : location.panchayatName}</span>
          </div>
        </div>

        {/* Category Pills */}
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
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected ? '#059669' : 'rgba(255, 255, 255, 0.9)',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1.5px solid #047857' : '1px solid #cbd5e1',
                  cursor: 'pointer',
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
          maxWidth: '460px',
          height: '710px',
          borderRadius: '24px',
          overflow: 'hidden',
          background: '#090d16',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.28)',
          border: '1.5px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          key={currentReel.id}
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

        {/* Dark Vignette Overlays for Maximum Legibility */}
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.92) 100%)',
            pointerEvents: 'none'
          }}
        />

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 30
            }}
          >
            <Play size={28} style={{ marginLeft: '4px' }} />
          </div>
        )}

        {/* Top Header Inside Reel */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 16,
            right: 16,
            zIndex: 25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Progress Segment Indicator */}
          <div style={{ display: 'flex', gap: '4px', flex: 1, marginRight: '14px' }}>
            {reels.map((_, idx) => (
              <div
                key={idx}
                style={{
                  height: '3px',
                  flex: 1,
                  background: idx === currentIndex ? '#10b981' : 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '999px',
                  transition: 'background 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Reel Index Pill */}
          <span
            style={{
              background: 'rgba(0,0,0,0.5)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              backdropFilter: 'blur(6px)'
            }}
          >
            {currentIndex + 1} / {reels.length}
          </span>
        </div>

        {/* Right Floating Action Bar (Reel Controls) */}
        <div
          style={{
            position: 'absolute',
            right: 14,
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
            title={en ? 'Previous Reel (Scroll Up)' : 'पिछला वीडियो (ऊपर स्क्रॉल)'}
            style={{
              background: 'rgba(0,0,0,0.6)',
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
            title={en ? 'Next Reel (Scroll Down)' : 'अगला वीडियो (नीचे स्क्रॉल)'}
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
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.45)',
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
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
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
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: likedReels[currentReel.id] ? '#ef4444' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Heart size={20} fill={likedReels[currentReel.id] ? '#ef4444' : 'none'} />
            <span style={{ fontSize: '0.62rem', fontWeight: 800, marginTop: '2px', color: '#ffffff' }}>
              {currentReel.likesCount + (likedReels[currentReel.id] ? 1 : 0)}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => handleSave(currentReel.id)}
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: savedReels[currentReel.id] ? '#f59e0b' : '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={20} fill={savedReels[currentReel.id] ? '#f59e0b' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <Share2 size={20} />
          </button>

          {/* Up & Down Arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Video (Arrow Up)"
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <ChevronUp size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next Video (Arrow Down)"
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Bottom Educational & Decision Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 74px 18px 16px',
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
                    background: 'rgba(15, 23, 42, 0.94)',
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
                    {en ? 'Personalized Relevance Match' : 'आपके खेत के अनुसार प्रासंगिकता'}
                  </div>
                  {(en ? currentReel.whyYouSeeThisEn : currentReel.whyYouSeeThisHi).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Video Title */}
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.35 }}>
            {en ? currentReel.titleEn : currentReel.titleHi}
          </h2>

          {/* 3-Step Swipe to Understand Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              padding: '3px',
              borderRadius: '10px',
              marginBottom: '10px'
            }}
          >
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
                flex: 1,
                padding: '5px 0',
                borderRadius: '7px',
                border: 'none',
                background: activeStepTab === 'action' ? '#059669' : 'transparent',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {en ? '03 / ACTION' : '03 / आज का कदम'}
            </button>
          </div>

          {/* Step Detail Content */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              lineHeight: 1.45,
              minHeight: '58px'
            }}
          >
            {activeStepTab === 'what' && (
              <div>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                  {en ? currentReel.step1TitleEn : currentReel.step1TitleHi}:{' '}
                </span>
                <span>{en ? currentReel.step1DescEn : currentReel.step1DescHi}</span>
              </div>
            )}
            {activeStepTab === 'why' && (
              <div>
                <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                  {en ? currentReel.step2TitleEn : currentReel.step2TitleHi}:{' '}
                </span>
                <span>{en ? currentReel.step2DescEn : currentReel.step2DescHi}</span>
              </div>
            )}
            {activeStepTab === 'action' && (
              <div>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  {en ? currentReel.step3TitleEn : currentReel.step3TitleHi}:{' '}
                </span>
                <span style={{ fontWeight: 800 }}>{en ? currentReel.step3ActionEn : currentReel.step3ActionHi}</span>
              </div>
            )}
          </div>

          {/* Audio Advice Button */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleListen}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isSpeaking ? '#dc2626' : '#059669',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
              }}
            >
              <Volume2 size={15} />
              <span>{isSpeaking ? (en ? 'Stop Audio' : 'आवाज़ रोकें') : en ? 'Listen Voice Advice' : 'सलाह सुनें'}</span>
            </button>
          </div>
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
      </div>

      {/* Region Notice */}
      {fallbackNotice && (
        <div style={{ marginTop: '12px', fontSize: '0.74rem', color: '#64748b', textAlign: 'center' }}>
          {fallbackNotice}
        </div>
      )}
    </div>
  );
};
