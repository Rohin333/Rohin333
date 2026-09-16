import { useMemo, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Gauge, GaugeIndicator, GaugeTrack, GaugeRange, GaugeValueText } from '@components/gauge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Cloud, Shield, Network, DollarSign, Cpu, Database, ExternalLink } from 'lucide-react';
import { cn } from '@lib/utils';
import { TOOLTIP_STYLE } from '@generated/components/ChartSwitcher';
import MetricDrilldownSheet from '@generated/components/MetricDrilldownSheet';

const INFRA_COLORS = {
  'AWS Cloud': 'hsl(var(--chart-3))', 'VMware On-Prem': 'hsl(var(--chart-1))',
  'Firewall': 'hsl(var(--destructive))', 'Network': 'hsl(var(--chart-4))',
  'Storage': 'hsl(var(--chart-2))', 'Hybrid': 'hsl(var(--chart-5))'
};
const INFRA_ICONS = { 'AWS Cloud': Cloud, 'VMware On-Prem': Server, 'Firewall': Shield, 'Network': Network, 'Storage': Database, 'Hybrid': Cpu };

function buildInfraDrilldown(key, name) {
  const configs = {
    totalCost:   { title: 'All Costed Items', description: 'Items with annual cost data, sorted by cost', filter: { annualCostBhd: { isEmpty: false } }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
    onPrem:      { title: 'VMware On-Prem Items', description: 'All on-premises infrastructure items', filter: { infrastructureType: 'VMware On-Prem' }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
    aws:         { title: 'AWS Cloud Items', description: 'All cloud infrastructure items', filter: { infrastructureType: 'AWS Cloud' }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
    awsServers:  { title: 'AWS Cloud Instances', description: 'Items tracking AWS server counts', filter: { infrastructureType: 'AWS Cloud' } },
    platform:    { title: `Platform: ${name}`, description: `All items on ${name} infrastructure`, filter: { infrastructureType: name }, orderBy: { column: 'annualCostBhd', direction: 'desc' } },
  };
  return configs[key] || null;
}

export default function InfrastructureDashboard({ aggregates, aggLoading, items, loading }) {
  const agg = aggregates;
  const isLoading = (loading || aggLoading) && !agg;

  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownConfig, setDrilldownConfig] = useState(null);

  const openDrilldown = useCallback((key, name) => {
    const cfg = buildInfraDrilldown(key, name);
    if (cfg) { setDrilldownConfig(cfg); setDrilldownOpen(true); }
  }, []);

  const openPlatformDrilldown = useCallback((name) => {
    openDrilldown('platform', name);
  }, [openDrilldown]);

  const infraMetrics = useMemo(() => {
    if (!agg?.infraDist) return null;
    const getInfra = (n) => agg.infraDist.find(d => d.infrastructureType === n) || {};
    const aws = getInfra('AWS Cloud');
    const onPrem = getInfra('VMware On-Prem');
    return {
      awsAnnual: aws.annualCost || 0, awsMonthly: aws.monthlyCost || 0,
      awsCount: aws.count || 0, awsServers: aws.serverCount || 0,
      onPremAnnual: onPrem.annualCost || 0, onPremMonthly: onPrem.monthlyCost || 0,
      onPremCount: onPrem.count || 0, infraDist: agg.infraDist
    };
  }, [agg]);

  const costPieData = useMemo(() => {
    if (!infraMetrics?.infraDist) return [];
    return infraMetrics.infraDist
      .filter(d => (d.annualCost || 0) > 0)
      .map(d => ({
        name: d.infrastructureType, value: d.annualCost || 0,
        count: d.count || 0, monthly: d.monthlyCost || 0,
        color: INFRA_COLORS[d.infrastructureType] || 'hsl(var(--muted))'
      }));
  }, [infraMetrics]);

  const infraBarData = useMemo(() => {
    if (!infraMetrics?.infraDist) return [];
    return infraMetrics.infraDist.map(d => ({
      name: d.infrastructureType, count: d.count || 0,
      annualCost: d.annualCost || 0, monthlyCost: d.monthlyCost || 0
    }));
  }, [infraMetrics]);

  const topInfraItems = useMemo(() => {
    if (!items) return [];
    return items
      .filter(i => (i.annualCostBhd || 0) > 0 && i.infrastructureType?.length > 0)
      .sort((a, b) => (b.annualCostBhd || 0) - (a.annualCostBhd || 0))
      .slice(0, 8);
  }, [items]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={`sk-infra-${i}`} className="h-32" />)}
        </div>
      </div>
    );
  }

  const t = agg?.totals || {};
  const totalInfraCost = t.totalAnnualCost || 0;
  const awsPct = totalInfraCost > 0 ? Math.round(((infraMetrics?.awsAnnual || 0) / totalInfraCost) * 100) : 0;
  const onPremPct = totalInfraCost > 0 ? Math.round(((infraMetrics?.onPremAnnual || 0) / totalInfraCost) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Headline Cards — clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfraMetricCard icon={DollarSign} label="Annual Cost (BHD)" value={totalInfraCost.toLocaleString()} color="bg-primary/10 text-primary" onClick={() => openDrilldown('totalCost')} />
        <InfraMetricCard icon={Server} label={`On-Prem (${onPremPct}%)`} value={(infraMetrics?.onPremAnnual || 0).toLocaleString()} color="bg-chart-1/10 text-chart-1" onClick={() => openDrilldown('onPrem')} />
        <InfraMetricCard icon={Cloud} label={`AWS Cloud (${awsPct}%)`} value={(infraMetrics?.awsAnnual || 0).toLocaleString()} color="bg-chart-3/10 text-chart-3" onClick={() => openDrilldown('aws')} />
        <InfraMetricCard icon={Cpu} label="AWS Servers" value={t.totalAWSServers || 0} color="bg-primary/10 text-primary" onClick={() => openDrilldown('awsServers')} />
      </div>

      {/* Cost Split Gauges + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Cost Split</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-around">
            <GaugeBlock value={onPremPct} label="On-Prem" color="stroke-chart-1" />
            <GaugeBlock value={awsPct} label="AWS" color="stroke-chart-3" />
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Annual Cost by Platform</CardTitle>
            <CardDescription className="text-xs">Click any segment to drill down</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={costPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" paddingAngle={2}
                  onClick={(_, idx) => openPlatformDrilldown(costPieData[idx]?.name)} className="cursor-pointer">
                  {costPieData.map(e => <Cell key={`c-${e.name}`} fill={e.color} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v.toLocaleString()} BHD`, 'Annual']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {costPieData.map(d => (
                <button key={d.name} onClick={() => openPlatformDrilldown(d.name)}
                  className="flex items-center gap-2 w-full hover:bg-muted/40 px-1.5 py-1 rounded transition-colors cursor-pointer group">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-medium text-foreground">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.count} items</p>
                  </div>
                  <p className="text-xs font-semibold tabular-nums text-foreground">{d.value.toLocaleString()}</p>
                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/30 group-hover:text-primary/60 flex-shrink-0" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart — clickable */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">Infrastructure Item Count by Type</CardTitle>
          <CardDescription className="text-xs">Click a bar to see items for that platform</CardDescription>
        </CardHeader>
        <CardContent>
          {infraBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={infraBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v, name) => [name === 'count' ? `${v} items` : `${v.toLocaleString()} BHD`, name === 'count' ? 'Items' : 'Annual Cost']} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} name="Items"
                  onClick={(entry) => openPlatformDrilldown(entry?.name)} className="cursor-pointer" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>

      {/* Infrastructure Detail Table */}
      {topInfraItems.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Infrastructure Cost Details</CardTitle>
            <CardDescription className="text-xs">Top items by annual cost from loaded data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Item</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Platform</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Owner</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Annual (BHD)</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8 text-right">Monthly (BHD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topInfraItems.map(item => {
                  const InfraIcon = INFRA_ICONS[item.infrastructureType?.[0]] || Server;
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-medium py-2 max-w-[200px] truncate">{item.name}</TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          <InfraIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{item.infrastructureType?.[0] || '—'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2"><Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.currentStatus || item.status || '—'}</Badge></TableCell>
                      <TableCell className="py-2"><span className="text-[10px] text-muted-foreground">{item.person?.[0]?.name || '—'}</span></TableCell>
                      <TableCell className="text-xs font-semibold py-2 text-right tabular-nums text-primary">{(item.annualCostBhd || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-xs py-2 text-right tabular-nums text-muted-foreground">{(item.monthlyCostBhd || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <MetricDrilldownSheet open={drilldownOpen} onClose={() => setDrilldownOpen(false)} config={drilldownConfig} />
    </div>
  );
}

/* ── Clickable Infra Metric Card ── */
function InfraMetricCard({ icon: Icon, label, value, color, onClick }) {
  const [iconBg, iconText] = color.split(' ');
  return (
    <Card className="border-border/60 hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer group" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("h-9 w-9 rounded-md flex items-center justify-center", iconBg)}>
            <Icon className={cn("h-4 w-4", iconText)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/60 transition-colors flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Gauge Block ── */
function GaugeBlock({ value, label, color }) {
  return (
    <div className="flex flex-col items-center">
      <Gauge value={value} size={90} thickness={9} startAngle={-120} endAngle={120}>
        <GaugeIndicator><GaugeTrack className="stroke-muted" /><GaugeRange className={color} /></GaugeIndicator>
        <GaugeValueText className="text-sm font-bold text-foreground" />
      </Gauge>
      <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
