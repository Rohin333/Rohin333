import { Button } from '@components/ui/button';
import { PieChart as PieIcon, BarChart3, BarChartHorizontal, Activity } from 'lucide-react';
import { cn } from '@lib/utils';

const CHART_OPTIONS = [
  { id: 'donut', icon: PieIcon, label: 'Donut' },
  { id: 'bar', icon: BarChart3, label: 'Bar' },
  { id: 'hbar', icon: BarChartHorizontal, label: 'Horizontal' },
  { id: 'area', icon: Activity, label: 'Area' },
];

export default function ChartSwitcher({ value, onChange, options }) {
  const available = options
    ? CHART_OPTIONS.filter(o => options.includes(o.id))
    : CHART_OPTIONS;

  return (
    <div className="flex items-center gap-0.5 bg-muted/50 rounded-md p-0.5">
      {available.map(opt => {
        const Icon = opt.icon;
        const active = value === opt.id;
        return (
          <Button
            key={opt.id}
            variant="ghost"
            size="sm"
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-5 w-5 p-0 rounded-sm",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={opt.label}
          >
            <Icon className="h-3 w-3" />
          </Button>
        );
      })}
    </div>
  );
}

// Shared tooltip style for all dark-theme charts
export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '6px',
    fontSize: '11px',
    color: 'hsl(var(--popover-foreground))',
    boxShadow: '0 4px 12px hsl(var(--background) / 0.4)',
  },
  itemStyle: {
    color: 'hsl(var(--popover-foreground))',
    fontSize: '11px',
  },
  labelStyle: {
    color: 'hsl(var(--popover-foreground))',
    fontWeight: 600,
    fontSize: '11px',
    marginBottom: '2px',
  },
};
