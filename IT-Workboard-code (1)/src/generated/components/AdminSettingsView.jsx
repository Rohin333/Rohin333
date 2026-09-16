import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import {
  Settings, Shield, Clock, Users, Database,
  Palette, Type, Layout, Save, Download, HelpCircle,
RotateCcw
} from 'lucide-react';
import { cn } from '@lib/utils';
import ColorPickerSection from './settings/ColorPickerSection';
import FontSection from './settings/FontSection';
import ThemePresets from './settings/ThemePresets';

  const AVAILABLE_FONTS = [
'Inter', 'Rajdhani', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Raleway', 'Poppins', 'Oswald', 'Source Sans Pro', 'Playfair Display',
'Ubuntu', 'Merriweather', 'PT Sans', 'Nunito', 'Kanit', 'Rubik'
];

export default function AdminSettingsView({ themeSettings, onSave, onReset, saving }) {
  const [activeSubTab, setActiveSubTab] = useState('standards');
  const [draft, setDraft] = useState(themeSettings.settings);

  useEffect(() => {
    setDraft(themeSettings.settings);
  }, [themeSettings.settings]);

  const updateDraft = (key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    themeSettings.applyPreview(next);
  };

  const handleApplyPreset = (colors) => {
    const next = { ...draft, ...colors };
    setDraft(next);
    themeSettings.applyPreview(next);
  };

  const handleSave = () => {
    themeSettings.saveSettings(draft);
  };

  const handleReset = () => {
    themeSettings.resetSettings();
  };

  const handleExportTemplate = () => {

    const templateConfig = {
      name: "IT-Department-Standard-Template",
      version: "1.2.0",
      requiredColumns: [
        { name: "Name", type: "name" },
        { name: "Status", id: "status8", type: "status" },
        { name: "Proj / Op", id: "status_1", type: "status" },
        { name: "Annual Cost (BHD)", id: "numeric_mm3z3k3a", type: "numbers" },
        { name: "SLA (Hours)", id: "text_mm40gk02", type: "text" },
        { name: "Firewall Vendor", id: "text_mm405arn", type: "text" }
      ],
      workflowPhases: ["Intake", "Procurement", "Implementation", "Compliance", "Audit"]
    };
    
    const blob = new Blob([JSON.stringify(templateConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IT-Programme-Template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-sm text-muted-foreground">Configure IT standards and dashboard personalization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Export App Template
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2" disabled={saving}>
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} size="sm" className="gap-2" disabled={saving}>
            <Save className={cn("h-4 w-4", saving && "animate-spin")} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
        <TabsList className="bg-muted/50 w-full justify-start border-b rounded-none h-11 p-0 px-1 gap-2 border-transparent">
          <TabsTrigger value="standards" className="data-[state=active]:bg-background rounded-t-md rounded-b-none border-b-2 data-[state=active]:border-primary border-transparent h-10 shadow-none px-4">
            <Shield className="h-3.5 w-3.5 mr-2" />
            IT Standards
          </TabsTrigger>
          <TabsTrigger value="visual" className="data-[state=active]:bg-background rounded-t-md rounded-b-none border-b-2 data-[state=active]:border-primary border-transparent h-10 shadow-none px-4">
            <Palette className="h-3.5 w-3.5 mr-2" />
            Visual Identity
          </TabsTrigger>
          <TabsTrigger value="workflow" className="data-[state=active]:bg-background rounded-t-md rounded-b-none border-b-2 data-[state=active]:border-primary border-transparent h-10 shadow-none px-4">
            <Layout className="h-3.5 w-3.5 mr-2" />
            Workflow Rules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  SLA & Availability Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Standard SLA Monitoring</Label>
                    <p className="text-xs text-muted-foreground">Enforce 24/7 monitoring for Infrastructure items</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Budget Sync Automation</Label>
                    <p className="text-xs text-muted-foreground">Auto-link subitems to budget parent on creation</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Data Retention Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Audit Trail Logging</Label>
                    <p className="text-xs text-muted-foreground">Keep historical change logs for 7 years</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">File Encryption</Label>
                    <p className="text-xs text-muted-foreground">Encrypt all IT Budget Data column attachments</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visual" className="space-y-6">
          <ThemePresets onApply={handleApplyPreset} currentDraft={draft} />
          <div className="grid grid-cols-1 gap-6">
            <ColorPickerSection draft={draft} updateDraft={updateDraft} />
            <FontSection draft={draft} updateDraft={updateDraft} fonts={AVAILABLE_FONTS} />
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold">Template & Import Logic</CardTitle>
              <CardDescription>How the app behaves when imported into a new department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/60">
                <h4 className="text-xs font-bold uppercase mb-2">Column Mapping Logic</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  When importing the "IT-Programme-Template", the app will automatically search for columns with matching SDK properties. 
                  If not found, it will fallback to displaying an "Integration Guide" for the user.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-[9px]">status8 → status</Badge>
                  <Badge variant="secondary" className="text-[9px]">timeline → date</Badge>
                  <Badge variant="secondary" className="text-[9px]">numeric_mm3z3k3a → annualCostBhd</Badge>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="xs" className="text-[10px] h-7" onClick={() => window.open('https://monday.com', '_blank')}>
                  <HelpCircle className="h-3 w-3 mr-1" />
                  View Mapping Documentation
                </Button>
              </div>

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
