import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Plug, Mail, Calendar, Database, CheckCircle2 } from 'lucide-react';

export default function IntegrationSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Email Integration */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Mail className="h-4 w-4 text-primary" />
            Email & Communication
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Connect to Outlook and Gmail for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Send Email on Status Change</Label>
              <p className="text-[10px] text-muted-foreground">Notify assigned person via email when status updates</p>
            </div>
            <Switch 
              checked={draft.emailOnStatusChange !== false}
              onCheckedChange={(val) => updateDraft('emailOnStatusChange', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Weekly Summary Reports</Label>
              <p className="text-[10px] text-muted-foreground">Send portfolio summary to management every Monday</p>
            </div>
            <Switch 
              checked={draft.weeklySummaryEmail !== false}
              onCheckedChange={(val) => updateDraft('weeklySummaryEmail', val)}
            />
          </div>

          <div className="p-3 bg-background/60 rounded border border-border/40">
            <p className="text-[10px] font-semibold mb-2 text-muted-foreground uppercase">Supported Providers</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-[9px]">Outlook</Badge>
              <Badge variant="secondary" className="text-[9px]">Gmail</Badge>
              <Badge variant="secondary" className="text-[9px]">SMTP</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Calendar className="h-4 w-4 text-primary" />
            Calendar Sync
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Sync due dates with Outlook and Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Sync Due Dates to Calendar</Label>
              <p className="text-[10px] text-muted-foreground">Create calendar events for items with due dates</p>
            </div>
            <Switch 
              checked={draft.calendarSync !== false}
              onCheckedChange={(val) => updateDraft('calendarSync', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Meeting Room Booking</Label>
              <p className="text-[10px] text-muted-foreground">Reserve TRA conference rooms for project reviews</p>
            </div>
            <Switch 
              checked={draft.meetingRoomBooking !== false}
              onCheckedChange={(val) => updateDraft('meetingRoomBooking', val)}
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-[10px] h-8 uppercase tracking-wider"
            onClick={() => console.log('Calendar connection flow would open here')}
          >
            <Plug className="h-3 w-3 mr-1.5" />
            Connect Calendar
          </Button>
        </CardContent>
      </Card>

      {/* External Systems */}
      <Card className="border-primary/40 relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Database className="h-4 w-4 text-primary" />
            External System Integrations
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Connect to TRA internal systems and databases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">TRA Finance System</p>
                    <p className="text-[9px] text-muted-foreground">Budget & procurement data</p>
                  </div>
                </div>
                <Badge variant="default" className="text-[8px] bg-primary">CONNECTED</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/60 rounded border border-border/40">
                <Label className="text-[10px] text-foreground">Auto-sync Cost Data</Label>
                <Switch 
                  checked={draft.syncFinanceData !== false}
                  onCheckedChange={(val) => updateDraft('syncFinanceData', val)}
                />
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">TRA Vendor Management</p>
                    <p className="text-[9px] text-muted-foreground">Contract & SLA tracking</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[8px]">AVAILABLE</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] h-8 uppercase tracking-wider"
                onClick={() => console.log('TRA Vendor Management connection flow would open here')}
              >
                <Plug className="h-3 w-3 mr-1.5" />
                Connect System
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">AWS Cloud Console</p>
                    <p className="text-[9px] text-muted-foreground">Infrastructure metrics</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[8px]">AVAILABLE</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] h-8 uppercase tracking-wider"
                onClick={() => console.log('AWS Cloud Console connection flow would open here')}
              >
                <Plug className="h-3 w-3 mr-1.5" />
                Connect AWS
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">ServiceNow ITSM</p>
                    <p className="text-[9px] text-muted-foreground">Ticket & incident sync</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[8px]">AVAILABLE</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-[10px] h-8 uppercase tracking-wider"
                onClick={() => console.log('ServiceNow ITSM connection flow would open here')}
              >
                <Plug className="h-3 w-3 mr-1.5" />
                Connect ServiceNow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
