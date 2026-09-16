import { useState } from 'react';
import { Shield, Users, FileText, AlertTriangle, Settings, Database } from 'lucide-react';
import GeneralSettings from '@generated/components/settings/GeneralSettings';
import SecurityPolicy from '@generated/components/settings/SecurityPolicy';
import AccessControl from '@generated/components/settings/AccessControl';
import AuditCompliance from '@generated/components/settings/AuditCompliance';
import ChangeManagement from '@generated/components/settings/ChangeManagement';
import IncidentResponse from '@generated/components/settings/IncidentResponse';

const SECTIONS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'security', label: 'Security Policy', icon: Shield },
  { id: 'access', label: 'Access Control', icon: Users },
  { id: 'audit', label: 'Audit & Compliance', icon: FileText },
  { id: 'change', label: 'Change Mgmt', icon: Database },
  { id: 'incident', label: 'Incident & DR', icon: AlertTriangle },
];

export default function SettingsPanel() {
  const [section, setSection] = useState('general');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <nav className="glass-surface flex flex-row gap-1 overflow-x-auto p-2 md:w-56 md:shrink-0 md:flex-col md:overflow-visible md:p-3">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all whitespace-nowrap ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'}`}>
              <Icon className="size-4 shrink-0" />
              <span className="font-[family-name:var(--font-body)]">{s.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="min-w-0 flex-1">
        {section === 'general' && <GeneralSettings />}
        {section === 'security' && <SecurityPolicy />}
        {section === 'access' && <AccessControl />}
        {section === 'audit' && <AuditCompliance />}
        {section === 'change' && <ChangeManagement />}
        {section === 'incident' && <IncidentResponse />}
      </div>
    </div>
  );
}
