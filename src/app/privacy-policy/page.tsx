export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for RCCG Salvation Centre.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#0a0a0c] mb-8" style={{ fontFamily: 'var(--font-lora), serif' }}>
          Privacy <span className="text-[#DDB771]">Policy</span>
        </h1>
        
        <div className="prose prose-lg text-gray-600 max-w-none space-y-6 font-light">
          <p>
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <p>
            Welcome to the RCCG Salvation Centre website. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            1. Information We Collect
          </h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our programs, or otherwise when you contact us. This may include your name, phone number, email address, physical address, and demographic information.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            2. How We Use Your Information
          </h2>
          <p>
            We use personal information collected via our website for a variety of purposes described below. We process your personal information for these purposes in reliance on our legitimate interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Facilitate account creation and logon process.</li>
            <li>Send administrative information to you.</li>
            <li>Fulfill and manage your registrations for programs and events.</li>
            <li>Respond to your inquiries and offer support.</li>
          </ul>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            3. Will Your Information Be Shared With Anyone?
          </h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            4. How Long Do We Keep Your Information?
          </h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            5. Contact Us
          </h2>
          <p>
            If you have questions or comments about this notice, you may email us at <strong>Rccgsalvationcentre01@gmail.com</strong> or by post to:
          </p>
          <p className="italic">
            RCCG Salvation Centre<br />
            10, Oba Akinjobi Way, GRA, Ikeja<br />
            Lagos State, Nigeria
          </p>
        </div>
      </div>
    </div>
  )
}
