export interface ManualTestItem {
  id: string;
  category: 'keyboard' | 'screen-reader' | 'zoom' | 'color' | 'forms' | 'media' | 'structure';
  title: string;
  description: string;
  instructions: string[];
  expectedResult: string;
  wcagRef: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeEstimate: string;
}

export const manualChecklist: ManualTestItem[] = [
  {
    id: 'keyboard-1',
    category: 'keyboard',
    title: 'Keyboard Navigation - Tab Order',
    description: 'Ensure all interactive elements are reachable via keyboard',
    instructions: [
      'Press Tab key repeatedly to navigate through the page',
      'Check if focus moves in logical order',
      'Verify all buttons, links, and form fields receive focus',
      'Check if focus indicator is clearly visible'
    ],
    expectedResult: 'All interactive elements are focusable in logical order with visible focus indicator',
    wcagRef: 'WCAG 2.1.1',
    priority: 'critical',
    timeEstimate: '5 minutes'
  },
  {
    id: 'keyboard-2',
    category: 'keyboard',
    title: 'Keyboard Traps',
    description: 'Ensure no keyboard traps exist',
    instructions: [
      'Navigate through page using Tab key',
      'Try to move focus away from each element',
      'Check if any element traps focus (can\'t tab away)',
      'Test Shift+Tab for backward navigation'
    ],
    expectedResult: 'Focus can move freely to all elements without getting trapped',
    wcagRef: 'WCAG 2.1.2',
    priority: 'critical',
    timeEstimate: '5 minutes'
  },
  {
    id: 'screen-reader-1',
    category: 'screen-reader',
    title: 'Screen Reader - Page Title',
    description: 'Verify page has descriptive title',
    instructions: [
      'Check if `<title>` tag is present',
      'Verify title describes page content uniquely',
      'Test with screen reader to hear title announced'
    ],
    expectedResult: 'Page has descriptive title that changes with page content',
    wcagRef: 'WCAG 2.4.2',
    priority: 'high',
    timeEstimate: '3 minutes'
  },
  {
    id: 'screen-reader-2',
    category: 'screen-reader',
    title: 'Screen Reader - Heading Structure',
    description: 'Verify heading hierarchy is logical',
    instructions: [
      'Navigate through headings using screen reader (H key)',
      'Check if headings form logical outline',
      'Verify no skipped heading levels (h1→h2→h3)'
    ],
    expectedResult: 'Headings provide clear document outline with no skipped levels',
    wcagRef: 'WCAG 2.4.6',
    priority: 'high',
    timeEstimate: '5 minutes'
  },
  {
    id: 'zoom-1',
    category: 'zoom',
    title: 'Zoom to 200%',
    description: 'Test page at 200% zoom',
    instructions: [
      'Zoom browser to 200% (Ctrl/Cmd +)',
      'Check if all content remains visible',
      'Verify no horizontal scrolling required',
      'Check if text reflows properly'
    ],
    expectedResult: 'All content is usable at 200% zoom without loss of functionality',
    wcagRef: 'WCAG 1.4.4',
    priority: 'high',
    timeEstimate: '5 minutes'
  },
  {
    id: 'color-1',
    category: 'color',
    title: 'Color Contrast - Manual Check',
    description: 'Verify color contrast for critical elements',
    instructions: [
      'Check text against background colors',
      'Verify link text contrasts sufficiently',
      'Check form input borders/labels',
      'Test with grayscale to ensure meaning not lost'
    ],
    expectedResult: 'All text has sufficient contrast (minimum 4.5:1)',
    wcagRef: 'WCAG 1.4.3',
    priority: 'critical',
    timeEstimate: '10 minutes'
  },
  {
    id: 'forms-1',
    category: 'forms',
    title: 'Form Labels',
    description: 'Verify all form fields have labels',
    instructions: [
      'Click on each form label',
      'Check if corresponding field receives focus',
      'Verify placeholder is not used as label',
      'Check if labels are descriptive'
    ],
    expectedResult: 'All form fields have properly associated labels',
    wcagRef: 'WCAG 3.3.2',
    priority: 'high',
    timeEstimate: '5 minutes'
  },
  {
    id: 'forms-2',
    category: 'forms',
    title: 'Error Identification',
    description: 'Test form error messages',
    instructions: [
      'Submit form with errors',
      'Check if errors are clearly identified',
      'Verify error messages describe the issue',
      'Check if focus moves to error'
    ],
    expectedResult: 'Form errors are clearly identified and described',
    wcagRef: 'WCAG 3.3.1',
    priority: 'high',
    timeEstimate: '5 minutes'
  },
  {
    id: 'media-1',
    category: 'media',
    title: 'Video Captions',
    description: 'Check for captions on videos',
    instructions: [
      'Play any video on page',
      'Check if captions are available',
      'Verify captions are synchronized',
      'Check caption accuracy'
    ],
    expectedResult: 'All videos have synchronized captions',
    wcagRef: 'WCAG 1.2.2',
    priority: 'medium',
    timeEstimate: '5 minutes per video'
  },
  {
    id: 'structure-1',
    category: 'structure',
    title: 'Landmarks',
    description: 'Verify ARIA landmarks are present',
    instructions: [
      'Navigate using screen reader landmarks',
      'Check for main, navigation, search landmarks',
      'Verify landmarks are properly labeled',
      'Ensure no duplicate landmark roles'
    ],
    expectedResult: 'Page has appropriate ARIA landmarks for navigation',
    wcagRef: 'WCAG 1.3.1',
    priority: 'medium',
    timeEstimate: '5 minutes'
  }
];

export function getChecklistByCategory(category?: string): ManualTestItem[] {
  if (category) {
    return manualChecklist.filter(item => item.category === category);
  }
  return manualChecklist;
}

export const categories = [
  { id: 'keyboard', name: 'Keyboard Navigation', icon: '⌨️', color: 'blue' },
  { id: 'screen-reader', name: 'Screen Reader', icon: '🔊', color: 'purple' },
  { id: 'zoom', name: 'Zoom & Reflow', icon: '🔍', color: 'green' },
  { id: 'color', name: 'Color & Contrast', icon: '🎨', color: 'yellow' },
  { id: 'forms', name: 'Forms & Inputs', icon: '📝', color: 'orange' },
  { id: 'media', name: 'Media', icon: '🎬', color: 'red' },
  { id: 'structure', name: 'Page Structure', icon: '🏗️', color: 'indigo' }
];