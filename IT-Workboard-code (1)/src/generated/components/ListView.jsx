import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Spinner } from '@components/ui/spinner';
import { Skeleton } from '@components/ui/skeleton';
import { Search, Calendar, User, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { ItProgrammeBoard } from '@api/BoardSDK';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const STATUS_VARIANTS = {
  'Done': 'default',
  'In Progress': 'default',
  'Not Yet Started': 'secondary',
  'Stuck': 'destructive',
  'Postponed': 'secondary',
  'Cancelled': 'outline'
};

const COLUMNS = [
  'person', 'status', 'projOp', 'date', 'taskDescription',
  'dependencies', 'blockersrisks', 'priority', 'completionStatus',
  'nextDueDate', 'infrastructureType'
];

export default function ListView({ items: parentItems, loading: parentLoading, loadMore: parentLoadMore, cursor: parentCursor, loadingMore: parentLoadingMore }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');

  // Server-side search state
  const [searchResults, setSearchResults] = useState(null);
  const [searchCursor, setSearchCursor] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);
  const debounceRef = useRef(null);

  // Debounce search term
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchTerm]);

  // Server-side search when debounced term changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults(null);
      setSearchCursor(null);
      return;
    }

    const doSearch = async () => {
      try {
        setSearching(true);
        const board = new ItProgrammeBoard();
        const results = await board.items()
          .withColumns(COLUMNS)
          .where({ name: debouncedSearch.trim() })
          .withPagination({ limit: 25 })
          .execute();
        setSearchResults(results.items || []);
        setSearchCursor(results.cursor);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };
    doSearch();
  }, [debouncedSearch]);

  const loadMoreSearch = async () => {
    if (!searchCursor || searchLoadingMore) return;
    try {
      setSearchLoadingMore(true);
      const board = new ItProgrammeBoard();
      const results = await board.items()
        .withColumns(COLUMNS)
        .withPagination({ cursor: searchCursor })
        .execute();
      setSearchResults(prev => [...(prev || []), ...(results.items || [])]);
      setSearchCursor(results.cursor);
    } catch (err) {
      console.error('Load more search error:', err);
    } finally {
      setSearchLoadingMore(false);
    }
  };

  // Determine which items to display
  const isSearchActive = debouncedSearch.trim().length > 0;
  const displayItems = isSearchActive ? (searchResults || []) : (parentItems || []);
  const activeCursor = isSearchActive ? searchCursor : parentCursor;
  const activeLoadMore = isSearchActive ? loadMoreSearch : parentLoadMore;
  const activeLoadingMore = isSearchActive ? searchLoadingMore : parentLoadingMore;

  // Client-side filters (type, status, group) applied to display items
  const filteredItems = useMemo(() => {
    return displayItems.filter(item => {
      if (filterType !== 'all' && item.projOp !== filterType) return false;
      if (filterStatus !== 'all' && item.status !== filterStatus) return false;
      if (filterGroup !== 'all' && item.group?.title !== filterGroup) return false;
      return true;
    });
  }, [displayItems, filterType, filterStatus, filterGroup]);

  const uniqueGroups = useMemo(() => {
    const groups = new Set(parentItems?.map(i => i.group?.title).filter(Boolean));
    return Array.from(groups);
  }, [parentItems]);

  const isLoading = parentLoading && !parentItems?.length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search items (server-side)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-primary" />
              )}
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Project">Projects</SelectItem>
                <SelectItem value="Operational">Operational</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Stuck">Stuck</SelectItem>
                <SelectItem value="Not Yet Started">Not Yet Started</SelectItem>
                <SelectItem value="Postponed">Postponed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {uniqueGroups.map(group => (
                  <SelectItem key={group} value={group}>{group}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>Showing {filteredItems.length} items</span>
            {isSearchActive && <Badge variant="outline" className="text-[10px] h-4 px-1.5">Search active</Badge>}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className={cn("overflow-x-auto", searching && "opacity-60 transition-opacity")}>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Name</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Type</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Status</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Timeline</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Assigned</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Group</TableHead>
                  <TableHead className="text-[10px] uppercase tracking-wide font-semibold h-8">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                      {searching ? 'Searching...' : 'No items found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-medium py-2 max-w-[220px]">
                        <div className="truncate">{item.name}</div>
                        {item.dependencies && (
                          <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            <span className="truncate">{item.dependencies}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        {item.projOp && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.projOp}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        {item.status && (
                          <Badge variant={STATUS_VARIANTS[item.status] || 'secondary'} className="text-[10px] px-1.5 py-0">{item.status}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        {item.nextDueDate ? (
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDate(item.nextDueDate)}
                          </div>
                        ) : item.date?.from ? (
                          <div className="text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {formatDate(item.date.from)}
                            </div>
                          </div>
                        ) : <span className="text-[10px] text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="py-2">
                        {item.person?.length > 0 ? (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <User className="h-2.5 w-2.5" />
                            <span className="truncate max-w-[80px]">{item.person[0].name}</span>
                            {item.person.length > 1 && <span>+{item.person.length - 1}</span>}
                          </div>
                        ) : <span className="text-[10px] text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="py-2">
                        <span className="text-[10px] text-muted-foreground truncate block max-w-[100px]">
                          {item.group?.title || '—'}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 max-w-[160px]">
                        {item.taskDescription ? (
                          <span className="text-[10px] text-muted-foreground truncate block">{item.taskDescription}</span>
                        ) : item.blockersrisks ? (
                          <span className="text-[10px] text-destructive truncate block flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5 inline flex-shrink-0" />
                            {item.blockersrisks}
                          </span>
                        ) : <span className="text-[10px] text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Load More */}
      {activeCursor && (
        <div className="flex justify-center">
          <Button
            onClick={activeLoadMore}
            disabled={activeLoadingMore}
            variant="outline"
            size="sm"
            className="min-w-[160px]"
          >
            {activeLoadingMore ? (
              <>
                <Spinner className="mr-2 h-3.5 w-3.5" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
