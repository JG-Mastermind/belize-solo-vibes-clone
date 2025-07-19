import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const InteractiveHero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* STATIC BACKGROUND - WORKS PERFECTLY */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/belize-solo.jpg')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
            Your Adventure Awaits
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            What's your vibe? Search for an adventure or choose a popular experience.
          </p>

          <div className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="E.g., 'cave tubing', 'jungle ruins'"
                className="w-full h-14 pl-6 pr-16 rounded-full text-lg text-black"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-belize-blue-500 hover:bg-belize-blue-600"
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="outline" className="bg-white/20 border-white backdrop-blur-sm hover:bg-white/30">
              Cave Tubing
            </Button>
            <Button variant="outline" className="bg-white/20 border-white backdrop-blur-sm hover:bg-white/30">
              Maya Ruins
            </Button>
            <Button variant="outline" className="bg-white/20 border-white backdrop-blur-sm hover:bg-white/30">
              Snorkeling
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveHero;