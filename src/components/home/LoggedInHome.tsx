
import DashboardHeader from '@/components/layout/DashboardHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Calendar as CalendarIcon, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSummaryCard from './DashboardSummaryCard';
import OfferSummaryCard from "./OfferSummaryCard";
import { useAuth } from "@/contexts/AuthContext";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const LoggedInHome = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className="flex-1 p-4 space-y-6">
        {/* Removed Profile link at the top */}

        <div className="bg-primary text-primary-foreground p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-lg">Dispose your trash responsibly</p>
            <p className="text-sm opacity-90">with our EcoAgents</p>
          </div>
          <Bot className="w-16 h-16" aria-label="EcoAgent bot" />
        </div>
        
        {user && <OfferSummaryCard userId={user.id} />}

        {/* Removed <PickupStatusCard /> */}
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
      </main>
      <BottomNav />
    </div>
  );
};

export default LoggedInHome;

