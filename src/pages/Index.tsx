import Hero from "@/components/Hero";
import AdventureCards from "@/components/AdventureCards";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <AdventureCards />
      <Testimonials />
    </div>
  );
};

export default Index;