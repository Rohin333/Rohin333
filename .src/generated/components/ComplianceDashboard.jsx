import { useMemo, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Gauge, GaugeIndicator, GaugeTrack, GaugeRange, GaugeValueText } from '@components/gauge';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ShieldCheck, AlertTriangle, TrendingUp,
  CheckCircle2, XCircle, Activity, FileText, DollarSign,
  Users, Calendar, Target, AlertCircle, ExternalLink
} from 'lucide-react';
import { cn } from '@lib/utils';
import ComplianceDocExport from '@generated/components/ComplianceDocExport';
import ChartSwitcher, { TOOLTIP_STYLE } from '@generated/components/ChartSwitcher';
import MetricDrilldownSheet from '@generated/components/MetricDrilldownSheet';

/* Board-accurate priority & health colors via CSS variables in theme-tokens.css */
function getCSSColor(varName, fallbackHSL) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  if (raw) return raw;
  if (fallbackHSL) return `hsl(${getComputedStyle(document.documentElement).getPropertyValue(fallbackHSL).trim()})`;
  return '#555';
}
const PRIORITY_COLORS = new Proxy({}, {
  get: (_, key) => ({
    'Critical': () => getCSSColor('--priority-critical'),
    'High': () => getCSSColor('--priority-high'),
    'Medium': () => getCSSColor('--priority-medium'),
    'Low': () => getCSSColor('--priority-low')
  }[key]?.() || getCSSColor('', '--muted-foreground'))
});
const HEALTH_COLORS = new Proxy({}, {
  get: (_, key) => ({
    'Completed': () => getCSSColor('--status-done'),
    'In Progress': () => getCSSColor('--status-postponed'),
    'Blocked': () => getCSSColor('--status-stuck'),
    'Not Started': () => getCSSColor('--status-daily-ops')
  }[key]?.() || getCSSColor('', '--muted-foreground'))
});

