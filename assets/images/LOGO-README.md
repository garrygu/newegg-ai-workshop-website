# Newegg Logo Setup

## Instructions

To display the Newegg logo on the registration site:

1. **Obtain the official Newegg logo** from Newegg's brand assets or marketing team
2. **Save the logo** as `newegg-logo.svg` in this directory (`assets/images/`)
3. **Alternative formats**: If you have a PNG version, save it as `newegg-logo.png` and update the image `src` attributes in the HTML files

## Current Implementation

The site is configured to display the Newegg logo in:
- Navigation bar (all pages)
- Footer (all pages)

If the logo file is not found, the site will gracefully fall back to the graduation cap emoji (🎓) icon.

## Logo Specifications

- **Format**: SVG (preferred) or PNG
- **Size**: The logo will be automatically sized to:
  - 32px height in the navigation bar
  - 40px height in the footer
- **Color**: Should work on dark backgrounds (the site uses dark theme)

## Files to Update (if using PNG instead of SVG)

If you use a PNG logo, update the `src` attribute in these files:
- `index.html` (navigation and footer)
- `about.html` (navigation and footer)
- `register.html` (navigation and footer)
- `confirmation.html` (navigation and footer)

Change `assets/images/newegg-logo.svg` to `assets/images/newegg-logo.png`

