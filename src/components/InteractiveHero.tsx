import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const InteractiveHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolled) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
  }, [isScrolled]);
  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {/* Placeholder for video, you can replace this with a real <video> tag later */}
        <div className="bg-black w-full h-full">
            <video
                ref={videoRef}
                src="/images/Caribbean_Beach_Video.mp4"
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-10"></div>
        </div>
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-20"></div>
      
      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4 leading-tight">
          Your Adventure Awaits
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
          What's your vibe? Search for an adventure or choose a popular experience.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="E.g., 'cave tubing', 'jungle ruins', 'snorkeling'"
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

        {/* Quick Action Buttons */}
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
    </section>
  );
};

export default InteractiveHero;