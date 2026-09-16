import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { ScrollArea, ScrollBar } from '@components/ui/scroll-area';
import { Skeleton } from '@components/ui/skeleton';
import { Calendar, Clock, User, Filter } from 'lucide-react';
import { cn } from '@lib/utils';

// Simple date utilities
const parseDate = (dateStr) => new Date(dateStr);
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addMonths = (date, months) => new Date(date.getFullYear(), date.getMonth() + months, 1);
const differenceInDays = (dateLeft, dateRight) => Math.ceil((dateLeft - dateRight) / (1000 * 60 * 60 * 24));
const formatDate = (date, format) => {
  const d = new Date(date);
  if (format === 'MMM yyyy') return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (format === 'MMM dd') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/* Board-accurate status colors via CSS variables defined in theme-tokens.css */
function getStatusColor(status) {
  const el = document.documentElement;
  const map = {
    'In Progress': '--status-in-progress',
    'Done': '--status-done',
    'Stuck': '--status-stuck',
    'Not Yet Started': '--status-not-started',
    'Postponed': '--status-postponed',
    'Cancelled': '--status-cancelled',
    'Daily Operational Tasks': '--status-daily-ops',
    'Emergency operantional TaskTask': '--status-emergency'
  };
  const v = map[status];
  if (!v) return getComputedStyle(el).getPropertyValue('--muted-foreground').trim() ? `hsl(${getComputedStyle(el).getPropertyValue('--muted-foreground').trim()})` : '#555';
  return getComputedStyle(el).getPropertyValue(v).trim() || '#555';
}
const STATUS_COLORS = new Proxy({}, { get: (_, status) => getStatusColor(status) });

const TYPE_COLORS = {
  'Project': 'bg-chart-1',
  'Operational': 'bg-chart-3'
};

export default function TimelineView({ items, loading }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const timelineData = useMemo(() => {
    if (!items || items.length === 0) return null;

    // Filter items
    let filtered = items.filter(item => item.date && item.date.from);
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.projOp === typeFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (filtered.length === 0) return null;

    // Calculate date range
    const dates = filtered.flatMap(item => [
      parseDate(item.date.from),
      parseDate(item.date.to || item.date.from)
    ]);
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    // Extend range to month boundaries
    const rangeStart = startOfMonth(minDate);
    const rangeEnd = endOfMonth(maxDate);
    const totalDays = differenceInDays(rangeEnd, rangeStart) + 1;

    // Generate months
    const months = [];
    let currentMonth = rangeStart;
    while (currentMonth <= rangeEnd) {
      months.push(new Date(currentMonth));
      currentMonth = addMonths(currentMonth, 1);
    }

    // Calculate timeline bars
    const timelineItems = filtered.map(item => {
      const startDate = parseDate(item.date.from);
      const endDate = parseDate(item.date.to || item.date.from);
      
      const startOffset = differenceInDays(startDate, rangeStart);
      const duration = differenceInDays(endDate, startDate) + 1;
      
      const leftPercent = (startOffset / totalDays) * 100;
      const widthPercent = (duration / totalDays) * 100;

      return {
        ...item,
        leftPercent,
        widthPercent,
        startDate,
        endDate,
        duration
      };
    });

    return {
      items: timelineItems,
      months,
      dateRange: { start: rangeStart, end: rangeEnd, totalDays }
    };
  }, [items, typeFilter, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className="border-border/60">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No timeline data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Stats */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-primary" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Project">Projects</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Not Yet Started">Not Yet Started</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Stuck">Stuck</SelectItem>
              <SelectItem value="Postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              {timelineData?.items.length || 0} {(timelineData?.items.length || 0) === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Gantt Chart */}
      <Card className="border-border/60 overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!timelineData || timelineData.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No items match the selected filters</p>
            </div>
          ) : (
            <div className="relative">
              <ScrollArea className="w-full">
                <div className="min-w-[1200px]">
                  {/* Timeline Grid */}
                  <div className="flex border-b border-border bg-muted/20">
                    {/* Left sidebar header */}
                    <div className="w-[320px] flex-shrink-0 border-r border-border p-4 font-semibold text-sm text-primary">
                      Task Name
                    </div>
                    
                    {/* Month headers */}
                    <div className="flex-1 flex">
                      {timelineData.months.map((month) => {
                        const monthStart = startOfMonth(month);
                        const monthEnd = endOfMonth(month);
                        const daysInView = differenceInDays(
                          monthEnd < timelineData.dateRange.end ? monthEnd : timelineData.dateRange.end,
                          monthStart > timelineData.dateRange.start ? monthStart : timelineData.dateRange.start
                        ) + 1;
                        const widthPercent = (daysInView / timelineData.dateRange.totalDays) * 100;

                        return (
                          <div
                            key={month.toISOString()}
                            style={{ width: `${widthPercent}%` }}
                            className="border-r border-border p-3 text-center"
                          >
                            <div className="text-xs font-bold text-primary uppercase tracking-wide">
                              {formatDate(month, 'MMM yyyy')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline rows */}
                  <div className="relative">
                    {timelineData.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center hover:bg-muted/50 transition-colors group",
                          idx % 2 === 0 ? "bg-card/30" : "bg-card/10"
                        )}
                      >
                        {/* Left sidebar - Task info */}
                        <div className="w-[320px] flex-shrink-0 border-r border-border p-4">
                          <div className="space-y-2">
                            <div className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                variant="outline" 
                                className={cn(TYPE_COLORS[item.projOp] || 'bg-muted', 'text-white border-0 text-xs')}
                              >
                                {item.projOp}
                              </Badge>
                              <Badge 
                                variant="secondary"
                                className="text-xs"
                                style={{ 
                                  backgroundColor: STATUS_COLORS[item.status] + '20',
                                  color: STATUS_COLORS[item.status],
                                  borderColor: STATUS_COLORS[item.status] + '40'
                                }}
                              >
                                {item.status}
                              </Badge>
                            </div>
                            {item.person && item.person.length > 0 && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span className="line-clamp-1">{item.person[0].name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timeline bar area */}
                        <div className="flex-1 relative h-[100px] py-4">
                          {/* Vertical grid lines for months */}
                          {timelineData.months.map((month) => {
                            const monthStart = startOfMonth(month);
                            const monthEnd = endOfMonth(month);
                            const daysInView = differenceInDays(
                              monthEnd < timelineData.dateRange.end ? monthEnd : timelineData.dateRange.end,
                              monthStart > timelineData.dateRange.start ? monthStart : timelineData.dateRange.start
                            ) + 1;
                            const widthPercent = (daysInView / timelineData.dateRange.totalDays) * 100;

                            return (
                              <div
                                key={month.toISOString()}
                                style={{ width: `${widthPercent}%` }}
                                className="absolute h-full border-r border-border/30"
                              />
                            );
                          })}

                          {/* Timeline bar */}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-10 rounded-md cursor-pointer transition-all group-hover:h-11"
                            style={{
                              left: `${item.leftPercent}%`,
                              width: `${item.widthPercent}%`,
                              backgroundColor: STATUS_COLORS[item.status]
                            }}
                          >
                            <div className="h-full flex items-center justify-between px-3 text-white text-xs font-semibold">
                              <span className="truncate">{formatDate(item.startDate, 'MMM dd')}</span>
                              {item.duration > 7 && (
                                <span className="ml-2 opacity-80">{item.duration}d</span>
                              )}
                              <span className="truncate">{formatDate(item.endDate, 'MMM dd')}</span>
                            </div>
                            
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="bg-popover border border-border rounded-lg shadow-xl p-3 min-w-[200px]">
                                <div className="text-xs font-semibold text-foreground mb-1">{item.name}</div>
                                <div className="text-xs text-muted-foreground space-y-1">
                                  <div>{formatDate(item.startDate)} - {formatDate(item.endDate)}</div>
                                  <div>{item.duration} day{item.duration !== 1 ? 's' : ''}</div>
                                  <div className="flex items-center gap-1 mt-2">
                                    <div 
                                      className="w-2 h-2 rounded-full" 
                                      style={{ backgroundColor: STATUS_COLORS[item.status] }}
                                    />
                                    {item.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-muted-foreground mr-2">Status Legend:</span>
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
