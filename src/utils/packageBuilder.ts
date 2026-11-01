import { DesignItem, CustomizationConfig } from '../types';
import { SimpleZip, downloadBlob } from './zipGenerator';
import { authService } from '../services/authService';

export function buildDesignZip(design: DesignItem, customConfig?: CustomizationConfig): Blob {
  const zip = new SimpleZip();
  const config = customConfig || design.defaultConfig;
  const isCustomized = !!customConfig;

  // 1. Generate customized CSS variables if applicable
  const customCssVars = `/* UIverse Studio Custom Design Tokens */
:root {
  --uiv-primary: ${config.primaryColor};
  --uiv-secondary: ${config.secondaryColor};
  --uiv-bg: ${config.backgroundColor};
  --uiv-font-family: '${config.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;
  --uiv-font-size-base: ${config.fontSize}px;
  --uiv-radius: ${config.borderRadius}px;
  --uiv-shadow: ${
    config.shadowLevel === 'none'
      ? 'none'
      : config.shadowLevel === 'subtle'
      ? '0 4px 12px rgba(0, 0, 0, 0.2)'
      : config.shadowLevel === 'medium'
      ? '0 8px 24px rgba(0, 0, 0, 0.35)'
      : '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.15)'
  };
  --uiv-speed: ${config.animationSpeed === 'slow' ? '400ms' : config.animationSpeed === 'normal' ? '200ms' : '100ms'};
}
`;

  // 2. HTML entrypoint
  const htmlContent = `<!DOCTYPE html>
<html lang="en" class="${config.themeMode}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${design.name} — UIverse Studio Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fontFamily)}:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body style="background-color: var(--uiv-bg); font-family: var(--uiv-font-family); color: ${config.themeMode === 'dark' ? '#f1f5f9' : '#0f172a'}; margin: 0; padding: 0;">
  <!-- Exported from UIverse Studio (${design.slug}) -->
  <main class="uiv-container">
${design.sourceCode.html}
  </main>
  <script src="script.js"></script>
</body>
</html>
`;

  // 3. CSS stylesheet
  const cssContent = `${customCssVars}

/* Global Reset and Utility Layout */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background-color var(--uiv-speed) ease;
}

.uiv-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${config.spacing === 'compact' ? '1rem' : config.spacing === 'normal' ? '2rem' : '3.5rem'};
}

/* Component Styles */
${design.sourceCode.css}
`;

  // 4. JS Script
  const jsContent = `/**
 * ${design.name}
 * Production script exported from UIverse Studio
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[UIverse Studio] Loaded "${design.name}"');
  ${design.sourceCode.js || '// Interactive event listeners and micro-animations initialized'}
});
`;

  // 5. React Component
  const reactComponent = `import React, { useState } from 'react';
import './styles.css';

/**
 * ${design.name}
 * @category ${design.category}
 * @tech ${design.technology}
 * Exported from UIverse Studio
 */
export default function ${sanitizeComponentName(design.name)}() {
${design.sourceCode.reactJsx || `  return (
    <div className="uiv-wrapper">
      <div className="uiv-card">
        <h2>${config.sampleHeadline || design.name}</h2>
        <p>${design.shortDescription}</p>
        <button className="uiv-btn">${config.sampleButtonText || 'Explore Now'}</button>
      </div>
    </div>
  );`}
}
`;

  // 6. React package.json
  const packageJson = JSON.stringify(
    {
      name: `@uiverse/${design.slug}`,
      version: '1.0.0',
      description: design.shortDescription,
      private: true,
      main: 'src/Component.jsx',
      dependencies: {
        react: '^18.3.0 || ^19.0.0',
        'react-dom': '^18.3.0 || ^19.0.0',
        'lucide-react': '^0.450.0',
      },
    },
    null,
    2
  );

  // 7. README.md
  const readmeContent = `# ${design.name}

> ${design.shortDescription}

Exported from **UIverse Studio** (${isCustomized ? 'Customized Theme' : 'Official Template'}).

- **Category:** ${design.category}
- **Technology:** ${design.technology}
- **License:** ${design.license}
- **Supported Screens:** ${design.supportedScreens.join(', ')}
- **Animation System:** ${design.animationType}

---

## What's Included in This Package

\`\`\`
├── index.html            # Standalone semantic HTML preview
├── style.css             # Theme tokens and responsive CSS
├── script.js             # Client-side JavaScript interactions
├── react/
│   ├── Component.jsx     # Production React component
│   ├── styles.css        # Scoped component styles
│   └── package.json      # Dependencies configuration
├── custom-theme.json     # Editable design tokens
├── README.md             # This documentation
└── LICENSE.txt           # License terms
\`\`\`

---

## Quick Start (HTML / Vanilla CSS)

1. Open \`index.html\` directly in any modern browser.
2. Link \`style.css\` in your project's \`<head>\`.
3. Adjust the CSS variables in the \`:root\` block to tailor colors and spacing.

## React Integration

1. Copy \`react/Component.jsx\` and \`react/styles.css\` into your React/Next.js/Vite project.
2. Install standard peer dependencies:
   \`\`\`bash
   npm install lucide-react
   \`\`\`
3. Import and render the component:
   \`\`\`jsx
   import ${sanitizeComponentName(design.name)} from './Component';

   export default function App() {
     return <${sanitizeComponentName(design.name)} />;
   }
   \`\`\`

---

## Design System Tokens
\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

## Support & Updates
Visit [UIverse Studio](https://uiverse.studio) for more production-ready website UI designs.
`;

  // 8. LICENSE.txt
  const licenseContent = `${design.license === 'MIT' ? `MIT License

Copyright (c) 2026 UIverse Studio & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.` : `UIverse Commercial Studio License

This component package is licensed for use in unlimited commercial and personal
projects, client deliverables, and SaaS products. Redistribution or reselling
the raw source files as an isolated UI kit is strictly prohibited.`}
`;

  // Add files to the archive
  zip.addFile('index.html', htmlContent);
  zip.addFile('style.css', cssContent);
  zip.addFile('script.js', jsContent);
  zip.addFile('react/Component.jsx', reactComponent);
  zip.addFile('react/styles.css', cssContent);
  zip.addFile('react/package.json', packageJson);
  zip.addFile('custom-theme.json', JSON.stringify(config, null, 2));
  zip.addFile('README.md', readmeContent);
  zip.addFile('LICENSE.txt', licenseContent);

  return zip.generateBlob();
}

export function downloadDesignPackage(
  design: DesignItem,
  customConfig?: CustomizationConfig,
  forceBypassAuth = false
) {
  if (!forceBypassAuth && !authService.isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('uiverse-auth-required', { detail: { design, customConfig } })
      );
    }
    throw new Error('AUTH0_LOGIN_REQUIRED');
  }
  const blob = buildDesignZip(design, customConfig);
  const suffix = customConfig ? '-custom' : '';
  const filename = `${design.slug}${suffix}-uiverse.zip`;
  downloadBlob(blob, filename);
}

function sanitizeComponentName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}
