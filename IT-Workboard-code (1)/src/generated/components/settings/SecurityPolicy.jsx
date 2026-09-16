import { useSettings } from '@generated/hooks/useSettings';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import { Skeleton } from '@components/ui/skeleton';

export default function SecurityPolicy() {
  const { settings, update, loading } = useSettings();

  if (loading) return <div className="glass-surface p-6"><Skeleton className="h-48 w-full" /></div>;

  return (
    <div className="glass-surface space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold">Security Policy</h3>
        <p className="text-sm text-muted-foreground">ISO 27001 A.9 — Access Control & A.10 — Cryptography</p>
      </div>

      <div className="space-y-4">
        <span className="mono-label">Authentication & Sessions</span>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="pwd-len" className="text-xs text-muted-foreground">Min Password Length</label>
            <Select value={settings.passwordMinLength} onValueChange={v => update('passwordMinLength', v)}>
              <SelectTrigger id="pwd-len"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 Characters</SelectItem>
                <SelectItem value="10">10 Characters</SelectItem>
                <SelectItem value="12">12 Characters (Recommended)</SelectItem>
                <SelectItem value="14">14 Characters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="pwd-rot" className="text-xs text-muted-foreground">Password Rotation</label>
            <Select value={settings.passwordRotationDays} onValueChange={v => update('passwordRotationDays', v)}>
              <SelectTrigger id="pwd-rot"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="60">60 Days</SelectItem>
                <SelectItem value="90">90 Days (ISO Recommended)</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="sess-to" className="text-xs text-muted-foreground">Session Timeout</label>
            <Select value={settings.sessionTimeout} onValueChange={v => update('sessionTimeout', v)}>
              <SelectTrigger id="sess-to"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="60">60 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="max-sess" className="text-xs text-muted-foreground">Max Concurrent Sessions</label>
            <Select value={settings.maxSessions} onValueChange={v => update('maxSessions', v)}>
              <SelectTrigger id="max-sess"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Session</SelectItem>
                <SelectItem value="3">3 Sessions</SelectItem>
                <SelectItem value="5">5 Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <span className="mono-label">Enforcement Controls</span>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Multi-Factor Authentication</p>
            <p className="text-xs text-muted-foreground">Enforce MFA for all board users</p>
          </div>
          <Switch checked={settings.mfaEnforced} onCheckedChange={v => update('mfaEnforced', v)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Complex Password Required</p>
            <p className="text-xs text-muted-foreground">Upper, lower, number, special character</p>
          </div>
          <Switch checked={settings.requireComplexPassword} onCheckedChange={v => update('requireComplexPassword', v)} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Encryption Standards:</strong> AES-256 at rest • TLS 1.3 in transit • RSA-2048 key exchange
        </p>
      </div>
    </div>
  );
}
