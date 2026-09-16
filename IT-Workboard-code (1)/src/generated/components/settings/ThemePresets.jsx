import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Check, Monitor, Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '@lib/utils';

const PRESETS = [
  {
    id: 'cyber-blue',
    name: 'Cyber Blue (Default)',
    description: 'Deep metallic blue-dark with glowing cyan accents',
    category: 'Dark',
    colors: {
      background: '222 47% 8%',
      foreground: '213 31% 91%',
      card: '222 44% 11%',
      cardForeground: '213 31% 91%',
      primary: '199 89% 48%',
      primaryForeground: '222 47% 8%',
      secondary: '217 33% 17%',
      secondaryForeground: '213 31% 91%',
      muted: '217 33% 14%',
      mutedForeground: '215 20% 55%',
      accent: '262 83% 58%',
      accentForeground: '222 47% 8%',
      destructive: '0 72% 51%',
      border: '215 28% 20%',
      ring: '199 89% 48%',
      chart1: '199 89% 48%',
      chart2: '262 83% 58%',
      chart3: '142 71% 45%',
      chart4: '38 92% 50%',
      chart5: '330 81% 60%'
    }
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    description: 'Rich purple tones with violet accent highlights',
    category: 'Dark',
    colors: {
      background: '270 40% 7%',
      foreground: '260 20% 92%',
      card: '270 35% 10%',
      cardForeground: '260 20% 92%',
      primary: '270 80% 60%',
      primaryForeground: '270 40% 7%',
      secondary: '270 25% 15%',
      secondaryForeground: '260 20% 92%',
      muted: '270 20% 13%',
      mutedForeground: '260 15% 52%',
      accent: '330 75% 55%',
      accentForeground: '270 40% 7%',
      destructive: '0 72% 51%',
      border: '270 18% 20%',
      ring: '270 80% 60%',
      chart1: '270 80% 60%',
      chart2: '330 75% 55%',
      chart3: '190 70% 50%',
      chart4: '45 85% 55%',
      chart5: '150 60% 45%'
    }
  },
  {
    id: 'emerald-dark',
    name: 'Emerald Dark',
    description: 'Deep forest with vibrant green data accents',
    category: 'Dark',
    colors: {
      background: '160 30% 6%',
      foreground: '150 18% 90%',
      card: '160 28% 9%',
      cardForeground: '150 18% 90%',
      primary: '152 75% 45%',
      primaryForeground: '160 30% 6%',
      secondary: '160 22% 14%',
      secondaryForeground: '150 18% 90%',
      muted: '160 18% 12%',
      mutedForeground: '150 14% 50%',
      accent: '38 80% 55%',
      accentForeground: '160 30% 6%',
      destructive: '0 72% 51%',
      border: '160 16% 18%',
      ring: '152 75% 45%',
      chart1: '152 75% 45%',
      chart2: '38 80% 55%',
      chart3: '199 70% 50%',
      chart4: '330 65% 55%',
      chart5: '270 60% 58%'
    }
  },
  {
    id: 'slate-pro',
    name: 'Slate Professional',
    description: 'Neutral dark grays for a corporate look',
    category: 'Dark',
    colors: {
      background: '220 15% 8%',
      foreground: '220 10% 90%',
      card: '220 13% 11%',
      cardForeground: '220 10% 90%',
      primary: '210 70% 55%',
      primaryForeground: '220 15% 8%',
      secondary: '220 12% 15%',
      secondaryForeground: '220 10% 90%',
      muted: '220 10% 13%',
      mutedForeground: '220 8% 50%',
      accent: '210 70% 55%',
      accentForeground: '220 15% 8%',
      destructive: '0 65% 50%',
      border: '220 10% 18%',
      ring: '210 70% 55%',
      chart1: '210 70% 55%',
      chart2: '38 75% 52%',
      chart3: '152 55% 45%',
      chart4: '330 60% 52%',
      chart5: '270 50% 55%'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Clean light theme with deep blue accents',
    category: 'Light',
    colors: {
      background: '210 40% 98%',
      foreground: '222 47% 11%',
      card: '0 0% 100%',
      cardForeground: '222 47% 11%',
      primary: '210 80% 45%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96%',
      secondaryForeground: '222 47% 11%',
      muted: '210 40% 96%',
      mutedForeground: '215 16% 47%',
      accent: '210 80% 45%',
      accentForeground: '210 40% 98%',
      destructive: '0 72% 51%',
      border: '214 32% 91%',
      ring: '210 80% 45%',
      chart1: '152 60% 42%',
      chart2: '38 92% 50%',
      chart3: '280 60% 55%',
      chart4: '200 80% 50%',
      chart5: '340 65% 55%'
    }
  },
  {
    id: 'warm-dark',
    name: 'Warm Dark',
    description: 'Amber-tinted dark theme with warm tones',
    category: 'Dark',
    colors: {
      background: '30 20% 7%',
      foreground: '35 15% 88%',
      card: '30 18% 10%',
      cardForeground: '35 15% 88%',
      primary: '38 85% 52%',
      primaryForeground: '30 20% 7%',
      secondary: '30 15% 15%',
      secondaryForeground: '35 15% 88%',
      muted: '30 12% 13%',
      mutedForeground: '30 10% 50%',
      accent: '15 75% 55%',
      accentForeground: '30 20% 7%',
      destructive: '0 72% 51%',
      border: '30 12% 18%',
      ring: '38 85% 52%',
      chart1: '38 85% 52%',
      chart2: '15 75% 55%',
      chart3: '152 55% 45%',
      chart4: '199 70% 50%',
      chart5: '330 60% 52%'
    }
  }
];
export default function ThemePresets({ onApply, currentDraft }) {
  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Ready-Made Themes</CardTitle>
          <CardDescription className="text-[10px]">Click a theme to apply it instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESETS.map(preset => {
              const isActive = currentDraft &&
                              currentDraft.primary === preset.colors.primary &&
              currentDraft.background === preset.colors.background;
                return (
                  <button
                  key={preset.id}
                  onClick={() => onApply(preset.colors)}
                    className={cn(
                    "relative p-3 rounded-lg border text-left transition-all hover:scale-[1.02]",
                  isActive ? "border-primary ring-1 ring-primary/30" : "border-border/60 hover:border-primary/40"
                )}
>

                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  {/* Color swatches */}
                  <div className="flex gap-1 mb-2">
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: `hsl(${preset.colors.background})` }} />
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: `hsl(${preset.colors.primary})` }} />
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: `hsl(${preset.colors.accent})` }} />
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: `hsl(${preset.colors.chart1})` }} />
                    <div className="h-6 w-6 rounded" style={{ backgroundColor: `hsl(${preset.colors.chart2})` }} />
                  </div>
                  <p className="text-xs font-semibold text-foreground">{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{preset.description}</p>
                  <Badge variant="outline" className="text-[9px] mt-1.5 border-border/60 px-1.5 py-0">{preset.category}</Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
