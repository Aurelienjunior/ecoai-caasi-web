import React, { useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { GrGallery } from 'react-icons/gr';

interface SnapInitialViewProps {
  onShutterClick: () => void;
}

const SnapInitialView: React.FC<SnapInitialViewProps> = ({
  onShutterClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📸 Selected from gallery:', file);
      // You can trigger an upload or pass it to your parent component
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 relative mx-auto w-1/2 max-sm:w-full md:h-[400px] h-[500px]">
        <p className="font-medium text-center">
          Point camera at your waste <br /> or <br /> Pick from gallery
        </p>

        <div className="absolute bottom-0 border border-white p-2 flex justify-center items-center w-full">
          {/* Hidden file input for gallery selection */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Gallery Icon Button */}
          <button
            type="button"
            onClick={handleGalleryClick}
            className="absolute left-5 text-white text-2xl"
          >
            <GrGallery />
          </button>

          {/* Camera Shutter Button */}
          <button
            onClick={onShutterClick}
            className="w-16 h-16 rounded-full bg-transparent border-[3px] border-green-400 flex items-center justify-center p-1"
          >
            <div className="w-full h-full rounded-full bg-white shadow-lg"></div>
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="font-bold text-base mb-4">
            Take a clear photo for accurate AI analysis
          </h3>
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
  );
};

export default SnapInitialView;
