import { useState, useEffect, useCallback } from 'react';
import { storage } from '@skills/monday-storage.jsx';

const KEY = 'tra_it_admin_settings';

const DEFAULTS = {
  classification: 'internal',
  retentionYears: '3',
  reviewCycle: 'quarterly',
  mfaEnforced: true,
  sessionTimeout: '30',
  maxSessions: '3',
  passwordMinLength: '12',
  passwordRotationDays: '90',
  requireComplexPassword: true,
  changeApprovalRequired: true,
  requireProjectOwner: true,
  requireITManager: true,
  requireDGD: false,
  changeFreezePeriod: '',
  emergencyChangeEnabled: true,
  rtoHours: '4',
  rpoHours: '1',
  backupFrequency: 'daily',
  lastAuditDate: '',
  nextAuditDate: '',
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { value, version: v } = await storage().k(KEY).get();
        if (value) setSettings({ ...DEFAULTS, ...value });
        setVersion(v);
      } catch (e) { console.error('Load settings error:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  const update = useCallback(async (key, value) => {
    const next = { ...settings, [key]: value };
    const prev = settings;
    setSettings(next);
    setSaving(true);
    try {
      await storage().k(KEY).v(version).set(next);
      const { version: v } = await storage().k(KEY).get();
      setVersion(v);
    } catch (e) {
      console.error('Save settings error:', e);
      setSettings(prev);
    } finally { setSaving(false); }
  }, [settings, version]);

  return { settings, update, loading, saving };
}
