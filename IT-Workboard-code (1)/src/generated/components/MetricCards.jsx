import { Skeleton } from '@components/ui/skeleton';
import { FadeIn, HoverGrow } from '@skills/motion-animations.jsx';
import { FolderOpen, Server, Zap, Users } from 'lucide-react';

const ICONS = [FolderOpen, Server, Zap, Users];

export default function MetricCards({ items = [], subscribers = [], loading = true }) {
  if (loading) return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="kpi-card p-5">
          <Skeleton className="mb-3 h-3 w-24" /><Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );

  const total = items.length;
  const statusCounts = {};
  items.forEach(item => {
    const status = item.status || 'Unknown';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const prog = statusCounts['In Progress'] || 0;
  const done = statusCounts['Done'] || 0;
  const completion = total > 0 ? ((done / total) * 100).toFixed(1) : '0.0';

  const data = [
    { label: 'Active Projects', value: total },
    { label: 'Systems', value: prog + done },
    { label: 'Uptime', value: `${completion}%` },
    { label: 'Team Members', value: subscribers?.length ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {data.map((m, i) => {
        const Icon = ICONS[i];
        return (
          <FadeIn key={m.label} direction="up" delay={i * 0.08}>
            <HoverGrow scale={1.03} lift={4}>
              <div className="kpi-card flex items-center justify-between p-5">
                <div>
                  <p className="kpi-number text-3xl md:text-4xl">{m.value}</p>
                  <p className="mono-label mt-1">{m.label}</p>
                </div>
                <Icon className="kpi-icon size-8" />
              </div>
            </HoverGrow>
          </FadeIn>
        );
      })}
    </div>
  );
}
