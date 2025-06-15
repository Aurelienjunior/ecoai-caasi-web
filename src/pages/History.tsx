
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import OffersTable from "@/components/history/OffersTable";
import { useAuth } from "@/contexts/AuthContext";

const History = () => {
  const { user } = useAuth();
  // Guard: If not logged in, return a loading or error state
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <DashboardHeader />
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="text-lg text-muted-foreground">Please log in to view your history.</div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <DashboardHeader />
      <main className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-6">Pickup History & Offers</h2>
        <OffersTable userId={user.id} />
      </main>
      <BottomNav />
    </div>
  );
};

export default History;

