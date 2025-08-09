'use client';

import { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';

// Define available icons - only these will be dynamically importable
export const AVAILABLE_ICONS = {
  // Electrical & Technical
  'zap': () => import('lucide-react').then(mod => ({ default: mod.Zap })),
  'plug': () => import('lucide-react').then(mod => ({ default: mod.Plug })),
  'lightbulb': () => import('lucide-react').then(mod => ({ default: mod.Lightbulb })),
  'settings': () => import('lucide-react').then(mod => ({ default: mod.Settings })),
  'wrench': () => import('lucide-react').then(mod => ({ default: mod.Wrench })),
  'cpu': () => import('lucide-react').then(mod => ({ default: mod.Cpu })),
  'power': () => import('lucide-react').then(mod => ({ default: mod.Power })),
  'wifi': () => import('lucide-react').then(mod => ({ default: mod.Wifi })),
  'tools': () => import('lucide-react').then(mod => ({ default: mod.Wrench })),
  
  // Home & Building
  'home': () => import('lucide-react').then(mod => ({ default: mod.Home })),
  'building': () => import('lucide-react').then(mod => ({ default: mod.Building })),
  'warehouse': () => import('lucide-react').then(mod => ({ default: mod.Warehouse })),
  'shield': () => import('lucide-react').then(mod => ({ default: mod.Shield })),
  'lock': () => import('lucide-react').then(mod => ({ default: mod.Lock })),
  'eye': () => import('lucide-react').then(mod => ({ default: mod.Eye })),
  'camera': () => import('lucide-react').then(mod => ({ default: mod.Camera })),
  'construction': () => import('lucide-react').then(mod => ({ default: mod.HardHat })),
  'clean': () => import('lucide-react').then(mod => ({ default: mod.Sparkles })),
  
  // Services & Tools
  'phone': () => import('lucide-react').then(mod => ({ default: mod.Phone })),
  'clock': () => import('lucide-react').then(mod => ({ default: mod.Clock })),
  'star': () => import('lucide-react').then(mod => ({ default: mod.Star })),
  'check': () => import('lucide-react').then(mod => ({ default: mod.Check })),
  'arrow-right': () => import('lucide-react').then(mod => ({ default: mod.ArrowRight })),
  'sun': () => import('lucide-react').then(mod => ({ default: mod.Sun })),
  'battery': () => import('lucide-react').then(mod => ({ default: mod.Battery })),
  'flame': () => import('lucide-react').then(mod => ({ default: mod.Flame })),
  'droplets': () => import('lucide-react').then(mod => ({ default: mod.Droplets })),
  'fan': () => import('lucide-react').then(mod => ({ default: mod.Fan })),
  'support': () => import('lucide-react').then(mod => ({ default: mod.Headphones })),
  'users': () => import('lucide-react').then(mod => ({ default: mod.Users })),
  'trash': () => import('lucide-react').then(mod => ({ default: mod.Trash2 })),
  'cloud': () => import('lucide-react').then(mod => ({ default: mod.Cloud })),
  'refresh': () => import('lucide-react').then(mod => ({ default: mod.RefreshCw })),
  'search': () => import('lucide-react').then(mod => ({ default: mod.Search })),
  'target': () => import('lucide-react').then(mod => ({ default: mod.Target })),
  'move': () => import('lucide-react').then(mod => ({ default: mod.Move })),
  'toggle': () => import('lucide-react').then(mod => ({ default: mod.ToggleLeft })),
  
  // Environment & Energy
  'leaf': () => import('lucide-react').then(mod => ({ default: mod.Leaf })),
  'tree': () => import('lucide-react').then(mod => ({ default: mod.Trees })),
  'recycle': () => import('lucide-react').then(mod => ({ default: mod.Recycle })),
  
  // Additional icons
  'heart': () => import('lucide-react').then(mod => ({ default: mod.Heart })),
} as const;

export type IconName = keyof typeof AVAILABLE_ICONS;

interface DynamicIconProps extends LucideProps {
  name: IconName;
  fallback?: React.ReactNode;
}

// Dynamic icon component that lazy loads icons
function DynamicIconInner({ name, fallback, ...props }: DynamicIconProps) {
  // Create lazy component
  const LazyIcon = lazy(AVAILABLE_ICONS[name]);
  
  return (
    <Suspense fallback={fallback || <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />}>
      <LazyIcon {...props} />
    </Suspense>
  );
}

// Main icon component with error boundary
export function DynamicIcon({ name, fallback, className = "w-5 h-5", ...props }: DynamicIconProps) {
  // Check if icon exists in our registry
  if (!AVAILABLE_ICONS[name]) {
    console.warn(`Icon "${name}" not found in registry. Available icons:`, Object.keys(AVAILABLE_ICONS));
    return fallback || <div className={`bg-slate-200 rounded ${className}`} />;
  }

  try {
    return <DynamicIconInner name={name} fallback={fallback} className={className} {...props} />;
  } catch (error) {
    console.warn(`Failed to load icon "${name}":`, error);
    return fallback || <div className={`bg-slate-200 rounded ${className}`} />;
  }
}

// Helper function to check if an icon is available
export function isIconAvailable(name: string): name is IconName {
  return name in AVAILABLE_ICONS;
}

// Export the icon names for TypeScript autocomplete
export const iconNames = Object.keys(AVAILABLE_ICONS) as IconName[]; 