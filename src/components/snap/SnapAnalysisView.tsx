import React from 'react';
import { LoaderCircle, XCircle, Info, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import SchedulePickupForm from '@/components/home/SchedulePickupForm';
import { AnalysisResult } from '@/lib/imageAnalysis';
import { Badge } from '@/components/ui/badge';

interface SnapAnalysisViewProps {
  previewUrl: string;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  isPickupDialogOpen: boolean;
  setIsPickupDialogOpen: (isOpen: boolean) => void;
  onScheduleClick: () => void;
  onSchedule: (values: any) => void;
  onReset: () => void;
}

const SnapAnalysisView: React.FC<SnapAnalysisViewProps> = ({
  previewUrl,
  isAnalyzing,
  analysisResult,
  isPickupDialogOpen,
  setIsPickupDialogOpen,
  onScheduleClick,
  onSchedule,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <img src={previewUrl} alt="Trash preview" className="rounded-2xl object-cover w-full aspect-[4/3]" />
      
      <div className="flex flex-col justify-center space-y-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-card rounded-lg border">
            <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            <p className="font-semibold text-lg">Analyzing image...</p>
            <p className="text-muted-foreground text-sm">This may take a moment.</p>
          </div>
        ) : analysisResult && (
          <>
            {analysisResult.error ? (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="text-destructive" />
                    Analysis Failed
                  </CardTitle>
                  <CardDescription>{analysisResult.error}</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="border-2 border-green-400 rounded-2xl p-4 space-y-4 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-gray-800">Analysis Result</h3>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 font-semibold border-transparent">Completed</Badge>
                </div>

                <div className="space-y-3 text-base">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated volume</span>
                        <span className="font-medium text-gray-800 text-right">{analysisResult.volume}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Waste Type</span>
                        <span className="font-medium text-gray-800 text-right">{analysisResult.wasteType}</span>
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-gray-800">Price Estimate</span>
                    <span className="text-2xl font-bold text-green-600">{analysisResult.price}</span>
                </div>

                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="w-3.5 h-3.5" />
                    <span>Price based on waste type and volume</span>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 pt-2">
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center py-6 text-base h-auto" onClick={onReset}>
                    <X className="mr-2 h-5 w-5" /> Decline
                </Button>
                <Dialog open={isPickupDialogOpen} onOpenChange={setIsPickupDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center py-6 text-base h-auto" 
                            onClick={onScheduleClick}
                            disabled={!!analysisResult.error}
                        >
                            <Check className="mr-2 h-5 w-5" /> Accept
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Schedule Pickup</DialogTitle>
                          <DialogDescription>
                            Enter your details below. An agent will be assigned shortly.
                          </DialogDescription>
                        </DialogHeader>
                        <SchedulePickupForm 
                          onSchedule={onSchedule} 
                        />
                    </DialogContent>
                </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SnapAnalysisView;
