import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Switch } from '@components/ui/switch';
import { Label } from '@components/ui/label';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { 
  Zap, Play, Pause, CheckCircle2, AlertTriangle, 
  ArrowRight, Activity, Shield, Server, Headphones,
  ChevronRight, Settings
} from 'lucide-react';
import { cn } from '@lib/utils';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';

const WORKFLOWS = [
  {
    id: 'siem-to-ticket',
    name: 'SIEM Alert → Support Ticket',
    description: 'Auto-create IT support tickets when critical security events are logged',
    source: 'R3 SIEM — Event Log',
    target: 'Submit IT Support Request',
    icon: Shield,
    trigger: 'Critical/High severity events',
    color: 'text-destructive'
  },
  {
    id: 'asset-to-project',
    name: 'Asset Registry → Project Tracking',
    description: 'Link new assets from the registry to relevant IT infrastructure projects',
    source: 'R3 SIEM — Asset Registry',
    target: 'IT Programme Board',
    icon: Server,
    trigger: 'New assets added',
    color: 'text-primary'
  },
  {
    id: 'ticket-to-project',
    name: 'Support Ticket → Project Task',
    description: 'Escalate recurring support issues into tracked IT projects',
    source: 'Submit IT Support Request',
    target: 'IT Programme Board',
    icon: Headphones,
    trigger: 'Repeat issues or high-impact tickets',
    color: 'text-chart-2'
  }
];

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState(
    WORKFLOWS.map(w => ({ ...w, enabled: false, executions: 0, lastRun: null }))
  );
  const [loading, setLoading] = useState(false);
  const [execLog, setExecLog] = useState([]);

  const toggleWorkflow = async (workflowId) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId ? { ...w, enabled: !w.enabled } : w
      )
    );
  };

  const manualTrigger = async (workflowId) => {
    setLoading(true);
    const workflow = workflows.find(w => w.id === workflowId);
    
    try {
      const board = new ITProgrammeBoard();
      
      if (workflowId === 'siem-to-ticket') {
        // Mock: In production, this would query the SIEM Event Log board
        // and create tickets in the Support Request board
        const logEntry = {
          timestamp: new Date(),
          action: 'Created support ticket #SRT-2047',
          source: workflow.source,
          target: workflow.target,
          status: 'success'
        };
        
        setExecLog(prev => [logEntry, ...prev].slice(0, 10));
        setWorkflows(prev =>
          prev.map(w =>
            w.id === workflowId
              ? { ...w, executions: w.executions + 1, lastRun: new Date() }
              : w
          )
        );
      } else if (workflowId === 'asset-to-project') {
        // Mock: Link asset registry entries to infrastructure projects
        const logEntry = {
          timestamp: new Date(),
          action: 'Linked 3 new assets to Network & Security Ops group',
          source: workflow.source,
          target: workflow.target,
          status: 'success'
        };
        
        setExecLog(prev => [logEntry, ...prev].slice(0, 10));
        setWorkflows(prev =>
          prev.map(w =>
            w.id === workflowId
              ? { ...w, executions: w.executions + 1, lastRun: new Date() }
              : w
          )
        );
      } else if (workflowId === 'ticket-to-project') {
        // Create IT project task from support ticket
        const newTask = await board.item().create({
          name: 'Escalated: Recurring VPN Connection Issues',
          status: 'In Progress',
          projOp: 'Operational',
          priority: 'High',
          currentStatus: 'In Progress',
          taskDescription: 'Auto-escalated from support ticket #SRT-1923 — multiple users reporting VPN dropouts',
          summary: 'Source: IT Support Request board | Auto-created by workflow automation'
        }).inGroup('group_mm45ch45').execute(); // Network & Security Ops group
        
        const logEntry = {
          timestamp: new Date(),
          action: `Created project task: ${newTask.name}`,
          source: workflow.source,
          target: workflow.target,
          status: 'success',
          itemId: newTask.id
        };
        
        setExecLog(prev => [logEntry, ...prev].slice(0, 10));
        setWorkflows(prev =>
          prev.map(w =>
            w.id === workflowId
              ? { ...w, executions: w.executions + 1, lastRun: new Date() }
              : w
          )
        );
      }
    } catch (err) {
      console.error(`Workflow ${workflowId} error:`, err);
      const logEntry = {
        timestamp: new Date(),
        action: `Failed: ${err.message}`,
        source: workflow.source,
        target: workflow.target,
        status: 'error'
      };
      setExecLog(prev => [logEntry, ...prev].slice(0, 10));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Cross-Board Workflows
            </h2>
            <p className="text-xs text-muted-foreground">
              Automated actions across 4 connected boards
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          <Activity className="h-3 w-3 mr-1" />
          {workflows.filter(w => w.enabled).length} Active
        </Badge>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 gap-3">
        {workflows.map((workflow) => {
          const Icon = workflow.icon;
          return (
            <Card
              key={workflow.id}
              className={cn(
                "border transition-all",
                workflow.enabled
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-card"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      workflow.enabled ? "bg-primary/20" : "bg-muted"
                    )}>
                      <Icon className={cn("h-4 w-4", workflow.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold text-foreground mb-1">
                        {workflow.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {workflow.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={workflow.enabled}
                      onCheckedChange={() => toggleWorkflow(workflow.id)}
                      aria-label={`Toggle ${workflow.name}`}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Flow Diagram */}
                <div className="flex items-center gap-2 text-xs bg-muted/30 rounded-lg p-2">
                  <Badge variant="outline" className="bg-background font-normal">
                    {workflow.source}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <Badge variant="outline" className="bg-background font-normal">
                    {workflow.target}
                  </Badge>
                </div>

                {/* Trigger */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Trigger:</span>
                  <span className="text-foreground font-medium">{workflow.trigger}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Executions:</span>
                    <span className="ml-2 text-foreground font-semibold">
                      {workflow.executions}
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span className="ml-2 text-foreground font-medium">
                      {workflow.lastRun
                        ? new Date(workflow.lastRun).toLocaleTimeString()
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Manual Trigger */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => manualTrigger(workflow.id)}
                  disabled={loading}
                >
                  <Play className="h-3 w-3 mr-2" />
                  Test Workflow
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Execution Log */}
      {execLog.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {execLog.map((entry) => (
                <div
                  key={`${entry.timestamp.getTime()}-${entry.action.slice(0, 20)}`}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/30 text-xs"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {entry.status === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-chart-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium mb-1">
                      {entry.action}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{entry.source}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span>{entry.target}</span>
                    </div>
                  </div>
                  <span className="text-muted-foreground flex-shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
