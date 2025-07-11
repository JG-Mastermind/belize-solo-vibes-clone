
import Hero from "@/components/Hero";
import AdventureCards from "@/components/AdventureCards";
import Testimonials from "@/components/Testimonials";
import ReviewForm from "@/components/ReviewForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <AdventureCards />
      <Testimonials />
      <div className="py-16 bg-belize-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
