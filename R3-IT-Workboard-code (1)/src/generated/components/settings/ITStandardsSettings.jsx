import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { 
  Clock, Database, Shield, AlertTriangle, 
  CheckCircle2, Settings, Server 
} from 'lucide-react';

export default function ITStandardsSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SLA & Availability */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Clock className="h-4 w-4 text-primary" />
            SLA & Availability Rules
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Define service level agreements for infrastructure monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Standard SLA Monitoring</Label>
              <p className="text-[10px] text-muted-foreground">Enforce 24/7 uptime monitoring for all Infrastructure items</p>
            </div>
            <Switch 
              checked={draft.slaMonitoring !== false} 
              onCheckedChange={(val) => updateDraft('slaMonitoring', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-escalate Overdue Tasks</Label>
              <p className="text-[10px] text-muted-foreground">Notify management when critical items exceed SLA threshold</p>
            </div>
            <Switch 
              checked={draft.autoEscalate !== false}
              onCheckedChange={(val) => updateDraft('autoEscalate', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Default SLA Response Time</Label>
            <Select 
              value={draft.defaultSLA || '24h'}
              onValueChange={(val) => updateDraft('defaultSLA', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue placeholder="Select SLA window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4h">4 hours (Critical)</SelectItem>
                <SelectItem value="8h">8 hours (High)</SelectItem>
                <SelectItem value="24h">24 hours (Standard)</SelectItem>
                <SelectItem value="48h">48 hours (Low)</SelectItem>
                <SelectItem value="72h">72 hours (Informational)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Infrastructure Compliance Target</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                min="0" 
                max="100" 
                value={draft.complianceTarget || 99}
                onChange={(e) => updateDraft('complianceTarget', parseInt(e.target.value))}
                className="h-9 text-xs border-border/60"
              />
              <Badge variant="outline" className="text-[10px] font-bold">%</Badge>
            </div>
            <p className="text-[9px] text-muted-foreground">Target uptime percentage for TRA infrastructure</p>
          </div>
        </CardContent>
      </Card>

      {/* Budget Sync Automation */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Database className="h-4 w-4 text-primary" />
            Budget & Financial Rules
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Automatic budget tracking and financial document linking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Budget Sync Automation</Label>
              <p className="text-[10px] text-muted-foreground">Auto-link operational tasks to budget parent items on creation</p>
            </div>
            <Switch 
              checked={draft.budgetSync !== false}
              onCheckedChange={(val) => updateDraft('budgetSync', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Cost Threshold Alerts</Label>
              <p className="text-[10px] text-muted-foreground">Notify when annual cost exceeds department allocation</p>
            </div>
            <Switch 
              checked={draft.costAlerts !== false}
              onCheckedChange={(val) => updateDraft('costAlerts', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Budget Alert Threshold (BHD)</Label>
            <Input 
              type="number" 
              min="0" 
              step="1000"
              value={draft.budgetThreshold || 50000}
              onChange={(e) => updateDraft('budgetThreshold', parseInt(e.target.value))}
              placeholder="50000"
              className="h-9 text-xs border-border/60 font-mono"
            />
            <p className="text-[9px] text-muted-foreground">Alert when item cost exceeds this amount</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Currency Standard</Label>
            <Select 
              value={draft.currency || 'BHD'}
              onValueChange={(val) => updateDraft('currency', val)}
            >
              <SelectTrigger className="h-9 text-xs border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BHD">BHD (Bahraini Dinar)</SelectItem>
                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                <SelectItem value="EUR">EUR (Euro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project Classification */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Settings className="h-4 w-4 text-primary" />
            Project Classification Rules
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Automatic categorization of operational vs project items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-classify New Items</Label>
              <p className="text-[10px] text-muted-foreground">Use AI to suggest Project vs Operational classification</p>
            </div>
            <Switch 
              checked={draft.autoClassify !== false}
              onCheckedChange={(val) => updateDraft('autoClassify', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Require Completion Status</Label>
              <p className="text-[10px] text-muted-foreground">Enforce completion status field for all items</p>
            </div>
            <Switch 
              checked={draft.requireCompletionStatus !== false}
              onCheckedChange={(val) => updateDraft('requireCompletionStatus', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Operational Task Naming Convention</Label>
            <Input 
              type="text"
              value={draft.opNamingConvention || '[OP] {task-name}'}
              onChange={(e) => updateDraft('opNamingConvention', e.target.value)}
              placeholder="[OP] {task-name}"
              className="h-9 text-xs border-border/60 font-mono"
            />
            <p className="text-[9px] text-muted-foreground">Template for operational task naming</p>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Standards */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Server className="h-4 w-4 text-primary" />
            Infrastructure Standards
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            AWS, VMware, and on-premises infrastructure rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">AWS Server Count Tracking</Label>
              <p className="text-[10px] text-muted-foreground">Automatically track and alert on cloud instance count</p>
            </div>
            <Switch 
              checked={draft.trackAWSServers !== false}
              onCheckedChange={(val) => updateDraft('trackAWSServers', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Firewall Vendor Compliance</Label>
              <p className="text-[10px] text-muted-foreground">Require firewall vendor field for security items</p>
            </div>
            <Switch 
              checked={draft.requireFirewallVendor !== false}
              onCheckedChange={(val) => updateDraft('requireFirewallVendor', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Approved Infrastructure Vendors</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-background/60 rounded border border-border/40 min-h-[60px]">
              <Badge variant="secondary" className="text-[9px]">Cisco</Badge>
              <Badge variant="secondary" className="text-[9px]">AWS</Badge>
              <Badge variant="secondary" className="text-[9px]">VMware</Badge>
              <Badge variant="secondary" className="text-[9px]">Fortinet</Badge>
              <Badge variant="secondary" className="text-[9px]">Palo Alto</Badge>
            </div>
            <p className="text-[9px] text-muted-foreground">Pre-approved vendors for procurement</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
