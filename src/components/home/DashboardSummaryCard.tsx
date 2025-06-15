
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, CheckCircle, Clock } from 'lucide-react';

const DashboardSummaryCard = () => {
    const summary = {
        totalPickups: 12,
        completed: 10,
        pending: 2,
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>My Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Total Pickups</span>
                    </div>
                    <span className="font-bold">{summary.totalPickups}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Completed</span>
                    </div>
                    <span className="font-bold">{summary.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Pending</span>
                    </div>
                    <span className="font-bold">{summary.pending}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardSummaryCard;
