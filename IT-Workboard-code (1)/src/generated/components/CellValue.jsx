import { Badge } from '@components/ui/badge';

const B = 'mono-label border-primary/20 bg-primary/10 text-primary';

export default function CellValue({ value, type }) {
  if (value == null || value === '') return '—';
  switch (type) {
    case 'badge':
      return <Badge variant="outline" className={B}>{value}</Badge>;
    case 'people':
      return Array.isArray(value) ? value.map(p => p.name).join(', ') || '—' : '—';
    case 'currency':
      return typeof value === 'number' ? value.toLocaleString() : '—';
    case 'date':
      return value?.toLocaleDateString?.() ?? String(value);
    case 'checkbox':
      return value ? '✓' : '○';
    case 'dropdown':
      return Array.isArray(value) ? value.join(', ') || '—' : '—';
    default:
      return String(value);
  }
}
