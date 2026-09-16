import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Bell, Users, AlertCircle, MessageSquare } from 'lucide-react';

export default function NotificationSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Notifications */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Bell className="h-4 w-4 text-primary" />
            User Notification Preferences
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Control when and how users receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Notify on Assignment</Label>
              <p className="text-[10px] text-muted-foreground">Alert users when they're assigned to a new item</p>
            </div>
            <Switch 
              checked={draft.notifyOnAssignment !== false}
              onCheckedChange={(val) => updateDraft('notifyOnAssignment', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Notify on @Mentions</Label>
              <p className="text-[10px] text-muted-foreground">Alert when mentioned in updates or comments</p>
            </div>
            <Switch 
              checked={draft.notifyOnMention !== false}
              onCheckedChange={(val) => updateDraft('notifyOnMention', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Notify on Due Date</Label>
              <p className="text-[10px] text-muted-foreground">Remind users 24h before item due date</p>
            </div>
            <Switch 
              checked={draft.notifyOnDueDate !== false}
              onCheckedChange={(val) => updateDraft('notifyOnDueDate', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Notification Frequency</Label>
            <Select 
              value={draft.notificationFrequency || 'realtime'}
              onValueChange={(val) => updateDraft('notificationFrequency', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (Immediate)</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="off">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Notifications */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Users className="h-4 w-4 text-primary" />
            Team & Management Alerts
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Notify supervisors and department leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Management Dashboard Alerts</Label>
              <p className="text-[10px] text-muted-foreground">Notify Sr. IT Admin of critical risks and blockers</p>
            </div>
            <Switch 
              checked={draft.managementAlerts !== false}
              onCheckedChange={(val) => updateDraft('managementAlerts', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Budget Overrun Alerts</Label>
              <p className="text-[10px] text-muted-foreground">Notify finance team when costs exceed threshold</p>
            </div>
            <Switch 
              checked={draft.budgetOverrunAlerts !== false}
              onCheckedChange={(val) => updateDraft('budgetOverrunAlerts', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">SLA Breach Warnings</Label>
              <p className="text-[10px] text-muted-foreground">Alert supervisors 2h before SLA deadline</p>
            </div>
            <Switch 
              checked={draft.slaBreachWarnings !== false}
              onCheckedChange={(val) => updateDraft('slaBreachWarnings', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Critical Alert Channel</Label>
            <Select 
              value={draft.criticalAlertChannel || 'email'}
              onValueChange={(val) => updateDraft('criticalAlertChannel', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="both">Email + SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Update Notifications */}
      <Card className="border-primary/40 relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="h-4 w-4 text-primary" />
            Update & Activity Notifications
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Configure notifications for item updates and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">New Updates</Label>
                <p className="text-[10px] text-muted-foreground">Posted to watched items</p>
              </div>
              <Switch 
                checked={draft.notifyNewUpdates !== false}
                onCheckedChange={(val) => updateDraft('notifyNewUpdates', val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">Status Changes</Label>
                <p className="text-[10px] text-muted-foreground">Items you're assigned to</p>
              </div>
              <Switch 
                checked={draft.notifyStatusUpdates !== false}
                onCheckedChange={(val) => updateDraft('notifyStatusUpdates', val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">File Uploads</Label>
                <p className="text-[10px] text-muted-foreground">New documents attached</p>
              </div>
              <Switch 
                checked={draft.notifyFileUploads !== false}
                onCheckedChange={(val) => updateDraft('notifyFileUploads', val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
