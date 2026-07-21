// app/page.tsx
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { WelcomeSection } from '@/components/ui/WelcomeSection'
//import { LeadershipSection } from '@/components/ui/LeadershipSection'
import { ProgramsSection } from '@/components/ui/ProgramsSection'
import { CtaSection } from '@/components/ui/CtaSection'
import { FirstTimerSection } from '@/components/ui/FirstTimerSection'
import { PhotoGallery } from '@/components/photo-gallery'
import { LiveStreaming } from '@/components/live-streaming'
import { StructuredData } from '@/components/structured-data'
import MonthlyThemes from '@/components/MonthlyThemes'

export const metadata = {
  title: 'RCCG Salvation Centre - Redeeming Lives Through Christ',
  description: 'Welcome to RCCG Salvation Centre – a vibrant faith community in Ikeja, Lagos dedicated to worship, spiritual growth, and service.',
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <HeroCarousel />
      <WelcomeSection />
      <MonthlyThemes />
      {/* <PhotoGallery /> */}
      <LiveStreaming />
      <ProgramsSection />
      <FirstTimerSection />
      <CtaSection />
    </>
  )
}