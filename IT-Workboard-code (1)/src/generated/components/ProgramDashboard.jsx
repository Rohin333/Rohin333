import { Activity, Server, Users, Zap, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { FadeIn, AnimatedList, HoverGrow } from '@skills/motion-animations.jsx';
import TRALogo from '@generated/components/TRALogo';

const KPIBox = ({ value, label, icon: Icon, color = 'primary', delay = 0 }) => (
  <FadeIn direction="up" delay={delay} distance={15}>
    <div className="relative border border-border bg-card/60 p-4 md:p-5 flex items-center justify-between group hover:border-primary/30 transition-colors duration-200">
      <div>
        <p className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-semibold text-foreground tracking-wide">
          {value}
        </p>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{label}</p>
      </div>
      <div className={`h-10 w-10 flex items-center justify-center ${color === 'destructive' ? 'text-destructive/50' : 'text-primary/30'}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </FadeIn>
);

const ProgramCard = ({ title, status, description, projects, progress, target }) => {
  const statusColor = status === 'ACTIVE' ? 'bg-primary/20 text-primary' :
    status === 'CRITICAL' ? 'bg-destructive/20 text-destructive' :
    'bg-primary/10 text-primary/70';
  const dotColor = status === 'CRITICAL' ? 'bg-destructive' : 'bg-primary';
  const borderGlow = status === 'CRITICAL' ? 'border-destructive/30 hover:border-destructive/50' : 'border-primary/20 hover:border-primary/40';

  return (
    <HoverGrow scale={1.02} lift={3}>
      <div className={`border ${borderGlow} bg-card/50 p-4 md:p-5 space-y-3 transition-colors duration-200 h-full`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-[family-name:var(--font-heading)] font-semibold text-foreground tracking-wide">
            {title}
          </h3>
          <span className={`inline-flex items-center gap-1 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${statusColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{description}</p>
        {/* Progress bar */}
        <div className="h-0.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${status === 'CRITICAL' ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <span className="text-primary font-[family-name:var(--font-heading)] font-bold text-xl block">{projects}</span>
            <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">Projects</span>
          </div>
          <div className="text-center">
            <span className="text-primary font-[family-name:var(--font-heading)] font-bold text-xl block">{progress}%</span>
            <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">Progress</span>
          </div>
          <div className="text-center">
            <span className="text-primary font-[family-name:var(--font-heading)] font-bold text-xl block">{target}</span>
            <span className="text-[8px] uppercase tracking-[0.12em] text-muted-foreground">Target</span>
          </div>
        </div>
      </div>
    </HoverGrow>
  );
};

export default function ProgramDashboard({ aggregates, aggLoading, items, loading, onNavigate }) {
  const totals = aggregates?.totals || {};
  const counts = aggregates?.counts || {};
  const rates = aggregates?.rates || {};

  const groups = {
    projects: items.filter(i => i.group?.id === 'new_group96591'),
    apps: items.filter(i => i.group?.id === 'group_mm404h32'),
    network: items.filter(i => i.group?.id === 'group_mm40z7pp'),
    desktop: items.filter(i => i.group?.id === 'group_mm40j3je'),
    completed: items.filter(i => i.group?.id === 'new_group'),
    budget: items.filter(i => i.group?.id === 'group_mm43t82'),
  };

  const getGroupStats = (groupItems) => {
    const total = groupItems.length;
    const done = groupItems.filter(i => i.status === 'Done').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, progress };
  };

  const projectStats = getGroupStats(groups.projects);
  const appStats = getGroupStats(groups.apps);
  const networkStats = getGroupStats(groups.network);
  const desktopStats = getGroupStats(groups.desktop);
  const budgetStats = getGroupStats(groups.budget);
  const completedStats = { total: groups.completed.length, done: groups.completed.length, progress: 100 };

  return (
    <div className="relative space-y-6 z-10">
      {/* Header with TRA Logo */}
      <FadeIn direction="down" distance={20}>
        <div className="text-center py-5 space-y-2">
          <div className="flex items-center justify-center gap-4">
            <TRALogo size={48} />
            <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-heading)] font-light text-foreground tracking-[0.12em] uppercase">
              IT Programme Board
            </h1>
            <TRALogo size={48} />
          </div>
          <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Telecommunications Regulatory Authority – Kingdom of Bahrain
          </p>
        </div>
      </FadeIn>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
        <KPIBox value={totals.totalItems || 0} label="Active Projects" icon={Activity} delay={0} />
        <KPIBox value={totals.totalAWSServers || 0} label="Systems" icon={Server} delay={0.1} />
        <KPIBox value={`${rates.completionRate || 0}%`} label="Completion" icon={TrendingUp} delay={0.2} />
        <KPIBox value={counts.itemsAssigned || 0} label="Team Members" icon={Users} delay={0.3} />
      </div>

      {/* Alert Row */}
      <FadeIn direction="up" delay={0.4}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 border border-destructive/20 bg-destructive/5 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground">
              <span className="text-destructive font-semibold text-sm">{counts.overdueCount || 0}</span> overdue items
            </span>
          </div>
          <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-2.5">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold text-sm">{counts.dueThisWeekCount || 0}</span> due this week
            </span>
          </div>
          <div className="flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              <span className="text-primary font-semibold text-sm">{counts.doneCount || 0}</span> completed
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Program Areas Grid */}
      <AnimatedList stagger={0.08} animation="fadeUp">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ProgramCard
            title="IT Projects & Management"
            status={counts.criticalCount > 2 ? 'CRITICAL' : 'ACTIVE'}
            description="Strategic IT projects including vendor contracts, system migrations, cloud infrastructure, and regulatory compliance initiatives."
            projects={projectStats.total}
            progress={projectStats.progress}
            target="Q4"
          />
          <ProgramCard
            title="Applications & Systems"
            status="ACTIVE"
            description="Managing on-prem and cloud applications, database operations, ERP systems, and enterprise software lifecycle management."
            projects={appStats.total}
            progress={appStats.progress}
            target="Q3"
          />
          <ProgramCard
            title="Network & Security"
            status={counts.stuckCount > 3 ? 'CRITICAL' : 'ACTIVE'}
            description="Firewall management, zero-trust architecture, threat detection, VPN operations, and comprehensive security compliance."
            projects={networkStats.total}
            progress={networkStats.progress}
            target="Q1"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ProgramCard
            title="Desktop & End-User"
            status="ACTIVE"
            description="End-user computing support, hardware lifecycle, software deployment, and IT helpdesk service level management."
            projects={desktopStats.total}
            progress={desktopStats.progress}
            target="Q2"
          />
          <ProgramCard
            title="Completed Projects"
            status="ACTIVE"
            description="Successfully delivered projects archived for reference, lessons learned, and audit compliance documentation."
            projects={completedStats.total}
            progress={completedStats.progress}
            target="Q4"
          />
          <ProgramCard
            title="IT Budget & Finance"
            status={counts.itemsWithBlockers > 3 ? 'CRITICAL' : 'ACTIVE'}
            description="Budget tracking, vendor payments, procurement workflows, cost optimization, and annual financial planning."
            projects={budgetStats.total}
            progress={budgetStats.progress}
            target="Q3"
          />
        </div>
      </AnimatedList>

      {/* Quick Navigation */}
      <FadeIn direction="up" delay={0.5}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Projects', tab: 'projects', icon: Zap },
            { label: 'Operations', tab: 'operations', icon: Server },
            { label: 'Infrastructure', tab: 'infrastructure', icon: Activity },
            { label: 'Settings', tab: 'settings', icon: CheckCircle2 },
          ].map(nav => (
            <button
              key={nav.tab}
              onClick={() => onNavigate(nav.tab)}
              className="flex items-center gap-2 border border-border bg-card/30 px-3 py-3 text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors duration-200"
            >
              <nav.icon className="h-4 w-4" />
              <span className="uppercase tracking-[0.1em] font-[family-name:var(--font-heading)] font-medium">{nav.label}</span>
            </button>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
