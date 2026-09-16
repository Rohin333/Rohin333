import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { 
  CheckCircle2, XCircle, Clock, User, 
  FileText, ChevronDown, ChevronRight, AlertTriangle
} from 'lucide-react';
import { cn } from '@lib/utils';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function ApprovalWorkflowView({ items, loading }) {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [subitemsData, setSubitemsData] = useState({});
  const [loadingSubitems, setLoadingSubitems] = useState({});

  const toggleExpand = async (itemId) => {
    const newExpanded = new Set(expandedItems);
    
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
      
      // Load subitems if not already loaded
      if (!subitemsData[itemId] && !loadingSubitems[itemId]) {
        setLoadingSubitems(prev => ({ ...prev, [itemId]: true }));
        try {
          const board = new ITProgrammeBoard();
          const itemDetails = await board.item(itemId)
            .withSubItems(['name'])
            .execute();
          
          setSubitemsData(prev => ({ 
            ...prev, 
            [itemId]: itemDetails.subitems || [] 
          }));
        } catch (err) {
          console.error('Error loading subitems:', err);
        } finally {
          setLoadingSubitems(prev => ({ ...prev, [itemId]: false }));
        }
      }
    }
    
    setExpandedItems(newExpanded);
  };

  const workflowItems = useMemo(() => {
    if (!items) return [];
    
    return items
      .filter(item => item.projOp === 'Operational')
      .map(item => {
        // Determine workflow status based on item status
        const isPrepared = item.status !== 'Not Yet Started';
        const isReviewed = item.status === 'In Progress' || item.status === 'Done';
        const isApproved = item.status === 'Done';
        
        return {
          ...item,
          workflowStatus: {
            prepared: isPrepared,
            reviewed: isReviewed,
            approved: isApproved
          }
        };
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [items]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{workflowItems.length}</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-2">
                  {workflowItems.filter(i => !i.workflowStatus.reviewed).length}
                </p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-4">
                  {workflowItems.filter(i => i.workflowStatus.reviewed && !i.workflowStatus.approved).length}
                </p>
                <p className="text-xs text-muted-foreground">Awaiting Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-1">
                  {workflowItems.filter(i => i.workflowStatus.approved).length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Tasks */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary">Approval Workflow Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workflowItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No operational tasks found</p>
              </div>
            ) : (
              workflowItems.map((item) => (
                <div key={item.id} className="border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all">
                  {/* Main Task */}
                  <div className="p-4 bg-card/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-2">{item.name}</h4>
                          
                          {/* Workflow Status Indicators */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              {item.workflowStatus.prepared ? (
                                <CheckCircle2 className="h-4 w-4 text-chart-1" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(
                                "text-xs",
                                item.workflowStatus.prepared ? "text-chart-1" : "text-muted-foreground"
                              )}>
                                Prepared
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {item.workflowStatus.reviewed ? (
                                <CheckCircle2 className="h-4 w-4 text-chart-1" />
                              ) : (
                                <Clock className="h-4 w-4 text-chart-2" />
                              )}
                              <span className={cn(
                                "text-xs",
                                item.workflowStatus.reviewed ? "text-chart-1" : "text-chart-2"
                              )}>
                                Reviewed
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {item.workflowStatus.approved ? (
                                <CheckCircle2 className="h-4 w-4 text-chart-1" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(
                                "text-xs",
                                item.workflowStatus.approved ? "text-chart-1" : "text-muted-foreground"
                              )}>
                                Approved
                              </span>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {item.person && item.person.length > 0 && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {item.person[0].name}
                              </div>
                            )}
                            {item.updatedAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Updated {formatDate(item.updatedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge 
                        variant="secondary"
                        className={cn(
                          item.status === 'Done' && "bg-chart-1/20 text-chart-1",
                          item.status === 'In Progress' && "bg-primary/20 text-primary",
                          item.status === 'Not Yet Started' && "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Subitems */}
                  {expandedItems.has(item.id) && (
                    <div className="border-t border-border bg-muted/20 p-4">
                      {loadingSubitems[item.id] ? (
                        <div className="space-y-2">
                          <Skeleton className="h-16 w-full" />
                          <Skeleton className="h-16 w-full" />
                        </div>
                      ) : subitemsData[item.id] && subitemsData[item.id].length > 0 ? (
                        <div className="space-y-2">
                          <h5 className="text-sm font-semibold text-foreground mb-3">
                            Sub-tasks ({subitemsData[item.id].length})
                          </h5>
                          {subitemsData[item.id].map((subitem) => (
                            <div key={subitem.id} className="bg-card rounded-lg p-3 flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">{subitem.name}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  {subitem.owner && subitem.owner.length > 0 && (
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {subitem.owner[0].name}
                                    </div>
                                  )}
                                  {subitem.date && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {subitem.date.from} - {subitem.date.to}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  subitem.status === 'Done' && "bg-chart-1/10 text-chart-1 border-chart-1/40",
                                  subitem.status === 'In Progress' && "bg-primary/10 text-primary border-primary/40"
                                )}
                              >
                                {subitem.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No sub-tasks for this item
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
