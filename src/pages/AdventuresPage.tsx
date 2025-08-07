import { useEffect, useState } from 'react';
import Hero from "@/components/Hero";
import AdventureCards from "@/components/AdventureCards";
import Testimonials from "@/components/Testimonials";
import { supabase } from '@/lib/supabase';
import { GlobalMeta } from "@/components/SEO/GlobalMeta";

// Tour type matching Supabase schema
type Tour = {
  id: string;
  title: string;
  description: string;
  location_name: string;
  price_per_person: number;
  duration_hours: number;
  max_participants: number;
  images: string[];
  provider_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const Index = () => {
  const [featuredTour, setFeaturedTour] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    async function fetchTours() {
      try {
        const { data, error } = await supabase
          .from('tours')
          .select('*')
          .eq('is_active', true)
          .order('price_per_person', { ascending: false }); // Featured = highest priced

        if (error) {
          console.error('Error fetching tours:', error);
          return;
        }

        if (data && data.length > 0) {
          setTours(data);
          setFeaturedTour(data[0]); // Set the highest priced tour as featured
        }
      } catch (error) {
        console.error('Unexpected error fetching tours:', error);
      }
    }

    fetchTours();
  }, []);

  return (
    <>
      <GlobalMeta 
        title="Belize Adventures & Tours"
        description="Explore authentic Belize adventure tours and experiences. Cave tubing, snorkeling, Maya ruins, jungle treks, and more with expert local guides."
        path="/adventures"
        keywords="Belize adventures, Belize tours, cave tubing, snorkeling, Maya ruins, jungle tours, adventure travel"
      />
      
      <div className="min-h-screen bg-background text-foreground">
        <Hero featuredTour={featuredTour} />
        <AdventureCards tours={tours} />
        <Testimonials />
      </div>
    </>
  );
};

export default Index;