
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const History = () => (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <DashboardHeader />
        <main className="flex-1 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Pickup History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This page will show your past trash pickups.</p>
                </CardContent>
            </Card>
        </main>
        <BottomNav />
    </div>
);
export default History;
