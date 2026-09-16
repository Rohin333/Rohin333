import { useState, useMemo } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { 
  Plus, RefreshCw, Layers, CheckCircle2, 
  AlertCircle, ChevronRight, FileSpreadsheet,
  Building2, ArrowRight
} from 'lucide-react';
import { cn } from '@lib/utils';

export default function BudgetSubitemSync({ items, loading, onRefresh }) {
  const [syncing, setSyncing] = useState({});

  // 1. Identify Budget Items (Parents)
  const budgetItems = useMemo(() => {
    return items.filter(i => i.group?.id === 'group_mm43t82' || i.group?.title === 'IT BUDGET Details');
  }, [items]);

  // 2. Identify Operational Items (Sources)
  const operationalItems = useMemo(() => {
    const opGroups = ['group_mm404h32', 'group_mm40z7pp', 'group_mm40j3je'];
    return items.filter(i => 
      opGroups.includes(i.group?.id) || 
      ['Applications & Systems Management', 'Network & Security Operations', 'Desktop & End-User Support'].includes(i.group?.title)
    );
  }, [items]);

  // 3. Map Operational Items to Budget Items
  const budgetMappings = useMemo(() => {
    return budgetItems.map(budget => {
      // Find operational items that match category
      const matches = operationalItems.filter(op => 
        (op.budgetCategories && budget.budgetCategories && op.budgetCategories.toLowerCase() === budget.budgetCategories.toLowerCase())
      );

      // Check existing subitems
      const existingSubitemNames = new Set(budget.subitems?.map(s => s.name) || []);
      const newPotentialSubitems = matches.filter(m => !existingSubitemNames.has(m.name));

      return {
        ...budget,
        matches,
        newPotentialSubitems,
        existingCount: budget.subitems?.length || 0
      };
    });
  }, [budgetItems, operationalItems]);

  const handleSyncSubitems = async (budgetItem) => {
    if (budgetItem.newPotentialSubitems.length === 0) return;
    
    try {
      setSyncing(prev => ({ ...prev, [budgetItem.id]: true }));
      const board = new ItProgrammeBoard();
      
      // Create subitems sequentially to avoid rate limits and keep order
      for (const opItem of budgetItem.newPotentialSubitems) {
        await board.item(budgetItem.id).subitem().create({
          name: opItem.name,
          status: "Operational Tasks"
        }).execute();
      }

      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Error syncing subitems:', err);
    } finally {
      setSyncing(prev => ({ ...prev, [budgetItem.id]: false }));
    }
  };

  if (loading && items.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">Loading budget structures...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Budget Subitem Generator</h2>
          <p className="text-sm text-muted-foreground">Sync operational line items as subitems for budget verification</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {budgetMappings.map((budget) => (
          <Card key={budget.id} className="border-border/60 overflow-hidden group">
            <div className="flex flex-col md:flex-row">
              {/* Left Side: Budget Item Info */}
              <div className="p-6 md:w-1/3 bg-muted/20 border-b md:border-b-0 md:border-r border-border/40">
                <div className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2 bg-primary/5 text-primary border-primary/20">
                      Parent Budget Item
                    </Badge>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{budget.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Department Group</p>
                      <p className="text-xs font-medium">{budget.group?.title || '—'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Category</p>
                      <p className="text-xs font-medium">{budget.budgetCategories || '—'}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Sync Coverage</span>
                      <span className="font-bold text-primary">
                        {budget.existingCount} / {budget.matches.length}
                      </span>
                    </div>
                    <Progress value={(budget.existingCount / (budget.matches.length || 1)) * 100} className="h-1.5" />
                  </div>
                </div>
              </div>

              {/* Right Side: Operational Matching & Actions */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-card">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">Operational Budget Matches</h4>
                  </div>

                  {budget.matches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4 text-center bg-muted/30 rounded-lg border border-dashed border-border/60">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-xs text-muted-foreground">No operational items match this category/department</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {budget.matches.map(op => (
                        <div key={op.id} className="flex items-center justify-between p-2 rounded bg-muted/50 border border-border/40">
                          <span className="text-xs font-medium truncate pr-2">{op.name}</span>
                          {budget.subitems?.some(s => s.name === op.name) ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-chart-1 flex-shrink-0" />
                          ) : (
                            <Badge variant="secondary" className="text-[9px] h-4 px-1">NEW</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-end gap-3">
                  {budget.newPotentialSubitems.length > 0 ? (
                    <Button 
                      onClick={() => handleSyncSubitems(budget)} 
                      disabled={syncing[budget.id]}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    >
                      {syncing[budget.id] ? (
                        <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 mr-2" />
                      )}
                      Generate {budget.newPotentialSubitems.length} Subitems
                    </Button>
                  ) : budget.matches.length > 0 ? (
                    <Badge variant="outline" className="h-8 px-3 border-chart-1/40 bg-chart-1/5 text-chart-1">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                      All Operational Items Synced
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
