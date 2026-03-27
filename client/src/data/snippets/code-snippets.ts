export interface CodeSnippet {
  ruleId: string;
  issue: string;
  before: string;
  after: string;
  explanation: string;
  language: 'html' | 'css' | 'javascript';
}

export const codeSnippets: Record<string, CodeSnippet> = {
  'image-alt': {
    ruleId: 'image-alt',
    issue: 'Images missing alt text',
    before: '<img src="logo.png">',
    after: '<img src="logo.png" alt="Company Logo - Homepage">',
    explanation: 'Screen readers announce the alt text, describing the image to visually impaired users.',
    language: 'html'
  },
  'link-name': {
    ruleId: 'link-name',
    issue: 'Links missing discernible text',
    before: '<a href="/products"><div class="icon"></div></a>',
    after: '<a href="/products"><div class="icon"></div>View Products</a>',
    explanation: 'Links must have text that describes their purpose, even if they contain icons.',
    language: 'html'
  },
  'color-contrast': {
    ruleId: 'color-contrast',
    issue: 'Low color contrast',
    before: '.button { background: #f0f0f0; color: #cccccc; }',
    after: '.button { background: #2563eb; color: #ffffff; }',
    explanation: 'Text must have sufficient contrast (4.5:1) against background for readability.',
    language: 'css'
  },
  'heading-order': {
    ruleId: 'heading-order',
    issue: 'Improper heading structure',
    before: '<h1>Main Title</h1>\n<h3>Subtitle</h3>\n<h2>Section</h2>',
    after: '<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Section</h3>',
    explanation: 'Headings must be in sequential order (h1 → h2 → h3) for proper document structure.',
    language: 'html'
  },
  'button-name': {
    ruleId: 'button-name',
    issue: 'Buttons missing accessible name',
    before: '<button><span class="icon"></span></button>',
    after: '<button><span class="icon" aria-hidden="true"></span><span class="sr-only">Close</span></button>',
    explanation: 'Buttons must have an accessible name via text content, aria-label, or aria-labelledby.',
    language: 'html'
  },
  'aria-required-attr': {
    ruleId: 'aria-required-attr',
    issue: 'ARIA required attributes missing',
    before: '<div role="checkbox" aria-checked="false"></div>',
    after: '<div role="checkbox" aria-checked="false" tabindex="0"></div>',
    explanation: 'ARIA roles often require specific attributes to function correctly.',
    language: 'html'
  },
  'duplicate-id': {
    ruleId: 'duplicate-id',
    issue: 'Duplicate ID attributes',
    before: '<div id="header">...</div>\n<div id="header">...</div>',
    after: '<div id="header">...</div>\n<div id="footer">...</div>',
    explanation: 'ID attributes must be unique within the page to avoid conflicts.',
    language: 'html'
  },
  'html-has-lang': {
    ruleId: 'html-has-lang',
    issue: 'HTML tag missing lang attribute',
    before: '<html>',
    after: '<html lang="en">',
    explanation: 'The lang attribute helps screen readers pronounce content correctly.',
    language: 'html'
  }
};

// Generate snippet for unknown issues
export function getSnippetForRule(ruleId: string, violation?: any): CodeSnippet {
  const snippet = codeSnippets[ruleId];
  
  if (snippet) return snippet;
  
  // Generate dynamic snippet based on violation
  if (violation?.nodes?.[0]?.html) {
    const element = violation.nodes[0].html;
    return {
      ruleId,
      issue: violation.help || 'Accessibility issue',
      before: element,
      after: `<!-- Fix: Add appropriate accessibility attributes -->
${element.replace(/(<[a-z0-9]+)/, '$1 aria-label="Descriptive label"')}`,
      explanation: 'Add proper ARIA attributes or semantic HTML to resolve this issue.',
      language: 'html'
    };
  }
  
  return {
    ruleId,
    issue: 'Accessibility issue',
    before: '<!-- Original code -->',
    after: '<!-- Fixed code with accessibility improvements -->',
    explanation: 'Review the element and add proper accessibility attributes.',
    language: 'html'
  };
}