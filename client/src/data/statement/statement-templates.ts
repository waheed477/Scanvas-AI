export interface AccessibilityStatement {
  organizationName: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone?: string;
  complianceLevel: 'A' | 'AA' | 'AAA';
  standards: string[];
  partialCompliance?: string[];
  knownIssues?: string[];
  reviewDate: Date;
  lastUpdated: Date;
}

export interface StatementSection {
  title: string;
  content: string;
  order: number;
}

export function generateStatement(data: AccessibilityStatement): StatementSection[] {
  const dateFormat = (date: Date) => date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return [
    {
      title: 'Accessibility Statement',
      content: `We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.`,
      order: 1
    },
    {
      title: 'Conformance Status',
      content: `The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. ${data.websiteUrl} is ${data.partialCompliance ? 'partially' : 'fully'} conformant with WCAG 2.1 Level ${data.complianceLevel}. ${data.partialCompliance ? `Partially conformant means that some parts of the content do not fully conform to the accessibility standard.` : ''}`,
      order: 2
    },
    {
      title: 'Additional Accessibility Considerations',
      content: data.standards.join(', '),
      order: 3
    },
    {
      title: 'Feedback',
      content: `We welcome your feedback on the accessibility of ${data.websiteUrl}. Please let us know if you encounter accessibility barriers:\n\nEmail: ${data.contactEmail}${data.contactPhone ? `\nPhone: ${data.contactPhone}` : ''}`,
      order: 4
    },
    {
      title: 'Technical Specifications',
      content: `Accessibility of ${data.websiteUrl} relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:\n\n- HTML\n- WAI-ARIA\n- CSS\n- JavaScript\n\nThese technologies are relied upon for conformance with the accessibility standards used.`,
      order: 5
    },
    {
      title: 'Assessment Approach',
      content: `${data.organizationName} assessed the accessibility of ${data.websiteUrl} by the following approaches:\n\n- Self-evaluation\n- External evaluation using axe-core accessibility testing engine\n- Manual testing with screen readers and keyboard navigation`,
      order: 6
    },
    {
      title: 'Date',
      content: `This statement was created on ${dateFormat(data.lastUpdated)}.`,
      order: 7
    }
  ];
}

export function getComplianceBadge(level: string): string {
  const badges = {
    'A': 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    'AA': 'https://www.w3.org/WAI/standards-guidelines/wcag/glance/',
    'AAA': 'https://www.w3.org/WAI/standards-guidelines/wcag/'
  };
  return badges[level as keyof typeof badges] || badges['AA'];
}

export const standardOptions = [
  { id: 'wcag21', name: 'WCAG 2.1', description: 'Latest web accessibility standards' },
  { id: 'section508', name: 'Section 508', description: 'US federal procurement standard' },
  { id: 'ada', name: 'ADA', description: 'Americans with Disabilities Act' },
  { id: 'en301549', name: 'EN 301 549', description: 'European accessibility standard' }
];