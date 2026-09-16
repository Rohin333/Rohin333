import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Shield, Lock, Key, AlertTriangle, FileKey } from 'lucide-react';

export default function SecurityComplianceSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Access Control */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Shield className="h-4 w-4 text-primary" />
            Access Control & Permissions
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Role-based access and data visibility rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Restrict Budget Data Access</Label>
              <p className="text-[10px] text-muted-foreground">Only IT Admin and Finance can view cost columns</p>
            </div>
            <Switch 
              checked={draft.restrictBudgetAccess !== false}
              onCheckedChange={(val) => updateDraft('restrictBudgetAccess', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Audit Log All Changes</Label>
              <p className="text-[10px] text-muted-foreground">Record all item modifications with user ID and timestamp</p>
            </div>
            <Switch 
              checked={draft.auditLogging !== false}
              onCheckedChange={(val) => updateDraft('auditLogging', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Require Approval for Deletion</Label>
              <p className="text-[10px] text-muted-foreground">Prevent non-admin users from deleting items</p>
            </div>
            <Switch 
              checked={draft.requireDeleteApproval !== false}
              onCheckedChange={(val) => updateDraft('requireDeleteApproval', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Administrator Role</Label>
            <div className="p-3 bg-background/60 rounded border border-border/40">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[9px] bg-primary">Sr. IT Admin</Badge>
                <span className="text-[10px] text-muted-foreground">Rohin Thomas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Encryption */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Lock className="h-4 w-4 text-primary" />
            Data Encryption & Security
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            File encryption and secure document handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Encrypt File Column Assets</Label>
              <p className="text-[10px] text-muted-foreground">Encrypt all files in "IT Budget Data" column at rest</p>
            </div>
            <Switch 
              checked={draft.encryptFiles !== false}
              onCheckedChange={(val) => updateDraft('encryptFiles', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Secure Email Notifications</Label>
              <p className="text-[10px] text-muted-foreground">Use TLS encryption for all outbound notifications</p>
            </div>
            <Switch 
              checked={draft.secureMail !== false}
              onCheckedChange={(val) => updateDraft('secureMail', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Watermark Exported Reports</Label>
              <p className="text-[10px] text-muted-foreground">Add "TRA Confidential" watermark to PDF exports</p>
            </div>
            <Switch 
              checked={draft.watermarkExports !== false}
              onCheckedChange={(val) => updateDraft('watermarkExports', val)}
            />
          </div>

          <div className="p-3 bg-accent/10 border border-accent/40 rounded">
            <div className="flex items-start gap-2">
              <FileKey className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Encryption Status</p>
                <p className="text-[10px] text-muted-foreground">
                  All sensitive data encrypted with AES-256 standard
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Standards */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Key className="h-4 w-4 text-primary" />
            Compliance & Regulatory Standards
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Industry and government compliance rules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">ISO 27001 Compliance Mode</Label>
              <p className="text-[10px] text-muted-foreground">Enforce information security management standards</p>
            </div>
            <Switch 
              checked={draft.iso27001Mode !== false}
              onCheckedChange={(val) => updateDraft('iso27001Mode', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">GDPR Data Protection</Label>
              <p className="text-[10px] text-muted-foreground">Apply personal data handling restrictions</p>
            </div>
            <Switch 
              checked={draft.gdprMode !== false}
              onCheckedChange={(val) => updateDraft('gdprMode', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Bahrain eGovernment Standards</Label>
              <p className="text-[10px] text-muted-foreground">Comply with Kingdom of Bahrain IT governance policies</p>
            </div>
            <Switch 
              checked={draft.bahrainGovCompliance !== false}
              onCheckedChange={(val) => updateDraft('bahrainGovCompliance', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Active Compliance Frameworks</Label>
            <div className="flex flex-wrap gap-2 p-3 bg-background/60 rounded border border-border/40 min-h-[60px]">
              <Badge variant="secondary" className="text-[9px]">ISO 27001</Badge>
              <Badge variant="secondary" className="text-[9px]">GDPR</Badge>
              <Badge variant="secondary" className="text-[9px]">Bahrain eGov</Badge>
              <Badge variant="secondary" className="text-[9px]">NIST CSF</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card className="border-accent/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-accent/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-accent" />
            Security Incident Alerts
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Real-time security event notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Failed Login Attempt Alerts</Label>
              <p className="text-[10px] text-muted-foreground">Notify admin after 3 failed authentication attempts</p>
            </div>
            <Switch 
              checked={draft.failedLoginAlerts !== false}
              onCheckedChange={(val) => updateDraft('failedLoginAlerts', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Unusual Activity Detection</Label>
              <p className="text-[10px] text-muted-foreground">Alert on bulk data exports or mass deletions</p>
            </div>
            <Switch 
              checked={draft.unusualActivityDetection !== false}
              onCheckedChange={(val) => updateDraft('unusualActivityDetection', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Security Alert Recipients</Label>
            <Input 
              type="email"
              value={draft.securityAlertEmail || 'security@tra.gov.bh'}
              onChange={(e) => updateDraft('securityAlertEmail', e.target.value)}
              placeholder="security@tra.gov.bh"
              className="h-9 text-xs border-border/60 font-mono"
            />
            <p className="text-[9px] text-muted-foreground">Email address for critical security notifications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
