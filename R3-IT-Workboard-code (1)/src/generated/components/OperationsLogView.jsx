import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Skeleton } from '@components/ui/skeleton';
import { ScrollArea } from '@components/ui/scroll-area';
import FilePreview from '@components/FilePreview';
import { 
  FileText, Search, Download, Calendar, User, 
  Shield, Network, Server, Cloud, Filter,
  AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '@lib/utils';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function OperationsLogView({ items, loading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [infraTypeFilter, setInfraTypeFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');

  const filteredItems = useMemo(() => {
    if (!items) return [];

    let filtered = items.filter(item => 
      item.projOp === 'Operational' && 
      item.logAnalysisReports && 
      item.logAnalysisReports.length > 0
    );

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.summary?.toLowerCase().includes(query) ||
        item.comments?.toLowerCase().includes(query)
      );
    }

    if (infraTypeFilter !== 'all') {
      filtered = filtered.filter(item => 
        item.infrastructureType?.includes(infraTypeFilter)
      );
    }

    if (healthFilter !== 'all') {
      filtered = filtered.filter(item => item.infrastructureHealth === healthFilter);
    }

    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [items, searchQuery, infraTypeFilter, healthFilter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by name, summary, or comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-primary/30"
              />
            </div>
            
            <Select value={infraTypeFilter} onValueChange={setInfraTypeFilter}>
              <SelectTrigger className="w-[200px] bg-background border-primary/30">
                <SelectValue placeholder="Infrastructure Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="AWS Cloud">AWS Cloud</SelectItem>
                <SelectItem value="VMware On-Prem">VMware On-Prem</SelectItem>
                <SelectItem value="Firewall">Firewall</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Storage">Storage</SelectItem>
              </SelectContent>
            </Select>

            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[180px] bg-background border-primary/30">
                <SelectValue placeholder="Health Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Healthy">Healthy</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Log Cards */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="border-primary/20">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No log reports found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery || infraTypeFilter !== 'all' || healthFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Upload log analysis reports to operational tasks'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="border-primary/20 hover:border-primary/40 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-primary mb-2">{item.name}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {item.infrastructureType?.map((type) => (
                        <Badge key={type} variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/40">
                          {type === 'AWS Cloud' && <Cloud className="h-3 w-3 mr-1" />}
                          {type === 'VMware On-Prem' && <Server className="h-3 w-3 mr-1" />}
                          {type === 'Firewall' && <Shield className="h-3 w-3 mr-1" />}
                          {type === 'Network' && <Network className="h-3 w-3 mr-1" />}
                          {type}
                        </Badge>
                      ))}
                      {item.infrastructureHealth && (
                        <Badge 
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            item.infrastructureHealth === 'Healthy' && "bg-chart-1/20 text-chart-1",
                            item.infrastructureHealth === 'Warning' && "bg-chart-2/20 text-chart-2",
                            item.infrastructureHealth === 'Critical' && "bg-destructive/20 text-destructive"
                          )}
                        >
                          {item.infrastructureHealth === 'Healthy' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {item.infrastructureHealth === 'Warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {item.infrastructureHealth === 'Critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {item.infrastructureHealth}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatDate(item.updatedAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                {item.summary && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.summary}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {item.person && item.person.length > 0 && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{item.person[0].name}</span>
                    </div>
                  )}
                  {item.annualCostBhd && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Annual Cost:</span>
                      <span className="font-medium text-primary">{item.annualCostBhd.toLocaleString()} BHD</span>
                    </div>
                  )}
                  {item.awsServerCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-chart-3" />
                      <span className="text-muted-foreground">AWS Servers:</span>
                      <span className="font-medium">{item.awsServerCount}</span>
                    </div>
                  )}
                  {item.vmwareVmCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-chart-1" />
                      <span className="text-muted-foreground">VMware VMs:</span>
                      <span className="font-medium">{item.vmwareVmCount}</span>
                    </div>
                  )}
                  {item.firewallRulesCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-destructive" />
                      <span className="text-muted-foreground">Firewall Rules:</span>
                      <span className="font-medium">{item.firewallRulesCount}</span>
                    </div>
                  )}
                </div>

                {/* Log Files */}
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Log Analysis Reports ({item.logAnalysisReports.length})
                  </h4>
                  <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.logAnalysisReports.map((file) => (
                        <div key={file.id} className="border border-border rounded-lg p-3 hover:border-primary/40 transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(file.size / 1024).toFixed(2)} KB • {formatDate(file.createdAt)}
                              </p>
                            </div>
                            {file.downloadUrl && (
                              <a 
                                href={file.downloadUrl} 
                                download 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                title="Download file"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          {/* File Preview */}
                          <div className="mt-3">
                            <FilePreview file={file} height="120px" objectFit="contain" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Comments */}
                {item.comments && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Comments</h4>
                    <p className="text-sm text-muted-foreground">{item.comments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
