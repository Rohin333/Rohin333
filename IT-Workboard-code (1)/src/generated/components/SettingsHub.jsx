import { useState } from 'react';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Settings, FileText, DollarSign, RefreshCw } from 'lucide-react';
import { FadeIn } from '@skills/motion-animations.jsx';
import TRALogo from '@generated/components/TRALogo';

export default function SettingsHub({ items, loading, aggregates, onRefresh }) {
  const [activeSection, setActiveSection] = useState('overview');
  const totals = aggregates?.totals || {};
  const counts = aggregates?.counts || {};
  const rates = aggregates?.rates || {};

  const budgetItems = items.filter(i => i.group?.id === 'group_mm43t82');
  const approvedItems = items.filter(i => i.approved);

  return (
    <div className="relative space-y-5 z-10">
      <FadeIn direction="down" distance={10}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
              Settings Hub
            </h2>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm"
            className="text-xs border-primary/30 text-primary hover:bg-primary/10 h-8 px-3">
            <RefreshCw className="h-3 w-3 mr-1.5" /> Refresh
          </Button>
        </div>
      </FadeIn>

      {/* Section Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['overview', 'budget', 'approvals'].map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`text-[11px] uppercase tracking-[0.1em] px-4 py-2 border font-[family-name:var(--font-heading)] font-medium transition-colors ${
              activeSection === s
                ? 'border-primary/40 text-primary bg-primary/5'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-border'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && (
        <FadeIn>
          <div className="space-y-4">
            <div className="border border-primary/15 bg-card/50 p-5 flex items-center gap-4">
              <TRALogo size={56} />
              <div>
                <h3 className="text-base font-[family-name:var(--font-heading)] font-semibold text-foreground uppercase tracking-wide">
                  IT Programme Board
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Telecommunications Regulatory Authority · Kingdom of Bahrain
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {totals.totalItems || 0} total items · {counts.doneCount || 0} completed · {rates.completionRate || 0}% overall progress
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="border border-border bg-card/40 p-4">
                <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-primary">
                  {totals.totalAnnualCost ? `${(totals.totalAnnualCost/1000).toFixed(0)}K` : '0'}
                </p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Annual Budget (BHD)</p>
              </div>
              <div className="border border-border bg-card/40 p-4">
                <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{totals.totalEstimatedHours || 0}</p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Estimated Hours</p>
              </div>
              <div className="border border-border bg-card/40 p-4">
                <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{counts.projectCount || 0}</p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Projects</p>
              </div>
              <div className="border border-border bg-card/40 p-4">
                <p className="text-2xl font-[family-name:var(--font-heading)] font-semibold text-foreground">{counts.operationalCount || 0}</p>
                <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mt-1">Operational</p>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {activeSection === 'budget' && (
        <FadeIn>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
                Budget Items
              </h3>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary ml-auto">{budgetItems.length}</Badge>
            </div>
            <div className="border border-border divide-y divide-border/40">
              {budgetItems.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No budget items found</p>
              ) : (
                budgetItems.map(item => (
                  <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px] gap-2 px-3 py-2.5 items-center hover:bg-primary/5 transition-colors">
                    <span className="text-xs text-foreground truncate">{item.name}</span>
                    <span className="text-xs text-primary font-medium">{item.annualCostBhd ? `${(item.annualCostBhd/1000).toFixed(0)}K` : '—'}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{item.budgetCategories || '—'}</span>
                    <span className="text-[10px] text-muted-foreground">{item.paymentStatus || '—'}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeIn>
      )}

      {activeSection === 'approvals' && (
        <FadeIn>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-[family-name:var(--font-heading)] font-semibold text-primary uppercase tracking-wider">
                Approval Status
              </h3>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary ml-auto">{approvedItems.length} approved</Badge>
            </div>
            <div className="border border-border divide-y divide-border/40">
              {items.filter(i => i.paymentStatus || i.approved || i.projectOwnerApproval || i.itManagerApproval).slice(0, 15).map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_55px_55px_55px_90px] gap-2 px-3 py-2.5 items-center hover:bg-primary/5 transition-colors">
                  <span className="text-xs text-foreground truncate">{item.name}</span>
                  <span className={`text-[9px] font-medium ${item.projectOwnerApproval ? 'text-primary' : 'text-muted-foreground/50'}`}>
                    {item.projectOwnerApproval ? '✓ PO' : '— PO'}
                  </span>
                  <span className={`text-[9px] font-medium ${item.itManagerApproval ? 'text-primary' : 'text-muted-foreground/50'}`}>
                    {item.itManagerApproval ? '✓ IT' : '— IT'}
                  </span>
                  <span className={`text-[9px] font-medium ${item.dgdApproval ? 'text-primary' : 'text-muted-foreground/50'}`}>
                    {item.dgdApproval ? '✓ DG' : '— DG'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.paymentStatus || '—'}</span>
                </div>
              ))}
              {items.filter(i => i.paymentStatus || i.approved).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">No approval data</p>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
