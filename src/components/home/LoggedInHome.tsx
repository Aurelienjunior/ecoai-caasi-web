
import DashboardHeader from '@/components/layout/DashboardHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Calendar as CalendarIcon, Bot, Clock, Bell, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

const DayButton = ({ day, date, selected }: { day: string; date: number; selected?: boolean }) => (
    <div className={`flex flex-col items-center p-2 rounded-lg w-12 text-center shrink-0 ${selected ? 'bg-primary text-primary-foreground' : 'bg-gray-200'}`}>
        <span className="text-xs">{day}</span>
        <span className="font-bold">{date}</span>
    </div>
)

const LoggedInHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className="flex-1 p-4 space-y-6">
        
        <div className="bg-primary text-primary-foreground p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-lg">Dispose your trash responsibly</p>
            <p className="text-sm opacity-90">with our EcoAgents</p>
          </div>
          <Bot className="w-16 h-16" />
        </div>
        
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Next Pickup</CardTitle>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                </div>
                <Button variant="ghost" size="icon"><Plus className="w-5 h-5"/></Button>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm mb-4">No Pickup yet</p>
                <div className="flex space-x-2 overflow-x-auto pb-2 -mx-2 px-2">
                    <DayButton day="Sun" date={23} selected />
                    <DayButton day="Mon" date={24} />
                    <DayButton day="Tue" date={25} />
                    <DayButton day="Wed" date={27} />
                    <DayButton day="Thu" date={28} />
                    <DayButton day="Fri" date={29} />
                    <DayButton day="Sat" date={31} />
                </div>
                <div className="mt-4 border-t pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-5 h-5" />
                        <span>10 am</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Bell className="w-5 h-5" />
                        <span>1hr Reminder</span>
                        <Switch id="reminder-switch" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
            <Link to="/snap" className="block h-full">
              <Card className="p-4 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-gray-100 transition-colors h-full">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                      <Book className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Book Now</h3>
                  <p className="text-sm text-muted-foreground">Instant Pickup</p>
              </Card>
            </Link>
            <Card className="p-4 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-gray-100 transition-colors">
                 <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <CalendarIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Book Later</h3>
                <p className="text-sm text-muted-foreground">Schedule a Pickup</p>
            </Card>
        </div>

        <Card className="p-4 flex items-center gap-4 shadow-lg">
            <div className="bg-blue-100 p-3 rounded-full">
                <Bot className="w-8 h-8 text-blue-600" />
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
