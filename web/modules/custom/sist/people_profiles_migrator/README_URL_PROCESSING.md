# Dynamic URL Processing for File Imports

## Overview

This implementation adds dynamic URL processing to the SSIS people migrator, allowing relative file URLs from the XML feed to be automatically combined with the base URL from the migration source configuration.

## Problem Solved

Previously, file imports in the migration required absolute URLs. If the XML feed contained relative paths (e.g., `images/photo.jpg`), the `file_import` plugin would fail because it couldn't locate the files. This implementation dynamically combines relative paths with the base URL extracted from the migration source.

## Implementation

### 1. Custom Process Plugin

**File:** `src/Plugin/migrate/process/RelativeToAbsoluteUrl.php`

This plugin:
- Extracts the base URL from the migration source configuration
- Supports both static YAML URLs and dynamic URLs set via the admin form
- Combines relative paths with the base URL to create absolute URLs
- Handles various URL formats and edge cases
- Passes through already absolute URLs unchanged

### 2. Updated Migration Files

The following migration files have been updated to use the new plugin:

- `migrations/ssis_people_cv_media.yml`
- `migrations/ssis_people_photos_media.yml` 
- `migrations/ssis_people_avatar_media.yml`

Each now includes the `relative_to_absolute_url` plugin before `file_import`:

```yaml
field_media_image:
  - plugin: relative_to_absolute_url
    source: uri
  - plugin: file_import
```

## How It Works

1. **URL Source Detection**: The plugin first checks if an external URL is configured via the admin form (`people_profiles.settings.ssis_external_source_url`)
2. **Fallback to Migration Config**: If no external URL is set, it uses the URLs from the migration's source configuration
3. **Base URL Extraction**: It extracts the base URL (scheme + host + port) from the full source URL
4. **URL Combination**: It combines the base URL with the relative path, handling leading/trailing slashes properly

## Examples

### Before (Static URL Required)
```xml
<person>
  <uri>/files/absolute/path/to/photo.jpg</uri>
</person>
```

### After (Relative URLs Supported)
```xml
<person>
  <uri>images/photo.jpg</uri>
</person>
```

With source URL `https://staff.test/people_profile_feed.xml`, the relative path `images/photo.jpg` becomes `https://staff.test/images/photo.jpg`.

## Configuration

### Via Admin Form
Set a custom source URL in the people profiles admin form:
- Navigate to the people profiles configuration
- Enter the external source URL
- The plugin will automatically extract the base URL from this setting

### Via YAML (Static)
The plugin reads the base URL from the migration's source configuration:
```yaml
source:
  urls:
    - 'https://staff.test/people_profile_feed.xml'
```

## Edge Cases Handled

1. **Already Absolute URLs**: Passed through unchanged
2. **Empty Values**: Skipped without processing
3. **Malformed URLs**: Gracefully handled with fallbacks
4. **Different Port Numbers**: Properly preserved in base URL
5. **Leading/Trailing Slashes**: Normalized during combination

## Testing

The plugin includes comprehensive URL handling logic that has been tested with various scenarios:

- Standard HTTPS URLs
- Custom port numbers
- URLs with query parameters
- Mixed relative/absolute path formats

## Benefits

1. **Flexibility**: Supports both relative and absolute URLs in source data
2. **Configuration**: Works with both static YAML configuration and dynamic admin settings
3. **Robustness**: Handles various URL formats and edge cases
4. **Backward Compatibility**: Existing absolute URLs continue to work unchanged
5. **Maintainability**: Centralized URL processing logic that's easy to modify

## Future Enhancements

Potential improvements could include:
- Caching of base URL extraction for performance
- Support for multiple base URL configurations per migration
- Custom URL transformation rules
- Enhanced logging for debugging URL processing issues