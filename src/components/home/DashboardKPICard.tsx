import React from 'react';

interface DashboardKPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg?: string;
}

const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  icon,
  label,
  value,
  iconBg,
}) => (
  <div className="flex flex-1 items-center gap-4 bg-muted rounded-xl px-4 py-5 shadow-sm">
    <span
      className={`rounded-full p-2 flex items-center justify-center ${
        iconBg ?? 'bg-gray-200'
      }`}
    >
      {icon}
    </span>
    <div>
      <div className="text-xs text-muted-foreground font-medium">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

export default DashboardKPICard;
