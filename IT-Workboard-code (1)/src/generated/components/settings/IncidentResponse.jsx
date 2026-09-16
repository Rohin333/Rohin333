import { useSettings } from '@generated/hooks/useSettings';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/ui/select';
import { Skeleton } from '@components/ui/skeleton';

export default function IncidentResponse() {
  const { settings, update, loading } = useSettings();

  if (loading) return <div className="glass-surface p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="glass-surface space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold">Incident Response & DR</h3>
        <p className="text-sm text-muted-foreground">ISO 27001 A.16 — Incident Mgmt & A.17 — Business Continuity</p>
      </div>

      <div className="space-y-4">
        <span className="mono-label">Recovery Objectives</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="rto" className="text-xs text-muted-foreground">RTO (Recovery Time Objective)</label>
            <Select value={settings.rtoHours} onValueChange={v => update('rtoHours', v)}>
              <SelectTrigger id="rto"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="2">2 Hours</SelectItem>
                <SelectItem value="4">4 Hours</SelectItem>
                <SelectItem value="8">8 Hours</SelectItem>
                <SelectItem value="24">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="rpo" className="text-xs text-muted-foreground">RPO (Recovery Point Objective)</label>
            <Select value={settings.rpoHours} onValueChange={v => update('rpoHours', v)}>
              <SelectTrigger id="rpo"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Zero Data Loss</SelectItem>
                <SelectItem value="1">1 Hour</SelectItem>
                <SelectItem value="4">4 Hours</SelectItem>
                <SelectItem value="24">24 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <span className="mono-label">Backup Configuration</span>
        <Select value={settings.backupFrequency} onValueChange={v => update('backupFrequency', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time Replication</SelectItem>
            <SelectItem value="hourly">Hourly Snapshots</SelectItem>
            <SelectItem value="daily">Daily Full Backup</SelectItem>
            <SelectItem value="weekly">Weekly Full Backup</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <span className="mono-label">Escalation Matrix</span>
        <div className="rounded-lg border border-border">
          <div className="flex justify-between border-b border-border px-3 py-2.5">
            <span className="text-xs font-medium text-destructive">P1 Critical</span>
            <span className="text-xs">IT Mgr → DGD → DG (15 min)</span>
          </div>
          <div className="flex justify-between border-b border-border px-3 py-2.5">
            <span className="text-xs font-medium text-accent">P2 High</span>
            <span className="text-xs">Team Lead → IT Mgr (30 min)</span>
          </div>
          <div className="flex justify-between border-b border-border px-3 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">P3 Medium</span>
            <span className="text-xs">Team Lead (1 hour)</span>
          </div>
          <div className="flex justify-between px-3 py-2.5">
            <span className="text-xs font-medium text-muted-foreground">P4 Low</span>
            <span className="text-xs">Assigned Engineer (4 hours)</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">DR Plan:</strong> Annual DR drill required. Last test validates {settings.rtoHours}hr
          RTO and {settings.rpoHours}hr RPO. Site failover to AWS Bahrain region.
        </p>
      </div>
    </div>
  );
}
