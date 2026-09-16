import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { 
  Code, Terminal, Workflow, Zap, 
  FileJson, Copy, CheckCircle2 
} from 'lucide-react';
import { useState } from 'react';

export default function AdvancedConfigSettings({ draft, updateDraft }) {
  const [copied, setCopied] = useState(false);

  const handleCopyConfig = () => {
    const configJson = JSON.stringify(draft, null, 2);
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Developer Mode */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Code className="h-4 w-4 text-primary" />
            Developer & Debug Options
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Advanced settings for IT administrators and developers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">Enable Debug Mode</Label>
                <p className="text-[10px] text-muted-foreground">Show console logs and performance metrics</p>
              </div>
              <Switch 
                checked={draft.debugMode === true}
                onCheckedChange={(val) => updateDraft('debugMode', val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">API Request Logging</Label>
                <p className="text-[10px] text-muted-foreground">Log all monday.com SDK calls to console</p>
              </div>
              <Switch 
                checked={draft.apiLogging === true}
                onCheckedChange={(val) => updateDraft('apiLogging', val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">Show Column IDs</Label>
                <p className="text-[10px] text-muted-foreground">Display SDK property names in tooltips</p>
              </div>
              <Switch 
                checked={draft.showColumnIds === true}
                onCheckedChange={(val) => updateDraft('showColumnIds', val)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
              <div className="space-y-0.5 flex-1">
                <Label className="text-xs font-semibold text-foreground">Performance Monitoring</Label>
                <p className="text-[10px] text-muted-foreground">Track render times and query performance</p>
              </div>
              <Switch 
                checked={draft.performanceMonitoring === true}
                onCheckedChange={(val) => updateDraft('performanceMonitoring', val)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Scripts */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Terminal className="h-4 w-4 text-primary" />
            Custom Automation Scripts
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Add JavaScript hooks for advanced workflow automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">On Item Create Hook</Label>
            <Textarea 
              value={draft.onItemCreateScript || '// Run custom logic when new item is created\n// Available: item, board, user\n'}
              onChange={(e) => updateDraft('onItemCreateScript', e.target.value)}
              placeholder="// JavaScript code here..."
              className="text-xs font-mono h-24 border-border/60 bg-background/60"
            />
            <p className="text-[9px] text-muted-foreground">Executes after an item is successfully created on the board</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">On Status Change Hook</Label>
            <Textarea 
              value={draft.onStatusChangeScript || '// Run custom logic when status changes\n// Available: item, oldStatus, newStatus\n'}
              onChange={(e) => updateDraft('onStatusChangeScript', e.target.value)}
              placeholder="// JavaScript code here..."
              className="text-xs font-mono h-24 border-border/60 bg-background/60"
            />
            <p className="text-[9px] text-muted-foreground">Executes when an item's status is modified</p>
          </div>

          <div className="p-3 bg-accent/10 border border-accent/40 rounded">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Security Notice</p>
                <p className="text-[10px] text-muted-foreground">
                  Custom scripts run in a sandboxed environment with limited permissions. They cannot access user credentials or make external HTTP requests.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Workflow className="h-4 w-4 text-primary" />
            API & Performance Tuning
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Fine-tune data fetching and caching behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Default Page Size</Label>
              <Input 
                type="number" 
                min="10" 
                max="500"
                value={draft.defaultPageSize || 50}
                onChange={(e) => updateDraft('defaultPageSize', parseInt(e.target.value))}
                className="h-9 text-xs border-border/60 font-mono"
              />
              <p className="text-[9px] text-muted-foreground">Number of items to load per page (10-500)</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Cache Duration (minutes)</Label>
              <Input 
                type="number" 
                min="0" 
                max="60"
                value={draft.cacheDuration || 5}
                onChange={(e) => updateDraft('cacheDuration', parseInt(e.target.value))}
                className="h-9 text-xs border-border/60 font-mono"
              />
              <p className="text-[9px] text-muted-foreground">How long to cache aggregated data (0 = disabled)</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Request Timeout (seconds)</Label>
              <Input 
                type="number" 
                min="5" 
                max="120"
                value={draft.requestTimeout || 30}
                onChange={(e) => updateDraft('requestTimeout', parseInt(e.target.value))}
                className="h-9 text-xs border-border/60 font-mono"
              />
              <p className="text-[9px] text-muted-foreground">Maximum time to wait for API responses</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Retry Attempts</Label>
              <Input 
                type="number" 
                min="0" 
                max="5"
                value={draft.retryAttempts || 3}
                onChange={(e) => updateDraft('retryAttempts', parseInt(e.target.value))}
                className="h-9 text-xs border-border/60 font-mono"
              />
              <p className="text-[9px] text-muted-foreground">Retry failed API calls (0 = no retry)</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded border border-border/40">
            <div className="space-y-0.5 flex-1">
              <Label className="text-xs font-semibold text-foreground">Optimistic UI Updates</Label>
              <p className="text-[10px] text-muted-foreground">Update UI immediately before API confirmation</p>
            </div>
            <Switch 
              checked={draft.optimisticUpdates !== false}
              onCheckedChange={(val) => updateDraft('optimisticUpdates', val)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration Export */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <FileJson className="h-4 w-4 text-primary" />
            Configuration Import / Export
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Backup and share your complete settings configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-background/60 rounded border border-border/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Current Configuration</p>
                <p className="text-[10px] text-muted-foreground">{Object.keys(draft).length} settings configured</p>
              </div>
              <Badge variant="default" className="text-[9px] bg-primary">ACTIVE</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyConfig}
                className="text-[10px] h-8 flex-1 uppercase tracking-wider"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1.5" />
                    Copy JSON
                  </>
                )}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `tra-it-portfolio-config-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="text-[10px] h-8 flex-1 bg-primary hover:bg-primary/90 uppercase tracking-wider font-bold"
                style={{ boxShadow: 'var(--glow-primary-medium)' }}
              >
                <FileJson className="h-3 w-3 mr-1.5" />
                Export Config
              </Button>
            </div>
          </div>

          <div className="p-3 bg-primary/10 border border-primary/40 rounded">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Configuration Portability</p>
                <p className="text-[10px] text-muted-foreground">
                  Export your settings and import them into another monday.com board to replicate this app's behavior instantly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
