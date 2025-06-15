import React from 'react';
import { ArrowLeft, CheckCircle, LoaderCircle, Package, CircleDollarSign, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import BottomNav from '@/components/layout/BottomNav';
import SchedulePickupForm from '@/components/home/SchedulePickupForm';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeTrashImage, loadImage, AnalysisResult } from '@/lib/imageAnalysis';
import { Badge } from '@/components/ui/badge';

const SnapHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 flex items-center gap-4 border-b">
            <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Snap your waste</h1>
        </header>
    );
};

const Snap = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isPickupDialogOpen, setIsPickupDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
      setIsAnalyzing(true);
      
      try {
        toast.info("Starting AI analysis...", { description: "The model will be downloaded if it's your first time." });
        const imageElement = await loadImage(selectedFile);
        const result = await analyzeTrashImage(imageElement);
        setAnalysisResult(result);
        if (result.error) {
          toast.error("Analysis Failed", { description: result.error });
        } else {
          toast.success("Analysis Complete!");
        }
      } catch (error) {
        console.error("Error loading or analyzing image:", error);
        const errMessage = "Could not load the image file.";
        toast.error("Analysis Failed", { description: errMessage });
        setAnalysisResult({ volume: 'N/A', price: 'N/A', error: errMessage, detectedItems: [] });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleShutterClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleScheduleSuccess = () => {
    setIsPickupDialogOpen(false);
    toast.success("Pickup scheduled!", {
      description: "We've received your request and will notify you once an agent is assigned.",
      duration: 5000,
    });
    
    setTimeout(() => {
        navigate('/');
    }, 1000);
  };

  const handleScheduleClick = () => {
    if (user) {
      setIsPickupDialogOpen(true);
    } else {
      toast.info("Please log in to schedule a pickup.", {
        description: "You'll be redirected to the login page.",
        duration: 2000,
      });
      setTimeout(() => navigate('/auth'), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <SnapHeader />
        <main className="flex-1 p-4 md:p-6">
            {!previewUrl ? (
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 relative aspect-[3/4] max-h-[50vh]">
                        <p className="font-medium text-center">Point camera at your waste</p>
                        <button onClick={handleShutterClick} className="w-16 h-16 rounded-full bg-transparent border-[3px] border-green-400 flex items-center justify-center p-1 absolute bottom-8">
                            <div className="w-full h-full rounded-full bg-white shadow-lg"></div>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                        />
                    </div>
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <h3 className="font-bold text-base mb-4">Take a clear photo for accurate AI analysis</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Ensure good lighting</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Include all waste in frame</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>Avoid shadows or reflections</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            ) : (
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
                                <Button className="w-full" onClick={handleScheduleClick}>Schedule Pickup</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Schedule Pickup</DialogTitle>
                                  <DialogDescription>
                                    Enter your details below. An agent will be assigned shortly.
                                  </DialogDescription>
                                </DialogHeader>
                                <SchedulePickupForm 
                                  onSchedule={handleScheduleSuccess} 
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
                     <Button variant="outline" className="w-full" onClick={handleReset}>Take another photo</Button>
                </div>
            )}
        </main>
        <BottomNav />
    </div>
  );
};

export default Snap;
