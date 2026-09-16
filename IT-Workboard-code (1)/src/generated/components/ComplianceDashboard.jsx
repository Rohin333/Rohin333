import { Shield, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Spinner } from '@components/ui/spinner';
import { FadeIn, AnimatedList } from '@skills/motion-animations.jsx';

export default function ComplianceDashboard({ aggregates, aggLoading, items, loading }) {
  const rates = aggregates?.rates || {};
  const counts = aggregates?.counts || {};
  const healthDist = aggregates?.healthDist || [];

  if (aggLoading && !aggregates) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const riskLevel = rates.riskScore > 60 ? 'HIGH' : rates.riskScore > 30 ? 'MEDIUM' : 'LOW';
  const riskColor = riskLevel === 'HIGH' ? 'text-destructive' : riskLevel === 'MEDIUM' ? 'text-primary' : 'text-primary';
  const riskBorder = riskLevel === 'HIGH' ? 'border-destructive/30' : 'border-primary/20';

  return (
    <div className="relative space-y-5 z-10">
      <FadeIn direction="down" distance={10}>
        <div>
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
            Compliance & Risk
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Security posture, SLA compliance, and risk indicators</p>
        </div>
      </FadeIn>

      {/* Risk Score Cards */}
      <AnimatedList stagger={0.1} animation="fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`border ${riskBorder} bg-card/50 p-5 text-center`}>
            <Shield className={`h-7 w-7 mx-auto mb-2 ${riskColor}`} />
            <p className={`text-3xl font-[family-name:var(--font-heading)] font-semibold ${riskColor}`}>
              {rates.riskScore || 0}
            </p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Risk Score</p>
            <p className={`text-xs mt-1 font-[family-name:var(--font-heading)] font-medium ${riskColor}`}>{riskLevel}</p>
          </div>
          <div className="border border-primary/20 bg-card/50 p-5 text-center">
            <CheckCircle2 className="h-7 w-7 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-[family-name:var(--font-heading)] font-semibold text-primary">
              {rates.complianceRate || 0}%
            </p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Compliance Rate</p>
          </div>
          <div className="border border-destructive/20 bg-card/50 p-5 text-center">
            <AlertTriangle className="h-7 w-7 mx-auto mb-2 text-destructive" />
            <p className="text-3xl font-[family-name:var(--font-heading)] font-semibold text-foreground">
              {counts.itemsWithBlockers || 0}
            </p>
            <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Active Blockers</p>
          </div>
        </div>
      </AnimatedList>

      {/* Coverage Metrics */}
      <FadeIn direction="up" delay={0.3}>
        <div className="border border-border bg-card/30 p-5 space-y-4">
          <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
            Coverage Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Cost Documented', value: rates.costCoverage },
              { label: 'Resources Assigned', value: rates.assignmentRate },
              { label: 'Documentation', value: rates.docCoverage },
              { label: 'Overall Completion', value: rates.completionRate },
            ].map(metric => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground">{metric.label}</span>
                  <span className="text-primary font-[family-name:var(--font-heading)] font-semibold">{metric.value || 0}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 transition-all duration-500"
                    style={{ width: `${Math.min(parseFloat(metric.value) || 0, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Health Distribution */}
      <FadeIn direction="up" delay={0.4}>
        <div className="border border-border bg-card/30 p-5 space-y-3">
          <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
            Completion Status Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {healthDist.map(h => (
              <div key={h.completionStatus} className="border border-border/50 bg-muted/20 p-3 text-center">
                <p className="text-lg font-[family-name:var(--font-heading)] font-semibold text-foreground">{h.count}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wider">{h.completionStatus}</p>
              </div>
            ))}
            {healthDist.length === 0 && (
              <p className="text-xs text-muted-foreground col-span-full text-center py-3">No health data</p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Critical Items */}
      <FadeIn direction="up" delay={0.5}>
        <div className="border border-destructive/20 bg-card/30 p-5 space-y-3">
          <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-destructive uppercase tracking-wider">
            Critical & Stuck Items
          </h3>
          <div className="divide-y divide-border/40">
            {items
              .filter(i => i.priority === 'Critical' || i.status === 'Stuck')
              .slice(0, 8)
              .map(item => (
                <div key={item.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    <span className="text-xs text-foreground">{item.name}</span>
                  </div>
                  <span className="text-[10px] text-destructive font-medium">{item.priority || item.status}</span>
                </div>
              ))}
            {items.filter(i => i.priority === 'Critical' || i.status === 'Stuck').length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No critical items</p>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
