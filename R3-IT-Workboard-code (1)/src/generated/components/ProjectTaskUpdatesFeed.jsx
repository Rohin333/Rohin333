import { useState, useEffect, useMemo } from 'react';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Alert, AlertDescription } from '@components/ui/alert';
import { 
  FileText, Calendar, User, MessageSquare, 
  RefreshCw, Filter, ChevronDown, Clock, CheckCircle2
} from 'lucide-react';
import { cn } from '@lib/utils';
import CyberpunkCard from './CyberpunkCard';

export default function ProjectTaskUpdatesFeed({ items, loading }) {
  const [updates, setUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  useEffect(() => {
    if (items && items.length > 0) {
      fetchUpdates();
    }
  }, [items]);

  const fetchUpdates = async () => {
    try {
      setLoadingUpdates(true);
      const board = new ITProgrammeBoard();
      
      // Fetch items with updates from Projects group
      const projectItems = items.filter(i => 
        i.group?.id === 'group_mm45zz29' || 
        i.group?.title === 'Projects'
      );

      const updatesData = [];
      for (const item of projectItems.slice(0, 20)) { // Limit to first 20 for performance
        try {
          const itemWithUpdates = await board.item(item.id)
            .withUpdates({ includeAssets: true })
            .execute();
          
          if (itemWithUpdates.updates && itemWithUpdates.updates.length > 0) {
            updatesData.push({
              ...item,
              updates: itemWithUpdates.updates
            });
          }
        } catch (err) {
          console.error(`Error fetching updates for item ${item.id}:`, err);
        }
      }

      setUpdates(updatesData);
    } catch (err) {
      console.error('Error fetching project updates:', err);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const filteredUpdates = useMemo(() => {
    if (filterStatus === 'all') return updates;
    return updates.filter(item => item.status === filterStatus);
  }, [updates, filterStatus]);

  const toggleExpanded = (itemId) => {
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

  if (loading || loadingUpdates) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Loading project updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-wider text-primary">Project Task Updates Feed</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Real-time status updates and task progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchUpdates}
            disabled={loadingUpdates}
            className="text-[10px] h-8 uppercase tracking-wider"
          >
            <RefreshCw className={cn("h-3 w-3 mr-1.5", loadingUpdates && "animate-spin")} />
            Refresh
          </Button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-8 px-2 text-[10px] bg-muted border border-border rounded uppercase tracking-wider"
          >
            <option value="all">All Status</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Stuck">Stuck</option>
            <option value="Not Yet Started">Not Yet Started</option>
          </select>
        </div>
      </div>

      {/* Updates List */}
      {filteredUpdates.length === 0 ? (
        <Alert className="border-border/60">
          <MessageSquare className="h-4 w-4" />
          <AlertDescription className="text-xs">
            No updates found for project items. Updates will appear here when team members post status changes.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-3">
          {filteredUpdates.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            const latestUpdate = item.updates[0];
            
            return (
              <CyberpunkCard key={item.id} className="overflow-hidden">
                <div className="p-4">
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[9px] font-bold",
                            item.status === 'Done' && "bg-primary/20 text-primary",
                            item.status === 'Stuck' && "bg-accent/20 text-accent",
                            item.status === 'In Progress' && "bg-blue-500/20 text-blue-400"
                          )}
                        >
                          {item.status}
                        </Badge>
                        {item.priority && (
                          <Badge variant="outline" className="text-[9px]">
                            {item.priority} Priority
                          </Badge>
                        )}
                        {item.person && item.person.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{item.person[0].name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(item.id)}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded && "rotate-180"
                      )} />
                    </Button>
                  </div>

                  {/* Latest Update Preview */}
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider">
                        Latest Update
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(latestUpdate.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {latestUpdate.text_body || 'No description provided'}
                    </p>
                    {latestUpdate.creator && (
                      <div className="flex items-center gap-1 mt-2 text-[9px] text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{latestUpdate.creator.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Updates Section */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                      <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
                        All Updates ({item.updates.length})
                      </div>
                      {item.updates.map((update, idx) => (
                        <div 
                          key={update.id || idx}
                          className="p-3 bg-background/60 rounded border border-border/30"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {update.creator && (
                                <div className="flex items-center gap-1 text-[10px] text-foreground font-semibold">
                                  <User className="h-3 w-3" />
                                  <span>{update.creator.name}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(update.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                            {update.text_body || 'No description provided'}
                          </p>
                          {update.assets && update.assets.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <FileText className="h-3 w-3 text-primary" />
                              <span className="text-[9px] text-primary">
                                {update.assets.length} attachment(s)
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/40 text-[10px]">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>{item.updates.length} updates</span>
                    </div>
                    {item.annualCostBhd && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="font-mono">{item.annualCostBhd.toLocaleString()} BHD</span>
                      </div>
                    )}
                    {item.date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date.from} → {item.date.to}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CyberpunkCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
