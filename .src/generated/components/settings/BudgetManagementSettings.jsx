import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { 
  DollarSign, FileSpreadsheet, Layers, Upload, 
  CheckCircle2, AlertTriangle, RefreshCw, Database
} from 'lucide-react';

export default function BudgetManagementSettings({ draft, updateDraft }) {
  return (
    <Card className="border-primary/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
      <CardHeader>
        <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
          <DollarSign className="h-4 w-4 text-primary" />
          Budget Management & Verification
        </CardTitle>
        <CardDescription className="text-[10px] uppercase tracking-wider">
          Budget upload, verification, and subitem synchronization settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="verification" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6 bg-muted/30">
            <TabsTrigger value="verification" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
              <CheckCircle2 className="h-3 w-3 mr-1.5" />
              Verification
            </TabsTrigger>
            <TabsTrigger value="sync" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
              <Layers className="h-3 w-3 mr-1.5" />
              Subitem Sync
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
              <Upload className="h-3 w-3 mr-1.5" />
              Budget Upload
            </TabsTrigger>
          </TabsList>

          {/* Budget Verification Tab */}
          <TabsContent value="verification" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Automated Verification
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Auto-verify Budget Files</Label>
                    <Switch 
                      checked={draft.autoVerifyBudgetFiles !== false}
                      onCheckedChange={(val) => updateDraft('autoVerifyBudgetFiles', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Flag Missing Cost Data</Label>
                    <Switch 
                      checked={draft.flagMissingCostData !== false}
                      onCheckedChange={(val) => updateDraft('flagMissingCostData', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Require Department Tags</Label>
                    <Switch 
                      checked={draft.requireDepartmentTags !== false}
                      onCheckedChange={(val) => updateDraft('requireDepartmentTags', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Validation Rules
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-foreground">Max Budget Variance (%)</Label>
                    <Input 
                      type="number"
                      className="h-7 text-xs"
                      value={draft.maxBudgetVariance || 10}
                      onChange={(e) => updateDraft('maxBudgetVariance', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Alert on Exceeding Budget</Label>
                    <Switch 
                      checked={draft.alertOnExceedingBudget !== false}
                      onCheckedChange={(val) => updateDraft('alertOnExceedingBudget', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/40 rounded">
              <h4 className="text-xs font-bold uppercase mb-2 text-foreground">Verification Status Indicators</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="text-[9px] bg-primary">Complete Documentation</Badge>
                <Badge variant="secondary" className="text-[9px]">Budget File Uploaded</Badge>
                <Badge variant="outline" className="text-[9px] border-accent text-accent">Missing Cost Data</Badge>
                <Badge variant="outline" className="text-[9px] border-muted-foreground">No Budget File</Badge>
              </div>
            </div>
          </TabsContent>

          {/* Subitem Sync Tab */}
          <TabsContent value="sync" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" />
                  Sync Configuration
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Auto-create Subitems from Operations</Label>
                    <Switch 
                      checked={draft.autoCreateSubitemsFromOps !== false}
                      onCheckedChange={(val) => updateDraft('autoCreateSubitemsFromOps', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Match by Department</Label>
                    <Switch 
                      checked={draft.matchSubitemsByDepartment !== false}
                      onCheckedChange={(val) => updateDraft('matchSubitemsByDepartment', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Match by Budget Category</Label>
                    <Switch 
                      checked={draft.matchSubitemsByCategory !== false}
                      onCheckedChange={(val) => updateDraft('matchSubitemsByCategory', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Sync Schedule
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Daily Auto-Sync</Label>
                    <Switch 
                      checked={draft.dailyAutoSync !== false}
                      onCheckedChange={(val) => updateDraft('dailyAutoSync', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Sync on Item Creation</Label>
                    <Switch 
                      checked={draft.syncOnItemCreation !== false}
                      onCheckedChange={(val) => updateDraft('syncOnItemCreation', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Prevent Duplicate Subitems</Label>
                    <Switch 
                      checked={draft.preventDuplicateSubitems !== false}
                      onCheckedChange={(val) => updateDraft('preventDuplicateSubitems', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/40 rounded">
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Budget-to-Operations Mapping</p>
                  <p className="text-[10px] text-muted-foreground">
                    Operational items from Application Management, Network Operations, and Desktop Support groups will automatically sync as subitems under matching budget line items based on department and category fields.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Budget Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Supported Formats
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Excel (.xlsx, .xls)</Label>
                    <Switch 
                      checked={draft.acceptExcelBudget !== false}
                      onCheckedChange={(val) => updateDraft('acceptExcelBudget', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">CSV Files</Label>
                    <Switch 
                      checked={draft.acceptCSVBudget !== false}
                      onCheckedChange={(val) => updateDraft('acceptCSVBudget', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">PDF Reports (Extract Data)</Label>
                    <Switch 
                      checked={draft.acceptPDFBudget !== false}
                      onCheckedChange={(val) => updateDraft('acceptPDFBudget', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded border border-border/40">
                <h4 className="text-xs font-bold uppercase mb-3 text-primary flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5" />
                  Upload Settings
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-foreground">Max File Size (MB)</Label>
                    <Input 
                      type="number"
                      className="h-7 text-xs"
                      value={draft.maxBudgetFileSize || 50}
                      onChange={(e) => updateDraft('maxBudgetFileSize', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Auto-extract on Upload</Label>
                    <Switch 
                      checked={draft.autoExtractOnUpload !== false}
                      onCheckedChange={(val) => updateDraft('autoExtractOnUpload', val)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] text-foreground">Require Fiscal Year Tag</Label>
                    <Switch 
                      checked={draft.requireFiscalYearTag !== false}
                      onCheckedChange={(val) => updateDraft('requireFiscalYearTag', val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/40 rounded">
              <h4 className="text-xs font-bold uppercase mb-2 text-foreground">Budget Upload Workflow</h4>
              <div className="space-y-2 text-[10px] text-muted-foreground">
                <p>1. Upload budget file to "IT BUDGET Details" group</p>
                <p>2. System auto-extracts department, category, and cost data</p>
                <p>3. Creates budget line item with extracted metadata</p>
                <p>4. Syncs operational subitems based on matching criteria</p>
                <p>5. Flags discrepancies and missing data for review</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