function buildDrilldownConfig(metricKey) {
  const today = new Date().toISOString().split('T')[0];
  const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const configs = {
    total:        { title: 'All Portfolio Items', description: 'Complete listing of every item on the board', filter: {} },
    completed:    { title: 'Completed Items', description: 'Items with status "Done"', filter: { status: 'Done' } },
    inProgress:   { title: 'In Progress Items', description: 'Currently active work items', filter: { status: 'In Progress' } },
    stuck:        { title: 'Stuck Items', description: 'Items blocked and requiring intervention', filter: { status: 'Stuck' } },
    critical:     { title: 'Critical Priority Items', description: 'Highest priority items needing immediate attention', filter: { priority: 'Critical' } },
    overdue:      { title: 'Overdue Items', description: 'Past due date and not yet completed', filter: { nextDueDate: { lt: 'TODAY' }, status: ['In Progress', 'Not Yet Started', 'Stuck', 'Postponed'] } },
    dueThisWeek:  { title: 'Due This Week', description: `Items due between ${today} and ${weekFromNow}`, filter: { nextDueDate: [today, weekFromNow] } },
    withBlockers: { title: 'Items with Blockers', description: 'Items reporting blockers or risks', filter: { blockersrisks: { isEmpty: false } } },
    missingCost:  { title: 'Missing Cost Data', description: 'Items without annual cost information', filter: { annualCostBhd: { isEmpty: true } } },
    estimatedHrs: { title: 'Items with Estimated Hours', description: 'Items that have time estimates set', filter: { estimatedHours: { isEmpty: false } } },
    annualCost:   { title: 'Items with Annual Cost', description: 'All items that have cost data', filter: { annualCostBhd: { isEmpty: false } }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
    monthlyCost:  { title: 'Items with Monthly Cost', description: 'All items that have monthly cost data', filter: { monthlyCostBhd: { isEmpty: false } }, orderBy: { column: 'monthlyCostBhd', direction: 'desc' } },
  };
  return configs[metricKey] || null;
}

function buildChartDrilldown(type, value) {
  if (type === 'priority')  return { title: `Priority: ${value}`, description: `All items with ${value} priority`, filter: { priority: value } };
  if (type === 'health')    return { title: `Health: ${value}`, description: `All items with current status "${value}"`, filter: { currentStatus: value } };
  if (type === 'status')    return { title: `Status: ${value}`, description: `All items with status "${value}"`, filter: { status: value } };
  return null;
}

export default function ComplianceDashboard({ aggregates, aggLoading, items, loading }) {
  const isLoading = loading || aggLoading;
  const agg = aggregates;

  const [priorityChartType, setPriorityChartType] = useState('donut');
  const [healthChartType, setHealthChartType] = useState('donut');
  const [statusChartType, setStatusChartType] = useState('bar');

  // Drilldown state
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownConfig, setDrilldownConfig] = useState(null);

  const openDrilldown = useCallback((metricKey) => {
    const cfg = buildDrilldownConfig(metricKey);
    if (cfg) {
      setDrilldownConfig(cfg);
      setDrilldownOpen(true);
    }
  }, []);

  const openChartDrilldown = useCallback((type, value) => {
    const cfg = buildChartDrilldown(type, value);
    if (cfg) {
      setDrilldownConfig(cfg);
      setDrilldownOpen(true);
    }
  }, []);

  const priorityChart = useMemo(() => {
    if (agg?.priorityDist?.length > 0) {
      return agg.priorityDist.map(d => ({
        name: d.priority, value: d.count,
        fill: PRIORITY_COLORS[d.priority] || 'hsl(var(--muted))'
      }));
    }
    if (items?.length > 0) {
      const counts = {};
      items.forEach(item => {
        const p = item.priority;
        if (p && p !== 'null') counts[p] = (counts[p] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({
        name, value, fill: PRIORITY_COLORS[name] || 'hsl(var(--muted))'
      }));
    }
    return [];
  }, [agg, items]);

  const healthChart = useMemo(() => {
    if (agg?.healthDist?.length > 0) {
      return agg.healthDist.map(d => ({
        name: d.currentStatus, value: d.count,
        fill: HEALTH_COLORS[d.currentStatus] || 'hsl(var(--muted))'
      }));
    }
    if (items?.length > 0) {
      const counts = {};
      items.forEach(item => {
        const s = item.currentStatus;
        if (s && s !== 'null') counts[s] = (counts[s] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({
        name, value, fill: HEALTH_COLORS[name] || 'hsl(var(--muted))'
      }));
    }
    return [];
  }, [agg, items]);

  const statusChart = useMemo(() => {
    if (!agg?.statusDist) return [];
    return agg.statusDist.map(d => ({ name: d.status, count: d.count }));
  }, [agg]);

  const riskItems = useMemo(() => {
    if (!items) return [];
    return items
      .filter(i => i.priority === 'Critical' || i.priority === 'High' || i.status === 'Stuck' || i.blockersrisks)
      .sort((a, b) => {
        const pOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
      })
      .slice(0, 10);
  }, [items]);

  if (isLoading && !agg) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={`skel-${i}`} className="h-24" />)}
        </div>
      </div>
    );
  }

  const t = agg?.totals || {};
  const c = agg?.counts || {};
  const r = agg?.rates || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold font-[family-name:var(--font-heading)]">Compliance Dashboard</h2>
        </div>
        <ComplianceDocExport aggregates={agg} />
      </div>

      {(c.criticalCount > 0 || c.overdueCount > 0 || c.blockedHealth > 0) && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <span className="font-semibold">Attention Required:</span>{' '}
            <button onClick={() => openDrilldown('critical')} className="underline underline-offset-2 hover:text-foreground transition-colors">{c.criticalCount} critical</button>,{' '}
            <button onClick={() => openChartDrilldown('health', 'Blocked')} className="underline underline-offset-2 hover:text-foreground transition-colors">{c.blockedHealth} blocked</button>,{' '}
            <button onClick={() => openDrilldown('overdue')} className="underline underline-offset-2 hover:text-foreground transition-colors">{c.overdueCount} overdue</button>.
            Risk Score: {r.riskScore}/100.
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Gauges + Headline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugesCard r={r} />
        <MetricsCard t={t} c={c} onDrilldown={openDrilldown} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Priority Distribution"
          chartType={priorityChartType}
          onTypeChange={setPriorityChartType}
          data={priorityChart}
          options={['donut', 'bar', 'hbar']}
          onSegmentClick={(name) => openChartDrilldown('priority', name)}
        />
        <ChartCard
          title="Infrastructure Health"
          chartType={healthChartType}
          onTypeChange={setHealthChartType}
          data={healthChart}
          options={['donut', 'bar', 'hbar']}
          onSegmentClick={(name) => openChartDrilldown('health', name)}
        />
        <StatusChartCard
          data={statusChart}
          chartType={statusChartType}
          onTypeChange={setStatusChartType}
          onSegmentClick={(name) => openChartDrilldown('status', name)}
        />
      </div>

      <RiskRegisterTable riskItems={riskItems} />
      <TopCostTable agg={agg} />
      <ComplianceProgress r={r} />
      <ExecutiveSummary t={t} c={c} r={r} />

      {/* Drilldown Sheet */}
      <MetricDrilldownSheet
        open={drilldownOpen}
        onClose={() => setDrilldownOpen(false)}
        config={drilldownConfig}
      />
    </div>
  );
}

