export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RCCG Salvation Centre',
    image: 'https://rccgsalvationcentre.com/logo.png',
    description: 'The Redeemed Christian Church of God - Salvation Centre. A faith-filled community dedicated to worship, growth, and transformation in Christ.',
    url: 'https://rccgsalvationcentre.com',
    telephone: '+234 123 456 7890',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '[]',
      addressLocality: '[Ikeja]',
      addressRegion: '[Lagos]',
      addressCountry: 'NGN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '09:00',
        closes: '12:00',
      },
    ],
    sameAs: [
      'https://facebook.com/rccgsalvationcentre',
      'https://twitter.com/rccgsalvationcentre',
      'https://youtube.com/@rccgsalvationcentre',
    ],
    potentialAction: {
      '@type': 'JoinAction',
      target: 'https://rccgsalvationcentre.com/connect',
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://rccgsalvationcentre.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Live Streaming',
        item: 'https://rccgsalvationcentre.com/live',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'About',
        item: 'https://rccgsalvationcentre.com/about',
      },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RCCG Salvation Centre',
    url: 'https://rccgsalvationcentre.com',
    logo: 'https://rccgsalvationcentre.com/logo.png',
    description: 'The Redeemed Christian Church of God - Salvation Centre',

    foundingDate: '1952',
    areaServed: 'NGN',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
