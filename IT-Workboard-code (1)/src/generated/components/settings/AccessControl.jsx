import { useState, useEffect } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { Skeleton } from '@components/ui/skeleton';
import { Badge } from '@components/ui/badge';

export default function AccessControl() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const board = new ItProgrammeBoard();
        const subs = await board.users.boardSubscribers().execute();
        setUsers(subs || []);
      } catch (e) { console.error('Fetch users error:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="glass-surface p-6">
      {[0, 1, 2, 3].map(i => <Skeleton key={i} className="mb-3 h-12 w-full" />)}
    </div>
  );

  return (
    <div className="glass-surface space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold">Access Control</h3>
        <p className="text-sm text-muted-foreground">ISO 27001 A.9.2 — User Access Management</p>
      </div>

      <div className="space-y-1">
        <span className="mono-label">Board Subscribers ({users.length})</span>
        <p className="text-xs text-muted-foreground">Users with access to IT Programme Board</p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border">
        {users.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-3">
            {user.photo_thumb ? (
              <img src={user.photo_thumb} alt="" className="size-8 rounded-full bg-muted" />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {user.name?.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="outline" className="shrink-0 border-primary/20 bg-primary/10 text-[10px] text-primary">
              Member
            </Badge>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Least Privilege (PoLP):</strong> Access rights reviewed quarterly per ISO 27001 A.9.2.5.
          Contact Sr. IT Admin to modify access levels.
        </p>
      </div>
    </div>
  );
}
