# Jira Site Monitor

Monitors external webpages referenced by the RCD website and creates a Jira sub-task under `RDS-436` when a page changes. The sub-task shows which lines were added and removed.

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
2. Extract the readable text (scripts, styles, and nav/header/footer are stripped).
3. Compute an MD5 hash of the text.
4. Compare against the last saved value in `hashes.json`.
5. If changed, diff against the saved text in `snapshots/` and create a Jira sub-task under `RDS-436` containing the diff.
6. Save the latest hashes and snapshots for the next run.

Only new changes trigger alerts. Long diffs are truncated so tickets stay readable.

## Files

- `monitor.py`: main script
- `hashes.json`: saved page hashes
- `snapshots/`: saved page text used to build diffs (gitignored)
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

3. Copy `.env.example` to a new file named `.env` and fill in your values. Do not edit `.env.example` itself — it is the committed template, while `.env` holds your real credentials and is gitignored.

   ```env
   JIRA_EMAIL=your_email_here
   JIRA_API_TOKEN=your_api_token_here
   ```

   [Creating API Tokens](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)

4. Run once to create the baseline. Every page reports `FIRST RUN` and no tickets are created.

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

- `FIRST RUN`: no prior baseline; snapshot saved, no ticket
- `NO CHANGE`: unchanged page
- `CHANGE DETECTED (+a/-r lines)`: diff printed and included in the Jira sub-task
- `ERROR`: request or processing failure; previous baseline kept

To reset the baseline: delete `snapshots/`, set `hashes.json` to `{}`, and run once.

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

- Simulates a change for `TEST_FORCE_CHANGE_FOR` and prints the resulting diff
- Does not save `hashes.json` or snapshots
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

When `CHANGE DETECTED` appears, a sub-task is created under `RDS-436` with the page name, source URL, and a diff of what changed. Then:

1. Open the Jira sub-task and read the diff.
2. Decide whether RCD content is impacted.
3. Update the relevant Service or Service2 entry in Drupal if needed.

## Future

- Support additional external webpages beyond the current list.
- Optionally watch a specific section of a page (CSS selector per URL) to further cut noise.
