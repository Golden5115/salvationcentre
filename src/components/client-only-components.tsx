// components/client-only-components.tsx
'use client'

import { useSyncExternalStore } from 'react'
import BackToTop from '@/components/BackToTop'
import Spinner from '@/components/Spinner'
import { BackgroundAudio } from '@/components/background-audio'
import { CookieConsent } from '@/components/cookie-consent'

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,      
    () => false      
  )
}

export default function ClientOnlyComponents() {
  const hasMounted = useHasMounted()
  
  if (!hasMounted) {
    return null
  }
  
  return (
    <>
      <Spinner />
      <BackgroundAudio />
      <BackToTop />
      <CookieConsent />
    </>
  )
}