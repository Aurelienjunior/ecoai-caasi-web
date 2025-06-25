import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import TrashUploader from '@/components/home/TrashUploader';

const FeatureHighlights = () => (
  <div className="flex flex-wrap justify-center gap-4 my-8 max-w-2xl mx-auto">
    <div className="flex items-center gap-2 bg-green-100 text-green-900 rounded-full px-4 py-2 text-xs font-medium shadow-sm">
      <span role="img" aria-label="Leaf">
        🌱
      </span>{' '}
      Eco-Friendly
    </div>
    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-900 rounded-full px-4 py-2 text-xs font-medium shadow-sm">
      <span role="img" aria-label="Coin">
        💰
      </span>{' '}
      Get Paid for Trash
    </div>
    <div className="flex items-center gap-2 bg-sky-100 text-sky-900 rounded-full px-4 py-2 text-xs font-medium shadow-sm">
      <span role="img" aria-label="Lightning">
        ⚡
      </span>{' '}
      Instant Pickup
    </div>
  </div>
);

const LoggedOutHome = () => {
  return (
    <div className=" relative flex flex-col min-h-screen bg-gradient-to-b from-secondary via-white to-green-50">
      <Header />

      
      <main className="flex-1 pb-10">
        <Hero />
        <FeatureHighlights />
        <HowItWorks />
        <TrashUploader />
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background bg-opacity-80 backdrop-blur">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 EcoAI by Caasitech. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default LoggedOutHome;
