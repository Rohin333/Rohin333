import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Skeleton } from '@components/ui/skeleton';
import { 
  FileText, Calendar, Users, AlertCircle, 
  CheckCircle2, Clock, Building2, FileSignature
} from 'lucide-react';
import { cn } from '@lib/utils';

export default function ITContractsView({ items, loading }) {
  const metrics = useMemo(() => {
    if (!items || items.length === 0) return null;

    // Filter to Projects or specific contract items
    const contractItems = items.filter(i => i.group?.id === 'new_group96591' || i.group?.title === 'Projects');

    const total = contractItems.length;
    const active = contractItems.filter(c => 
      c.status === 'In Progress' || c.completionStatus === 'In Progress'
    ).length;

    // Find expiring contracts
    let expiringSoon = 0;
    let expired = 0;
    
    contractItems.forEach(c => {
      const dateField = c.nextDueDate || c.date;
      if (!dateField) return;
      
      let endDate;
      if (dateField.to) {
        endDate = new Date(dateField.to);
      } else if (dateField instanceof Date) {
        endDate = dateField;
      }
      
      if (endDate && !isNaN(endDate.getTime())) {
        const daysUntil = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntil < 0) {
          expired++;
        } else if (daysUntil <= 90) {
          expiringSoon++;
        }
      }
    });

    return {
      total,
      active,
      expiringSoon,
      expired,
      contractItems
    };
  }, [items]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={`skeleton-contract-${i}`} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0 || !metrics || metrics.total === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileSignature className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No contracts found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Items in the "2026 Contracts" group will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  Total Contracts
                </p>
                <p className="text-3xl font-bold text-primary">{metrics.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-1/30 bg-gradient-to-br from-card to-chart-1/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Active Contracts
                </p>
                <p className="text-3xl font-bold text-chart-1">{metrics.active}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-2/30 bg-gradient-to-br from-card to-chart-2/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Expiring Soon
                </p>
                <p className="text-3xl font-bold text-chart-2">{metrics.expiringSoon}</p>
                <p className="text-xs text-muted-foreground">Within 90 days</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-gradient-to-br from-card to-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Expired
                </p>
                <p className="text-3xl font-bold text-destructive">{metrics.expired}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-primary">2026 IT Contracts & Documentation</CardTitle>
          <CardDescription>Active contracts, SLAs, and vendor agreements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.contractItems.map((contract) => {
              const dateField = contract.nextDueDate || contract.date;
              
              let daysUntilExpiry = null;
              let endDateDisplay = null;
              
              if (dateField) {
                let endDate;
                if (dateField.to) {
                  endDate = new Date(dateField.to);
                  endDateDisplay = `${new Date(dateField.from).toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                } else if (dateField instanceof Date) {
                  endDate = dateField;
                  endDateDisplay = endDate.toLocaleDateString();
                }
                
                if (endDate && !isNaN(endDate.getTime())) {
                  daysUntilExpiry = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
                }
              }
              
              const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 90;
              const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

              return (
                <div 
                  key={contract.id} 
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    isExpired ? "border-destructive/40 bg-destructive/5" :
                    isExpiringSoon ? "border-chart-2/40 bg-chart-2/5" :
                    "border-border/60 bg-card hover:border-primary/40"
                  )}
                >
                  <h4 className="font-semibold text-foreground mb-2">{contract.name}</h4>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {contract.status && (
                      <Badge variant="outline" className={cn(
                        contract.status === 'In Progress' && "bg-chart-1/10 text-chart-1 border-chart-1/40",
                        contract.status === 'Done' && "bg-chart-1/10 text-chart-1 border-chart-1/40",
                        contract.status === 'Stuck' && "bg-destructive/10 text-destructive border-destructive/40"
                      )}>
                        {contract.status}
                      </Badge>
                    )}
                    
                    {contract.person && contract.person.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {contract.person.map(p => p.name).join(', ')}
                      </Badge>
                    )}

                    {contract.vendor && (
                      <Badge variant="outline" className="bg-primary/5">
                        <Building2 className="h-3 w-3 mr-1" />
                        {contract.vendor}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                    {endDateDisplay && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contract Period</p>
                          <p className="font-medium text-foreground">{endDateDisplay}</p>
                        </div>
                      </div>
                    )}

                    {daysUntilExpiry !== null && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Expiry</p>
                          <p className={cn(
                            "font-medium",
                            isExpired ? "text-destructive" :
                            isExpiringSoon ? "text-chart-2" :
                            "text-foreground"
                          )}>
                            {isExpired 
                              ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                              : `${daysUntilExpiry} days remaining`
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {contract.group?.title && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Department Group</p>
                          <p className="font-medium text-foreground truncate">{contract.group.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {contract.taskDescription && (
                    <div className="mb-3 p-3 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Contract Description</p>
                      <p className="text-sm text-foreground">{contract.taskDescription}</p>
                    </div>
                  )}

                  {contract.itBudgetData && contract.itBudgetData.length > 0 && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Documentation</p>
                      <div className="flex flex-wrap gap-2">
                        {contract.itBudgetData.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted rounded text-xs text-foreground transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
