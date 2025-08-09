/**
 * Accessibility utilities for testing and keyboard navigation
 */

// Keyboard navigation helper
export const handleKeyNavigation = (
  event: React.KeyboardEvent,
  onEnter?: () => void,
  onSpace?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  switch (event.key) {
    case 'Enter':
      if (onEnter) {
        event.preventDefault();
        onEnter();
      }
      break;
    case ' ':
    case 'Space':
      if (onSpace) {
        event.preventDefault();
        onSpace();
      }
      break;
    case 'Escape':
      if (onEscape) {
        event.preventDefault();
        onEscape();
      }
      break;
    case 'ArrowUp':
      if (onArrowUp) {
        event.preventDefault();
        onArrowUp();
      }
      break;
    case 'ArrowDown':
      if (onArrowDown) {
        event.preventDefault();
        onArrowDown();
      }
      break;
    case 'ArrowLeft':
      if (onArrowLeft) {
        event.preventDefault();
        onArrowLeft();
      }
      break;
    case 'ArrowRight':
      if (onArrowRight) {
        event.preventDefault();
        onArrowRight();
      }
      break;
  }
};

// Focus management helper
export const manageFocus = {
  /**
   * Trap focus within an element
   */
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  /**
   * Get the next focusable element
   */
  getNextFocusableElement: (currentElement: HTMLElement, direction: 'next' | 'previous' = 'next') => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (direction === 'next') {
      return focusableElements[currentIndex + 1] || focusableElements[0];
    } else {
      return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
    }
  },

  /**
   * Focus the first element with an error
   */
  focusFirstError: () => {
    const errorElement = document.querySelector('[aria-invalid="true"], .error, [data-error="true"]') as HTMLElement;
    if (errorElement) {
      errorElement.focus();
      return true;
    }
    return false;
  }
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Color contrast validation
export const checkColorContrast = (foreground: string, background: string): { ratio: number; passes: { AA: boolean; AAA: boolean } } => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);

  if (!fgRgb || !bgRgb) {
    return { ratio: 0, passes: { AA: false, AAA: false } };
  }

  const fgLuminance = getLuminance(fgRgb);
  const bgLuminance = getLuminance(bgRgb);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7
    }
  };
};

// Accessibility testing helpers for development
export const a11yTest = {
  /**
   * Check for missing alt text on images
   */
  checkImages: () => {
    const images = document.querySelectorAll('img');
    const issues: string[] = [];

    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
        issues.push(`Image ${index + 1} is missing alt text`);
      }
    });

    return issues;
  },

  /**
   * Check for proper heading hierarchy
   */
  checkHeadingHierarchy: () => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const issues: string[] = [];
    let lastLevel = 0;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (index === 0 && level !== 1) {
        issues.push('Page should start with an h1');
      }
      
      if (level > lastLevel + 1) {
        issues.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
      }
      
      lastLevel = level;
    });

    return issues;
  },

  /**
   * Check for proper form labels
   */
  checkFormLabels: () => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const issues: string[] = [];

    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      
      if (!hasLabel && input.getAttribute('type') !== 'hidden') {
        issues.push(`Form control ${index + 1} is missing a label`);
      }
    });

    return issues;
  },

  /**
   * Run all accessibility checks
   */
  runAll: () => {
    if (process.env.NODE_ENV === 'development') {
      const issues = [
        ...a11yTest.checkImages(),
        ...a11yTest.checkHeadingHierarchy(),
        ...a11yTest.checkFormLabels()
      ];

      if (issues.length > 0) {
        console.warn('Accessibility issues found:', issues);
      } else {
        console.log('No accessibility issues detected');
      }

      return issues;
    }
    return [];
  }
}; 