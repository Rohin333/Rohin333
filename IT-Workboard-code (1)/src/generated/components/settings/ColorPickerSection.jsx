import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';

const COLOR_GROUPS = [
  {
    title: 'Base Colors',
    description: 'Background, text, and surface colors',
    items: [
      { key: 'background', label: 'Background' },
      { key: 'foreground', label: 'Foreground (Text)' },
      { key: 'card', label: 'Card Surface' },
      { key: 'cardForeground', label: 'Card Text' },
    ]
  },
  {
    title: 'Brand Colors',
    description: 'Primary and accent hues',
    items: [
      { key: 'primary', label: 'Primary' },
      { key: 'primaryForeground', label: 'Primary Text' },
      { key: 'accent', label: 'Accent' },
      { key: 'accentForeground', label: 'Accent Text' },
    ]
  },
  {
    title: 'UI Colors',
    description: 'Borders, muted surfaces, and interactive elements',
    items: [
      { key: 'secondary', label: 'Secondary' },
      { key: 'muted', label: 'Muted' },
      { key: 'mutedForeground', label: 'Muted Text' },
      { key: 'border', label: 'Border' },
      { key: 'ring', label: 'Focus Ring' },
      { key: 'destructive', label: 'Destructive' },
    ]
  },
  {
    title: 'Chart Colors',
    description: 'Data visualization palette',
    items: [
      { key: 'chart1', label: 'Chart 1' },
      { key: 'chart2', label: 'Chart 2' },
      { key: 'chart3', label: 'Chart 3' },
      { key: 'chart4', label: 'Chart 4' },
      { key: 'chart5', label: 'Chart 5' },
    ]
  }
];

function hslToHex(hslStr) {
  if (!hslStr) return '#000000';
  const parts = hslStr.trim().split(/\s+/);
  const h = parseFloat(parts[0]) || 0;
  const s = parseFloat(parts[1]) / 100 || 0;
  const l = parseFloat(parts[2]) / 100 || 0;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex) {
  if (!hex) return '0 0% 0%';
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function ColorPickerSection({ draft, updateDraft }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {COLOR_GROUPS.map(group => (
        <Card key={group.title} className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{group.title}</CardTitle>
            <CardDescription className="text-[10px]">{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.items.map(item => (
              <div key={item.key} className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={hslToHex(draft[item.key])}
                    onChange={(e) => updateDraft(item.key, hexToHsl(e.target.value))}
                    aria-label={`Pick color for ${item.label}`}
                    className="w-8 h-8 rounded-md border border-border/60 cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-xs font-medium">{item.label}</Label>
                  <p className="text-[10px] text-muted-foreground font-mono">{draft[item.key]}</p>
                </div>
                <Input
                  value={hslToHex(draft[item.key])}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      updateDraft(item.key, hexToHsl(e.target.value));
                    }
                  }}
                  className="w-24 h-7 text-[10px] font-mono"
                  placeholder="#000000"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export { hslToHex, hexToHsl };
