import { Badge } from '@components/ui/badge';
import { cn } from '@lib/utils';

export default function CyberpunkCard({ 
  title, 
  status, 
  description, 
  metrics = [],
  progressValue,
  variant = 'default',
  onClick,
  className,
  children
}) {
  const isCritical = status === 'CRITICAL' || variant === 'critical';
  const isActive = status === 'ACTIVE' || variant === 'active';
  const isPending = status === 'PENDING' || variant === 'pending';
  
  if (children && !title) {
    return (
      <div className={cn("programme-card rounded-md", className)}>
        {children}
      </div>
    );
  }

  const handleKeyDown = onClick ? (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  } : undefined;
  
  return (
    <div 
      className={cn(
        "programme-card rounded-md p-5 transition-all duration-300 relative",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <AccentLine isCritical={isCritical} isActive={isActive} isPending={isPending} />
      <CardHead title={title} status={status} isCritical={isCritical} isActive={isActive} isPending={isPending} />
      {description && (
        <p className="text-xs text-muted-foreground pl-3 mb-4 leading-relaxed font-normal tracking-normal max-w-[90%]">
          {description}
        </p>
      )}
      {progressValue !== undefined && <ProgressBar value={progressValue} />}
      {metrics.length > 0 && <MetricsRow metrics={metrics} />}
      {children}
    </div>
  );
}

function AccentLine({ isCritical, isActive, isPending }) {
  const glowStyle = isCritical
    ? { boxShadow: 'var(--line-glow-accent)' }
    : isActive
    ? { boxShadow: 'var(--line-glow-primary)' }
    : isPending
    ? { boxShadow: 'var(--line-glow-pending)' }
    : undefined;

  return (
    <div
      className={cn(
        "absolute left-0 top-3 bottom-3 w-[2px] rounded-full",
        isCritical && "bg-accent",
        isActive && "bg-primary",
        isPending && "bg-chart-4",
        !isCritical && !isActive && !isPending && "bg-border"
      )}
      style={glowStyle}
    />
  );
}

function CardHead({ title, status, isCritical, isActive, isPending }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3 pl-3">
      <h3 className="text-base sm:text-lg font-bold tracking-[0.04em] text-foreground leading-tight flex-1 font-[family-name:var(--font-heading)]">
        {title}
      </h3>
      {status && (
        <Badge
          variant="outline"
          className={cn(
            "text-[9px] font-black tracking-widest px-2.5 py-0.5 border rounded-full flex items-center gap-1.5 flex-shrink-0",
            isCritical && "bg-accent/15 text-accent border-accent/50",
            isActive && "bg-primary/15 text-primary border-primary/50",
            isPending && "bg-chart-4/15 text-chart-4 border-chart-4/50"
          )}
        >
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            isCritical && "bg-accent",
            isActive && "bg-primary",
            isPending && "bg-chart-4"
          )} />
          {status}
        </Badge>
      )}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="pl-3 mb-4">
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-chart-3 transition-all duration-700"
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            boxShadow: 'var(--progress-glow-cyan)'
          }}
        />
      </div>
    </div>
  );
}

function MetricsRow({ metrics }) {
  return (
    <div className="pl-3 pt-3 border-t border-border/30">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div
              className="text-xl sm:text-2xl font-black tabular-nums text-primary tracking-tight leading-none mb-0.5"
              style={{ textShadow: 'var(--text-glow-metric)' }}
            >
              {metric.value}
            </div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-[0.12em] font-semibold">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
