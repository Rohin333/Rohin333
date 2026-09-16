import { useState, useEffect, useCallback } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@components/ui/table';
import { Button } from '@components/ui/button';
import { Skeleton } from '@components/ui/skeleton';
import { Spinner } from '@components/ui/spinner';
import { toast } from 'sonner';
import CellValue from '@generated/components/CellValue';
import { withRetry } from '@generated/hooks/useRetry';

export default function GroupTable({ groupId, groupLabel, columns, searchTerm }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refetching, setRefetching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const columnKeys = columns.map(c => c.key);

  const fetchItems = useCallback(async (isRefetch = false) => {
    if (isRefetch) setRefetching(true);
    else setLoading(true);
    try {
      const filter = { group: [groupId] };
      if (searchTerm) filter.name = searchTerm;

      const doFetch = withRetry(async () => {
        const board = new ItProgrammeBoard();
        return board.items()
          .withColumns(columnKeys)
          .where(filter)
          .withPagination({ limit: 10 })
          .execute();
      }, { maxRetries: 4, baseDelay: 2500 });

      const res = await doFetch();
      setItems(res.items || []);
      setCursor(res.cursor || null);
    } catch (e) {
      console.error('Fetch error:', e);
      toast.error('Failed to load data — please try again');
    } finally {
      setLoading(false);
      setRefetching(false);
    }
  }, [groupId, searchTerm, columnKeys]);

  useEffect(() => {
    const timer = setTimeout(() => fetchItems(items.length > 0), 1200);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const doLoad = withRetry(async () => {
        const board = new ItProgrammeBoard();
        return board.items().withPagination({ cursor }).execute();
      }, { maxRetries: 2, baseDelay: 2000 });

      const res = await doLoad();
      setItems(p => [...p, ...(res.items || [])]);
      setCursor(res.cursor || null);
    } catch (e) {
      console.error('Load more error:', e);
      toast.error('Failed to load more');
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return (
    <div className="p-6">
      {[0, 1, 2, 3, 4].map(i => <Skeleton key={i} className="mb-3 h-14 w-full" />)}
    </div>
  );

  if (!items.length) return (
    <div className="p-10 text-center">
      <p className="mono-label text-muted-foreground">
        {searchTerm ? `No results for "${searchTerm}"` : `No items in ${groupLabel}`}
      </p>
    </div>
  );

  return (
    <div className={refetching ? 'opacity-50 transition-opacity' : ''}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-prog-border/30 hover:bg-transparent">
              <TableHead className="mono-label p-4 text-prog-accent/80">Item</TableHead>
              {columns.map(c => (
                <TableHead key={c.key} className="mono-label p-4 text-prog-accent/80">{c.head}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id} className="border-b border-border/50 hover:bg-prog-accent/5">
                <TableCell className="max-w-[260px] truncate p-4 font-semibold text-foreground">
                  {item.name}
                </TableCell>
                {columns.map(c => (
                  <TableCell key={c.key} className="p-4">
                    <CellValue value={item[c.key]} type={c.type} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {refetching && (
        <div className="flex items-center justify-center gap-2 border-t border-border/30 p-3 text-xs text-muted-foreground">
          <Spinner className="size-3" /> Updating results...
        </div>
      )}
      {cursor && (
        <div className="border-t border-prog-border/30 p-4 text-center">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}
            className="border-prog-accent/20 bg-prog-accent/5 text-prog-accent hover:bg-prog-accent/10">
            {loadingMore ? <><Spinner className="mr-2 size-4" /> Loading...</> : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
