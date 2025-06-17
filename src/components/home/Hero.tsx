
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="w-full py-14 md:py-20 xl:py-36 bg-gradient-to-br from-green-50 via-secondary to-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_650px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-sm text-emerald-900">
                Make <span className="text-primary">Trash</span> Your <span className="text-emerald-500">Treasure</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl font-medium">
                Snap a photo, get cash instantly, and help make Yaoundé a greener city. 
                Our EcoAgents will handle the rest!
              </p>
            </div>
            <div className="flex gap-2 sm:gap-4 md:gap-6 mt-2">
              <a href="#upload">
                <Button size="lg" className="text-base px-8 py-4 shadow-lg hover:scale-105 transition-transform">
                  Get Free Quote
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="text-base px-8 py-4">
                  How It Works
                </Button>
              </a>
            </div>
          </div>
          <div className="relative flex lg:justify-end items-center">
            <div className="absolute left-0 right-0 m-auto rounded-full bg-green-200/50 w-72 h-72 blur-3xl opacity-70 scale-110 z-0"></div>
            <img 
              alt="Waste Collection Hero" 
              className="relative z-10 mx-auto aspect-video overflow-hidden rounded-2xl object-cover sm:w-full shadow-xl border border-green-100 hover:scale-105 transition-transform duration-300" 
              src="/images/45a6a556-0796-45b9-8a93-f178a0e4606d.png" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
