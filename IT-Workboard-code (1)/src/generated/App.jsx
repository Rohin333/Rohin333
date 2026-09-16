import { useState, useEffect } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Toaster } from '@components/ui/sonner';
import { Search, Settings, Database } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@components/ui/input-group';
import ParticleCanvas from '@generated/components/ParticleCanvas';
import MetricCards from '@generated/components/MetricCards';
import ProgrammeCards from '@generated/components/ProgrammeCards';
import GroupTable from '@generated/components/GroupTable';
import SettingsPanel from '@generated/components/SettingsPanel';
import { GROUPS } from '@generated/config/groupConfig';
import { useDebounce } from '@generated/hooks/useDebounce';
import { withRetry } from '@generated/hooks/useRetry';
import { FadeIn } from '@skills/motion-animations.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState(GROUPS[0].id);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const isSettings = activeTab === 'settings';

  const [boardData, setBoardData] = useState({
    items: [],
    subscribers: [],
    loading: true
  });

  useEffect(() => {
    const load = withRetry(async () => {
      const board = new ItProgrammeBoard();
      const res = await board.items()
        .withColumns(['status'])
        .withPagination({ limit: 500 })
        .execute();
      await new Promise(r => setTimeout(r, 300));
      const subs = await board.users.boardSubscribers().execute();
      return { items: res.items || [], subscribers: subs || [] };
    }, { maxRetries: 3, baseDelay: 2000 });

    load()
      .then(d => setBoardData({ ...d, loading: false }))
      .catch(e => {
        console.error('Dashboard data error:', e);
        setBoardData({ items: [], subscribers: [], loading: false });
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ParticleCanvas />
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 py-6 md:px-8 md:py-10">

        <FadeIn direction="down" distance={15}>
          <header className="mb-10 text-center">
            <div className="inline-flex items-center gap-3 md:gap-5">
              <div className="header-gem header-gem--left" />
              <h1 className="font-[family-name:var(--font-heading)] text-xl font-black tracking-[0.12em] md:text-3xl lg:text-4xl">
                IT Programme Board
              </h1>
              <div className="header-gem header-gem--right" />
            </div>
            <p className="mt-2 text-sm tracking-[0.2em] text-muted-foreground">
              Telecommunications Regulatory Authority — Kingdom of Bahrain
            </p>
          </header>
        </FadeIn>

        {!isSettings && (
          <>
            <MetricCards items={boardData.items} subscribers={boardData.subscribers} loading={boardData.loading} />
            <div className="mt-8">
              <ProgrammeCards items={boardData.items} loading={boardData.loading} onNavigate={setActiveTab} />
            </div>

            <div className="data-vault">
              <div className="data-vault-header">
                <div className="data-vault-corner" />
                <Database className="size-5 text-prog-accent/50" />
                <h2 className="data-vault-title">Data Vault Access</h2>
                <Database className="size-5 text-prog-accent/50" />
                <div className="data-vault-corner" style={{ transform: 'scaleX(-1)' }} />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <TabsList className="flex flex-wrap gap-2.5 overflow-x-auto bg-transparent p-0">
                    {GROUPS.map(g => (
                      <TabsTrigger key={g.id} value={g.id} className="cyber-tab">{g.label}</TabsTrigger>
                    ))}
                    <TabsTrigger value="settings" className="cyber-tab">
                      <Settings className="mr-1.5 inline-block size-3.5" />Admin
                    </TabsTrigger>
                  </TabsList>
                  <InputGroup className="w-full shrink-0 md:w-64">
                    <InputGroupAddon align="inline-start">
                      <Search className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search items..." value={search}
                      onChange={e => setSearch(e.target.value)} className="font-[family-name:var(--font-mono)] text-xs" />
                  </InputGroup>
                </div>

                {GROUPS.map(g => activeTab === g.id ? (
                  <TabsContent key={g.id} value={g.id} className="mt-0">
                    <div className="data-frame">
                      <div className="data-frame-inner">
                        <GroupTable groupId={g.id} groupLabel={g.label} columns={g.columns} searchTerm={debouncedSearch} />
                      </div>
                    </div>
                  </TabsContent>
                ) : null)}
              </Tabs>
            </div>
          </>
        )}

        {isSettings && (
          <Tabs value="settings" onValueChange={setActiveTab}>
            <div className="mb-6">
              <TabsList className="flex flex-wrap gap-2.5 overflow-x-auto bg-transparent p-0">
                {GROUPS.map(g => (
                  <TabsTrigger key={g.id} value={g.id} className="cyber-tab">{g.label}</TabsTrigger>
                ))}
                <TabsTrigger value="settings" className="cyber-tab">
                  <Settings className="mr-1.5 inline-block size-3.5" />Admin
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="settings" className="mt-0"><SettingsPanel /></TabsContent>
          </Tabs>
        )}
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
