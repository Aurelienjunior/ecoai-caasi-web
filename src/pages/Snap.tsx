
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { analyzeTrashImage, loadImage, AnalysisResult } from '@/lib/imageAnalysis';
import SnapHeader from '@/components/snap/SnapHeader';
import SnapInitialView from '@/components/snap/SnapInitialView';
import SnapAnalysisView from '@/components/snap/SnapAnalysisView';

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
                <>
                    <SnapInitialView onShutterClick={handleShutterClick} />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                    />
                </>
            ) : (
                <SnapAnalysisView
                    previewUrl={previewUrl}
                    isAnalyzing={isAnalyzing}
                    analysisResult={analysisResult}
                    isPickupDialogOpen={isPickupDialogOpen}
                    setIsPickupDialogOpen={setIsPickupDialogOpen}
                    onScheduleClick={handleScheduleClick}
                    onScheduleSuccess={handleScheduleSuccess}
                    onReset={handleReset}
                />
            )}
        </main>
        <BottomNav />
    </div>
  );
};

export default Snap;
