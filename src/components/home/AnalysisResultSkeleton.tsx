
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AnalysisResultSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[60%] mb-2" />
      <Skeleton className="h-4 w-[80%]" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded" />
    </CardContent>
  </Card>
);

export default AnalysisResultSkeleton;
