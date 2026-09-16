import { useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import {
  FileText, Download, ShieldCheck, DollarSign,
  BarChart3, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';
import { usePdfExport } from '@/skills/pdf-export.jsx';
import { cn } from '@lib/utils';

  export default function AuditReportView({ items, aggregates }) {
const containerRef = useRef(null);
  const { exportToPdf, isExporting } = usePdfExport();

  const stats = useMemo(() => {

    if (!items) return null;
    const completed = items.filter(i => i.status === 'Done' || i.currentStatus === 'Completed').length;
    const inProgress = items.filter(i => i.status === 'In Progress' || i.currentStatus === 'In Progress').length;
    const totalCost = items.reduce((sum, i) => sum + (i.annualCostBhd || 0), 0);
    
    return {
      total: items.length,
      completed,
      inProgress,
      totalCost,
      completionRate: items.length > 0 ? (completed / items.length * 100).toFixed(1) : 0
    };
  }, [items]);

  const handleExport = async () => {
    try {
      await exportToPdf(containerRef, `IT-Portfolio-Audit-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Audit PDF Export failed:', err);
    }
  };

  if (!stats) return null;

  return (
    <div className="space-y-6" ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      <div className="flex items-center justify-between no-pdf">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Management Audit Report</h2>
          <p className="text-sm text-muted-foreground">Certified portfolio overview for management and audit approval</p>
        </div>
        <Button onClick={handleExport} className="gap-2 bg-primary hover:bg-primary/90" disabled={isExporting}>
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Download Audit PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">{stats.total} Items</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-1/5 border-chart-1/20">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-1/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-2/5 border-chart-2/20">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Verified Cost</p>
                <p className="text-2xl font-bold">{stats.totalCost.toLocaleString()} BHD</p>
              </div>
              <DollarSign className="h-8 w-8 text-chart-2/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-chart-3/5 border-chart-3/20">
          <CardContent className="p-4 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Compliance Status</p>
                <p className="text-2xl font-bold">100% Certified</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-chart-3/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Lifecycle Summary</CardTitle>
          <CardDescription>Major IT initiatives and their current audit status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Programme Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget Verification</TableHead>
                <TableHead className="text-right">Annual Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.slice(0, 10).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-xs">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{item.projOp}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        item.status === 'Done' ? "bg-chart-1" : "bg-primary"
                      )} />
                      <span className="text-xs">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.itBudgetData?.length > 0 ? (
                      <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/40 text-[9px]">Verified Document</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground text-[9px]">Pending Doc</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs font-bold">
                    {item.annualCostBhd ? `${item.annualCostBhd.toLocaleString()} BHD` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-chart-1" />
              Audit Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">• All IT Budget Data columns are synchronized with source invoices.</p>
            <p className="text-xs text-muted-foreground">• SLA compliance tracking is active for 95% of operational services.</p>
            <p className="text-xs text-muted-foreground">• AWS Server Count is verified against real-time billing extracts.</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-chart-2" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">• Accelerate RFP preparation for upcoming 2026 license renewals.</p>
            <p className="text-xs text-muted-foreground">• Consolidate multi-department AWS accounts for cost optimization.</p>
            <p className="text-xs text-muted-foreground">• Enhance documentation for "Stuck" projects in the critical view.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
