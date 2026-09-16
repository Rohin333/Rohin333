import { FadeIn } from '@skills/motion-animations.jsx';
import { PROGRAMMES } from '@generated/config/programmeConfig';
import { Skeleton } from '@components/ui/skeleton';

export default function ProgrammeCards({ items = [], loading = true, onNavigate }) {
  if (loading) return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-56 w-full rounded-xl" />)}
    </div>
  );

  const data = PROGRAMMES.map(p => {
    const groupItems = items.filter(item => item.group?.id === p.groupId);
    const total = groupItems.length;
    const done = groupItems.filter(item => item.status === 'Done').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ...p, projects: total, progress };
  });

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((c, i) => (
        <FadeIn key={c.groupId} direction="up" delay={i * 0.06}>
          <button type="button" className="prog-card w-full cursor-pointer p-5 text-left transition-all hover:scale-[1.02]"
            onClick={() => onNavigate?.(c.groupId)}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold tracking-wider md:text-base">
                {c.title}
              </h3>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${c.badgeClass}`}>
                ● {c.badge}
              </span>
            </div>
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {c.description}
            </p>
            <div className="prog-bar mb-5">
              <div className="prog-bar-fill" style={{ width: `${c.progress}%` }} />
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="prog-value text-xl">{c.projects}</p>
                <p className="mono-label">Projects</p>
              </div>
              <div className="text-center">
                <p className="prog-value text-xl">{c.progress}%</p>
                <p className="mono-label">Progress</p>
              </div>
              <div className="text-center">
                <p className="prog-value text-xl">{c.target}</p>
                <p className="mono-label">Target</p>
              </div>
            </div>
          </button>
        </FadeIn>
      ))}
    </div>
  );
}
