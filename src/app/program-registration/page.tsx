import { ProgramRegistrationForm } from '@/components/ui/ProgramRegistrationForm'

export const metadata = {
  title: 'Special Program Registration',
  description: 'Register for our upcoming special programs and sessions at RCCG Salvation Centre.',
}

export default function ProgramRegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 
        The global Navigation is handled by layout.tsx. 
        We just add a top padding spacer here to account for the fixed navbar 
        since the form itself uses relative positioning and padding.
      */}
      <div className="pt-[100px]">
        <ProgramRegistrationForm />
      </div>
    </div>
  )
}
