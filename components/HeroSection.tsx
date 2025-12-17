import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Helper to safely play video and catch interruption errors
    const safePlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Catch "The play() request was interrupted by a call to pause()" 
          // and other autoplay rejection errors to keep console clean.
        });
      }
    };

    // Attempt initial play
    safePlay();

    // Optimize performance by pausing when not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        safePlay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight * 0.8,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full min-h-[70vh] lg:h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Video Background */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1456324504439-367cee13d643?q=80&w=2070&auto=format&fit=crop"
        className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-1000 ease-in-out"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-person-writing-on-a-notebook-on-a-wooden-table-4078-large.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-8 mt-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 drop-shadow-sm">
          Calm the Chaos.<br />Plan the Journey.
        </h1>
        
        <p className="text-lg md:text-2xl text-stone-100 max-w-2xl mx-auto font-medium opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed drop-shadow-sm">
          The modern planner for homeschool families who cherish clarity, connection, and peace of mind.
        </p>
        
        <div className="pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={scrollToContent}
            className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-stone-100 transition-all hover:scale-105 shadow-xl flex items-center gap-2"
          >
            Start Planning Today
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 hover:text-white transition-colors cursor-pointer p-2"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-8 h-8" />
      </button>
    </div>
  );
};

export default HeroSection;