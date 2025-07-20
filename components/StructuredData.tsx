import Script from 'next/script'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'trial-listing'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Free Trial Sentinel",
          "description": "Track and manage your free trials in one place. Never lose track of your trials again.",
          "url": "https://freetrialsentinel.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://freetrialsentinel.com/explore?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Free Trial Sentinel",
          "url": "https://freetrialsentinel.com",
          "logo": "https://freetrialsentinel.com/logo.png",
          "sameAs": [
            "https://twitter.com/FTsentinel"
          ],
          "description": "A platform to help users track and manage their free trials effectively."
        }
      
      case 'trial-listing':
        return {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Free Trials Directory",
          "description": "A comprehensive list of free trials available across various services and platforms",
          "url": "https://freetrialsentinel.com/explore",
          "itemListElement": data?.trials?.map((trial: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Service",
              "name": trial.name,
              "description": `Free trial for ${trial.name} - ${trial.trial_length} days`,
              "provider": {
                "@type": "Organization",
                "name": trial.name
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            }
          })) || []
        }
      
      default:
        return {}
    }
  }

  const structuredData = getStructuredData()

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
} 