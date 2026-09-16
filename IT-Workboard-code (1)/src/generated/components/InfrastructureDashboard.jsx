import { Server, Cloud, Shield, HardDrive } from 'lucide-react';
import { Spinner } from '@components/ui/spinner';
import { FadeIn, AnimatedList } from '@skills/motion-animations.jsx';

export default function InfrastructureDashboard({ aggregates, aggLoading, items, loading }) {
  const infraDist = aggregates?.infraDist || [];
  const totals = aggregates?.totals || {};

  if (aggLoading && !aggregates) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const infraItems = items.filter(i => i.infrastructureType && i.infrastructureType.length > 0);
  const annualK = totals.totalAnnualCost ? (totals.totalAnnualCost / 1000).toFixed(0) : '0';
  const monthlyK = totals.totalMonthlyCost ? (totals.totalMonthlyCost / 1000).toFixed(0) : '0';

  return (
    <div className="relative space-y-5 z-10">
      <FadeIn direction="down" distance={10}>
        <div>
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
            Infrastructure Overview
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">AWS, VMware, Network & Security systems</p>
        </div>
      </FadeIn>

      {/* Summary KPIs */}
      <AnimatedList stagger={0.08} animation="fadeUp">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-border bg-card/50 p-4">
            <Server className="h-4 w-4 text-primary mb-2" />
            <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{totals.totalAWSServers || 0}</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Total Servers</p>
          </div>
          <div className="border border-border bg-card/50 p-4">
            <Cloud className="h-4 w-4 text-primary mb-2" />
            <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{annualK}K</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Annual Cost (BHD)</p>
          </div>
          <div className="border border-border bg-card/50 p-4">
            <Shield className="h-4 w-4 text-destructive mb-2" />
            <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{infraDist.length}</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Infra Types</p>
          </div>
          <div className="border border-border bg-card/50 p-4">
            <HardDrive className="h-4 w-4 text-primary mb-2" />
            <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{monthlyK}K</p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Monthly Cost (BHD)</p>
          </div>
        </div>
      </AnimatedList>

      {/* Infrastructure Distribution */}
      <FadeIn direction="up" delay={0.3}>
        <div className="border border-border bg-card/30 p-5 space-y-3">
          <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
            By Infrastructure Type
          </h3>
          <div className="space-y-2.5">
            {infraDist.map((row) => {
              const maxCount = Math.max(...infraDist.map(d => d.count || 0), 1);
              const pct = ((row.count || 0) / maxCount) * 100;
              return (
                <div key={row.infrastructureType} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{row.infrastructureType}</span>
                    <span className="text-muted-foreground">{row.count} items · {row.annualCost ? `${(row.annualCost/1000).toFixed(0)}K BHD` : '—'}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/60 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {infraDist.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No infrastructure data available</p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Top Infrastructure Items */}
      <FadeIn direction="up" delay={0.4}>
        <div className="border border-border bg-card/30 p-5 space-y-3">
          <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
            Infrastructure Items
          </h3>
          <div className="divide-y divide-border/40">
            {infraItems.slice(0, 10).map(item => (
              <div key={item.id} className="grid grid-cols-[1fr_120px_80px_80px] gap-2 py-2.5 items-center hover:bg-primary/5 transition-colors">
                <span className="text-xs text-foreground truncate">{item.name}</span>
                <span className="text-[10px] text-muted-foreground">{item.infrastructureType?.join(', ')}</span>
                <span className="text-[10px] text-primary font-medium">{item.awsServerCount ? `${item.awsServerCount} srv` : '—'}</span>
                <span className="text-[10px] text-muted-foreground">{item.annualCostBhd ? `${(item.annualCostBhd/1000).toFixed(0)}K` : '—'}</span>
              </div>
            ))}
            {infraItems.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No infrastructure items</p>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
