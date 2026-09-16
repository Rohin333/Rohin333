import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
import { Progress } from '@components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Users, User } from 'lucide-react';
import { cn } from '@lib/utils';

export default function ResourceView({ items }) {
  const [sortBy, setSortBy] = useState('workload');

  const resourceData = useMemo(() => {
    const resources = new Map();

    items.forEach(item => {
      // Process assigned person
      if (item.person && Array.isArray(item.person)) {
        item.person.forEach(p => {
          if (!resources.has(p.id)) {
            resources.set(p.id, {
              id: p.id,
              name: p.name || 'Unknown',
              items: [],
              projects: 0,
              operational: 0,
              inProgress: 0,
              completed: 0,
              blocked: 0
            });
          }

          const resource = resources.get(p.id);
          resource.items.push(item);

          if (item.projOp === 'Project') resource.projects++;
          if (item.projOp === 'Operational') resource.operational++;
          if (item.status === 'In Progress' || item.currentStatus === 'In Progress') resource.inProgress++;
          if (item.status === 'Done') resource.completed++;
          if (item.status === 'Stuck') resource.blocked++;
        });
      }
    });

    let resourceArray = Array.from(resources.values());

    // Sort
    if (sortBy === 'workload') {
      resourceArray.sort((a, b) => b.items.length - a.items.length);
    } else if (sortBy === 'name') {
      resourceArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'active') {
      resourceArray.sort((a, b) => b.inProgress - a.inProgress);
    }

    return resourceArray;
  }, [items, sortBy]);

  const totalAssignments = items.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/60">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {resourceData.length} Team Members
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalAssignments} total assignments
                </div>
              </div>
            </div>

            <div className="w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workload">By Workload</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="active">By Active Tasks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resourceData.length === 0 ? (
          <Card className="border-border/60 col-span-full">
            <CardContent className="p-12 text-center text-muted-foreground">
              No resource assignments found
            </CardContent>
          </Card>
        ) : (
          resourceData.map(resource => {
            const workloadPercent = Math.min((resource.items.length / 10) * 100, 100);
            const completionRate = resource.items.length > 0 
              ? (resource.completed / resource.items.length) * 100 
              : 0;

            return (
              <Card key={resource.id} className="border-border/60 hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {resource.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-semibold truncate">
                        {resource.name}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-1">
                        {resource.items.length} {resource.items.length === 1 ? 'assignment' : 'assignments'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Workload */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Workload</span>
                      <span className="text-xs font-semibold text-foreground">
                        {resource.items.length} items
                      </span>
                    </div>
                    <Progress 
                      value={workloadPercent} 
                      className={cn(
                        "h-2",
                        workloadPercent > 80 ? "bg-destructive/20" : ""
                      )}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">Projects</div>
                      <div className="text-lg font-bold text-foreground">{resource.projects}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">Operational</div>
                      <div className="text-lg font-bold text-foreground">{resource.operational}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-1/10">
                      <div className="text-xs text-muted-foreground mb-1">In Progress</div>
                      <div className="text-lg font-bold text-chart-1">{resource.inProgress}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-chart-2/10">
                      <div className="text-xs text-muted-foreground mb-1">Completed</div>
                      <div className="text-lg font-bold text-chart-2">{resource.completed}</div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {resource.blocked > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {resource.blocked} Blocked
                      </Badge>
                    )}
                    {completionRate > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {completionRate.toFixed(0)}% Complete
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
