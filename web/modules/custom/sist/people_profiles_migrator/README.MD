# People Profiles Migrator

This module provides migration functionality to import people profiles from XML feeds into Drupal. It includes support for migrating profile data, photos, avatars, and CV documents.

## Dependencies

This module depends on the following modules:
  - migrate
  - migrate_plus
  - migrate_tools
  - migrate_file
  - people_profiles
  - views_data_export

## Features

- **XML Feed Migration**: Import people profiles from external XML data sources
- **Media Migration**: Handles migration of profile photos, avatars, and CV documents
- **URL Processing**: Converts relative URLs to absolute URLs during migration
- **Export View**: Includes a view for exporting people profile data
- **Configuration Form**: Provides administrative interface for setting default people profile pages

## Install

This module should be installed on both, the source and the destination websites. 

To install this module please use the following drush command:

```bash
drush en people_profiles_migrator
```

## Usage

### Running Migrations

The module provides several migration configurations:

1. **Avatar Media Migration** (`ssis_people_avatar_media`)
2. **CV Media Migration** (`ssis_people_cv_media`) 
3. **Photos Media Migration** (`ssis_people_photos_media`)
4. **People Profiles Migration** (`ssis_people_profiles`)

Run migrations using drush:

```bash
# Run all people profile migrations
drush migrate:import --group=ssis_people

# Or run individual migrations
drush migrate:import ssis_people_avatar_media
drush migrate:import ssis_people_cv_media
drush migrate:import ssis_people_photos_media
drush migrate:import ssis_people_profiles
```

### Configuration

Step 1: When installing the module on the source website (the one that provides the XML data feed), please make sure you review the People Profile Feed view that exports the information in an XML structured format. The relative URL for this view initially would be /people_profile_feed.xml.

The Data Export view can be found under *Structure > Views > People Profile Feed*

Step 2: When installing the module on the destination website (the one that imports the profiles), as an administrator, please make sure you go to the /admin/config/people/people-profiles-migrator or /admin/config/people_profiles, to configure the CRON settings and trigger the initial migration:

1. Navigate to the module's configuration page (available in the admin menu)
2. Set up XML feed source as needed for your migration. The format of the URL should be https://source-site-url/people_profile_feed.xml
3. (Optional) Under the **Cron Job Settings** section make sure to check **Enable scheduled migration** option if you would like to schedule an automatic migration scheduled as a Cron job. This will present a dropdown option for selecting the **Migration frequency** by choosign one of the following values: *Every hour*, *Every 6 hours*, *Every 12 hours*, *Daily*, or *Weekly*.
4. Once you are done with the migration configurations click on **Save Configuration** button to save the settings.
5. (Optional) In case you want to test the migration manually, you can click on the **Run All Migrations Now** button under the **Manual Migration Actions** section. In case any of the migrations show error or gets stuck, you can click on the **Reset All Migrations** button


### URL Processing

The module includes a custom process plugin [`RelativeToAbsoluteUrl`](src/Plugin/migrate/process/RelativeToAbsoluteUrl.php) that automatically converts relative URLs to absolute URLs during migration. See [README_URL_PROCESSING.md](README_URL_PROCESSING.md) for detailed information.

### Export Functionality

The module includes a [`people_profile_feed`](config/install/views.view.people_profile_feed.yml) view that allows exporting people profile data, useful for data verification and backup purposes.

## Migration Files

- [`ssis_people_avatar_media.yml`](migrations/ssis_people_avatar_media.yml) - Migrates avatar images
- [`ssis_people_cv_media.yml`](migrations/ssis_people_cv_media.yml) - Migrates CV documents
- [`ssis_people_photos_media.yml`](migrations/ssis_people_photos_media.yml) - Migrates profile photos
- [`ssis_people_profiles.yml`](migrations/ssis_people_profiles.yml) - Migrates people profile content

## Troubleshooting

### Common Migration Issues

1. **File Access Issues**: Ensure the source XML feed URLs are accessible
2. **Media Migration Failures**: Check file permissions and source file availability
3. **Memory Issues**: For large datasets, consider running migrations in batches
4. **Shared Photos**: Multiple people can share the same photo URL. The `ssis_people_photos_media` migration will show some "unprocessed" items for duplicate URLs - this is expected behavior. Only one media entity is created per unique photo URL, and all people profiles sharing that URL will reference the same media entity.

### Useful Drush Commands

```bash
# Check migration status
drush migrate:status

# Check status of the migrations
drush migrate:status --group=ssis_people

# Reset a migration
drush migrate:reset-status migration_id

drush migrate:reset-status ssis_people_avatar_media
drush migrate:reset-status ssis_people_cv_media
drush migrate:reset-status ssis_people_photos_media
drush migrate:reset-status ssis_people_profiles

# Or reset all migrations in the group
drush migrate:reset-status --group=ssis_people

# Rollback a migration
drush migrate:rollback migration_id

# Get detailed migration information
drush migrate:messages migration_id
```

## Uninstall

To uninstall this module please use the following drush command:

```bash
drush pmu people_profiles_migrator
```

**Note**: Before uninstalling, ensure you have backed up any migrated data as needed, as uninstalling may remove migration tracking information.