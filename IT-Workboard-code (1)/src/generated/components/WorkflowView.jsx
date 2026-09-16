import { useState, useEffect, useCallback } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Spinner } from '@components/ui/spinner';
import { Loader2, GitBranch } from 'lucide-react';
import { FadeIn, AnimatedList } from '@skills/motion-animations.jsx';

const STATUS_COLORS = {
  'In Progress': 'border-primary/40 text-primary bg-primary/10',
  'Done': 'border-primary/40 text-primary bg-primary/10',
  'Stuck': 'border-destructive/40 text-destructive bg-destructive/10',
  'Not Yet Started': 'border-muted-foreground/40 text-muted-foreground bg-muted',
  'Postponed': 'border-muted-foreground/40 text-muted-foreground bg-muted/50',
  'Daily Operational Tasks': 'border-primary/30 text-primary/80 bg-primary/5',
  'Emergency operantional TaskTask': 'border-destructive/30 text-destructive/80 bg-destructive/5',
  'Cancelled': 'border-muted-foreground/30 text-muted-foreground/60 bg-muted/30',
};

export default function WorkflowView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const board = new ItProgrammeBoard();
      const results = await board.items()
        .withColumns(['status', 'projOp', 'completionStatus', 'priority', 'nextDueDate', 'person'])
        .orderBy({ column: 'updatedAt', direction: 'desc' })
        .withPagination({ limit: 25 })
        .execute();
      setItems(results.items || []);
      setCursor(results.cursor);
    } catch (err) {
      console.error('Error fetching workflow items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const board = new ItProgrammeBoard();
      const results = await board.items()
        .withPagination({ cursor })
        .execute();
      setItems(prev => [...prev, ...(results.items || [])]);
      setCursor(results.cursor);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => { fetchItems(); }, [fetchItems]);

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const byStatus = {};
  items.forEach(item => {
    const st = item.status || 'Unknown';
    if (!byStatus[st]) byStatus[st] = [];
    byStatus[st].push(item);
  });

  return (
    <div className="relative space-y-5 z-10">
      <FadeIn direction="down" distance={10}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
              Lifecycle
            </h2>
          </div>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
            {items.length} items
          </Badge>
        </div>
      </FadeIn>

      {/* Status columns */}
      <AnimatedList stagger={0.06} animation="fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(byStatus).map(([status, statusItems]) => (
            <div key={status} className="border border-border bg-card/40 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border font-medium ${STATUS_COLORS[status] || 'border-border text-muted-foreground'}`}>
                  {status}
                </span>
                <span className="text-xs text-primary font-[family-name:var(--font-heading)] font-semibold">{statusItems.length}</span>
              </div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {statusItems.slice(0, 10).map(item => (
                  <div key={item.id} className="bg-muted/20 border border-border/30 p-2 text-[10px] hover:border-primary/20 transition-colors">
                    <p className="text-foreground truncate">{item.name}</p>
                    <p className="text-muted-foreground mt-0.5">
                      {item.person?.map(p => p.name?.split(' ')[0]).join(', ') || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimatedList>

      {cursor && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="sm"
            className="text-xs border-primary/30 text-primary hover:bg-primary/10">
            {loadingMore ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : null}
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
