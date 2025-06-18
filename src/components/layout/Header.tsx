import { Mountain } from 'lucide-react';

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background shadow-sm">
      <a className="flex items-center justify-center" href="#">
        <Mountain className="h-6 w-6 text-primary" />
        <span className="sr-only">EcoAI</span>
        <span className="ml-2 text-lg font-semibold text-foreground">
          EcoAI
        </span>
      </a>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <a
          className="text-lg text-green-600 hover:underline underline-offset-4 font-bold "
          href="/home"
        >
          Dashboard
        </a>
        <a
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#how-it-works"
        >
          How It Works
        </a>
        <a
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#upload"
        >
          Get a Quote
        </a>
        <a
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;
