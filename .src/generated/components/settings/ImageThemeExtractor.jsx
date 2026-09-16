import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Separator } from '@components/ui/separator';
import { Upload, Image, Palette, ExternalLink, Sparkles } from 'lucide-react';
import { cn } from '@lib/utils';

const THEME_WEBSITES = [
  { name: 'Realtime Colors', url: 'https://www.realtimecolors.com', description: 'Visualize color palettes on real UI' },
  { name: 'Coolors', url: 'https://coolors.co', description: 'Color palette generator' },
  { name: 'Color Hunt', url: 'https://colorhunt.co', description: 'Curated color palettes' },
  { name: 'Happy Hues', url: 'https://www.happyhues.co', description: 'Curated palette inspiration' },
  { name: 'UI Colors', url: 'https://uicolors.app', description: 'Tailwind CSS color shades' },
  { name: 'Shadcn Themes', url: 'https://ui.shadcn.com/themes', description: 'Official shadcn theme generator' },
  { name: 'Gradient Magic', url: 'https://www.gradientmagic.com', description: 'CSS gradient gallery' },
  { name: 'Muzli Colors', url: 'https://colors.muz.li', description: 'AI color palette generator' },
];

export default function ImageThemeExtractor({ onExtract }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedColors, setExtractedColors] = useState(null);
  const [manualHex, setManualHex] = useState('');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      extractColorsFromImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const extractColorsFromImage = (imageSrc) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colors = extractDominantColors(imageData, size);
      setExtractedColors(colors);
    };
    img.src = imageSrc;
  };

  const extractDominantColors = (data, size) => {
    const buckets = {};
    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / 32) * 32;
      const g = Math.round(data[i + 1] / 32) * 32;
      const b = Math.round(data[i + 2] / 32) * 32;
      const key = `${r},${g},${b}`;
      buckets[key] = (buckets[key] || 0) + 1;
    }

    const sorted = Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([key]) => {
        const [r, g, b] = key.split(',').map(Number);
        return rgbToHsl(r, g, b);
      });

    // Find darkest for background, lightest for foreground
    const byLightness = [...sorted].sort((a, b) => parseFloat(a.split(' ')[2]) - parseFloat(b.split(' ')[2]));
    const darkest = byLightness[0] || '220 25% 8%';
    const lightest = byLightness[byLightness.length - 1] || '210 20% 92%';

    // Most saturated for primary
    const bySaturation = [...sorted].sort((a, b) => parseFloat(b.split(' ')[1]) - parseFloat(a.split(' ')[1]));
    const primary = bySaturation[0] || '199 89% 48%';
    const accent = bySaturation[1] || '262 83% 58%';

    return {
      background: darkest,
      foreground: lightest,
      card: adjustLightness(darkest, 3),
      cardForeground: lightest,
      primary,
      primaryForeground: darkest,
      accent,
      accentForeground: darkest,
      muted: adjustLightness(darkest, 5),
      mutedForeground: adjustLightness(lightest, -35),
      border: adjustLightness(darkest, 10),
      ring: primary,
      chart1: primary,
      chart2: accent,
      chart3: bySaturation[2] || '142 71% 45%',
      chart4: bySaturation[3] || '38 92% 50%',
      chart5: bySaturation[4] || '330 81% 60%'
    };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
  };

  const adjustLightness = (hsl, amount) => {
    const parts = hsl.split(' ');
    const l = Math.max(0, Math.min(100, parseFloat(parts[2]) + amount));
    return `${parts[0]} ${parts[1]} ${l}%`;
  };

  const handleApplyExtracted = () => {
    if (extractedColors) {
      onExtract(extractedColors);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Image to Extract Theme
          </CardTitle>
          <CardDescription className="text-[10px]">
            Upload any image and we'll extract a color palette from it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              "hover:border-primary/50 hover:bg-primary/5",
              imagePreview ? "border-primary/30" : "border-border/60"
            )}
            aria-label="Upload an image to extract theme colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Choose image file"
            />
            {imagePreview ? (
              <div className="space-y-3">
                <img src={imagePreview} alt="Uploaded" className="max-h-40 mx-auto rounded-md object-cover" />
                <p className="text-[10px] text-muted-foreground">Click to replace image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Image className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs text-muted-foreground">Click or drop an image here</p>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, WebP supported</p>
              </div>
            )}
          </button>

          {extractedColors && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Extracted Palette</p>
                <Button size="sm" className="h-7 px-3 text-xs" onClick={handleApplyExtracted}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Apply to Theme
                </Button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {Object.entries(extractedColors).slice(0, 8).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center gap-0.5">
                    <div className="w-8 h-8 rounded-md border border-border/40" style={{ backgroundColor: `hsl(${val})` }} />
                    <span className="text-[8px] text-muted-foreground">{key.slice(0, 5)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme Websites */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme Resources & Generators
          </CardTitle>
          <CardDescription className="text-[10px]">
            Browse free theme websites for inspiration, then copy colors back here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {THEME_WEBSITES.map(site => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-md border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors group"
              >
                <div className="h-7 w-7 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="h-3 w-3 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{site.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{site.description}</p>
                </div>
              </a>
            ))}
          </div>
          <Separator className="my-3" />
          <Alert className="bg-muted/30 border-border/40">
            <AlertDescription className="text-[10px] text-muted-foreground">
              <strong className="text-foreground">Tip:</strong> Visit any of these sites, find a palette you like, 
              then come back and paste the hex colors into the Colors tab. Or take a screenshot of the theme 
              and upload it above to auto-extract colors.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
