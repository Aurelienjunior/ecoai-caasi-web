
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import OffersTable from "@/components/history/OffersTable";

const History = () => (
  <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
    <DashboardHeader />
    <main className="flex-1 p-4">
      <h2 className="text-2xl font-bold mb-6">Pickup History & Offers</h2>
      <OffersTable />
    </main>
    <BottomNav />
  </div>
);

export default History;
