import { useState } from 'react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Spinner } from '@components/ui/spinner';
import { ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { FadeIn } from '@skills/motion-animations.jsx';

const STATUS_COLORS = {
  'In Progress': 'border-primary/40 text-primary bg-primary/10',
  'Done': 'border-primary/40 text-primary bg-primary/10',
  'Stuck': 'border-destructive/40 text-destructive bg-destructive/10',
  'Not Yet Started': 'border-muted-foreground/40 text-muted-foreground bg-muted',
  'Postponed': 'border-muted-foreground/40 text-muted-foreground bg-muted/50',
  'Cancelled': 'border-muted-foreground/40 text-muted-foreground bg-muted/30',
};

const PRIORITY_COLORS = {
  'Critical': 'text-destructive',
  'High': 'text-destructive/80',
  'Medium': 'text-primary',
  'Low': 'text-muted-foreground',
};

export default function ProjectsView({ items, loading, cursor, loadMore, loadingMore }) {
  const [expandedId, setExpandedId] = useState(null);

  const projectItems = items.filter(i =>
    i.group?.id === 'new_group96591' || i.projOp === 'Project'
  );

  if (loading && projectItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
    <div className="relative space-y-4 z-10">
      <FadeIn direction="down" distance={10}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
            Projects & Initiatives
          </h2>
          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
            {projectItems.length} items
          </Badge>
        </div>
      </FadeIn>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_100px_80px_100px_80px] gap-2 px-3 py-2.5 border-b border-primary/20 text-[10px] uppercase tracking-[0.12em] text-primary/70 font-[family-name:var(--font-heading)] font-medium">
        <span>Name</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Timeline</span>
        <span>Cost</span>
      </div>

      {/* Table Rows */}
      <div className={`space-y-0 ${loading && items.length > 0 ? 'opacity-50' : ''}`}>
        {projectItems.map(item => (
          <div key={item.id} className="border-b border-border/40">
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full grid grid-cols-[1fr_100px_80px_100px_80px] gap-2 px-3 py-2.5 text-left hover:bg-primary/5 transition-colors duration-150 items-center"
            >
              <span className="text-xs text-foreground truncate">{item.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm border inline-flex items-center w-fit ${STATUS_COLORS[item.status] || 'border-border text-muted-foreground'}`}>
                {item.status || '—'}
              </span>
              <span className={`text-[10px] font-medium ${PRIORITY_COLORS[item.priority] || 'text-muted-foreground'}`}>
                {item.priority || '—'}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {item.date ? item.date.from?.slice(5) : '—'}
              </span>
              <span className="text-[10px] text-primary font-medium">
                {item.annualCostBhd ? `${(item.annualCostBhd / 1000).toFixed(0)}K` : '—'}
              </span>
            </button>
            {expandedId === item.id && (
              <div className="px-3 pb-3 pt-1.5 space-y-2 bg-card/80 border-t border-primary/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Vendor</span>
                    <span className="text-foreground">{item.vendor || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Assignee</span>
                    <span className="text-foreground">{item.person?.map(p => p.name).join(', ') || 'Unassigned'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Monthly Cost</span>
                    <span className="text-primary">{item.monthlyCostBhd ? `${item.monthlyCostBhd} BHD` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Infrastructure</span>
                    <span className="text-foreground">{item.infrastructureType?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
                {item.taskDescription && item.taskDescription !== '"This is some text" or null' && (
                  <p className="text-[11px] text-muted-foreground">{item.taskDescription}</p>
                )}
                {item.detailedProjectUrl && item.detailedProjectUrl !== '"This is some text" or null' && (
                  <a href={item.detailedProjectUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline">
                    <ExternalLink className="h-2.5 w-2.5" /> View Details
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {cursor && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="sm"
            className="text-xs border-primary/30 text-primary hover:bg-primary/10">
            {loadingMore ? <Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> : <ChevronDown className="h-3 w-3 mr-1.5" />}
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
