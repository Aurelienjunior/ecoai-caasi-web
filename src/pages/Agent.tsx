
import BottomNav from "@/components/layout/BottomNav";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Agent = () => (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <DashboardHeader />
        <main className="flex-1 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This page will show available EcoAgents in your area.</p>
                </CardContent>
            </Card>
        </main>
        <BottomNav />
    </div>
);
export default Agent;
