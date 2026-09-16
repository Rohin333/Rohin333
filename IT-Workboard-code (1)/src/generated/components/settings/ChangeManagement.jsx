import { useSettings } from '@generated/hooks/useSettings';
import { Switch } from '@components/ui/switch';
import { Input } from '@components/ui/input';
import { Skeleton } from '@components/ui/skeleton';

export default function ChangeManagement() {
  const { settings, update, loading } = useSettings();

  if (loading) return <div className="glass-surface p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="glass-surface space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold">Change Management</h3>
        <p className="text-sm text-muted-foreground">ISO 27001 A.12.1.2 — Change Management Controls</p>
      </div>

      <div className="space-y-4">
        <span className="mono-label">Approval Workflow</span>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require Change Approval</p>
              <p className="text-xs text-muted-foreground">All changes need formal approval before implementation</p>
            </div>
            <Switch checked={settings.changeApprovalRequired} onCheckedChange={v => update('changeApprovalRequired', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Project Owner Sign-off</p>
              <p className="text-xs text-muted-foreground">Business owner must approve</p>
            </div>
            <Switch checked={settings.requireProjectOwner} onCheckedChange={v => update('requireProjectOwner', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">IT Manager Approval</p>
              <p className="text-xs text-muted-foreground">Technical lead review required</p>
            </div>
            <Switch checked={settings.requireITManager} onCheckedChange={v => update('requireITManager', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">DGD Approval</p>
              <p className="text-xs text-muted-foreground">Director General Deputy authorization</p>
            </div>
            <Switch checked={settings.requireDGD} onCheckedChange={v => update('requireDGD', v)} />
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-4">
        <span className="mono-label">Change Freeze & Emergency</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="freeze-period" className="text-xs text-muted-foreground">Change Freeze Period</label>
            <Input id="freeze-period" placeholder="e.g. Dec 20 – Jan 5" value={settings.changeFreezePeriod}
              onChange={e => update('changeFreezePeriod', e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Emergency Changes</p>
              <p className="text-xs text-muted-foreground">Allow expedited path</p>
            </div>
            <Switch checked={settings.emergencyChangeEnabled} onCheckedChange={v => update('emergencyChangeEnabled', v)} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">CAB Process:</strong> All standard changes reviewed in weekly Change Advisory Board meeting.
          Emergency changes require retrospective CAB approval within 48 hours.
        </p>
      </div>
    </div>
  );
}
