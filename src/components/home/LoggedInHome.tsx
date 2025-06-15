
import DashboardHeader from '@/components/layout/DashboardHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Calendar as CalendarIcon, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSummaryCard from './DashboardSummaryCard';
import OfferSummaryCard from "./OfferSummaryCard";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import OnboardingTooltip from '@/components/onboarding/OnboardingTooltip';

const USER_NAME = "Melanie"; // Replace with actual user.profile?.first_name in production

const days = [
  { day: "Sun", date: 23, active: true },
  { day: "Mon", date: 24, active: false },
  { day: "Tue", date: 25, active: false },
  { day: "Wed", date: 27, active: false },
  { day: "Thu", date: 28, active: false },
  { day: "Fri", date: 29, active: false },
  { day: "Sat", date: 31, active: false },
];

const LoggedInHome = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {/* Desktop header */}
      <div className="hidden md:block">
        <DashboardHeader />
      </div>
      {/* Mobile Mockup Redesign */}
      <main className="flex-1 p-0 md:p-4 space-y-0 md:space-y-6 max-w-lg mx-auto w-full">
        {/* Mobile container */}
        <div className="md:hidden bg-white rounded-b-3xl shadow pb-1 pt-5 px-4">
          {/* Profile/Greeting header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold flex items-center gap-2">
                <span className="text-gray-700">
                  Hi, <span className="text-emerald-700 font-bold">{USER_NAME}</span>
                </span>
                <span role="img" aria-label="wave" className="ml-1">👋</span>
              </p>
              <p className="text-sm text-muted-foreground -mt-1 mb-1">
                Ready to manage your waste the smart way?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-gray-50 rounded-full shadow-sm" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-700">
                  <path d="M18 16v-5a6 6 0 10-12 0v5M5 16h14M12 21a2 2 0 002-2H10a2 2 0 002 2z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow" />
            </div>
          </div>
          {/* EcoAgent Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center px-4 py-4 mb-4 shadow-lg relative" style={{minHeight: 98}}>
            <div className="z-10">
              <p className="text-white font-medium text-lg leading-snug mb-1">Dispose your trash responsibly<br />with our EcoAgents</p>
            </div>
            <img
              src="/lovable-uploads/d2ebe1bb-dfb2-49f4-8bb5-710bbfaa8d8a.png"
              alt="EcoAgent"
              className="w-24 h-24 object-contain absolute -top-8 right-0 pointer-events-none select-none drop-shadow-xl"
              style={{ right: -10 }}
            />
          </div>
          {/* Next Pickup Card */}
          <div className="rounded-2xl bg-white px-4 py-5 mb-4 shadow border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-base text-neutral-900">Next Pickup<span className="text-emerald-500 ml-1">•</span></p>
                <p className="text-xs text-muted-foreground">No Pickup yet</p>
              </div>
              <button className="text-2xl font-bold text-gray-500 hover:text-primary" aria-label="Add Pickup">+</button>
            </div>
            <div className="flex gap-1 justify-between my-2">
              {days.map(d => (
                <div key={d.day} className={`flex flex-col items-center gap-0 mx-0.5`}>
                  <span className={`text-xs ${d.active ? "text-white" : "text-gray-500"}`}>{d.day}</span>
                  <span className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm
                    ${d.active ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-800"}`}>
                    {d.date}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                10 am
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m9 2v-1a7 7 0 10-14 0v1a4 4 0 004 4h6a4 4 0 004-4z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-emerald-600 text-sm font-medium">1hr Reminder</span>
                <span className="bg-gray-200 w-9 h-5 rounded-full inline-flex ml-2 items-center">
                  <span className="bg-white w-4 h-4 rounded-full block shadow transform translate-x-0" />
                </span>
              </div>
            </div>
          </div>
          {/* Book Now / Book Later */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link to="/snap">
              <div className="bg-gray-50 shadow rounded-xl p-5 flex flex-col items-center hover:bg-green-50 active:scale-95 transition border border-gray-100">
                <Book className="w-9 h-9 text-emerald-500 mb-2" />
                <span className="font-bold text-lg text-emerald-800">Book Now</span>
                <span className="text-gray-500 text-xs mt-0.5">Instant Pickup</span>
              </div>
            </Link>
            <div className="bg-gray-50 shadow rounded-xl p-5 flex flex-col items-center border border-gray-100 opacity-60 relative">
              <CalendarIcon className="w-9 h-9 text-emerald-300 mb-2" />
              <span className="font-bold text-lg text-emerald-800">Book Later</span>
              <span className="text-gray-500 text-xs mt-0.5">Schedule a Pickup</span>
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl pointer-events-none" />
            </div>
          </div>
          {/* AI Tip Card */}
          <div className="rounded-xl bg-blue-50 px-4 py-3 flex items-center gap-3 shadow mb-3">
            <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none">
              <path d="M2 12a10 10 0 1020 0 10 10 0 00-20 0zm10-8v3.5M8.2 15.5h7.6m-10.5-2L7 16.8M9.5 5.7L7.2 7M14.5 5.7l2.3 1.3M19.8 13.5L17 16.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <span className="font-bold text-base text-blue-800">AI Tip</span>
              <p className="text-gray-700 text-sm leading-tight">Separating plastic and metal improves scanning accuracy.</p>
            </div>
          </div>
        </div>
        {/* Desktop and fallback: legacy dashboard content */}
        <div className="hidden md:block space-y-6">
          <OnboardingTooltip />
          <div className="bg-primary text-primary-foreground p-4 rounded-xl flex items-center justify-between shadow-lg">
            <div>
              <p className="font-bold text-lg">Dispose your trash responsibly</p>
              <p className="text-sm opacity-90">with our EcoAgents</p>
            </div>
            <Bot className="w-16 h-16" aria-label="EcoAgent bot" />
          </div>
          {user && <OfferSummaryCard userId={user.id} />}
          <DashboardSummaryCard />
          <div className="grid grid-cols-2 gap-4">
            <Link to="/snap" className="block h-full">
              <Card className="p-4 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-gray-100 transition-colors h-full">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <Book className="w-8 h-8 text-primary" aria-label="Book Now" />
                  </div>
                  <h3 className="font-bold text-lg">Book Now</h3>
                  <p className="text-sm text-muted-foreground">Instant Pickup</p>
              </Card>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card
                    className="p-4 flex flex-col items-center justify-center text-center shadow-lg cursor-not-allowed opacity-60"
                    tabIndex={-1}
                    aria-disabled="true"
                    aria-label="Book Later (Coming Soon)"
                    role="button"
                  >
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <CalendarIcon className="w-8 h-8 text-primary" aria-label="Book Later" />
                    </div>
                    <h3 className="font-bold text-lg">Book Later</h3>
                    <p className="text-sm text-muted-foreground">Schedule a Pickup</p>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  Coming Soon: Schedule future pickups!
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Card className="p-4 flex items-center gap-4 shadow-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                  <Bot className="w-8 h-8 text-blue-600" aria-label="AI tip bot" />
              </div>
              <div>
                  <h3 className="font-bold text-lg">AI Tip</h3>
                  <p className="text-sm text-muted-foreground">Separating plastic and metal improves scanning accuracy.</p>
              </div>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default LoggedInHome;
