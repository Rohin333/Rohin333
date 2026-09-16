import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { AlertTriangle, AlertCircle, XCircle, Clock, Users, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/ui/collapsible';

export default function CriticalItemsView({ items, loading }) {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const criticalAnalysis = useMemo(() => {
    if (!items) return null;
    const today = new Date();
    const criticalPriority = items.filter(i => i.priority === 'Critical');
    const highPriority = items.filter(i => i.priority === 'High');
    const blockedInfra = items.filter(i => i.completionStatus === 'On Hold');
    const blockedItems = items.filter(i => i.status === 'Stuck' || (i.blockersrisks && i.blockersrisks.trim().length > 0));
    const overdueItems = items.filter(i => {
      if (!i.nextDueDate || i.status === 'Done') return false;
      return new Date(i.nextDueDate) < today;
    });
    const missingDocs = items.filter(i =>
      (!i.itBudgetData || i.itBudgetData.length === 0) &&
      (i.projOp === 'Operational' || i.status === 'In Progress')
    );
    const unassignedCritical = items.filter(i =>
      (i.priority === 'Critical' || i.priority === 'High') &&
      (!i.person || i.person.length === 0)
    );

    return {
      criticalPriority, highPriority, blockedInfra, blockedItems,
      overdueItems, missingDocs, unassignedCritical,
      totalCritical: new Set([
        ...criticalPriority.map(i => i.id),
        ...blockedInfra.map(i => i.id),
        ...blockedItems.map(i => i.id),
        ...overdueItems.map(i => i.id)
      ]).size
    };
  }, [items]);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 5 }, (_, i) => <Skeleton key={`cs-${i}`} className="h-32" />)}</div>;
  }

  const CriticalSection = ({ title, items: sectionItems, icon: Icon, variant = 'destructive', description }) => {
    if (!sectionItems || sectionItems.length === 0) return null;
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Icon className={cn("h-5 w-5", variant === 'destructive' ? 'text-destructive' : variant === 'warning' ? 'text-chart-2' : 'text-primary')} />
            {title}
            <Badge variant={variant} className="ml-auto">{sectionItems.length}</Badge>
          </CardTitle>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sectionItems.map(item => (
              <Collapsible key={item.id} open={expandedItems.has(item.id)}>
                <div className="border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all">
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-start justify-between p-3 cursor-pointer hover:bg-muted/30 text-left bg-transparent border-0"
                      onClick={() => toggleExpand(item.id)}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">{item.name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {item.priority && <Badge variant={item.priority === 'Critical' ? 'destructive' : item.priority === 'High' ? 'default' : 'secondary'} className="text-xs">{item.priority}</Badge>}
                          {item.status && <Badge variant="outline" className="text-xs">{item.status}</Badge>}
                          {item.completionStatus === 'On Hold' && <Badge variant="destructive" className="text-xs">On Hold</Badge>}
                          {item.person?.length > 0 && <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />{item.person[0].name}</span>}
                        </div>
                      </div>
                      <span className="inline-flex items-center justify-center h-8 w-8">
                        {expandedItems.has(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0 space-y-2 border-t border-border bg-muted/20">
                      {item.blockersrisks && (
                        <div className="bg-destructive/10 border border-destructive/30 rounded p-2">
                          <p className="text-xs font-medium text-destructive mb-1">Blockers/Risks:</p>
                          <p className="text-xs text-muted-foreground">{item.blockersrisks}</p>
                        </div>
                      )}
                      {item.dependencies && (
                        <div className="bg-chart-2/10 border border-chart-2/30 rounded p-2">
                          <p className="text-xs font-medium text-chart-2 mb-1">Dependencies:</p>
                          <p className="text-xs text-muted-foreground">{item.dependencies}</p>
                        </div>
                      )}
                      {item.taskDescription && (
                        <div className="bg-muted/50 rounded p-2">
                          <p className="text-xs font-medium text-foreground mb-1">Task Description:</p>
                          <p className="text-xs text-muted-foreground">{item.taskDescription}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {item.nextDueDate && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />Due: {new Date(item.nextDueDate).toLocaleDateString()}
                          </div>
                        )}
                        {item.itBudgetData?.length > 0 && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <FileText className="h-3 w-3" />{item.itBudgetData.length} docs
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {criticalAnalysis && criticalAnalysis.totalCritical > 0 && (
        <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <strong>Critical Items: {criticalAnalysis.totalCritical}</strong>
            <div className="mt-2 text-xs space-y-1">
              {criticalAnalysis.criticalPriority.length > 0 && <div>• {criticalAnalysis.criticalPriority.length} Critical Priority</div>}
              {criticalAnalysis.blockedInfra.length > 0 && <div>• {criticalAnalysis.blockedInfra.length} Blocked Infrastructure</div>}
              {criticalAnalysis.blockedItems.length > 0 && <div>• {criticalAnalysis.blockedItems.length} Blocked/Stuck</div>}
              {criticalAnalysis.overdueItems.length > 0 && <div>• {criticalAnalysis.overdueItems.length} Overdue</div>}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <CriticalSection title="Critical Priority Items" items={criticalAnalysis?.criticalPriority} icon={AlertTriangle} variant="destructive" description="Highest priority — immediate attention" />
      <CriticalSection title="Blocked Infrastructure" items={criticalAnalysis?.blockedInfra} icon={AlertCircle} variant="destructive" description="Systems with blocked status" />
      <CriticalSection title="Blocked & Stuck Items" items={criticalAnalysis?.blockedItems} icon={XCircle} variant="destructive" description="Items with blockers or stuck status" />
      <CriticalSection title="Overdue Tasks" items={criticalAnalysis?.overdueItems} icon={Clock} variant="warning" description="Past due date" />
      <CriticalSection title="High Priority Items" items={criticalAnalysis?.highPriority} icon={AlertTriangle} variant="warning" description="Close monitoring required" />
      <CriticalSection title="Unassigned Critical/High" items={criticalAnalysis?.unassignedCritical} icon={Users} variant="warning" description="No assigned owner" />
      <CriticalSection title="Missing Documentation" items={criticalAnalysis?.missingDocs} icon={FileText} variant="default" description="Active items without budget files" />

      {criticalAnalysis && criticalAnalysis.totalCritical === 0 && (
        <Card className="border-chart-1/40 bg-chart-1/5">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-16 w-16 text-chart-1 mb-4 opacity-50" />
            <p className="text-lg font-semibold text-chart-1 mb-2">No Critical Items</p>
            <p className="text-sm text-muted-foreground">All items within acceptable parameters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
