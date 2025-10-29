# Bootstrap 3.4.1 Security Patches

This directory contains security patches for known CVEs in Bootstrap 3.4.1.

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

These patches are automatically loaded via the `ucsbweb.libraries.yml` file:

```yaml
bootstrap-security-patches:
  version: 1.0
  js:
    js/patches/bootstrap-cve-2025-1647.patch.js: { weight: -10 }
    js/patches/bootstrap-cve-2024-6485.patch.js: { weight: -10 }
    js/patches/bootstrap-runtime-disable.js: { weight: -9 }
  dependencies:
    - ucsbweb/bootstrap
    - core/drupal
    - core/jquery
```

The patches load with negative weight to ensure they execute before Bootstrap components are initialized.

## Security Impact

### Without Patches
- 🚨 Tooltips/popovers vulnerable to XSS via malicious data-content/data-title
- 🚨 Buttons vulnerable to XSS via data-loading-text and similar attributes
- 🚨 DOM clobbering can bypass Bootstrap's built-in sanitization
- 🚨 Carousel IDs vulnerable to XSS injection
- 🚨 Custom modules vulnerable to innerHTML/outerHTML XSS

### With Patches
- ✅ Tooltips/popovers sanitize HTML before insertion
- ✅ Button state text is HTML-escaped
- ✅ Runtime monitoring prevents dynamic injection
- ✅ Carousel IDs validated and sanitized
- ✅ Custom module XSS vulnerabilities fixed
- ✅ Defense-in-depth: multiple layers of protection

## Current Implementation Status

Based on security audit and fixes applied (as of 2025-10-28):

| Component/Module | Location | Vulnerability | Risk Level | Status | Fix Details |
|------------------|----------|---------------|------------|--------|-------------|
| **Bootstrap Components (CVE-2025-1647, CVE-2024-6485)** |
| Tooltips | ucsbweb theme | XSS via data-content | High | ✅ **Patched** | DOM-based XSS sanitization |
| Popovers | ucsbweb theme | XSS via data-content | High | ✅ **Patched** | DOM-based XSS sanitization |
| Button States | ucsbweb theme | XSS via data-*-text | High | ✅ **Patched** | HTML entity escaping |
| Carousels | ucsbweb theme | XSS via carousel IDs | Medium | ✅ **Hardened** | ID validation + `clean_class` filter<br>Commit: `b235f54` |
| **Custom Modules (innerHTML/outerHTML XSS)** |
| CKEditor Icons | `ckeditor_ucsbicon` | innerHTML XSS (4 instances) | High | ✅ **Fixed** | Replaced innerHTML with safe DOM methods<br>Commit: `f863d7f` |
| YouTube Gallery | `ssis_youtube_gallery` | innerHTML XSS (3 instances) | High | ✅ **Fixed** | Replaced innerHTML with textContent<br>Commit: `ccd49f6` |
| News Module | `ssis_news` | outerHTML XSS (unsafe concatenation) | Critical | ✅ **Fixed** | Safe DOM manipulation methods<br>Commit: `571c05a` |
| Sidebar Navigation | `ssis_sidebar_nav` | Collapse component usage | Low | ✅ **Safe** | No user input, safe implementation |

### Security Assessment Summary

✅ **All known vulnerabilities have been addressed**

**Bootstrap CVE Protection:**
1. Theme-level patches intercept Bootstrap component initialization
2. Runtime monitoring prevents dynamic injection attempts
3. Template-level sanitization for carousels
4. Defense-in-depth: multiple protection layers

**Custom Module XSS Protection:**
1. All innerHTML/outerHTML usage replaced with safe DOM methods
2. User input properly escaped before DOM insertion
3. Carousel IDs validated before Bootstrap initialization
4. No remaining unsafe string concatenation patterns

**Coverage:**
- ✅ Theme components protected via patches
- ✅ Custom modules audited and fixed
- ✅ Sub-themes inherit protection via theme inheritance
- ✅ All pages protected via `hook_page_attachments()`

## Maintenance

### When to Update
- New Bootstrap CVEs are discovered
- HeroDevs releases updated patches (if monitoring their solutions)
- Bootstrap 4/5 upgrade is planned (patches become unnecessary)

### How to Disable
To temporarily disable patches for testing:

1. Comment out the library in a sub-theme
2. Or, remove from theme's library attachment in `.theme` file
3. Clear caches: `drush cr`

**⚠️ WARNING**: Only disable for testing in development environments!

### Future CVEs
If new CVEs are discovered:

1. Create new patch file: `bootstrap-cve-XXXX-XXXX.patch.js`
2. Add to `ucsbweb.libraries.yml`
3. Update this README
4. Test thoroughly
5. Clear caches

## Alternative Solutions

### HeroDevs NES (Never-Ending Support)
- **Cost**: $2,000-5,000/year (estimated)
- **Benefit**: Professional patches maintained by HeroDevs
- **Trade-off**: Ongoing cost vs DIY maintenance

### Bootstrap 4/5 Upgrade
- **Cost**: Significant development time
- **Benefit**: Modern, supported framework
- **Trade-off**: Major theme refactor required
- **Status**: Recommended long-term solution

### Accept Risk + Defense-in-Depth
- **Cost**: Free (current approach)
- **Benefit**: Components not used = no attack surface
- **Trade-off**: Library contains vulnerabilities even if unexploitable
- **Mitigation**: CSP headers + these patches + runtime monitoring

## Compliance & Audit Trail

**Risk Assessment Date**: January 28, 2025  
**Scan Results**: No vulnerable component usage found in custom themes  
**Mitigation Strategy**: DIY patches + runtime monitoring + defense-in-depth  
**Residual Risk**: Low (vulnerabilities exist but not exploitable)

## Support & Questions

For questions or issues:
1. Check console for error messages
2. Review test page results
3. Verify patches are loading (check Network tab in DevTools)
4. Consult `BOOTSTRAP_CVE_PATCHES.md` in theme root for more details

## References

- CVE-2025-1647: https://www.herodevs.com/vulnerability-directory/cve-2025-1647
- CVE-2024-6485: https://www.herodevs.com/vulnerability-directory/cve-2024-6485
- Bootstrap 3 Documentation: https://getbootstrap.com/docs/3.4/
- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
