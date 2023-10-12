# UCSB Login Page module

This module stylizes the login pages for UCSB websites. It adds a SSO login button and reorganizes the forms based on the CAS module. This module affects the forms hosted on the following URLs (**/user/login**, **/user/register**, and **/user/password**). When CAS module enabled this module will show an option to Log in with UCSB Net ID and password.

## Install

To install this module please use the following drush command

```bash
drush en ucsb_login_page
```

## Uninstall

To uninstall this module please use the following drush command

```bash
drush pmu ucsb_login_page
```