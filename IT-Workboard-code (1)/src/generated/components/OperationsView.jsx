import { Badge } from '@components/ui/badge';
import { Spinner } from '@components/ui/spinner';
import { FadeIn, AnimatedList } from '@skills/motion-animations.jsx';

const STATUS_COLORS = {
  'In Progress': 'border-primary/40 text-primary bg-primary/10',
  'Done': 'border-primary/40 text-primary bg-primary/10',
  'Stuck': 'border-destructive/40 text-destructive bg-destructive/10',
  'Daily Operational Tasks': 'border-primary/30 text-primary/80 bg-primary/5',
  'Emergency operantional TaskTask': 'border-destructive/30 text-destructive/80 bg-destructive/5',
  'Not Yet Started': 'border-muted-foreground/40 text-muted-foreground bg-muted',
};

export default function OperationsView({ items, loading }) {
  const opItems = items.filter(i =>
    i.projOp === 'Operational' ||
    i.group?.id === 'group_mm404h32' ||
    i.group?.id === 'group_mm40z7pp' ||
    i.group?.id === 'group_mm40j3je'
  );

  if (loading && opItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  const grouped = {
    'Applications & Systems': opItems.filter(i => i.group?.id === 'group_mm404h32'),
    'Network & Security': opItems.filter(i => i.group?.id === 'group_mm40z7pp'),
    'Desktop & End-User': opItems.filter(i => i.group?.id === 'group_mm40j3je'),
  };

  return (
    <div className="relative space-y-5 z-10">
      <FadeIn direction="down" distance={10}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
            Operations
          </h2>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
            {opItems.length} tasks
          </Badge>
        </div>
      </FadeIn>

      <AnimatedList stagger={0.1} animation="fadeUp">
        {Object.entries(grouped).map(([groupName, groupItems]) => (
          <div key={groupName} className="space-y-2">
            <div className="flex items-center gap-2 border-b border-primary/15 pb-1.5">
              <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
                {groupName}
              </h3>
              <span className="text-[10px] text-muted-foreground">({groupItems.length})</span>
            </div>
            <div className="border border-border/60 divide-y divide-border/30">
              {groupItems.length === 0 ? (
                <p className="text-xs text-muted-foreground px-3 py-4 text-center">No items in this group</p>
              ) : (
                groupItems.map(item => (
                  <div key={item.id} className="grid grid-cols-[1fr_100px_90px_80px] gap-2 px-3 py-2.5 items-center hover:bg-primary/5 transition-colors">
                    <span className="text-xs text-foreground truncate">{item.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border inline-flex items-center w-fit ${STATUS_COLORS[item.status] || 'border-border text-muted-foreground'}`}>
                      {item.status || '—'}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {item.person?.map(p => p.name?.split(' ')[0]).join(', ') || '—'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {item.frequency?.join(', ') || '—'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </AnimatedList>
    </div>
  );
}
