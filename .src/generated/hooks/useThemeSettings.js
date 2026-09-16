import { useState, useEffect, useCallback } from 'react';
import { storage } from '@skills/monday-storage.jsx';

const DEFAULT_THEME = {
  background: '222 47% 8%',
  foreground: '213 31% 91%',
  card: '222 44% 11%',
  cardForeground: '213 31% 91%',
  popover: '222 44% 11%',
  popoverForeground: '213 31% 91%',
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
  chart5: '330 81% 60%',
  fontHeading: 'Rajdhani',
  fontBody: 'Inter',
  radius: '0.5rem'
};

const STORAGE_KEY = 'it_portfolio_theme_settings';
const STYLE_TAG_ID = 'it-portfolio-dynamic-theme';

export function useThemeSettings() {
  const [settings, setSettings] = useState(DEFAULT_THEME);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const result = await storage().k(STORAGE_KEY).get();
      if (result && result.value) {
        const parsed = typeof result.value === 'string' ? JSON.parse(result.value) : result.value;
        const merged = { ...DEFAULT_THEME, ...parsed };
        setSettings(merged);
        applyTheme(merged);
        setThemeVersion(v => v + 1);
      } else {
        // No saved settings — apply defaults to establish dynamic style tag
        applyTheme(DEFAULT_THEME);
      }
      if (result) setVersion(result.version);
    } catch (err) {
      console.error('Error loading theme settings:', err);
      // Apply defaults on error so the dynamic style tag is still created
      applyTheme(DEFAULT_THEME);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyPreview = useCallback((draftSettings) => {
    applyTheme(draftSettings);
    setThemeVersion(v => v + 1);
  }, []);

  const saveSettings = useCallback(async (newSettings) => {
    try {
      setSaving(true);
      setSettings(newSettings);
      applyTheme(newSettings);
      setThemeVersion(v => v + 1);

      // Save to storage with version for optimistic locking
      if (version != null) {
        await storage().k(STORAGE_KEY).v(version).set(newSettings);
      } else {
        await storage().k(STORAGE_KEY).set(newSettings);
      }
      // Refresh version after save
      const result = await storage().k(STORAGE_KEY).get();
      if (result) setVersion(result.version);
    } catch (err) {
      console.error('Error saving theme settings:', err);
      // Still apply visually even if persist fails
      applyTheme(newSettings);
    } finally {
      setSaving(false);
    }
  }, [version]);

  const resetSettings = useCallback(async () => {
    try {
      setSaving(true);
      setSettings(DEFAULT_THEME);
      applyTheme(DEFAULT_THEME);
      setThemeVersion(v => v + 1);

      if (version != null) {
        await storage().k(STORAGE_KEY).v(version).set(DEFAULT_THEME);
      } else {
        await storage().k(STORAGE_KEY).set(DEFAULT_THEME);
      }
      const result = await storage().k(STORAGE_KEY).get();
      if (result) setVersion(result.version);
    } catch (err) {
      console.error('Error resetting theme settings:', err);
    } finally {
      setSaving(false);
    }
  }, [version]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings, saveSettings, resetSettings, applyPreview,
    loading, saving, themeVersion, DEFAULT_THEME
  };
}

/**
 * Applies theme by injecting/updating a dynamic <style> tag.
 * Uses html:root selector (specificity 0,1,1) to beat both
 * :root (0,1,0) and .dark (0,1,0) in the static CSS.
 */
export function applyTheme(s) {
  let styleEl = document.getElementById(STYLE_TAG_ID);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_TAG_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    html:root, html.dark {
      --background: ${s.background};
      --foreground: ${s.foreground};
      --card: ${s.card};
      --card-foreground: ${s.cardForeground};
      --popover: ${s.popover || s.card};
      --popover-foreground: ${s.popoverForeground || s.cardForeground};
      --primary: ${s.primary};
      --primary-foreground: ${s.primaryForeground};
      --secondary: ${s.secondary};
      --secondary-foreground: ${s.secondaryForeground};
      --muted: ${s.muted};
      --muted-foreground: ${s.mutedForeground};
      --accent: ${s.accent};
      --accent-foreground: ${s.accentForeground};
      --destructive: ${s.destructive};
      --destructive-foreground: 210 40% 98%;
      --border: ${s.border};
      --input: ${s.border};
      --ring: ${s.ring};
      --chart-1: ${s.chart1};
      --chart-2: ${s.chart2};
      --chart-3: ${s.chart3};
      --chart-4: ${s.chart4};
      --chart-5: ${s.chart5};
      --font-heading: '${s.fontHeading}', sans-serif;
      --font-body: '${s.fontBody}', sans-serif;
      --radius: ${s.radius};
    }
  `;

  // Load Google Fonts dynamically
  loadGoogleFont(s.fontHeading);
  loadGoogleFont(s.fontBody);
}

function loadGoogleFont(fontName) {
  if (!fontName) return;
  const id = `gfont-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}
