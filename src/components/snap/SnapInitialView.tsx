import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SnapInitialViewProps {
  onShutterClick: () => void;
}

const SnapInitialView: React.FC<SnapInitialViewProps> = ({
  onShutterClick,
}) => {
  return (
    <div className="space-y-6 ">
      <div className="bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white p-4 relative mx-auto w-1/2 max-sm:w-full md:h-[400px] h-[500px] ">
        <p className="font-medium text-center">Point camera at your waste</p>
        <button
          onClick={onShutterClick}
          className="w-16 h-16 rounded-full bg-transparent border-[3px] border-green-400 flex items-center justify-center p-1 absolute bottom-8"
        >
          <div className="w-full h-full rounded-full bg-white shadow-lg"></div>
        </button>
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
