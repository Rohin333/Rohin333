import { useMemo, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Gauge, GaugeIndicator, GaugeTrack, GaugeRange, GaugeValueText } from '@components/gauge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, FolderKanban, Zap, Cpu, DollarSign, ExternalLink } from 'lucide-react';
import { cn } from '@lib/utils';
import { TOOLTIP_STYLE } from '@generated/components/ChartSwitcher';
import MetricDrilldownSheet from '@generated/components/MetricDrilldownSheet';

const STATUS_COLORS = {
  'Done': 'hsl(var(--chart-1))', 'In Progress': 'hsl(var(--primary))',
  'Not Yet Started': 'hsl(var(--chart-4))', 'Stuck': 'hsl(var(--destructive))',
  'Postponed': 'hsl(var(--chart-2))', 'Cancelled': 'hsl(var(--muted-foreground))',
  'Daily Operational Tasks': 'hsl(var(--chart-5))', 'Emergency operantional TaskTask': 'hsl(var(--chart-3))'
};

function buildDrilldown(key) {
  const configs = {
    total:      { title: 'All Portfolio Items', description: 'Complete item listing', filter: {} },
    inProgress: { title: 'In Progress Items', description: 'Currently active work', filter: { status: 'In Progress' } },
    atRisk:     { title: 'At Risk Items', description: 'Stuck or overdue items needing attention', filter: { status: ['Stuck'] } },
    annualCost: { title: 'Items by Annual Cost', description: 'Sorted by highest annual cost', filter: { annualCostBhd: { isEmpty: false } }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
    awsServers: { title: 'AWS Cloud Items', description: 'Items on AWS Cloud infrastructure', filter: { infrastructureType: 'AWS Cloud' } },
  };
  return configs[key] || null;
}

function buildStatusDrilldown(statusName) {
  return { title: `Status: ${statusName}`, description: `All items with "${statusName}" status`, filter: { status: statusName } };
}

function buildInfraDrilldown(infraName) {
  return { title: `Infrastructure: ${infraName}`, description: `Items on ${infraName} platform`, filter: { infrastructureType: infraName }, orderBy: { column: 'annualCostBhd', direction: 'desc' } };
}

export default function DashboardView({ aggregates, aggLoading, items, loading }) {
  const agg = aggregates;
  const isLoading = (loading || aggLoading) && !agg;

  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownConfig, setDrilldownConfig] = useState(null);

  const openDrilldown = useCallback((key) => {
    const cfg = buildDrilldown(key);
    if (cfg) { setDrilldownConfig(cfg); setDrilldownOpen(true); }
  }, []);

  const openStatusDrilldown = useCallback((name) => {
    setDrilldownConfig(buildStatusDrilldown(name));
    setDrilldownOpen(true);
  }, []);

  const openInfraDrilldown = useCallback((name) => {
    setDrilldownConfig(buildInfraDrilldown(name));
    setDrilldownOpen(true);
  }, []);

  const statusData = useMemo(() => {
    if (!agg?.statusDist) return [];
    return agg.statusDist.map(d => ({
      name: d.status, value: d.count,
      color: STATUS_COLORS[d.status] || 'hsl(var(--muted))'
    }));
  }, [agg]);

  const infraBarData = useMemo(() => {
    if (!agg?.infraDist) return [];
    return agg.infraDist.map(d => ({
      name: d.infrastructureType, annualCost: d.annualCost || 0, count: d.count || 0
    }));
  }, [agg]);

  const recentActivity = useMemo(() => {
    if (!items) return [];
    return [...items].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8);
  }, [items]);

  const teamData = useMemo(() => {
    if (!items) return [];
    const teams = {};
    items.forEach(item => {
      if (item.person?.length > 0) {
        item.person.forEach(p => {
          if (!teams[p.name]) teams[p.name] = { name: p.name, id: p.id, total: 0, inProgress: 0, done: 0, blocked: 0 };
          teams[p.name].total++;
          if (item.status === 'In Progress') teams[p.name].inProgress++;
          if (item.status === 'Done') teams[p.name].done++;
          if (item.status === 'Stuck') teams[p.name].blocked++;
        });
      }
    });
    return Object.values(teams).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [items]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={`sk-${i}`} className="h-40" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" /> <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const t = agg?.totals || {};
  const c = agg?.counts || {};
  const r = agg?.rates || {};

  return (
    <div className="space-y-6">
      <GaugesRow r={r} c={c} t={t} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <ClickableTile icon={FolderKanban} label="Total Items" value={t.totalItems || 0} sub={`${c.projectCount || 0} proj / ${c.operationalCount || 0} ops`} onClick={() => openDrilldown('total')} />
        <ClickableTile icon={Zap} label="In Progress" value={c.inProgressCount || 0} sub="Active tasks" accent onClick={() => openDrilldown('inProgress')} />
        <ClickableTile icon={AlertTriangle} label="At Risk" value={(c.stuckCount || 0) + (c.overdueCount || 0)} sub={`${c.stuckCount || 0} stuck, ${c.overdueCount || 0} overdue`} destructive onClick={() => openDrilldown('atRisk')} />
        <ClickableTile icon={DollarSign} label="Annual Cost" value={`${((t.totalAnnualCost || 0) / 1000).toFixed(0)}K`} sub="BHD board-wide" onClick={() => openDrilldown('annualCost')} />
        <ClickableTile icon={Cpu} label="AWS Servers" value={t.totalAWSServers || 0} sub="Cloud instances" onClick={() => openDrilldown('awsServers')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatusPieCard data={statusData} onSegmentClick={openStatusDrilldown} />
        <RecentActivityCard items={recentActivity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfraCostBar data={infraBarData} onBarClick={openInfraDrilldown} />
        <TeamWorkloadCard data={teamData} />
      </div>

      <TopCostTable agg={agg} />
      <ExecutiveSummary t={t} c={c} r={r} />

      <MetricDrilldownSheet open={drilldownOpen} onClose={() => setDrilldownOpen(false)} config={drilldownConfig} />
    </div>
  );
}

/* ── Gauges Row ── */
function GaugesRow({ r, c, t }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <GaugeCard value={Number(r.completionRate) || 0} label="Completion" sub={`${c.doneCount || 0} of ${t.totalItems || 0}`} color="stroke-primary" />
      <GaugeCard value={Number(r.complianceRate) || 0} label="Compliance" sub="IT governance score" color="stroke-chart-1" />
      <GaugeCard value={Number(r.docCoverage) || 0} label="Documentation" sub={`${c.itemsWithDocs || 0} items covered`} color="stroke-chart-2" />
      <GaugeCard value={Math.min(100, 100 - (r.riskScore || 0))} label="Health Score" sub={`Risk: ${r.riskScore || 0}/100`}
        color={r.riskScore < 30 ? "stroke-chart-1" : r.riskScore < 60 ? "stroke-chart-2" : "stroke-destructive"} />
    </div>
  );
}

function GaugeCard({ value, label, sub, color }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 flex flex-col items-center justify-center">
        <Gauge value={value} size={100} thickness={10} startAngle={-120} endAngle={120}>
          <GaugeIndicator><GaugeTrack className="stroke-muted" /><GaugeRange className={color} /></GaugeIndicator>
          <GaugeValueText className="text-lg font-bold text-foreground" />
        </Gauge>
        <p className="text-xs font-medium text-muted-foreground mt-2">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

/* ── Clickable Metric Tile ── */
function ClickableTile({ icon: Icon, label, value, sub, accent, destructive, onClick }) {
  return (
    <Card className="border-border/60 hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer group" onClick={onClick}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className={cn("h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0",
          destructive ? "bg-destructive/10" : accent ? "bg-primary/10" : "bg-muted")}>
          <Icon className={cn("h-4 w-4", destructive ? "text-destructive" : accent ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-lg font-bold tabular-nums leading-tight", destructive ? "text-destructive" : "text-foreground")}>{value}</p>
          <p className="text-[10px] text-muted-foreground truncate">{label}</p>
          {sub && <p className="text-[10px] text-muted-foreground/70 truncate">{sub}</p>}
        </div>
        <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors flex-shrink-0" />
      </CardContent>
    </Card>
  );
}

/* ── Status Pie ── */
function StatusPieCard({ data, onSegmentClick }) {
  return (
    <Card className="border-border/60 lg:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Status Distribution</CardTitle>
        <CardDescription className="text-xs">Click any segment to see items</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}
              onClick={(_, idx) => onSegmentClick(data[idx]?.name)} className="cursor-pointer">
              {data.map(e => <Cell key={`s-${e.name}`} fill={e.color} />)}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
          {data.slice(0, 6).map(s => (
            <button key={s.name} onClick={() => onSegmentClick(s.name)}
              className="flex items-center gap-1.5 hover:bg-muted/40 px-1 py-0.5 rounded transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] text-muted-foreground truncate">{s.name}</span>
              <span className="text-[10px] font-medium text-foreground ml-auto tabular-nums">{s.value}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Recent Activity ── */
function RecentActivityCard({ items }) {
  return (
    <Card className="border-border/60 lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Recent Activity</CardTitle>
        <CardDescription className="text-xs">Last updated items across the portfolio</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Item</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Type</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Owner</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-xs font-medium py-2 max-w-[200px] truncate">{item.name}</TableCell>
                <TableCell className="py-2"><Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">{item.status || '—'}</Badge></TableCell>
                <TableCell className="py-2"><span className="text-[10px] text-muted-foreground">{item.projOp || '—'}</span></TableCell>
                <TableCell className="py-2"><span className="text-[10px] text-muted-foreground">{item.person?.[0]?.name || '—'}</span></TableCell>
                <TableCell className="py-2 text-right">
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ── Infra Cost Bar ── */
function InfraCostBar({ data, onBarClick }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Infrastructure Cost by Type</CardTitle>
        <CardDescription className="text-xs">Click a bar to see items for that platform</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={100} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v.toLocaleString()} BHD`, 'Annual Cost']} />
              <Bar dataKey="annualCost" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}
                onClick={(entry) => onBarClick(entry?.name)} className="cursor-pointer" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-xs text-muted-foreground">No infrastructure cost data</div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Team Workload ── */
function TeamWorkloadCard({ data }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-foreground">Team Workload</CardTitle></CardHeader>
        <CardContent><div className="h-60 flex items-center justify-center text-xs text-muted-foreground">No team data</div></CardContent>
      </Card>
    );
  }
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Team Workload</CardTitle>
        <CardDescription className="text-xs">Based on loaded items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map(person => {
            const pct = person.total > 0 ? Math.round((person.done / person.total) * 100) : 0;
            return (
              <div key={person.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-semibold text-primary">{person.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground truncate">{person.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{person.total} total</span>
                      {person.blocked > 0 && <span className="text-destructive">{person.blocked} blocked</span>}
                    </div>
                  </div>
                  <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-muted">
                    <div className="bg-chart-1 rounded-l-full" style={{ width: `${pct}%` }} />
                    <div className="bg-primary" style={{ width: `${person.total > 0 ? (person.inProgress / person.total) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Top Cost Table ── */
function TopCostTable({ agg }) {
  if (!agg?.topCostItems?.length) return null;
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Top 5 Highest Cost Items</CardTitle>
            <CardDescription className="text-xs">Board-wide, sorted by annual cost</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] border-primary/30">Board-wide</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 w-8">#</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Item</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Type</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Platform</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Annual (BHD)</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Monthly (BHD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agg.topCostItems.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-xs font-medium py-2.5 text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="text-xs font-medium py-2.5 max-w-[250px] truncate">{item.name}</TableCell>
                <TableCell className="py-2.5"><span className="text-[10px] text-muted-foreground">{item.projOp || '—'}</span></TableCell>
                <TableCell className="py-2.5">
                  {item.infrastructureType?.map(type => (
                    <Badge key={type} variant="secondary" className="text-[10px] px-1.5 py-0 mr-1">{type}</Badge>
                  ))}
                </TableCell>
                <TableCell className="text-xs font-semibold py-2.5 text-right tabular-nums text-primary">{(item.annualCostBhd || 0).toLocaleString()}</TableCell>
                <TableCell className="text-xs py-2.5 text-right tabular-nums text-muted-foreground">{(item.monthlyCostBhd || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ── Executive Summary ── */
function ExecutiveSummary({ t, c, r }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Executive Summary</span> — The IT portfolio comprises {t.totalItems || 0} items
          ({c.projectCount || 0} projects, {c.operationalCount || 0} operational) with {r.complianceRate || 0}% compliance.
          {c.criticalCount > 0 && ` ${c.criticalCount} critical priority items require attention.`}
          {c.overdueCount > 0 && ` ${c.overdueCount} items are overdue.`}
          {' '}Total annual IT cost: {(t.totalAnnualCost || 0).toLocaleString()} BHD.
          Documentation at {r.docCoverage || 0}%, assignment at {r.assignmentRate || 0}%.
          {r.riskScore < 30 ? ' Risk: LOW.' : r.riskScore < 60 ? ' Risk: MEDIUM.' : ' Risk: HIGH — executive review required.'}
        </p>
      </CardContent>
    </Card>
  );
}
