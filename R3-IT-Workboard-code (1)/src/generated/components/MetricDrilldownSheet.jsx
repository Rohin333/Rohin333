import { useState, useEffect, useCallback } from 'react';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from '@components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { Spinner } from '@components/ui/spinner';
import { ScrollArea } from '@components/ui/scroll-area';
import { ExternalLink, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';

const DETAIL_COLUMNS = [
  'person', 'status', 'priority', 'currentStatus', 'projOp',
  'annualCostBhd', 'monthlyCostBhd', 'nextDueDate',
  'blockersrisks', 'infrastructureType', 'comments',
  'updateSummaryShort', 'slaHours',
  'awsServerCount', 'assignedTeam', 'vendor', 'summary'
];

const STATUS_COLORS = {
  'Done': 'bg-chart-1/15 text-chart-1',
  'In Progress': 'bg-primary/15 text-primary',
  'Stuck': 'bg-destructive/15 text-destructive',
  'Not Yet Started': 'bg-chart-2/15 text-chart-2',
  'Postponed': 'bg-chart-4/15 text-chart-4',
  'Cancelled': 'bg-muted text-muted-foreground',
};

const PRIORITY_COLORS = {
  'Critical': 'bg-destructive/15 text-destructive',
  'High': 'bg-chart-5/15 text-chart-5',
  'Medium': 'bg-chart-4/15 text-chart-4',
  'Low': 'bg-primary/15 text-primary',
};

export default function MetricDrilldownSheet({ open, onClose, config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalLoaded, setTotalLoaded] = useState(0);

  const fetchItems = useCallback(async () => {
    if (!config?.filter) return;
    try {
      setLoading(true);
      setItems([]);
      const board = new ITProgrammeBoard();
      let query = board.items().withColumns(DETAIL_COLUMNS).withPagination({ limit: 25 });

      if (config.filter && Object.keys(config.filter).length > 0) {
        query = query.where(config.filter);
      }
      if (config.orderBy) {
        query = query.orderBy(config.orderBy);
      }

      const results = await query.execute();
      setItems(results.items || []);
      setCursor(results.cursor);
      setTotalLoaded(results.items?.length || 0);
    } catch (err) {
      console.error('Error fetching drill-down items:', err);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const board = new ITProgrammeBoard()();
      const results = await board.items()
        .withColumns(DETAIL_COLUMNS)
        .withPagination({ cursor })
        .execute();
      setItems(prev => [...prev, ...(results.items || [])]);
      setCursor(results.cursor);
      setTotalLoaded(prev => prev + (results.items?.length || 0));
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (open && config) {
      fetchItems();
    }
    if (!open) {
      setItems([]);
      setCursor(null);
      setTotalLoaded(0);
    }
  }, [open, config, fetchItems]);

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-4xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-border/40 flex-shrink-0">
          <SheetTitle className="text-base font-bold font-[family-name:var(--font-heading)]">
            {config?.title || 'Item Details'}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {config?.description || 'Showing matching board items'}
            {totalLoaded > 0 && (
              <Badge variant="outline" className="ml-2 text-[10px] border-primary/30">
                {totalLoaded} loaded{cursor ? ' (more available)' : ''}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }, (_, i) => (
                <Skeleton key={`skel-${i}`} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">No items found</p>
              <p className="text-xs mt-1">No board items match this filter</p>
            </div>
          ) : (
            <div className="p-2">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Item</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Group</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Priority</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Owner</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background">Type</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 sticky top-0 bg-background text-right">Cost (BHD)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <DrilldownRow key={item.id} item={item} />
                  ))}
                </TableBody>
              </Table>

              {cursor && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="h-8 text-xs"
                  >
                    {loadingMore ? (
                      <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Loading...</>
                    ) : (
                      <><ChevronRight className="h-3 w-3 mr-1.5" /> Load More</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function DrilldownRow({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        className="hover:bg-muted/30 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="py-2 max-w-[220px]">
          <div className="flex items-center gap-1.5">
            <ChevronRight className={cn(
              "h-3 w-3 text-muted-foreground flex-shrink-0 transition-transform",
              expanded && "rotate-90"
            )} />
            <span className="text-xs font-medium truncate">{item.name}</span>
          </div>
        </TableCell>
        <TableCell className="py-2">
          <span className="text-[10px] text-muted-foreground">{item.group?.title || '—'}</span>
        </TableCell>
        <TableCell className="py-2">
          <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", STATUS_COLORS[item.status] || '')}>
            {item.status || '—'}
          </Badge>
        </TableCell>
        <TableCell className="py-2">
          {item.priority ? (
            <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0", PRIORITY_COLORS[item.priority] || '')}>
              {item.priority}
            </Badge>
          ) : <span className="text-[10px] text-muted-foreground">—</span>}
        </TableCell>
        <TableCell className="py-2">
          <span className="text-[10px] text-muted-foreground">{item.person?.[0]?.name || '—'}</span>
        </TableCell>
        <TableCell className="py-2">
          <span className="text-[10px] text-muted-foreground">{item.projOp || '—'}</span>
        </TableCell>
        <TableCell className="py-2 text-right">
          <span className="text-xs font-semibold tabular-nums text-primary">
            {(item.annualCostBhd || 0) > 0 ? (item.annualCostBhd).toLocaleString() : '—'}
          </span>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={7} className="py-3 px-6">
            <ExpandedDetail item={item} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function ExpandedDetail({ item }) {
  const dueDate = item.nextDueDate ? new Date(item.nextDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const isOverdue = item.nextDueDate && new Date(item.nextDueDate) < new Date() && item.status !== 'Done';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div className="space-y-4">
        <DetailField label="Infrastructure Details" value={item.infrastructureType?.join(', ')} />
        <DetailField label="AWS Servers" value={item.awsServerCount} />
        <DetailField label="Vendor" value={item.vendor} />
        <DetailField label="Annual Cost" value={item.annualCostBhd > 0 ? `${item.annualCostBhd.toLocaleString()} BHD` : null} />
        <DetailField label="Monthly Cost" value={item.monthlyCostBhd > 0 ? `${item.monthlyCostBhd.toLocaleString()} BHD` : null} />
        <DetailField label="SLA / Availability" value={item.slaHours} />
      </div>

      <div className="space-y-4">
        <DetailField label="Current Status" value={item.currentStatus}>
          {isOverdue && <Badge variant="destructive" className="text-[9px] px-1 py-0 ml-1">Overdue</Badge>}
        </DetailField>
        <DetailField label="Next Due Date" value={dueDate} />
        <DetailField label="Assigned Team" value={item.assignedTeam?.join(', ')} />
        <DetailField label="Check Frequency" value={item.frequency?.join(', ')} />
        <DetailField label="Primary Owner" value={item.person?.[0]?.name} />
      </div>
<div className="md:col-span-2 space-y-4 pt-2 border-t border-border/40">
  <DetailField label="Update Summary" value={item.updateSummaryShort || item.summary} />
    {item.blockersrisks && <DetailField label="Blockers / Risks" value={item.blockersrisks} danger />}
      {item.comments && <DetailField label="Comments" value={item.comments} />}
      </div>

    </div>
  );
}

function DetailField({ label, value, danger, children }) {
  if (!value && !children) return null;
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
      <p className={cn("text-xs", danger ? "text-destructive" : "text-foreground")}>
        {value || '—'}{children}
      </p>
    </div>
  );
}
