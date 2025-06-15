
import React from 'react';
import { CheckCircle, LoaderCircle, Package, CircleDollarSign, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  onScheduleSuccess: () => void;
  onReset: () => void;
}

const SnapAnalysisView: React.FC<SnapAnalysisViewProps> = ({
  previewUrl,
  isAnalyzing,
  analysisResult,
  isPickupDialogOpen,
  setIsPickupDialogOpen,
  onScheduleClick,
  onScheduleSuccess,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      <img src={previewUrl} alt="Trash preview" className="rounded-lg object-cover w-full aspect-square" />
      
      <div className="flex flex-col justify-center space-y-4">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8 bg-card rounded-lg border">
            <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
            <p className="font-semibold text-lg">Analyzing image...</p>
            <p className="text-muted-foreground text-sm">This may take a moment.</p>
          </div>
        ) : analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {analysisResult.error ? (
                  <XCircle className="text-destructive" />
                ) : (
                  <CheckCircle className="text-green-500" />
                )}
                {analysisResult.error ? 'Analysis Failed' : 'Analysis Complete'}
              </CardTitle>
              <CardDescription>
                {analysisResult.error ? analysisResult.error : 'Based on our AI assessment.'}
              </CardDescription>
            </CardHeader>
            {!analysisResult.error && (
              <CardContent className="space-y-4">
                {analysisResult.detectedItems && analysisResult.detectedItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Detected Items</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.detectedItems.map((item, index) => (
                        <Badge key={`${item}-${index}`} variant="secondary" className="capitalize">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Package className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Volume</p>
                    <p className="font-semibold">{analysisResult.volume}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <CircleDollarSign className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Price</p>
                    <p className="font-semibold text-xl">{analysisResult.price}</p>
                  </div>
                </div>
                <Dialog open={isPickupDialogOpen} onOpenChange={setIsPickupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={onScheduleClick}>Schedule Pickup</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule Pickup</DialogTitle>
                      <DialogDescription>
                        Enter your details below. An agent will be assigned shortly.
                      </DialogDescription>
                    </DialogHeader>
                    <SchedulePickupForm 
                      onSchedule={onScheduleSuccess} 
                      volume={analysisResult.volume!}
                      price={analysisResult.price!}
                    />
                  </DialogContent>
                </Dialog>
              </CardContent>
            )}
          </Card>
        )}
      </div>
       <Button variant="outline" className="w-full" onClick={onReset}>Take another photo</Button>
    </div>
  );
};

export default SnapAnalysisView;
