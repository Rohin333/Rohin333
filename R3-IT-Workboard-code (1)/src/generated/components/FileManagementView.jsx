import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Skeleton } from '@components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@components/ui/dialog';
import { FileText, Search, Upload, FolderOpen, Cloud, Server, Shield, Network, DollarSign } from 'lucide-react';
import { cn } from '@lib/utils';
import FileUploadManager from './FileUploadManager';
import BudgetInvoiceUpload from './BudgetInvoiceUpload';

export default function FileManagementView({ items, loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [infraTypeFilter, setInfraTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [budgetUploadItem, setBudgetUploadItem] = useState(null);

  const operationalItems = useMemo(() => {
    if (!items) return [];
    let filtered = items.filter(item => item.projOp === 'Operational');
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.name?.toLowerCase().includes(query) || item.summary?.toLowerCase().includes(query));
    }
    if (infraTypeFilter !== 'all') {
      filtered = filtered.filter(item => item.infrastructureType?.includes(infraTypeFilter));
    }
    return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [items, searchQuery, infraTypeFilter]);

  const stats = useMemo(() => {
    const totalItems = operationalItems.length;
    const itemsWithFiles = operationalItems.filter(i => i.itBudgetData && i.itBudgetData.length > 0).length;
    const totalFiles = operationalItems.reduce((sum, i) => sum + (i.itBudgetData?.length || 0), 0);
    return { totalItems, itemsWithFiles, totalFiles, itemsNeedingFiles: totalItems - itemsWithFiles };
  }, [operationalItems]);

  const handleUploadComplete = () => {
    setUploadDialogOpen(false);
    setSelectedItem(null);
    onRefresh?.();
  };

  if (loading) {
    return <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-[600px] w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><FolderOpen className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-primary">{stats.totalItems}</p><p className="text-xs text-muted-foreground">Operational Tasks</p></div>
          </div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center"><FileText className="h-5 w-5 text-chart-1" /></div>
            <div><p className="text-2xl font-bold text-chart-1">{stats.totalFiles}</p><p className="text-xs text-muted-foreground">Total Files</p></div>
          </div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center"><Upload className="h-5 w-5 text-chart-3" /></div>
            <div><p className="text-2xl font-bold text-chart-3">{stats.itemsWithFiles}</p><p className="text-xs text-muted-foreground">With Files</p></div>
          </div>
        </CardContent></Card>
        <Card className="border-border/60"><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center"><FileText className="h-5 w-5 text-chart-2" /></div>
            <div><p className="text-2xl font-bold text-chart-2">{stats.itemsNeedingFiles}</p><p className="text-xs text-muted-foreground">Need Docs</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <Card className="border-border/60"><CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search operational tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={infraTypeFilter} onValueChange={setInfraTypeFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Infrastructure Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="AWS Cloud">AWS Cloud</SelectItem>
              <SelectItem value="VMware On-Prem">VMware On-Prem</SelectItem>
              <SelectItem value="Firewall">Firewall</SelectItem>
              <SelectItem value="Network">Network</SelectItem>
              <SelectItem value="Storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      {/* Tasks */}
      <div className="grid grid-cols-1 gap-4">
        {operationalItems.length === 0 ? (
          <Card className="border-border/60"><CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No operational tasks found</p>
          </CardContent></Card>
        ) : operationalItems.map(item => (
          <Card key={item.id} className="border-border/60 hover:border-primary/40 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-primary mb-2">{item.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {item.infrastructureType?.map(type => (
                      <Badge key={type} variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/40">
                        {type === 'AWS Cloud' && <Cloud className="h-3 w-3 mr-1" />}
                        {type === 'VMware On-Prem' && <Server className="h-3 w-3 mr-1" />}
                        {type === 'Firewall' && <Shield className="h-3 w-3 mr-1" />}
                        {type === 'Network' && <Network className="h-3 w-3 mr-1" />}
                        {type}
                      </Badge>
                    ))}
                    <Badge variant="secondary">{item.itBudgetData?.length || 0} Files</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setBudgetUploadItem(item)} className="flex items-center gap-2 border-primary/30 hover:border-primary hover:bg-primary/10">
                    <DollarSign className="h-4 w-4" />Budget
                  </Button>
                  <Dialog open={uploadDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => { setUploadDialogOpen(open); if (!open) setSelectedItem(null); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setSelectedItem(item)} className="flex items-center gap-2"><Upload className="h-4 w-4" />Upload</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-primary">Upload Files - {item.name}</DialogTitle>
                        <DialogDescription>Upload documentation and budget files</DialogDescription>
                      </DialogHeader>
                      <FileUploadManager item={item} onUploadComplete={handleUploadComplete} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {item.summary && <div className="bg-muted/30 rounded-lg p-3 mb-3"><p className="text-sm text-muted-foreground">{item.summary}</p></div>}
              {item.itBudgetData?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground">Recent Files:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.itBudgetData.slice(0, 3).map(file => (
                      <Badge key={file.id} variant="outline" className="text-xs"><FileText className="h-3 w-3 mr-1" />{file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}</Badge>
                    ))}
                    {item.itBudgetData.length > 3 && <Badge variant="secondary" className="text-xs">+{item.itBudgetData.length - 3} more</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {budgetUploadItem && (
        <BudgetInvoiceUpload item={budgetUploadItem} open={!!budgetUploadItem} onClose={() => setBudgetUploadItem(null)} onSuccess={() => { setBudgetUploadItem(null); onRefresh?.(); }} />
      )}
    </div>
  );
}
