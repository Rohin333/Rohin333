import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/ui/select';
import { Label } from '@components/ui/label';
import { Slider } from '@components/ui/slider';
import { Type } from 'lucide-react';

export default function FontSection({ draft, updateDraft, fonts }) {
  if (!draft) return null;
  const radiusValue = parseFloat(draft.radius) || 0.5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Heading Font */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Heading Font</CardTitle>
          <CardDescription className="text-[10px]">Used for titles and headings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={draft.fontHeading} onValueChange={(v) => updateDraft('fontHeading', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select heading font" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(f => (
                <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="p-3 rounded-md bg-muted/50 border border-border/40">
            <p className="text-xl font-bold" style={{ fontFamily: `'${draft.fontHeading}', sans-serif` }}>
              IT Portfolio Hub
            </p>
            <p className="text-sm" style={{ fontFamily: `'${draft.fontHeading}', sans-serif` }}>
              Dashboard Overview
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Body Font */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Body Font</CardTitle>
          <CardDescription className="text-[10px]">Used for all body text and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={draft.fontBody} onValueChange={(v) => updateDraft('fontBody', v)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select body font" />
            </SelectTrigger>
            <SelectContent>
              {fonts.map(f => (
                <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="p-3 rounded-md bg-muted/50 border border-border/40">
            <p className="text-sm" style={{ fontFamily: `'${draft.fontBody}', sans-serif` }}>
              The IT portfolio comprises 45 items with 78% compliance rate.
            </p>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: `'${draft.fontBody}', sans-serif` }}>
              Annual cost: 250,000 BHD • 12 servers tracked
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card className="border-border/60 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Border Radius</CardTitle>
          <CardDescription className="text-[10px]">Controls the roundness of cards and buttons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Slider
              value={[radiusValue * 10]}
              min={0}
              max={15}
              step={1}
              onValueChange={([v]) => updateDraft('radius', `${(v / 10).toFixed(1)}rem`)}
              className="flex-1"
            />
            <span className="text-xs font-mono text-muted-foreground min-w-[4rem] text-right">{draft.radius}</span>
          </div>
          <div className="flex gap-3">
            {[0, 0.25, 0.5, 0.75, 1.0, 1.5].map(v => (
              <button
                key={v}
                onClick={() => updateDraft('radius', `${v}rem`)}
                className="h-10 w-10 bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary font-mono hover:bg-primary/30 transition-colors"
                style={{ borderRadius: `${v}rem` }}
              >
                {v}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
