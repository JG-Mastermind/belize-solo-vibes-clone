import { Helmet } from 'react-helmet-async';
import InteractiveHero from "@/components/InteractiveHero";

const Index = () => {

  return (
    <>
      <Helmet>
        <title>BelizeVibes - Authentic Belize Adventures & Solo Travel Experiences</title>
        <meta name="description" content="Discover authentic Belize adventures with expert local guides. Cave tubing, snorkeling, Maya ruins, and eco-tours. Perfect for solo travelers and small groups." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="BelizeVibes - Authentic Belize Adventures" />
        <meta property="og:description" content="Discover authentic Belize adventures with expert local guides. Perfect for solo travelers." />
        <meta property="og:image" content="https://belizevibes.com/images/belize-hero.jpg" />
        <meta property="og:url" content="https://belizevibes.com/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@belizevibes" />
        <meta name="twitter:title" content="BelizeVibes - Authentic Belize Adventures" />
        <meta name="twitter:description" content="Discover authentic Belize adventures with expert local guides." />
        <meta name="twitter:image" content="https://belizevibes.com/images/belize-hero.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://belizevibes.com/" />
        
        {/* Language */}
        <html lang="en" />
        
        {/* Additional SEO */}
        <meta name="keywords" content="Belize tours, adventure travel, solo travel, cave tubing, snorkeling, Maya ruins, eco-tours, local guides" />
        <meta name="author" content="BelizeVibes" />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground">
        <InteractiveHero />
      </div>
    </>
  );
};

export default Index;