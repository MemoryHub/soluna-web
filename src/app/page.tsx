'use client';

import { 
  Navigation, 
  HeroSection, 
  PhilosophySection, 
  TimelineSection, 
  CTASection 
} from './home';
import { useScrollManager } from '@/hooks/useScrollManager';

export default function Home() {
  const { scrollToSection } = useScrollManager();

  return (
    <div className="bg-[#0a0a0a] text-gray-300 min-h-screen font-mono overflow-x-hidden">
      <Navigation onScrollToSection={scrollToSection} />
      
      <HeroSection onScrollToSection={scrollToSection} />
      <PhilosophySection />
      <TimelineSection />
      <CTASection />
    </div>
  );
}
