import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { 
  FileText, Shield, Clock, Calendar, 
  DollarSign, Download, Building2, ExternalLink,
  ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import { cn } from '@lib/utils';
import FilePreview from '@components/FilePreview';

export default function GroupOpsCenter({ items, loading }) {
  const groups = useMemo(() => {
    if (!items || items.length === 0) return {};
    
    return items.reduce((acc, item) => {
      const groupTitle = item.group?.title || 'General';
      if (!acc[groupTitle]) acc[groupTitle] = [];
      acc[groupTitle].push(item);
      return acc;
    }, {});
  }, [items]);

  const groupTitles = Object.keys(groups).sort();

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={`skeleton-${i}`} className="h-40 w-full bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (groupTitles.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
          <p>No group data found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cyberpunk header */}
      <div className="relative pb-4 border-b border-primary/20">
        <div className="absolute -left-1 top-0 w-2.5 h-2.5 bg-primary rotate-45" 
             style={{ boxShadow: 'var(--glow-primary-strong)' }} />
        <div className="absolute -right-1 top-0 w-2.5 h-2.5 bg-accent rotate-45"
             style={{ boxShadow: 'var(--glow-accent-strong)' }} />
        
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-black tracking-[0.1em] uppercase text-primary"
              style={{ textShadow: 'var(--glow-primary-soft)' }}>
            Operational Group Hub
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.06em] font-semibold">
            Contracts, SLAs, and Invoices broken down by department group
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <Accordion type="multiple" defaultValue={[groupTitles[0]]} className="space-y-4">
        {groupTitles.map((title) => (
          <AccordionItem key={title} value={title} className="border border-primary/40 rounded bg-card overflow-hidden hover:border-primary/60 transition-all relative group/accordion">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-l-[24px] border-l-transparent border-t-primary/20" />
            
            <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-colors hover:no-underline relative z-10">
              <div className="flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded border border-primary/60 bg-primary/10 flex items-center justify-center text-primary"
                     style={{ boxShadow: 'var(--glow-primary-subtle)' }}>
                  <Building2 className="h-5 w-5"
                             style={{ filter: 'drop-shadow(var(--glow-primary-medium))' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground leading-tight uppercase tracking-[0.06em]">{title}</h3>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">{groups[title].length} Systems in Group</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0 border-t border-primary/20">
              <Tabs defaultValue="contracts" className="w-full">
                <div className="px-6 border-b border-border/40 bg-card/50">
                  <TabsList className="h-11 bg-transparent border-none p-0 gap-6">
                    <TabsTrigger 
                      value="contracts" 
                      className="h-11 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent px-1 shadow-none text-[10px] font-bold tracking-wider uppercase transition-all"
                    >
                      <Shield className="h-3.5 w-3.5 mr-2" />
                      Contracts & SLAs
                    </TabsTrigger>
                    <TabsTrigger 
                      value="uploads" 
                      className="h-11 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent bg-transparent px-1 shadow-none"
                    >
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      Invoices & Uploads
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="contracts" className="m-0 p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[300px] text-[11px] uppercase tracking-wider font-bold h-10 px-6">Service Name</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10">Vendor</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10">SLA Details</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10">Due Date</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10">Status</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10 text-right pr-6">Annual Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups[title].filter(item => item.vendor || item.slaHours || item.annualCostBhd).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                              No contract or SLA data found for this group
                            </TableCell>
                          </TableRow>
                        ) : (
                          groups[title].map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/10 group">
                              <TableCell className="px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold text-foreground text-sm leading-tight">{item.name}</span>
                                  {item.licensingProposalRequest && (
                                    <span className="text-[11px] text-muted-foreground line-clamp-1 italic">{item.licensingProposalRequest}</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {item.vendor ? (
                                  <Badge variant="outline" className="font-medium bg-primary/5 text-primary border-primary/20">
                                    {item.vendor}
                                  </Badge>
                                ) : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                              <TableCell>
                                {item.slaHours ? (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5 text-primary/60" />
                                    <span>{item.slaHours}</span>
                                  </div>
                                ) : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                              <TableCell>
                                {item.nextDueDate ? (
                                  <div className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className={cn(
                                      "font-medium",
                                      new Date(item.nextDueDate) < new Date() ? "text-destructive" : "text-foreground"
                                    )}>
                                      {new Date(item.nextDueDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                ) : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                              <TableCell>
                                {item.status && (
                                  <Badge 
                                    className={cn(
                                      "text-[10px] h-5 px-2",
                                      item.status === 'Done' ? "bg-chart-1 text-chart-1-foreground" :
                                      item.status === 'In Progress' ? "bg-primary text-primary-foreground" :
                                      item.status === 'Stuck' ? "bg-destructive text-destructive-foreground" :
                                      "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {item.status}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                {item.annualCostBhd ? (
                                  <span className="font-bold text-sm text-foreground">
                                    {item.annualCostBhd.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground uppercase ml-0.5">BHD</span>
                                  </span>
                                ) : <span className="text-muted-foreground">—</span>}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="uploads" className="m-0 p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[350px] text-[11px] uppercase tracking-wider font-bold h-10 px-6">Service/Asset</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10">Invoices & Documentation</TableHead>
                          <TableHead className="text-[11px] uppercase tracking-wider font-bold h-10 text-right pr-6">Monthly / Annual Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups[title].filter(item => (item.itBudgetData && item.itBudgetData.length > 0) || item.monthlyCostBhd).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                              No invoice or upload data found for this group
                            </TableCell>
                          </TableRow>
                        ) : (
                          groups[title].map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/10">
                              <TableCell className="px-6 py-5">
                                <div className="flex flex-col gap-1">
                                  <span className="font-semibold text-foreground text-sm">{item.name}</span>
                                  {item.budgetCategories && (
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant="secondary" className="text-[9px] uppercase tracking-tight py-0 px-1.5 h-4">
                                        {item.budgetCategories}
                                      </Badge>
                                      {item.department && (
                                        <span className="text-[10px] text-muted-foreground">{item.department}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2 py-1">
                                  {item.itBudgetData && item.itBudgetData.length > 0 ? (
                                    item.itBudgetData.map((file) => (
                                      <div key={file.id} className="group/file relative">
                                        <a 
                                          href={file.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 px-2.5 py-1.5 bg-muted/40 border border-border/60 rounded-md hover:bg-muted hover:border-primary/40 transition-all text-xs"
                                        >
                                          <FileText className="h-3.5 w-3.5 text-primary" />
                                          <span className="max-w-[120px] truncate font-medium">{file.name}</span>
                                          <Download className="h-3 w-3 text-muted-foreground opacity-0 group-hover/file:opacity-100 transition-opacity" />
                                        </a>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[11px] text-muted-foreground italic flex items-center gap-1.5">
                                      <AlertCircle className="h-3 w-3" />
                                      No documents uploaded
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right pr-6 py-5">
                                <div className="flex flex-col items-end gap-0.5">
                                  {item.annualCostBhd ? (
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-[10px] text-muted-foreground uppercase">Annual:</span>
                                      <span className="font-bold text-foreground text-sm">{item.annualCostBhd.toLocaleString()} BHD</span>
                                    </div>
                                  ) : null}
                                  {item.monthlyCostBhd ? (
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-[10px] text-muted-foreground uppercase">Monthly:</span>
                                      <span className="font-medium text-chart-1 text-xs">{item.monthlyCostBhd.toLocaleString()} BHD</span>
                                    </div>
                                  ) : null}
                                  {!item.annualCostBhd && !item.monthlyCostBhd && (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
