import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQStructuredDataProps {
  blogTitle: string;
  blogUrl: string;
  faqs: FAQItem[];
}

export const FAQStructuredData: React.FC<FAQStructuredDataProps> = ({
  blogTitle,
  blogUrl,
  faqs
}) => {
  // Only generate schema if there are FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    })),
    // Additional context for the blog post
    "mainEntityOfPage": {
      "@type": "Article",
      "name": blogTitle,
      "url": blogUrl
    },
    // BelizeVibes specific context
    "publisher": {
      "@type": "Organization",
      "name": "BelizeVibes",
      "url": "https://belizevibes.com"
    },
    // Tourism and travel context
    "inLanguage": "en-US",
    "audience": {
      "@type": "Audience",
      "audienceType": "tourists, travelers, adventure seekers"
    },
    "about": [
      {
        "@type": "Place",
        "name": "Belize",
        "description": "Central American country known for barrier reef, Maya ruins, and eco-adventures"
      },
      {
        "@type": "Thing",
        "name": "Travel Information",
        "description": "Practical information and answers for travelers visiting Belize"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
    </Helmet>
  );
};

// Utility function to extract FAQ data from HTML content
export const extractFAQsFromContent = (htmlContent: string): FAQItem[] => {
  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  const faqs: FAQItem[] = [];
  
  // Find all details elements (FAQ sections)
  const detailsElements = tempDiv.querySelectorAll('details');
  
  detailsElements.forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('div, p');
    
    if (summary && content) {
      // Clean question text (remove emoji and extra formatting)
      let question = summary.textContent || '';
      question = question.replace(/^[❓?]\s*/, '').trim();
      
      // Clean answer text (remove emoji and extra formatting)
      let answer = content.textContent || '';
      answer = answer.replace(/^[✅✓]\s*/, '').trim();
      
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  });
  
  return faqs;
};

// Hook to automatically generate FAQ structured data from blog content
export const useFAQStructuredData = (blogTitle: string, blogUrl: string, content: string) => {
  const faqs = React.useMemo(() => {
    if (!content) return [];
    return extractFAQsFromContent(content);
  }, [content]);
  
  return {
    faqs,
    hasValidFAQs: faqs.length > 0,
    FAQStructuredDataComponent: () => (
      <FAQStructuredData 
        blogTitle={blogTitle} 
        blogUrl={blogUrl} 
        faqs={faqs} 
      />
    )
  };
};