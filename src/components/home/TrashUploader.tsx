
import React from 'react';
import { UploadCloud, LoaderCircle, Package, CircleDollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AnalysisResult {
  volume: string;
  price: string;
}

const TrashUploader = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalysisResult | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
      setIsAnalyzing(true);
      // Simulate API call for analysis
      setTimeout(() => {
        setAnalysisResult({
          volume: 'Medium (approx. 2-3 bags)',
          price: 'XAF 500',
        });
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleUploadClick = () => {
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

  return (
    <section id="upload" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get an Instant Quote</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Upload a picture of your trash and let our AI do the rest.
          </p>
        </div>
        <div className="mt-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              {!previewUrl ? (
                <div 
                  className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer"
                  onClick={handleUploadClick}
                >
                  <UploadCloud className="w-12 h-12 text-muted-foreground" />
                  <p className="mt-4 text-lg font-semibold">Click to upload a photo</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <img src={previewUrl} alt="Trash preview" className="rounded-lg object-cover w-full aspect-square" />
                    <Button variant="outline" className="w-full" onClick={handleReset}>Upload another photo</Button>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
                        <p className="font-semibold text-lg">Analyzing image...</p>
                        <p className="text-muted-foreground text-sm">This may take a moment.</p>
                      </div>
                    ) : analysisResult && (
                      <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="text-green-500" />
                                Analysis Complete
                            </CardTitle>
                          <CardDescription>Based on our AI assessment.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                          <Button className="w-full">Schedule Pickup</Button>
                        </CardContent>
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
