import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: number;
  decimals?: number;
  suffix?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  decimals = 0,
  suffix = ''
}: StatCardProps) {
  const isPositive = trend > 0;
  const formattedValue = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
            {formattedValue}{suffix}
          </p>
        </div>
        <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg shadow-inner">
          <Icon className="w-5 h-5 text-indigo-500" />
        </div>
      </div>
      {trend !== 0 && (
        <div className="mt-3 flex items-center">
          <span
            className={`text-sm font-medium ${
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {trend}%
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            vs mes anterior
          </span>
        </div>
      )}
    </div>
  );
}