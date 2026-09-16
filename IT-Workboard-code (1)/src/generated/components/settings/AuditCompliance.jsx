import { useSettings } from '@generated/hooks/useSettings';
import { Input } from '@components/ui/input';
import { Skeleton } from '@components/ui/skeleton';
import { Badge } from '@components/ui/badge';

const CONTROLS = [
  { id: 'A.5', name: 'Information Security Policies', status: 'compliant' },
  { id: 'A.6', name: 'Organization of Information Security', status: 'compliant' },
  { id: 'A.7', name: 'Human Resource Security', status: 'compliant' },
  { id: 'A.8', name: 'Asset Management', status: 'partial' },
  { id: 'A.9', name: 'Access Control', status: 'compliant' },
  { id: 'A.10', name: 'Cryptography', status: 'compliant' },
  { id: 'A.11', name: 'Physical & Environmental Security', status: 'compliant' },
  { id: 'A.12', name: 'Operations Security', status: 'partial' },
  { id: 'A.13', name: 'Communications Security', status: 'compliant' },
  { id: 'A.14', name: 'System Acquisition & Development', status: 'compliant' },
  { id: 'A.15', name: 'Supplier Relationships', status: 'review' },
  { id: 'A.16', name: 'Incident Management', status: 'compliant' },
  { id: 'A.17', name: 'Business Continuity', status: 'partial' },
  { id: 'A.18', name: 'Compliance', status: 'compliant' },
];

const STATUS_MAP = {
  compliant: { label: 'Compliant', cls: 'border-primary/30 bg-primary/10 text-primary' },
  partial: { label: 'Partial', cls: 'border-accent/30 bg-accent/10 text-accent' },
  review: { label: 'Review', cls: 'border-destructive/30 bg-destructive/10 text-destructive' },
};

export default function AuditCompliance() {
  const { settings, update, loading } = useSettings();
  const compliantCount = CONTROLS.filter(c => c.status === 'compliant').length;
  const score = Math.round((compliantCount / CONTROLS.length) * 100);

  if (loading) return <div className="glass-surface p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="glass-surface space-y-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit & Compliance</h3>
          <p className="text-sm text-muted-foreground">ISO 27001 A.18 — Compliance Monitoring</p>
        </div>
        <div className="text-right">
          <p className="metric-value !text-2xl">{score}%</p>
          <span className="mono-label">Score</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="mono-label">Last Audit Date</span>
          <Input type="date" value={settings.lastAuditDate} onChange={e => update('lastAuditDate', e.target.value)} />
        </div>
        <div className="space-y-2">
          <span className="mono-label">Next Scheduled Audit</span>
          <Input type="date" value={settings.nextAuditDate} onChange={e => update('nextAuditDate', e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <span className="mono-label">ISO 27001 Annex A Controls</span>
        <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
          {CONTROLS.map(c => {
            const s = STATUS_MAP[c.status];
            return (
              <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="mono-label !text-foreground">{c.id}</span>
                  <span className="text-sm">{c.name}</span>
                </div>
                <Badge variant="outline" className={`shrink-0 text-[10px] ${s.cls}`}>{s.label}</Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
