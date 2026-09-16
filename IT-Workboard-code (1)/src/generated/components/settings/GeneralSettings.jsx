import { useSettings } from '@generated/hooks/useSettings';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/ui/select';
import { Skeleton } from '@components/ui/skeleton';
import { Badge } from '@components/ui/badge';

export default function GeneralSettings() {
  const { settings, update, loading } = useSettings();

  if (loading) return <div className="glass-surface p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="glass-surface space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold">General Configuration</h3>
        <p className="text-sm text-muted-foreground">ISO 27001 A.5 — Information Security Policies</p>
      </div>

      <div className="space-y-1">
        <span className="mono-label">Organization</span>
        <p className="font-medium text-foreground">Telecommunications Regulatory Authority</p>
        <p className="text-sm text-muted-foreground">Kingdom of Bahrain • IT Department</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <span className="mono-label">Data Classification</span>
          <Select value={settings.classification} onValueChange={v => update('classification', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="internal">Internal Use Only</SelectItem>
              <SelectItem value="confidential">Confidential</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="mono-label">Retention Period</span>
          <Select value={settings.retentionYears} onValueChange={v => update('retentionYears', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Year</SelectItem>
              <SelectItem value="3">3 Years</SelectItem>
              <SelectItem value="5">5 Years</SelectItem>
              <SelectItem value="7">7 Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <span className="mono-label">Policy Review Cycle</span>
          <Select value={settings.reviewCycle} onValueChange={v => update('reviewCycle', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="biannual">Bi-Annual</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <span className="mono-label">Applied Standards</span>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">ISO/IEC 27001:2022</Badge>
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">ISO/IEC 27002:2022</Badge>
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">NIST CSF 2.0</Badge>
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">TRA Cyber Policy</Badge>
        </div>
      </div>
    </div>
  );
}