/* ── Gauges Card ── */
function GaugesCard({ r }) {
  return (
    <Card className="border-border/60 md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Compliance Scores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <GaugeItem value={Number(r.complianceRate) || 0} label="Compliance"
            color={Number(r.complianceRate) >= 80 ? "stroke-chart-1" : Number(r.complianceRate) >= 60 ? "stroke-chart-2" : "stroke-destructive"} />
          <GaugeItem value={Number(r.assignmentRate) || 0} label="Assignment" color="stroke-primary" />
          <GaugeItem value={Number(r.docCoverage) || 0} label="Documentation" color="stroke-chart-2" />
          <GaugeItem value={Number(r.costCoverage) || 0} label="Cost Coverage" color="stroke-chart-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function GaugeItem({ value, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <Gauge value={value} size={80} thickness={8} startAngle={-120} endAngle={120}>
        <GaugeIndicator>
          <GaugeTrack className="stroke-muted" />
          <GaugeRange className={color} />
        </GaugeIndicator>
        <GaugeValueText className="text-sm font-bold text-foreground" />
      </Gauge>
      <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

/* ── Metrics Card ── */
function MetricsCard({ t, c, onDrilldown }) {
  return (
    <Card className="border-border/60 md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Portfolio Health Metrics</CardTitle>
        <CardDescription className="text-xs">Click any metric to see its items</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <ClickableMetric icon={Target} label="Total Items" value={t.totalItems || 0} onClick={() => onDrilldown('total')} />
          <ClickableMetric icon={CheckCircle2} label="Completed" value={c.doneCount || 0} status="success" onClick={() => onDrilldown('completed')} />
          <ClickableMetric icon={Activity} label="In Progress" value={c.inProgressCount || 0} onClick={() => onDrilldown('inProgress')} />
          <ClickableMetric icon={XCircle} label="Stuck" value={c.stuckCount || 0} status="danger" onClick={() => onDrilldown('stuck')} />
          <ClickableMetric icon={AlertTriangle} label="Critical" value={c.criticalCount || 0} status="danger" onClick={() => onDrilldown('critical')} />
          <ClickableMetric icon={AlertCircle} label="Overdue" value={c.overdueCount || 0} status="danger" onClick={() => onDrilldown('overdue')} />
          <ClickableMetric icon={Calendar} label="Due 7 Days" value={c.dueThisWeekCount || 0} status="warning" onClick={() => onDrilldown('dueThisWeek')} />
          <ClickableMetric icon={Users} label="With Blockers" value={c.itemsWithBlockers || 0} status="danger" onClick={() => onDrilldown('withBlockers')} />
        </div>
        <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-2 md:grid-cols-4 gap-3">
          <ClickableMetric icon={DollarSign} label="Annual Cost" value={`${((t.totalAnnualCost || 0)/1000).toFixed(0)}K BHD`} onClick={() => onDrilldown('annualCost')} />
          <ClickableMetric icon={DollarSign} label="Monthly Cost" value={`${((t.totalMonthlyCost || 0)/1000).toFixed(0)}K BHD`} onClick={() => onDrilldown('monthlyCost')} />
          <ClickableMetric icon={FileText} label="Missing Cost" value={c.itemsWithoutCost || 0} status="warning" onClick={() => onDrilldown('missingCost')} />
          <ClickableMetric icon={TrendingUp} label="Estimated Hrs" value={t.totalEstimatedHours || 0} onClick={() => onDrilldown('estimatedHrs')} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Chart Card (Priority / Health) ── */
function ChartCard({ title, chartType, onTypeChange, data, options, onSegmentClick }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground text-center">No data — column values may not be populated</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleClick = (entry) => {
    if (onSegmentClick && entry?.name) onSegmentClick(entry.name);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
          <ChartSwitcher value={chartType} onChange={onTypeChange} options={options} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          {chartType === 'donut' ? (
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}
                onClick={(_, idx) => handleClick(data[idx])} className="cursor-pointer">
                {data.map(e => <Cell key={`p-${e.name}`} fill={e.fill} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} interval={0} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} onClick={(entry) => handleClick(entry)} className="cursor-pointer">
                {data.map(e => <Cell key={`b-${e.name}`} fill={e.fill} />)}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} width={80} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} onClick={(entry) => handleClick(entry)} className="cursor-pointer">
                {data.map(e => <Cell key={`hb-${e.name}`} fill={e.fill} />)}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          {data.map(p => (
            <button key={p.name} onClick={() => onSegmentClick?.(p.name)}
              className="flex items-center gap-1.5 hover:bg-muted/40 px-1.5 py-0.5 rounded transition-colors cursor-pointer">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
              <span className="text-[10px] text-muted-foreground">{p.name}: {p.value}</span>
              <ExternalLink className="h-2 w-2 text-muted-foreground/50" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Status Chart Card ── */
function StatusChartCard({ data, chartType, onTypeChange, onSegmentClick }) {
  if (data.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">No data</div>
        </CardContent>
      </Card>
    );
  }

  const handleBarClick = (entry) => {
    if (onSegmentClick && entry?.name) onSegmentClick(entry.name);
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Status Breakdown</CardTitle>
          <ChartSwitcher value={chartType} onChange={onTypeChange} options={['bar', 'hbar', 'area']} />
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} angle={-30} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]}
                onClick={handleBarClick} className="cursor-pointer" />
            </BarChart>
          ) : chartType === 'hbar' ? (
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} width={120} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 3, 3, 0]}
                onClick={handleBarClick} className="cursor-pointer" />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} angle={-30} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

/* ── Risk Register ── */
function RiskRegisterTable({ riskItems }) {
  if (riskItems.length === 0) return null;
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">Risk Register</CardTitle>
            <CardDescription className="text-xs">High priority and blocked items requiring attention</CardDescription>
          </div>
          <Badge variant="outline" className="text-[10px] border-destructive/30 text-destructive">{riskItems.length} items</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Item</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Priority</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Owner</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Blocker / Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riskItems.map(item => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-xs font-medium py-2 max-w-[180px] truncate">{item.name}</TableCell>
                <TableCell className="py-2">
                  <Badge variant="secondary" className={cn(
                    "text-[10px] px-1.5 py-0",
                    item.priority === 'Critical' && "bg-destructive/10 text-destructive",
                    item.priority === 'High' && "bg-chart-5/10 text-chart-5"
                  )}>{item.priority || '—'}</Badge>
                </TableCell>
                <TableCell className="py-2"><span className="text-[10px] text-muted-foreground">{item.status || '—'}</span></TableCell>
                <TableCell className="py-2"><span className="text-[10px] text-muted-foreground">{item.person?.[0]?.name || '—'}</span></TableCell>
                <TableCell className="py-2 max-w-[200px]">
                  <span className="text-[10px] text-muted-foreground truncate block">{item.blockersrisks || item.dependencies || '—'}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <CardDescription className="text-xs">Sorted by annual cost across the entire board</CardDescription>
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
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Platform</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Annual (BHD)</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Monthly (BHD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agg.topCostItems.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground py-2.5">{idx + 1}</TableCell>
                <TableCell className="text-xs font-medium py-2.5 max-w-[220px] truncate">{item.name}</TableCell>
                <TableCell className="py-2.5"><Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.status || '—'}</Badge></TableCell>
                <TableCell className="py-2.5">
                  {item.infrastructureType?.map(type => (
                    <Badge key={type} variant="outline" className="text-[10px] px-1.5 py-0 mr-1">{type}</Badge>
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

/* ── Compliance Progress ── */
function ComplianceProgress({ r }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Compliance Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ProgressRow label="Overall Compliance" value={Number(r.complianceRate) || 0} />
        <ProgressRow label="Documentation Coverage" value={Number(r.docCoverage) || 0} />
        <ProgressRow label="Resource Assignment" value={Number(r.assignmentRate) || 0} />
        <ProgressRow label="Cost Data Coverage" value={Number(r.costCoverage) || 0} />
        <ProgressRow label="Risk Level" value={r.riskScore || 0} invert />
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
          <span className="font-semibold text-foreground">Executive Summary</span> — IT portfolio: {t.totalItems || 0} items
          ({c.projectCount || 0} projects, {c.operationalCount || 0} operational). Compliance: {r.complianceRate || 0}%.
          {c.criticalCount > 0 && ` Critical items: ${c.criticalCount}.`}
          {c.overdueCount > 0 && ` Overdue: ${c.overdueCount}.`}
          {' '}Annual cost: {(t.totalAnnualCost || 0).toLocaleString()} BHD.
          {r.riskScore < 30 ? ' Risk: LOW.' : r.riskScore < 60 ? ' Risk: MEDIUM.' : ' Risk: HIGH.'}
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Clickable Compact Metric ── */
function ClickableMetric({ icon: Icon, label, value, status, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md bg-muted/30 text-left w-full",
        "hover:bg-muted/60 hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer",
        "group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      )}
    >
      <Icon className={cn(
        "h-3.5 w-3.5 flex-shrink-0",
        status === 'danger' ? "text-destructive" :
        status === 'success' ? "text-chart-1" :
        status === 'warning' ? "text-chart-2" : "text-muted-foreground"
      )} />
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-sm font-bold tabular-nums leading-none",
          status === 'danger' ? "text-destructive" :
          status === 'success' ? "text-chart-1" : "text-foreground"
        )}>{value}</p>
        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{label}</p>
      </div>
      <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors flex-shrink-0" />
    </button>
  );
}

function ProgressRow({ label, value, invert }) {
  const color = invert
    ? (value < 30 ? "text-chart-1" : value < 60 ? "text-chart-2" : "text-destructive")
    : (value >= 80 ? "text-chart-1" : value >= 50 ? "text-chart-2" : "text-destructive");

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-40 flex-shrink-0">{label}</span>
      <Progress value={value} className="h-1.5 flex-1" />
      <span className={cn("text-xs font-semibold tabular-nums w-12 text-right", color)}>
        {invert ? `${value}/100` : `${value}%`}
      </span>
    </div>
  );
}
