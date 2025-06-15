
import React from 'react';
import { UploadCloud, LoaderCircle, Package, CircleDollarSign, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import SchedulePickupForm from './SchedulePickupForm';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analyzeTrashImage, loadImage, AnalysisResult } from '@/lib/imageAnalysis';
import AnalysisResultSkeleton from "./AnalysisResultSkeleton";

const TrashUploader = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const [isPickupDialogOpen, setIsPickupDialogOpen] = React.useState(false);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
      setAnalysisError(null);
      setIsAnalyzing(true);
      
      try {
        toast.info("Starting AI analysis...", { description: "The model will be downloaded if it's your first time." });
        const imageElement = await loadImage(selectedFile);
        const result = await analyzeTrashImage(imageElement);
        setAnalysisResult(result);
        if (result.error) {
          toast.error("Analysis Failed", {
            description: result.error,
            action: (
              <Button size="sm" variant="outline" onClick={handleRetryAnalysis} aria-label="Retry analysis">
                <RefreshCcw size={16} className="mr-1" /> Retry
              </Button>
            ),
          });
          setAnalysisError(result.error);
        } else {
          toast.success("Analysis Complete!");
        }
      } catch (error) {
        console.error("Error loading or analyzing image:", error);
        const errMessage = "Could not load the image file.";
        toast.error("Analysis Failed", {
          description: errMessage,
          action: (
            <Button size="sm" variant="outline" onClick={handleRetryAnalysis} aria-label="Retry analysis">
              <RefreshCcw size={16} className="mr-1" /> Retry
            </Button>
          ),
        });
        setAnalysisError(errMessage);
        setAnalysisResult({ volume: 'N/A', price: 'N/A', wasteType: 'N/A', error: errMessage, detectedItems: [] });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetryAnalysis = () => {
    // Re-analyze the same file
    if (file) {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setAnalysisResult(null);
      setTimeout(async () => {
        try {
          toast.info("Retrying AI analysis...", { description: "The model will be downloaded if needed." });
          const imageElement = await loadImage(file);
          const result = await analyzeTrashImage(imageElement);
          setAnalysisResult(result);
          if (result.error) {
            toast.error("Analysis Failed", {
              description: result.error,
              action: (
                <Button size="sm" variant="outline" onClick={handleRetryAnalysis} aria-label="Retry analysis">
                  <RefreshCcw size={16} className="mr-1" /> Retry
                </Button>
              ),
            });
            setAnalysisError(result.error);
          } else {
            toast.success("Analysis Complete!");
          }
        } catch (error) {
          console.error("Error retry loading/analyzing image:", error);
          const errMessage = "Could not load the image file.";
          toast.error("Analysis Failed", {
            description: errMessage,
            action: (
              <Button size="sm" variant="outline" onClick={handleRetryAnalysis} aria-label="Retry analysis">
                <RefreshCcw size={16} className="mr-1" /> Retry
              </Button>
            ),
          });
          setAnalysisError(errMessage);
          setAnalysisResult({ volume: 'N/A', price: 'N/A', wasteType: 'N/A', error: errMessage, detectedItems: [] });
        } finally {
          setIsAnalyzing(false);
        }
      }, 300);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSchedule = (formValues: any) => {
    setIsPickupDialogOpen(false);
    navigate('/payment', {
        state: {
            scheduleDetails: formValues,
            analysisResult: analysisResult,
        }
    });
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
    <section id="upload" className="w-full py-14 md:py-24 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get an Instant Quote</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Upload a picture of your trash and let our AI do the rest.
          </p>
        </div>
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto bg-white/90 shadow-xl border-green-100">
            <CardContent className="p-6">
              {!previewUrl ? (
                <div 
                  className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer bg-gradient-to-br from-green-100 via-white to-green-50 hover:shadow-lg transition-all duration-200"
                  onClick={handleUploadClick}
                  tabIndex={0}
                  role="button"
                  aria-label="Upload a photo"
                >
                  <UploadCloud className="w-14 h-14 text-muted-foreground" aria-label="Upload icon" />
                  <p className="mt-4 text-lg font-semibold">Click to upload a photo</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    aria-label="Choose image file"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Trash preview" className="rounded-lg object-cover w-full aspect-square border border-green-100 shadow" />
                    <Button variant="outline" className="w-full" onClick={handleReset} aria-label="Upload another photo">Upload another photo</Button>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    {isAnalyzing ? (
                      <AnalysisResultSkeleton />
                    ) : analysisResult && (
                      <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {analysisResult.error ? (
                                  <XCircle className="text-destructive" aria-label="Analysis failed" />
                                ) : (
                                  <CheckCircle className="text-green-500" aria-label="Analysis complete" />
                                )}
                                {analysisResult.error ? 'Analysis Failed' : 'Analysis Complete'}
                            </CardTitle>
                          <CardDescription>
                            {analysisResult.error ? analysisResult.error : 'Based on our AI assessment.'}
                          </CardDescription>
                        </CardHeader>
                        {!analysisResult.error && (
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                              <Package className="w-8 h-8 text-primary" aria-label="Estimated volume" />
                              <div>
                                <p className="text-sm text-muted-foreground">Estimated Volume</p>
                                <p className="font-semibold">{analysisResult.volume}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <CircleDollarSign className="w-8 h-8 text-primary" aria-label="Pickup price" />
                              <div>
                                <p className="text-sm text-muted-foreground">Pickup Price</p>
                                <p className="font-semibold text-xl">{analysisResult.price}</p>
                              </div>
                            </div>
                            <Dialog open={isPickupDialogOpen} onOpenChange={setIsPickupDialogOpen}>
                              <DialogTrigger asChild>
                                <Button className="w-full" onClick={handleScheduleClick} aria-label="Schedule Pickup">Schedule Pickup</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Schedule Pickup</DialogTitle>
                                  <DialogDescription>
                                    Enter your details below. An agent will be assigned shortly.
                                  </DialogDescription>
                                </DialogHeader>
                                <SchedulePickupForm 
                                  onSchedule={handleSchedule} 
                                />
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        )}
                        {analysisResult.error && (
                          <CardContent className="mt-2">
                            <Button variant="outline" onClick={handleRetryAnalysis} aria-label="Retry analysis">
                              <RefreshCcw size={18} className="mr-2" /> Retry
                            </Button>
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrashUploader;

