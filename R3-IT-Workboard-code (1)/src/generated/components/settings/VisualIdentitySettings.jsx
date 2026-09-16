import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@components/ui/tabs';
import { Palette, Type, Layout } from 'lucide-react';
import ColorPickerSection from './ColorPickerSection';
import FontSection from './FontSection';
import ThemePresets from './ThemePresets';

const AVAILABLE_FONTS = [
  'Orbitron', 'Rajdhani', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
  'Raleway', 'Poppins', 'Oswald', 'Source Sans Pro', 'Playfair Display',
  'Ubuntu', 'Merriweather', 'PT Sans', 'Nunito', 'Kanit', 'Rubik', 'Space Mono'
];

export default function VisualIdentitySettings({ draft, updateDraft, themeSettings }) {
  const handleApplyPreset = (colors) => {
    const next = { ...draft, ...colors };
    Object.keys(colors).forEach(key => {
      updateDraft(key, colors[key]);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top-level Tabs for Visual Identity Sub-sections */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Palette className="h-4 w-4 text-primary" />
            Visual Identity & Branding
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Customize theme, typography, and UI layout settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="themes" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 bg-muted/30">
              <TabsTrigger value="themes" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
                <Palette className="h-3 w-3 mr-1.5" />
                Themes
              </TabsTrigger>
              <TabsTrigger value="typography" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
                <Type className="h-3 w-3 mr-1.5" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="colors" className="text-xs uppercase tracking-wider data-[state=active]:bg-primary/20">
                <Layout className="h-3 w-3 mr-1.5" />
                Colors
              </TabsTrigger>
            </TabsList>

            {/* Theme Presets Tab */}
            <TabsContent value="themes" className="space-y-4">
              <ThemePresets onApply={handleApplyPreset} currentDraft={draft} />
            </TabsContent>

            {/* Font Sizing Tab */}
            <TabsContent value="typography" className="space-y-4">
              <FontSection draft={draft} updateDraft={updateDraft} fonts={AVAILABLE_FONTS} />
            </TabsContent>

            {/* Custom Color Picker Tab */}
            <TabsContent value="colors" className="space-y-4">
              <ColorPickerSection draft={draft} updateDraft={updateDraft} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
