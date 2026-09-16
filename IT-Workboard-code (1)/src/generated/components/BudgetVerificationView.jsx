import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { 
  FileText, DollarSign, CheckCircle2, AlertCircle, 
  Building2, Download
} from 'lucide-react';
import { cn } from '@lib/utils';

export default function BudgetVerificationView({ items, loading }) {
  const budgetAnalysis = useMemo(() => {
    if (!items || items.length === 0) return null;

    // Filter to IT BUDGET Details group
    const budgetGroupItems = items.filter(i => i.group?.id === 'group_mm43t82' || i.group?.title === 'IT BUDGET Details');

    // Items with budget data uploaded
    const itemsWithBudgetFiles = budgetGroupItems.filter(i => 
      i.itBudgetData && i.itBudgetData.length > 0
    );

    // Items with extracted cost data
    const itemsWithCosts = budgetGroupItems.filter(i => 
      (i.annualCostBhd && i.annualCostBhd > 0) || 
      (i.monthlyCostBhd && i.monthlyCostBhd > 0)
    );

    // Items with budget files but no costs extracted
    const budgetFilesNoCosts = itemsWithBudgetFiles.filter(i => 
      (!i.annualCostBhd || i.annualCostBhd === 0) && 
      (!i.monthlyCostBhd || i.monthlyCostBhd === 0)
    );

    // Items with costs but no budget files
    const costsNoBudgetFiles = itemsWithCosts.filter(i => 
      !i.itBudgetData || i.itBudgetData.length === 0
    );

    // Items with complete budget information
    const completelyDocumented = itemsWithBudgetFiles.filter(i => 
      (i.annualCostBhd && i.annualCostBhd > 0) &&
      i.group?.title &&
      i.budgetCategories
    );

    // Calculate totals
    const totalFromExtracted = itemsWithCosts.reduce((sum, i) => 
      sum + (i.annualCostBhd || 0), 0
    );

    // Group by department
    const byDepartment = budgetGroupItems.reduce((acc, item) => {
      const dept = item.group?.title || 'Unassigned';
      if (!acc[dept]) {
        acc[dept] = { 
          count: 0, 
          annualCost: 0, 
          monthlyCost: 0,
          withFiles: 0
        };
      }
      acc[dept].count++;
      acc[dept].annualCost += (item.annualCostBhd || 0);
      acc[dept].monthlyCost += (item.monthlyCostBhd || 0);
      if (item.itBudgetData && item.itBudgetData.length > 0) {
        acc[dept].withFiles++;
      }
      return acc;
    }, {});
// Detailed budget items sorted by cost
const detailedBudgetItems = itemsWithBudgetFiles.map(item => ({
  id: item.id,
  name: item.name,
  annualCost: item.annualCostBhd || 0,
  monthlyCost: item.monthlyCostBhd || 0,
  currency: item.currency || 'BHD',
  department: item.group?.title,
  directorate: 'TRA',
  budgetCategory: item.budgetCategories,
  fiscalYear: item.year ? new Date(item.year).getFullYear() : null,
  files: item.itBudgetData || [],
  overview: item.taskDescription,
  totalBudgetAmount: item.annualCostBhd || 0,
  budgetStatus: item.itBudgetStatus,
  hasCompleteData: !!(
    item.annualCostBhd &&
    item.group?.title &&
    item.budgetCategories
  )
})).sort((a, b) => b.annualCost - a.annualCost);

    return {
      total: budgetGroupItems.length,
      itemsWithBudgetFiles: itemsWithBudgetFiles.length,
      itemsWithCosts: itemsWithCosts.length,
      budgetFilesNoCosts: budgetFilesNoCosts.length,
      costsNoBudgetFiles: costsNoBudgetFiles.length,
      completelyDocumented: completelyDocumented.length,
      totalFromExtracted,
      byDepartment,
      detailedBudgetItems
    };
  }, [items]);

  if (!budgetAnalysis || budgetAnalysis.total === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No budget items found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Items in the "IT BUDGET Details" group will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Data Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-chart-1/30 bg-gradient-to-br from-card to-chart-1/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Complete Budget Data
                </p>
                <p className="text-3xl font-bold text-chart-1">{budgetAnalysis.completelyDocumented}</p>
                <p className="text-xs text-muted-foreground">Files + Costs + Metadata</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Budget Files Uploaded
                </p>
                <p className="text-3xl font-bold text-primary">{budgetAnalysis.itemsWithBudgetFiles}</p>
                <p className="text-xs text-muted-foreground">Items with budget documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-2/30 bg-gradient-to-br from-card to-chart-2/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Files Without Costs
                </p>
                <p className="text-3xl font-bold text-chart-2">{budgetAnalysis.budgetFilesNoCosts}</p>
                <p className="text-xs text-muted-foreground">Need re-extraction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Verified Budget
                </p>
                <p className="text-2xl font-bold text-primary">
                  {budgetAnalysis.totalFromExtracted.toLocaleString()} BHD
                </p>
                <p className="text-xs text-muted-foreground">Annual from extracted data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Warnings */}
      {(budgetAnalysis.budgetFilesNoCosts > 0 || budgetAnalysis.costsNoBudgetFiles > 0) && (
        <div className="space-y-3">
          {budgetAnalysis.budgetFilesNoCosts > 0 && (
            <Alert className="border-chart-2/40 bg-chart-2/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{budgetAnalysis.budgetFilesNoCosts} items</strong> have budget files uploaded but no costs extracted. 
                Re-upload or re-extract budget data from these files.
              </AlertDescription>
            </Alert>
          )}
          {budgetAnalysis.costsNoBudgetFiles > 0 && (
            <Alert className="border-primary/40 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{budgetAnalysis.costsNoBudgetFiles} items</strong> have cost data but no budget files attached. 
                Upload source budget documents for audit trail.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Detailed Budget Items */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-primary">Budget Verification Details</CardTitle>
          <CardDescription>Review extracted budget data - Click files to verify amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgetAnalysis.detailedBudgetItems.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  item.hasCompleteData 
                    ? "border-chart-1/40 bg-chart-1/5 hover:border-chart-1/60" 
                    : "border-chart-2/40 bg-chart-2/5 hover:border-chart-2/60"
                )}
              >
                <h4 className="font-semibold text-foreground mb-2">{item.name}</h4>
                
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.budgetStatus && (
                    <Badge variant="outline" className={cn(
                      item.budgetStatus === 'Approved' && "bg-chart-1/10 text-chart-1 border-chart-1/40",
                      item.budgetStatus === 'Under Review' && "bg-chart-2/10 text-chart-2 border-chart-2/40",
                      item.budgetStatus === 'Draft' && "bg-muted/50 text-muted-foreground border-border"
                    )}>
                      {item.budgetStatus}
                    </Badge>
                  )}
                  {item.hasCompleteData ? (
                    <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/40">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/40">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Annual Cost</p>
                    <p className="text-lg font-bold text-chart-1">
                      {item.annualCost.toLocaleString()} {item.currency}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Monthly Cost</p>
                    <p className="text-lg font-bold text-chart-3">
                      {item.monthlyCost.toLocaleString()} {item.currency}
                    </p>
                  </div>
                  {item.department && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="font-medium text-foreground">{item.department}</p>
                    </div>
                  )}
                  {item.budgetCategory && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-medium text-foreground">{item.budgetCategory}</p>
                    </div>
                  )}
                </div>

                {item.overview && (
                  <div className="mb-3 p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground mb-1">Budget Overview</p>
                    <p className="text-sm text-foreground">{item.overview}</p>
                  </div>
                )}

                {/* Budget Files */}
                {item.files && item.files.length > 0 && (
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      Source Budget Documents - Click to verify extracted amounts
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.files.map((file) => (
                        <a
                          key={file.id}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-card border border-border/60 hover:border-primary/40 rounded text-sm transition-colors"
                        >
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                              {file.createdAt && ` • ${new Date(file.createdAt).toLocaleDateString()}`}
                            </p>
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Budget Summary */}
      {Object.keys(budgetAnalysis.byDepartment).length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-primary">Budget by Department</CardTitle>
            <CardDescription>Cost allocation across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(budgetAnalysis.byDepartment)
                .sort(([,a], [,b]) => b.annualCost - a.annualCost)
                .map(([dept, data]) => (
                  <div key={dept} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{dept}</p>
                        <p className="text-xs text-muted-foreground">
                          {data.count} items • {data.withFiles} with budget files
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-chart-1">
                        {data.annualCost.toLocaleString()} BHD
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.monthlyCost.toLocaleString()} BHD/month
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
