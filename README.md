# UCSB Web Theme Upstream for Drupal 10 websites using Pantheon's Integrated Composer.

This is a collaborative effort from Information Technology Services (ITS) and the Office of Public Affairs & Communications (OPAC) to bring the campus one unified CMS template.

We used Pantheon's recommended starting point for forking new Drupal upstreams that work with the Platform's Integrated Composer build process. The custom upstream includes the UCSB's Web theme and several custom modules.

To get started, there are accounts and tools that require registration prior to getting started.

### You will need:

* A GitHub account connected to the [UCSB organization](https://github.com/ucsb/github-guide) if you plan on contributing to this upstream.

* A Pantheon account setup using the EDU pathway during [registration](https://pantheon.io/register).

* [Terminus, the Pantheon command line tool](https://pantheon.io/docs/terminus/install/) (recommended for developers)

* The codebase uses a CSS-preprocessor called Sass for our styles. We recommend all style changes be made using SASS and are compiled accordingly.

* We use a custom development workflow while implementing new features for the upstream. Please contact us to request more information.
<br />

### About the new upstream:

* Pantheon will automatically run composer. The build results are added to your repository as a tag; they are not pushed to your development branch. When you update a site from the dashboard, Pantheon will both update the git repository from the upstream and then run Composer to get any updates to core, modules or themes.

* You generally do not need to update core in the custom upstream any longer. Pantheon / Composer will update core when there are new versions available, without requiring changes to the upstream.

* Do not attempt to require a different set of modules on different sites. This use case does not work well with Composer, which is designed to manage dependencies for a single application. Instead, include the superset of modules needed in the upstream, and only enable the ones that are needed on any given site.

### Project Structure:

* DOCS contains the main directories and files in this repository. You can start with DOCS/DEVS/00_GETTING_STARTED.md file and proceed in numerical order.
* Now move forward to the files in DOCS/PAGES and feel free to explore the rest of the repository.
