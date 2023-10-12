# UCSB Power BI Module for Drupal 9
_PowerBi/Drupal row-level security integration using Service Principal._

Contents of this file
---------------------

* Introduction
* Requirements
* Installation

Introduction
-----------------

This module integrates with Microsoft Power BI to allow Drupal users to
embed Power BI reports with a new Paragraph type.

Row-level security can be implemented by adding Dataset ID and Role values
to the appropriate field in the Power BI Paragraph. Reports are fetched via
the Service Principal method using the Power BI REST API.

Requirements
-----------------

* In order to access Power BI reports in the Drupal website, a user should be able to login using their UCSBNetID and password.
* Users must contact PBI data owner to request access if they are unable to see the content of a report.
* Users will not have direct access to Power BI and will not sign in to Power BI from Drupal.

Installation
-----------------

**Steps to configure the UCSB Power BI module:**

* Verify CAS module was enabled and configured for UCSB SSO. 
* Enable the UCSB Power BI module at /admin/modules.
* Existing(authenticated) users will be granted the "View Power BI Reports" permission by default when the module is installed.
* Add the permission "View Power BI Reports" to any specific user role(s).
* User allowed to access the reports need to be added to the specific role with "View Power BI Reports" permission.
* Add the Client ID, Tenant ID and Power BI secret at 
  `/admin/config/ucsb_power_bi/ucsb_power_bi`.
* Verify the new Paragraph type is available to content editors
  (e.g. `/admin/structure/paragraphs_type/blade/fields/paragraph.blade.field_columns`).
* Create a page containing the new Power BI Paragraph.

_Please note that you can use the new Power BI field type to add a PBI field to any entity type or entity bundle._

**Steps to uninstall the module:**

* Definitely make a DB backup.
* Remove all Power BI Report fields (field_ucsb_power_bi_report) from your entities.
  (e.g. You will need to delete the PowerBI report field at `/admin/structure/paragraphs_type/ucsb_power_bi/fields` before you can uninstall the module).
* Run cron potentially multiple times (this cleans up the entities) at `/admin/reports/status`.
* It is important, that you no longer have _fields pending deletion_ as a reason for not being able to disable Power BI Report fields (under `/admin/modules/uninstall/`) - if you still have it, try running the cron again.
* Uninstall the UCSB Power BI module now via `/admin/modules/uninstall/` or use `drush pmu ucsb_power_bi`.