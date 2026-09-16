import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Archive, Trash2, Database, HardDrive, Calendar } from 'lucide-react';

export default function DataRetentionSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Audit Trail */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Archive className="h-4 w-4 text-primary" />
            Audit Trail & Change History
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Historical record keeping for compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Enable Audit Logging</Label>
              <p className="text-[10px] text-muted-foreground">Record all item changes with timestamps and user IDs</p>
            </div>
            <Switch 
              checked={draft.auditLogging !== false}
              onCheckedChange={(val) => updateDraft('auditLogging', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Preserve Deleted Items</Label>
              <p className="text-[10px] text-muted-foreground">Keep deleted items in archive for 90 days before permanent removal</p>
            </div>
            <Switch 
              checked={draft.preserveDeleted !== false}
              onCheckedChange={(val) => updateDraft('preserveDeleted', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Audit Log Retention Period</Label>
            <Select 
              value={draft.auditRetentionPeriod || '7years'}
              onValueChange={(val) => updateDraft('auditRetentionPeriod', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="3years">3 Years</SelectItem>
                <SelectItem value="5years">5 Years</SelectItem>
                <SelectItem value="7years">7 Years (Compliance Standard)</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[9px] text-muted-foreground">TRA requires 7-year audit trail for financial records</p>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/40 rounded">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Current Audit Records</p>
                <p className="text-[10px] text-muted-foreground">Logs stored since: Jan 1, 2019</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Retention */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <HardDrive className="h-4 w-4 text-primary" />
            File & Document Retention
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Storage policies for uploaded files and attachments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Archive Old Files</Label>
              <p className="text-[10px] text-muted-foreground">Move files from completed projects to cold storage after 1 year</p>
            </div>
            <Switch 
              checked={draft.archiveOldFiles !== false}
              onCheckedChange={(val) => updateDraft('archiveOldFiles', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Compress Archived Files</Label>
              <p className="text-[10px] text-muted-foreground">Reduce storage costs by compressing archived documents</p>
            </div>
            <Switch 
              checked={draft.compressArchivedFiles !== false}
              onCheckedChange={(val) => updateDraft('compressArchivedFiles', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Budget Document Retention</Label>
            <Select 
              value={draft.budgetDocRetention || '10years'}
              onValueChange={(val) => updateDraft('budgetDocRetention', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5years">5 Years</SelectItem>
                <SelectItem value="7years">7 Years</SelectItem>
                <SelectItem value="10years">10 Years (Financial Standard)</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[9px] text-muted-foreground">Files in "IT Budget Data" column retention period</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Maximum File Size (MB)</Label>
            <Input 
              type="number" 
              min="1" 
              max="1000"
              value={draft.maxFileSize || 100}
              onChange={(e) => updateDraft('maxFileSize', parseInt(e.target.value))}
              className="h-9 text-xs border-border/60 font-mono"
            />
            <p className="text-[9px] text-muted-foreground">Limit individual file uploads to prevent storage bloat</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Purging */}
      <Card className="border-accent/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-accent/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Trash2 className="h-4 w-4 text-accent" />
            Automatic Data Purging
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider text-accent">
            Permanent deletion policies (use with caution)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-purge Cancelled Items</Label>
              <p className="text-[10px] text-muted-foreground">Permanently delete items after 180 days in Cancelled group</p>
            </div>
            <Switch 
              checked={draft.autoPurgeCancelled === true}
              onCheckedChange={(val) => updateDraft('autoPurgeCancelled', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Purge Old Updates</Label>
              <p className="text-[10px] text-muted-foreground">Delete item updates older than 2 years (keeps audit log)</p>
            </div>
            <Switch 
              checked={draft.purgeOldUpdates === true}
              onCheckedChange={(val) => updateDraft('purgeOldUpdates', val)}
            />
          </div>

          <div className="p-3 bg-accent/10 border border-accent/40 rounded">
            <div className="flex items-start gap-2">
              <Trash2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Purge Schedule</p>
                <p className="text-[10px] text-muted-foreground">
                  Automatic purge runs monthly on the 1st at 2:00 AM GST
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-destructive/10 border border-destructive/40 rounded">
            <div className="flex items-start gap-2">
              <Badge variant="destructive" className="text-[8px]">WARNING</Badge>
              <p className="text-[10px] text-muted-foreground">
                Purged data cannot be recovered. Ensure audit logs and backups are enabled before activating auto-purge features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Configuration */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Database className="h-4 w-4 text-primary" />
            Backup & Recovery
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Data protection and disaster recovery settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Automatic Daily Backups</Label>
              <p className="text-[10px] text-muted-foreground">Full board backup every 24 hours to secure storage</p>
            </div>
            <Switch 
              checked={draft.dailyBackups !== false}
              onCheckedChange={(val) => updateDraft('dailyBackups', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Geo-redundant Storage</Label>
              <p className="text-[10px] text-muted-foreground">Replicate backups to multiple data centers</p>
            </div>
            <Switch 
              checked={draft.geoRedundantBackups !== false}
              onCheckedChange={(val) => updateDraft('geoRedundantBackups', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Backup Retention Period</Label>
            <Select 
              value={draft.backupRetention || '90days'}
              onValueChange={(val) => updateDraft('backupRetention', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days (Recommended)</SelectItem>
                <SelectItem value="180days">180 Days</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/40 rounded">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground">Last Backup</p>
                <p className="text-[10px] text-muted-foreground">Today at 2:00 AM GST • Status: Success</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
