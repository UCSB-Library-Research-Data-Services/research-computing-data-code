# Bootstrap 3.4.1 Security Patches & JavaScript Fixes

This directory contains security patches for Bootstrap 3.4.1 CVEs and documentation of JavaScript compatibility fixes.

## Overview

Bootstrap 3.4.1 reached End-of-Life (EOL) in 2024 and contains known security vulnerabilities. These patches provide protection against:

- **CVE-2025-1647**: DOM-based XSS via DOM clobbering in tooltips/popovers
- **CVE-2024-6485**: XSS via unsanitized data-*-text attributes in button states

## Patch Files

### 1. bootstrap-cve-2025-1647.patch.js
**Purpose**: Patches the `sanitizeHtml` function in Bootstrap tooltips and popovers.

**What it does**:
- Creates a sandboxed iframe for HTML parsing
- Implements strict whitelist of allowed HTML tags and attributes
- Removes dangerous patterns (javascript:, data:, on* event handlers)
- Prevents DOM clobbering attacks

**Components affected**: Tooltip, Popover

### 2. bootstrap-cve-2024-6485.patch.js
**Purpose**: Sanitizes button state data attributes before DOM insertion.

**What it does**:
- Overrides Bootstrap's `setState` method in button component
- Escapes HTML entities in all data-*-text attributes
- Uses `.text()` instead of `.html()` to prevent HTML injection
- Maintains Bootstrap's original behavior while adding security

**Components affected**: Button

### 3. bootstrap-runtime-disable.js
**Purpose**: Provides defense-in-depth protection at runtime.

**What it does**:
- Disables tooltip and popover initialization (since this site doesn't use them)
- Monitors DOM for dynamic injection of vulnerable attributes
- Automatically sanitizes or removes dangerous patterns
- Logs security events to console for monitoring

**Components monitored**: Tooltip, Popover, Button, Carousel

## Installation

### Library Definition

The patches are defined in `ucsbweb.libraries.yml`:

```yaml
bootstrap-security-patches:
  version: 1.0
  js:
    js/patches/bootstrap-cve-2025-1647.patch.js: {}
    js/patches/bootstrap-cve-2024-6485.patch.js: {}
    js/patches/bootstrap-runtime-disable.js: {}
  dependencies:
    - core/drupal
    - core/jquery
    - ucsbweb/bootstrap-scripts
```

### Automatic Loading

The patches are automatically attached to the Bootstrap framework via `ucsbweb.info.yml`:

```yaml
libraries-extend:
  bootstrap/framework:
    - 'ucsbweb/bootstrap-scripts'
    - 'ucsbweb/bootstrap-security-patches'
```

This configuration ensures the patches load automatically whenever Bootstrap is loaded on any page, providing site-wide protection without requiring manual library attachment.


## Current Implementation Status

| Component/Module | Location | Vulnerability/Issue | Status | Fix Details |
|------------------|----------|---------------------|--------|-------------|
| **Bootstrap Components (CVE-2025-1647, CVE-2024-6485)** |
| Tooltips | ucsbweb theme | XSS via data-content | ✅ **Patched** | DOM-based XSS sanitization |
| Popovers | ucsbweb theme | XSS via data-content | ✅ **Patched** | DOM-based XSS sanitization |
| Button States | ucsbweb theme | XSS via data-*-text | ✅ **Patched** | HTML entity escaping |
| Carousels | ucsbweb theme | XSS via carousel IDs | ✅ **Hardened** | ID validation + `clean_class` filter |
| **Custom Modules (innerHTML/outerHTML XSS)** |
| CKEditor Icons | `ckeditor_ucsbicon` | innerHTML XSS | ✅ **Fixed** | Replaced with safe DOM methods |
| YouTube Gallery | `ssis_youtube_gallery` | innerHTML XSS | ✅ **Fixed** | Replaced with textContent |
| News Module | `ssis_news` | outerHTML XSS | ✅ **Fixed** | Safe DOM manipulation |
| **JavaScript Compatibility** |
| Jumplink Function | `scripts.js` | jQuery selector error | ✅ **Fixed** | Excluded `href="#/"` from selector |
| YouTube Gallery | Template | jQuery selector error | ✅ **Fixed** | Changed to `href="#"` + `return false;` |

### Security Assessment Summary

✅ **All known vulnerabilities and compatibility issues resolved**

**Protection Layers:**
1. Theme-level patches intercept Bootstrap initialization
2. Runtime monitoring prevents dynamic injection
3. Template-level sanitization for carousels
4. Custom modules use safe DOM methods
5. jQuery selectors exclude problematic patterns

## Maintenance

### When to Update
- New Bootstrap CVEs are discovered
- Bootstrap 4/5 upgrade is planned (patches become unnecessary)

### How to Disable
To temporarily disable patches for testing:

1. Comment out the library in a sub-theme
2. Or, remove from theme's library attachment in `.theme` file
3. Clear caches: `drush cr`

**⚠️ WARNING**: Only disable for testing in development environments!

## Alternative Solutions

### Bootstrap 4/5 Upgrade
- **Benefit**: Modern, supported framework
- **Trade-off**: Major theme refactor required
- **Status**: Recommended long-term solution

### HeroDevs NES (Never-Ending Support)
- **Cost**: $2,000-5,000/year
- **Benefit**: Professional patches maintained by HeroDevs
- **Trade-off**: Ongoing cost vs DIY maintenance

## References

- CVE-2025-1647: https://www.herodevs.com/vulnerability-directory/cve-2025-1647
- CVE-2024-6485: https://www.herodevs.com/vulnerability-directory/cve-2024-6485
- Bootstrap 3 Documentation: https://getbootstrap.com/docs/3.4/
- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
