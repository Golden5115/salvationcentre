export const metadata = {
  title: 'Cookies Policy',
  description: 'Cookies Policy for RCCG Salvation Centre.',
}

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-[120px] pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#0a0a0c] mb-8" style={{ fontFamily: 'var(--font-lora), serif' }}>
          Cookies <span className="text-[#DDB771]">Policy</span>
        </h1>
        
        <div className="prose prose-lg text-gray-600 max-w-none space-y-6 font-light">
          <p>
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          
          <p>
            This Cookie Policy explains how RCCG Salvation Centre uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            What are cookies?
          </h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            Why do we use cookies?
          </h2>
          <p>
            We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our online properties.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            How can I control cookies?
          </h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject.
          </p>
          <p>
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            Updates to this policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>

          <h2 className="text-2xl font-medium text-[#0a0a0c] mt-10 mb-4" style={{ fontFamily: 'var(--font-lora), serif' }}>
            Contact Us
          </h2>
          <p>
            If you have questions or comments about this notice, you may email us at <strong>Rccgsalvationcentre01@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
