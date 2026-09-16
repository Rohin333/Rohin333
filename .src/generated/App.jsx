import { useState, useEffect, useCallback } from 'react';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import { Spinner } from '@components/ui/spinner';
import { Alert, AlertDescription } from '@components/ui/alert';
import { 
  AlertCircle, RefreshCw, Database, LayoutDashboard, Settings, 
  Activity, Plus, ClipboardCheck, GitBranch, History, MessageSquare, GitMerge 
} from 'lucide-react';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { useAggregates } from '@generated/hooks/useAggregates';
import { useThemeSettings } from '@generated/hooks/useThemeSettings';

import ComplianceDashboard from '@generated/components/ComplianceDashboard';
import CriticalItemsView from '@generated/components/CriticalItemsView';
import DashboardView from '@generated/components/DashboardView';
import TimelineView from '@generated/components/TimelineView';
import ResourceView from '@generated/components/ResourceView';
import ListView from '@generated/components/ListView';
import InfrastructureDashboard from '@generated/components/InfrastructureDashboard';
import FileManagementView from '@generated/components/FileManagementView';
import ITContractsView from '@generated/components/ITContractsView';
import BudgetVerificationView from '@generated/components/BudgetVerificationView';
import BudgetSubitemSync from '@generated/components/BudgetSubitemSync';
import GroupOpsCenter from '@generated/components/GroupOpsCenter';
import AdminSettingsView from '@generated/components/AdminSettingsView';
import WorkflowView from '@generated/components/WorkflowView';
import AuditReportView from '@generated/components/AuditReportView';
import ProjectTaskUpdatesFeed from '@generated/components/ProjectTaskUpdatesFeed';
import PowerAutomateWorkflowSpec from '@generated/components/PowerAutomateWorkflowSpec';
import ProgrammeOverview from '@generated/components/ProgrammeOverview';
import WorkflowAutomation from '@generated/components/WorkflowAutomation';

import './theme-tokens.css';

// Create IT Programme Board instance with correct ID and column mappings
const board = new ITProgrammeBoard();

const COLUMNS = [
  'person', 'status', 'projOp', 'date', 'comments',
  'dependencies', 'blockersrisks',
  'currentStatus', 'changeManagementSummary', 'updateSummaryShort', 'completionStatus',
  'nextDueDate', 'assignedTeam', 'slaHours', 'priority',
  'infrastructureType', 'awsServerCount', 'annualCostBhd', 'monthlyCostBhd',
  'summary', 'approved', 'estimatedHours', 'itBudgetData',
  'department', 'directorate', 'budgetCategories', 'totalBudgetAmounts',
  'overview', 'vendor', 'contractExpire'
];

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeTab, setActiveTab] = useState('opshub');

  const { aggregates, loading: aggLoading, error: aggError, refetch: refetchAggregates } = useAggregates();
  const themeSettings = useThemeSettings();
  const themeVersion = themeSettings.settings.themeVersion;

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const result = await board.items()
        .withColumns(COLUMNS)
        .withPagination({ limit: 100 })
        .execute();
      
      setItems(result.items || []);
      setCursor(result.cursor);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const result = await board.items()
        .withPagination({ cursor })
        .execute();
      
      setItems(prev => [...prev, ...(result.items || [])]);
      setCursor(result.cursor);
    } catch (err) {
      console.error('Error loading more items:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [cursor, loadingMore]);

  const handleRefresh = useCallback(() => {
    fetchItems();
    refetchAggregates();
  }, [fetchItems, refetchAggregates]);

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="text-primary" />
          <p className="text-sm text-muted-foreground font-mono tracking-wider uppercase">
            Initializing Ops Center...
          </p>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 md:p-5 relative z-10">
      <div className="max-w-[1800px] mx-auto space-y-4">
        {/* Header - Minimal nav bar */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm flex items-center justify-end gap-3 pb-3 pt-2 relative">
          <div className="flex items-center gap-2">
            {aggregates && (
              <Badge variant="outline" className="text-[9px] border-primary/40 bg-primary/10 text-primary font-bold tracking-wider uppercase">
                <Database className="h-2.5 w-2.5 mr-1.5" />
                {aggregates.totals.totalItems} Systems
              </Badge>
            )}
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="h-7 px-2.5 text-[10px] border border-border/40 hover:border-primary/60 hover:bg-primary/10 hover:text-primary font-bold tracking-wider uppercase"
              disabled={loading || aggLoading}
            >
              <RefreshCw className={`h-3 w-3 mr-1.5 ${(loading || aggLoading) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <TooltipProvider delayDuration={300}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="h-9 bg-card/80 border border-border/40 p-0.5 w-full justify-start overflow-x-auto flex-nowrap"
                      style={{ boxShadow: 'var(--glow-dark)' }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="opshub" className="text-[10px] h-7 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 flex items-center gap-1.5 font-bold tracking-wider uppercase transition-all">
                    <Activity className="h-3 w-3" />
                    Ops Hub
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-xs">
                  Unified view for IT operations, contracts, and financial document tracking across all department groups.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="cross-board" className="text-[10px] h-7 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 data-[state=active]:shadow-[0_0_8px_rgba(158,255,0,0.3)] font-bold tracking-wider uppercase transition-all flex items-center gap-1">
                    <GitMerge className="h-3 w-3" />
                    Board Sync
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-xs">
                  Automated workflows that create and update items across connected boards.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="dashboard" className="text-[10px] h-7 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 data-[state=active]:shadow-[0_0_8px_rgba(158,255,0,0.3)] flex items-center gap-1.5 font-bold tracking-wider uppercase transition-all">
                    <LayoutDashboard className="h-3 w-3" />
                    Analytics
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-xs">
                  Real-time charts and KPIs: cost distribution, project health, infrastructure breakdown.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="list" className="text-[10px] h-7 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 data-[state=active]:shadow-[0_0_8px_rgba(158,255,0,0.3)] font-bold tracking-wider uppercase transition-all">List View</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-xs">
                  Comprehensive, searchable tabular view of all board items with advanced server-side filtering.
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="admin" className="text-[10px] h-7 px-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/60 data-[state=active]:shadow-[0_0_8px_rgba(158,255,0,0.3)] font-bold tracking-wider uppercase transition-all flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    Settings
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent className="max-w-[250px] text-xs">
                  IT standards configuration, system rules, and dashboard theme personalization.
                </TooltipContent>
              </Tooltip>
            </TabsList>

            <TabsContent value="opshub" className="space-y-4 mt-0">
              <ProgrammeOverview items={items} loading={loading} aggregates={aggregates} />
            </TabsContent>

            <TabsContent value="cross-board" className="space-y-4 mt-0">
              <WorkflowAutomation />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4 mt-0">
              <DashboardView key={`dash-${themeVersion}`} aggregates={aggregates} aggLoading={aggLoading} items={items} loading={loading} />
            </TabsContent>

            <TabsContent value="list" className="space-y-4 mt-0">
              <ListView items={items} loading={loading} cursor={cursor} loadMore={loadMore} loadingMore={loadingMore} />
            </TabsContent>

            <TabsContent value="admin" className="space-y-4 mt-0">
              <AdminSettingsView
                themeSettings={themeSettings}
                onSave={themeSettings.saveSettings}
                onReset={themeSettings.resetSettings}
                saving={themeSettings.saving}
              />
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default App;
