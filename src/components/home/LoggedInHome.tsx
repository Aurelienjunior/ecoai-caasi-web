import DashboardHeader from '@/components/layout/DashboardHeader';
import BottomNav from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/card';
import { Book, Calendar as CalendarIcon, Bot, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardSummaryCard from './DashboardSummaryCard';
import OfferSummaryCard from './OfferSummaryCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

const LoggedInHome = () => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [instantPickups, setInstantPickups] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const fetchPickups = async () => {
      if (!user?.uid) return;

      const instantQuery = query(
        collection(db, 'pickups'),
        where('userId', '==', user.uid)
      );
      const scheduledQuery = query(
        collection(db, 'scheduledPickups'),
        where('userId', '==', user.uid)
      );

      const [instantSnap, scheduledSnap] = await Promise.all([
        getDocs(instantQuery),
        getDocs(scheduledQuery),
      ]);

      setInstantPickups(
        instantSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setScheduledPickups(
        scheduledSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchPickups();
  }, [user]);

  return (
    <div className="relative w-full flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader
        isProfileOpen={isProfileOpen}
        handleProfileClick={handleProfileClick}
      />

      {isProfileOpen && (
        <div className="fixed w-full h-full flex justify-center items-center bg-black/5">
          <div className="bg-white md:w-[500px] w-[90%] px-3 h-[400px] flex flex-col text-center justify-around items-center border rounded-lg shadow-lg">
            <p className="text-xl font-[500] text-[#333333]">
              Complete your Profile
            </p>
            <img src="../../../images/profile.svg" alt="Complete profile" />
            <p>
              This will help streamline your <br /> booking process
            </p>
            <div className="w-full flex flex-col gap-5">
              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-[#4CAC3E] text-white px-3 py-2 rounded-[8px]"
              >
                Complete Now
              </button>
              <button
                onClick={handleProfileClick}
                className="w-full bg-[#212121] text-white px-3 py-2 rounded-[8px]"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="p-4 space-y-6">
        <div className="w-full bg-primary text-primary-foreground p-4 rounded-xl flex items-center justify-between shadow-lg">
          <div>
            <p className="font-bold text-lg">Dispose your trash responsibly</p>
            <p className="text-sm opacity-90">with our EcoAgents</p>
          </div>
          <Bot className="w-16 h-16" />
        </div>

        {user && (
          <OfferSummaryCard userId={user?.uid || Cookies.userSession?.uid} />
        )}

        <DashboardSummaryCard userId={user?.uid} />

        {/* Actions */}
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

          <Link to="/schedule" className="block h-full">
            <Card className="p-4 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer hover:bg-gray-100 transition-colors h-full">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Book Later</h3>
              <p className="text-sm text-muted-foreground">Schedule a Pickup</p>
            </Card>
          </Link>
        </div>
        {/* 
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-800 mt-6">Your Recent Pickups</h2>

          {instantPickups.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Instant Pickups</h3>
              <div className="space-y-2">
                {instantPickups.map((pickup) => (
                  <Card key={pickup.id} className="p-3 flex justify-between items-center border-l-4 border-green-500 shadow">
                    <div>
                      <p className="font-medium text-gray-800">{pickup.wasteType}</p>
                      <p className="text-xs text-muted-foreground">{pickup.volume} • {pickup.address}</p>
                    </div>
                    <span className="font-bold text-green-600">{pickup.price}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {scheduledPickups.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Scheduled Pickups</h3>
              <div className="space-y-2">
                {scheduledPickups.map((pickup) => (
                  <Card key={pickup.id} className="p-3 flex justify-between items-center border-l-4 border-blue-500 shadow">
                    <div>
                      <p className="font-medium text-gray-800">{pickup.wasteType}</p>
                      <p className="text-xs text-muted-foreground">
                        {pickup.estimatedVolume} • {pickup.address} • {pickup.date} {pickup.time}
                      </p>
                    </div>
                    <span className="font-bold text-blue-600">{pickup.estimatedPrice?.toLocaleString()} XAF</span>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
 */}

        <Card className="p-4 flex items-center gap-4 shadow-lg">
          <div className="bg-blue-100 p-3 rounded-full">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Tip</h3>
            <p className="text-sm text-muted-foreground">
              Separating plastic and metal improves scanning accuracy.
            </p>
          </div>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default LoggedInHome;
