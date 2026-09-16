import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { 
  GitBranch, Zap, FileCheck, Download, Upload,
  HelpCircle, CheckCircle2, FileText, Shield, AlertTriangle
} from 'lucide-react';

export default function WorkflowAutomationSettings({ draft, updateDraft }) {
  const handleExportTemplate = () => {
    const templateConfig = {
      name: "TRA-IT-Programme-Template",
      version: "2.0.0",
      organization: "Telecommunications Regulatory Authority - Kingdom of Bahrain",
      requiredColumns: [
        { name: "Name", type: "name" },
        { name: "Status", sdk: "status", type: "status" },
        { name: "Proj / Op", sdk: "projOp", type: "status" },
        { name: "Person", sdk: "person", type: "people" },
        { name: "Annual Cost (BHD)", sdk: "annualCostBhd", type: "numbers" },
        { name: "SLA (Hours)", sdk: "slaHours", type: "text" },
        { name: "Infrastructure Type", sdk: "infrastructureType", type: "dropdown" },
        { name: "Priority", sdk: "priority", type: "status" }
      ],
      workflowPhases: [
        "Intake & Planning",
        "Pre-Evaluation & Stakeholder Selection",
        "RFP / RFQ Preparation",
        "Procurement Process",
        "Director Approval (AWS / O365 / Cloud)",
        "Implementation & Deployment",
        "Compliance & Security Review",
        "Operational Handover",
        "Audit & Documentation"
      ],
      automationRules: {
        budgetSync: draft.budgetSync !== false,
        slaMonitoring: draft.slaMonitoring !== false,
        autoEscalate: draft.autoEscalate !== false,
        costAlerts: draft.costAlerts !== false,
        directorApprovalRequired: draft.directorApprovalRequired !== false,
        fileAttachmentSupport: draft.fileAttachmentSupport !== false
      },
      settings: draft
    };
    
    const blob = new Blob([JSON.stringify(templateConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TRA-IT-Programme-Board-Template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* RFP / RFQ Workflow Enhancement */}
      <Card className="border-primary/40 relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <FileText className="h-4 w-4 text-primary" />
            RFP / RFQ Workflow Configuration
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Configure procurement workflow phases and approval requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pre-Evaluation Stage */}
            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Pre-Evaluation Stage
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Enable Pre-Evaluation</Label>
                  <Switch 
                    checked={draft.enablePreEvaluation !== false}
                    onCheckedChange={(val) => updateDraft('enablePreEvaluation', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Require Signature</Label>
                  <Switch 
                    checked={draft.requirePreEvalSignature !== false}
                    onCheckedChange={(val) => updateDraft('requirePreEvalSignature', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Stakeholder Selection Dropdown</Label>
                  <Switch 
                    checked={draft.enableStakeholderDropdown !== false}
                    onCheckedChange={(val) => updateDraft('enableStakeholderDropdown', val)}
                  />
                </div>
              </div>
            </div>

            {/* File Attachment Support */}
            <div className="p-4 bg-muted/30 rounded border border-border/40">
              <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                <Upload className="h-3.5 w-3.5" />
                Attachment Management
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Allow File Uploads</Label>
                  <Switch 
                    checked={draft.fileAttachmentSupport !== false}
                    onCheckedChange={(val) => updateDraft('fileAttachmentSupport', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">PDF Pre-Evaluation Uploads</Label>
                  <Switch 
                    checked={draft.allowPreEvalPDF !== false}
                    onCheckedChange={(val) => updateDraft('allowPreEvalPDF', val)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-foreground">Template Encryption</Label>
                  <Switch 
                    checked={draft.encryptTemplates !== false}
                    onCheckedChange={(val) => updateDraft('encryptTemplates', val)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Phases Display */}
          <div className="p-4 bg-primary/10 border border-primary/40 rounded">
            <h4 className="text-xs font-bold uppercase mb-3 text-foreground">Standard Workflow Phases</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-[9px]">1. Intake & Planning</Badge>
              <Badge variant="secondary" className="text-[9px]">2. Pre-Evaluation</Badge>
              <Badge variant="secondary" className="text-[9px]">3. Stakeholder Selection</Badge>
              <Badge variant="secondary" className="text-[9px]">4. RFP/RFQ Prep</Badge>
              <Badge variant="secondary" className="text-[9px]">5. Procurement</Badge>
              <Badge variant="secondary" className="text-[9px]">6. Director Approval</Badge>
              <Badge variant="secondary" className="text-[9px]">7. Implementation</Badge>
              <Badge variant="secondary" className="text-[9px]">8. Compliance Review</Badge>
              <Badge variant="secondary" className="text-[9px]">9. Operational Handover</Badge>
              <Badge variant="secondary" className="text-[9px]">10. Audit</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Director Approval System */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Shield className="h-4 w-4 text-primary" />
            Director Approval Requirements
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Mandatory approvals for cloud services and licenses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">AWS Service Approval</Label>
              <p className="text-[10px] text-muted-foreground">Require Director approval for new AWS services</p>
            </div>
            <Switch 
              checked={draft.directorApprovalAWS !== false}
              onCheckedChange={(val) => updateDraft('directorApprovalAWS', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Office 365 License Approval</Label>
              <p className="text-[10px] text-muted-foreground">Require Director approval for O365 licenses</p>
            </div>
            <Switch 
              checked={draft.directorApprovalO365 !== false}
              onCheckedChange={(val) => updateDraft('directorApprovalO365', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Cloud Expense Approval</Label>
              <p className="text-[10px] text-muted-foreground">Approval required for any cloud-related cost</p>
            </div>
            <Switch 
              checked={draft.directorApprovalCloud !== false}
              onCheckedChange={(val) => updateDraft('directorApprovalCloud', val)}
            />
          </div>

          <div className="p-3 bg-accent/10 border border-accent/40 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Alert Configuration</p>
                <p className="text-[10px] text-muted-foreground">
                  When approval is required, system will trigger email notifications, dashboard alerts, and popup notifications to the IT Director.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Phase Automation */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <GitBranch className="h-4 w-4 text-primary" />
            Workflow Phase Automation
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Auto-trigger actions based on status transitions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-move Completed Items</Label>
              <p className="text-[10px] text-muted-foreground">Move to "Completed Projects" group when status = Done</p>
            </div>
            <Switch 
              checked={draft.autoMoveCompleted !== false}
              onCheckedChange={(val) => updateDraft('autoMoveCompleted', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-archive Cancelled Items</Label>
              <p className="text-[10px] text-muted-foreground">Archive items moved to "Cancelled Projects" group after 30 days</p>
            </div>
            <Switch 
              checked={draft.autoArchiveCancelled !== false}
              onCheckedChange={(val) => updateDraft('autoArchiveCancelled', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Require Approval for High-Cost Items</Label>
              <p className="text-[10px] text-muted-foreground">Flag items exceeding {draft.budgetThreshold || 50000} BHD for approval</p>
            </div>
            <Switch 
              checked={draft.requireApproval !== false}
              onCheckedChange={(val) => updateDraft('requireApproval', val)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">Phase Categories</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant={draft.enableProjectPhase !== false ? "default" : "outline"} 
                     className="text-[9px] cursor-pointer"
                     onClick={() => updateDraft('enableProjectPhase', !(draft.enableProjectPhase === false))}>
                Project
              </Badge>
              <Badge variant={draft.enableOperationPhase !== false ? "default" : "outline"} 
                     className="text-[9px] cursor-pointer"
                     onClick={() => updateDraft('enableOperationPhase', !(draft.enableOperationPhase === false))}>
                Operation
              </Badge>
              <Badge variant={draft.enableSystemAdminPhase !== false ? "default" : "outline"} 
                     className="text-[9px] cursor-pointer"
                     onClick={() => updateDraft('enableSystemAdminPhase', !(draft.enableSystemAdminPhase === false))}>
                System Administration
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Automation */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Zap className="h-4 w-4 text-primary" />
            Status & Update Triggers
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Automatic notifications and field updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Notify on Status Change</Label>
              <p className="text-[10px] text-muted-foreground">Alert assigned person when item status is updated</p>
            </div>
            <Switch 
              checked={draft.notifyStatusChange !== false}
              onCheckedChange={(val) => updateDraft('notifyStatusChange', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Auto-set Next Due Date</Label>
              <p className="text-[10px] text-muted-foreground">Calculate next due date based on frequency field</p>
            </div>
            <Switch 
              checked={draft.autoSetDueDate !== false}
              onCheckedChange={(val) => updateDraft('autoSetDueDate', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Generate Update Summary</Label>
              <p className="text-[10px] text-muted-foreground">Auto-populate summary fields from meeting notetaker</p>
            </div>
            <Switch 
              checked={draft.autoGenerateSummary !== false}
              onCheckedChange={(val) => updateDraft('autoGenerateSummary', val)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Stuck Item Detection</Label>
              <p className="text-[10px] text-muted-foreground">Auto-mark items as Stuck if no updates for 7+ days</p>
            </div>
            <Switch 
              checked={draft.stuckDetection !== false}
              onCheckedChange={(val) => updateDraft('stuckDetection', val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Template Export */}
      <Card className="border-primary/40 relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <FileCheck className="h-4 w-4 text-primary" />
            Board Template & Import Configuration
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Export app configuration for reuse across departments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/30 rounded border border-border/60">
            <h4 className="text-xs font-bold uppercase mb-3 text-primary">Column Mapping Logic</h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              When importing the "TRA IT Programme Board Template", the app will automatically search for columns 
              with matching SDK properties. If columns are not found, the app will display an Integration Guide 
              with mapping instructions for the board administrator.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="text-[9px] font-mono">status8 → status</Badge>
              <Badge variant="secondary" className="text-[9px] font-mono">status_1 → projOp</Badge>
              <Badge variant="secondary" className="text-[9px] font-mono">timeline → date</Badge>
              <Badge variant="secondary" className="text-[9px] font-mono">numeric_mm3z3k3a → annualCostBhd</Badge>
              <Badge variant="secondary" className="text-[9px] font-mono">text_mm40gk02 → slaHours</Badge>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Template includes all automation rules, workflow phases, and visual settings</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[10px] h-8 uppercase tracking-wider"
                  onClick={() => window.open('https://support.monday.com', '_blank')}
                >
                  <HelpCircle className="h-3 w-3 mr-1.5" />
                  View Docs
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleExportTemplate}
                  className="text-[10px] h-8 bg-primary hover:bg-primary/90 uppercase tracking-wider font-bold"
                  style={{ boxShadow: 'var(--glow-primary-medium)' }}
                >
                  <Download className="h-3 w-3 mr-1.5" />
                  Export Template
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
