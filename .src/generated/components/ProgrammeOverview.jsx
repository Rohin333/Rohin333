import { useMemo } from 'react';
import { cn } from '@lib/utils';
import { Server, Shield, Monitor, Laptop, CheckCircle2, Wallet } from 'lucide-react';
import CyberpunkHeader from './CyberpunkHeader';
import CyberpunkCard from './CyberpunkCard';

/*
  Maps each card to REAL board group IDs from IT Programme Board.
  Groups:
    Projects                                       → group_mm45zz29
    Applications & Systems Management (On-Prem & Cloud) → group_mm45zdyk
    Network & Security Operations (On-Prem & Cloud)     → group_mm45ch45
    Desktop & End-User Support                     → group_mm45hpa9
    Completed Projects                             → group_mm459g4j
    Cancelled Projects                             → group_mm45jvcj
    IT BUDGET Details                              → group_mm452vv3
*/
const PROGRAMME_AREAS = [
  {
    id: 'projects',
    title: 'Projects',
    description: 'Active strategic projects including procurement, RFP processes, and infrastructure upgrades managed by the IT department.',
    groupIds: ['group_mm45zz29'],
    icon: Monitor
  },
  {
    id: 'apps-systems',
    title: 'Applications & Systems',
    description: 'On-prem and cloud application management, system maintenance, and platform operations across the TRA environment.',
    groupIds: ['group_mm45zdyk'],
    icon: Server
  },
  {
    id: 'network-security',
    title: 'Network & Security Ops',
    description: 'Network infrastructure, firewall management, security operations, and threat monitoring across on-prem and cloud environments.',
    groupIds: ['group_mm45ch45'],
    icon: Shield
  },
  {
    id: 'desktop-support',
    title: 'Desktop & End-User Support',
    description: 'End-user device management, help desk operations, software deployment, and employee IT support services.',
    groupIds: ['group_mm45hpa9'],
    icon: Laptop
  },
  {
    id: 'completed',
    title: 'Completed Projects',
    description: 'Successfully delivered projects archived for reference, audit trails, and lessons-learned documentation.',
    groupIds: ['group_mm459g4j'],
    icon: CheckCircle2
  },
  {
    id: 'budget',
    title: 'IT Budget Details',
    description: 'Financial tracking for operational and project budgets, monthly cost breakdowns, and departmental allocations.',
    groupIds: ['group_mm452vv3'],
    icon: Wallet
  }
];

export default function ProgrammeOverview({ items, loading, aggregates }) {
  const programmeStats = useMemo(() => {
    if (!items || items.length === 0) return [];

    return PROGRAMME_AREAS.map(area => {
      const areaItems = items.filter(item =>
        area.groupIds.includes(item.group?.id)
      );

      const total = areaItems.length;
      const doneCount = areaItems.filter(i => i.status === 'Done').length;
      const inProgressCount = areaItems.filter(i => i.status === 'In Progress').length;
      const stuckCount = areaItems.filter(i => i.status === 'Stuck').length;
      const progressPct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

      let status = 'ACTIVE';
      if (area.id === 'completed') status = 'ACTIVE';
      else if (stuckCount > total * 0.3) status = 'CRITICAL';
      else if (total === 0 || inProgressCount === 0) status = 'PENDING';

      const latestDate = areaItems
        .filter(i => i.date?.to)
        .map(i => new Date(i.date.to))
        .sort((a, b) => b - a)[0];

      let targetQ = '—';
      if (latestDate) {
        const month = latestDate.getMonth();
        if (month < 3) targetQ = 'Q1';
        else if (month < 6) targetQ = 'Q2';
        else if (month < 9) targetQ = 'Q3';
        else targetQ = 'Q4';
      }

      return { ...area, status, projectCount: total, progress: progressPct, targetQuarter: targetQ };
    });
  }, [items]);

  const kpis = useMemo(() => {
    if (!items) return { active: 0, total: 0, uptime: '99.9%', team: 0 };

    const activeCount = items.filter(i =>
      i.status === 'In Progress' || i.status === 'Not Yet Started'
    ).length;
    const uniquePersons = new Set();
    items.forEach(item => item.person?.forEach(p => uniquePersons.add(p.id)));

    return { active: activeCount, total: items.length, uptime: '99.9%', team: uniquePersons.size };
  }, [items]);

  if (loading && (!items || items.length === 0)) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-8 relative z-10">
      <CyberpunkHeader
        title="IT Programme Board"
        subtitle="Telecommunications Regulatory Authority — Kingdom of Bahrain"
      />
      <KPIRow kpis={kpis} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programmeStats.map(area => (
          <CyberpunkCard
            key={area.id}
            title={area.title}
            status={area.status}
            description={area.description}
            progressValue={area.progress}
            variant={area.status === 'CRITICAL' ? 'critical' : area.status === 'ACTIVE' ? 'active' : 'pending'}
            metrics={[
              { value: area.projectCount, label: 'Items' },
              { value: `${area.progress}%`, label: 'Progress' },
              { value: area.targetQuarter, label: 'Target' }
            ]}
          />
        ))}
      </div>
    </div>
  );
}

/* ── KPI Row ── */
function KPIRow({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPIStatCard value={kpis.active} label="Active Projects" icon={<BarIcon />} />
      <KPIStatCard value={kpis.total}  label="Systems"         icon={<MonitorIcon />} />
      <KPIStatCard value={kpis.uptime} label="Uptime"          icon={<ArrowIcon />} />
      <KPIStatCard value={kpis.team}   label="Team Members"    icon={<PersonIcon />} />
    </div>
  );
}

function KPIStatCard({ value, label, icon }) {
  return (
    <div className="programme-card rounded-md p-4 flex items-center justify-between min-h-[80px]">
      <div>
        <div
          className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight leading-none mb-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.12em] font-semibold">
          {label}
        </div>
      </div>
      <div className="opacity-40">{icon}</div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 bg-muted/20 animate-pulse rounded" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-muted/20 animate-pulse rounded" />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 bg-muted/20 animate-pulse rounded" />)}
      </div>
    </div>
  );
}

/* ── Simple geometric KPI icons ── */
function BarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="6" width="10" height="20" rx="2" fill="hsl(var(--chart-3))" opacity="0.7" />
      <rect x="18" y="10" width="10" height="16" rx="2" fill="hsl(var(--primary))" opacity="0.5" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="8" width="24" height="16" rx="2" fill="hsl(var(--chart-3))" opacity="0.6" />
      <rect x="8" y="12" width="6" height="4" rx="1" fill="hsl(var(--primary))" opacity="0.5" />
      <rect x="8" y="18" width="16" height="2" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 24 L12 14 L18 18 L26 8" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M26 8 L26 12 L22 8" fill="hsl(var(--primary))" opacity="0.5" />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="12" r="5" fill="hsl(var(--primary))" opacity="0.4" />
      <path d="M8 26 C8 21 12 18 16 18 C20 18 24 21 24 26" fill="hsl(var(--primary))" opacity="0.3" />
    </svg>
  );
}
