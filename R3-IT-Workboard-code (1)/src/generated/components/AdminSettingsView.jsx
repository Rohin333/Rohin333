import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import {
  Settings, Shield, Save, RotateCcw, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@lib/utils';
import CyberpunkHeader from './CyberpunkHeader';

// Sub-components for each settings category
import ITStandardsSettings from './settings/ITStandardsSettings';
import VisualIdentitySettings from './settings/VisualIdentitySettings';
import WorkflowAutomationSettings from './settings/WorkflowAutomationSettings';
import SecurityComplianceSettings from './settings/SecurityComplianceSettings';
import IntegrationSettings from './settings/IntegrationSettings';
import NotificationSettings from './settings/NotificationSettings';
import DataRetentionSettings from './settings/DataRetentionSettings';
import AdvancedConfigSettings from './settings/AdvancedConfigSettings';
import BudgetManagementSettings from './settings/BudgetManagementSettings';
import ContactsManagementSettings from './settings/ContactsManagementSettings';

export default function AdminSettingsView({ themeSettings, onSave, onReset, saving }) {
  const [activeTab, setActiveTab] = useState('standards');
  const [draft, setDraft] = useState(themeSettings.settings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    setDraft(themeSettings.settings);
    setHasUnsavedChanges(false);
  }, [themeSettings.settings]);

  const updateDraft = useCallback((key, value) => {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setHasUnsavedChanges(true);
    // Apply preview for visual changes only
    if (['background', 'primary', 'accent', 'fontHeading', 'fontBody'].includes(key)) {
      themeSettings.applyPreview(next);
    }
  }, [draft, themeSettings]);

  const handleSave = async () => {
    try {
      setSaveStatus(null);
      await themeSettings.saveSettings(draft);
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all settings to default values? This action cannot be undone.')) return;
    try {
      await themeSettings.resetSettings();
      setDraft(themeSettings.DEFAULT_THEME);
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Reset failed:', err);
      setSaveStatus('error');
    }
  };

  const stats = [
    { label: hasUnsavedChanges ? 'UNSAVED CHANGES' : 'ALL SAVED', variant: hasUnsavedChanges ? 'destructive' : 'default' }
  ];

  return (
    <div className="space-y-6">
      <CyberpunkHeader
        title="SYSTEM ADMINISTRATION"
        subtitle="Telecommunications Regulatory Authority - Kingdom of Bahrain"
        stats={stats}
      />

      {/* Save Status Alert */}
      {saveStatus && (
        <Alert variant={saveStatus === 'success' ? 'default' : 'destructive'} 
               className={cn(
                 "border-2 animate-in fade-in slide-in-from-top-2 duration-300",
                 saveStatus === 'success' && "border-primary/60 bg-primary/10",
                 saveStatus === 'error' && "border-accent/60 bg-accent/10"
               )}>
          {saveStatus === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-accent" />
          )}
          <AlertDescription className="text-xs font-bold tracking-wide">
            {saveStatus === 'success' 
              ? 'Configuration saved successfully and applied across all modules'
              : 'Failed to save configuration. Please try again.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-card border border-border/60 rounded"
           style={{ boxShadow: 'var(--glow-dark)' }}>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded border border-primary/60 bg-primary/10 flex items-center justify-center"
               style={{ boxShadow: 'var(--glow-primary-subtle)' }}>
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">IT Programme Configuration Panel</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Senior Administrator Access Level
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-[10px] text-accent font-bold uppercase tracking-wider animate-pulse">
              • Unsaved Changes
            </span>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset} 
            disabled={saving}
            className="text-[10px] h-8 border-border/60 hover:border-accent hover:text-accent uppercase tracking-wider"
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Reset All
          </Button>
          <Button 
            onClick={handleSave} 
            size="sm" 
            disabled={!hasUnsavedChanges || saving}
            className="text-[10px] h-8 bg-primary hover:bg-primary/90 uppercase tracking-wider font-bold"
            style={{ boxShadow: hasUnsavedChanges ? 'var(--glow-primary-medium)' : 'none' }}
          >
            <Save className={cn("h-3 w-3 mr-1.5", saving && "animate-spin")} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-auto bg-card border border-border/60 p-1 w-full justify-start flex-wrap gap-1"
                  style={{ boxShadow: 'var(--glow-dark)' }}>
          <TabsTrigger 
            value="standards" 
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            <Shield className="h-3 w-3 mr-1.5" />
            IT Standards
          </TabsTrigger>
          <TabsTrigger 
            value="visual"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Visual Identity
          </TabsTrigger>
          <TabsTrigger 
            value="workflow"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Workflow Automation
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Security & Compliance
          </TabsTrigger>
          <TabsTrigger 
            value="integrations"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="retention"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Data Retention
          </TabsTrigger>
          <TabsTrigger 
            value="budget"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Budget Management
          </TabsTrigger>
          <TabsTrigger 
            value="contacts"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Contacts
          </TabsTrigger>
          <TabsTrigger 
            value="advanced"
            className="text-[9px] h-8 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 font-bold tracking-widest uppercase transition-all"
          >
            Advanced Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standards" className="space-y-6 mt-0">
          <ITStandardsSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="visual" className="space-y-6 mt-0">
          <VisualIdentitySettings draft={draft} updateDraft={updateDraft} themeSettings={themeSettings} />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6 mt-0">
          <WorkflowAutomationSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-0">
          <SecurityComplianceSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6 mt-0">
          <IntegrationSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-0">
          <NotificationSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="retention" className="space-y-6 mt-0">
          <DataRetentionSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-6 mt-0">
          <BudgetManagementSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6 mt-0">
          <ContactsManagementSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-0">
          <AdvancedConfigSettings draft={draft} updateDraft={updateDraft} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
