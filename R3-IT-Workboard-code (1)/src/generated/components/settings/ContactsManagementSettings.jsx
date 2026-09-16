import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { 
  Users, Building2, Mail, Phone, 
  BookOpen, UserPlus, FileText
} from 'lucide-react';

export default function ContactsManagementSettings({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vendor Contact Management */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Building2 className="h-4 w-4 text-primary" />
            Vendor & Stakeholder Contacts
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            External vendor and partner contact management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Enable Vendor Directory</Label>
              <p className="text-[10px] text-muted-foreground">Centralized vendor contact database</p>
            </div>
            <Switch 
              checked={draft.enableVendorDirectory !== false}
              onCheckedChange={(val) => updateDraft('enableVendorDirectory', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-link to RFP Items</Label>
              <p className="text-[10px] text-muted-foreground">Automatically associate vendors with procurement items</p>
            </div>
            <Switch 
              checked={draft.autoLinkVendorsToRFP !== false}
              onCheckedChange={(val) => updateDraft('autoLinkVendorsToRFP', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Contract Expiry Reminders</Label>
              <p className="text-[10px] text-muted-foreground">Alert 90 days before vendor contract expires</p>
            </div>
            <Switch 
              checked={draft.contractExpiryReminders !== false}
              onCheckedChange={(val) => updateDraft('contractExpiryReminders', val)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] text-foreground">Reminder Days Before Expiry</Label>
            <Input 
              type="number"
              className="h-7 text-xs"
              value={draft.contractReminderDays || 90}
              onChange={(e) => updateDraft('contractReminderDays', parseInt(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Internal Team Contacts */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Users className="h-4 w-4 text-primary" />
            Internal Team Directory
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            TRA IT department staff and role management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Display Team Org Chart</Label>
              <p className="text-[10px] text-muted-foreground">Visual hierarchy of IT department structure</p>
            </div>
            <Switch 
              checked={draft.displayTeamOrgChart !== false}
              onCheckedChange={(val) => updateDraft('displayTeamOrgChart', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Sync with Active Directory</Label>
              <p className="text-[10px] text-muted-foreground">Pull staff data from TRA AD</p>
            </div>
            <Switch 
              checked={draft.syncWithActiveDirectory !== false}
              onCheckedChange={(val) => updateDraft('syncWithActiveDirectory', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Show Contact Info in Dashboard</Label>
              <p className="text-[10px] text-muted-foreground">Display phone and email on hover</p>
            </div>
            <Switch 
              checked={draft.showContactInfoInDashboard !== false}
              onCheckedChange={(val) => updateDraft('showContactInfoInDashboard', val)}
            />
          </div>

          <div className="p-3 bg-primary/10 border border-primary/40 rounded">
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Quick Contact Access</p>
                <p className="text-[10px] text-muted-foreground">
                  Staff can click on assigned person fields to view full contact card with phone, email, and department.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card className="border-primary/40 relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Mail className="h-4 w-4 text-primary" />
            Communication Settings
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Email templates and notification preferences for contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase text-foreground">Email Templates</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">RFP Invitation</Label>
                  <Switch 
                    checked={draft.enableRFPInvitationTemplate !== false}
                    onCheckedChange={(val) => updateDraft('enableRFPInvitationTemplate', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Contract Renewal</Label>
                  <Switch 
                    checked={draft.enableContractRenewalTemplate !== false}
                    onCheckedChange={(val) => updateDraft('enableContractRenewalTemplate', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Status Update</Label>
                  <Switch 
                    checked={draft.enableStatusUpdateTemplate !== false}
                    onCheckedChange={(val) => updateDraft('enableStatusUpdateTemplate', val)}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase text-foreground">Call Logging</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Log Vendor Calls</Label>
                  <Switch 
                    checked={draft.logVendorCalls !== false}
                    onCheckedChange={(val) => updateDraft('logVendorCalls', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Auto-create Update</Label>
                  <Switch 
                    checked={draft.autoCreateCallUpdate !== false}
                    onCheckedChange={(val) => updateDraft('autoCreateCallUpdate', val)}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-primary" />
                <h4 className="text-xs font-bold uppercase text-foreground">Document Sharing</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Secure File Links</Label>
                  <Switch 
                    checked={draft.enableSecureFileLinks !== false}
                    onCheckedChange={(val) => updateDraft('enableSecureFileLinks', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Expiring Links (7 days)</Label>
                  <Switch 
                    checked={draft.expiringFileLinks !== false}
                    onCheckedChange={(val) => updateDraft('expiringFileLinks', val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
