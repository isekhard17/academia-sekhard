import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
          <span
            className={
              index === items.length - 1
                ? 'font-medium text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}