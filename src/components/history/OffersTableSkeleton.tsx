
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 4;

const OffersTableSkeleton = () => (
  <Card className="overflow-x-auto p-4 animate-pulse">
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Date", "Address", "Volume", "Price", "Status", "Agent", "Action"].map(h => (
          <Skeleton key={h} className="h-5 w-20" />
        ))}
      </div>
      {[...Array(ROWS)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-2 mb-2">
          {[...Array(7)].map((__, j) => (
            <Skeleton key={j} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  </Card>
);

export default OffersTableSkeleton;
