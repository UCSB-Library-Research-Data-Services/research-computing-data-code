# Jira Site Monitor

Monitors external webpages referenced by the RCD website and creates a Jira sub-task under `RDS-436` when a page changes.

This script only alerts maintainers. It does not update Drupal automatically.

## Monitored Pages

- [COSL Catalog](https://software.ucsb.edu/software-catalog)
- [COSL Microsoft](https://software.ucsb.edu/software-catalog/microsoft)
- [COSL Adobe](https://software.ucsb.edu/software-catalog/adobe)
- [COSL SAS](https://software.ucsb.edu/software-catalog/sas)
- [COSL Mathematica](https://software.ucsb.edu/software-catalog/mathematica)
- [COSL Matlab](https://software.ucsb.edu/software-catalog/matlab)
- [GRIT Software](https://grit.ucsb.edu/support/software)
- [DREAM Lab](https://www.library.ucsb.edu/dreamlab/desktop-resources)

These are defined in the `URLS` dictionary in `monitor.py`.

## How It Works

1. Fetch HTML for each monitored page.
2. Compute an MD5 hash.
3. Compare against the last saved value in `hashes.json`.
4. If changed, create a Jira sub-task under `RDS-436`.
5. Save latest hashes for the next run.

Only new changes trigger alerts.

## Files

- `monitor.py`: main script
- `hashes.json`: saved page hashes
- `requirements.txt`: Python dependencies
- `.env.example`: environment variable template

## Setup

1. From the `researchdata-ucsb-edu-v01` repository root, enter the monitor folder.

   ```bash
   cd jira-site-monitor
   ```

2. Install dependencies.

   ```bash
   python -m pip install -r requirements.txt
   ```

3. Create a `.env` file (copy from `.env.example`) and fill values.

   ```env
   JIRA_EMAIL=your_email_here
   JIRA_API_TOKEN=your_api_token_here
   ```

   [Creating API Tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

4. Initialize baseline hashes by setting `hashes.json` to:

   ```json
   {}
   ```

5. Run once:

   ```bash
   python monitor.py
   ```

## Run

```bash
python monitor.py
```

From the repository root, this also works:

```bash
python jira-site-monitor/monitor.py
```

Console statuses:

- `FIRST RUN`: no prior hash
- `NO CHANGE`: unchanged page
- `CHANGE DETECTED`: hash changed
- `ERROR`: request or processing failure

## Test vs Production

`monitor.py` flags:

```python
ENABLE_TEST_MODE = False
TEST_FORCE_CHANGE_FOR = "COSL Adobe"
CREATE_REAL_JIRA_ISSUES = True
```

For safe test mode:

```python
ENABLE_TEST_MODE = True
CREATE_REAL_JIRA_ISSUES = False
```

- Simulates a change for `TEST_FORCE_CHANGE_FOR`
- Does not save `hashes.json`
- Does not create Jira issues

For one real Jira integration test:

```python
ENABLE_TEST_MODE = True
CREATE_REAL_JIRA_ISSUES = True
```

Production:

```python
ENABLE_TEST_MODE = False
CREATE_REAL_JIRA_ISSUES = True
```

## Jira Workflow

When `CHANGE DETECTED` appears, a sub-task is created under `RDS-436` with the page name and source URL. Then:

1. Open the Jira sub-task.
2. Review the external page.
3. Decide whether RCD content is impacted.
4. Update the relevant Service or Service2 entry in Drupal if needed.

## Future

- Support additional external webpages beyond the current list.
- Improve change reporting so alerts show what changed and where the change occurred (not just `CHANGE DETECTED`).
