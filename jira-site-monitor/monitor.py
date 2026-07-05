import difflib
import hashlib
import json
import os
import re
import sys

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from requests.auth import HTTPBasicAuth

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(SCRIPT_DIR, ".env"))

URLS = {
    "COSL Catalog": "https://software.ucsb.edu/software-catalog",
    "COSL Microsoft": "https://software.ucsb.edu/software-catalog/microsoft",
    "COSL Adobe": "https://software.ucsb.edu/software-catalog/adobe",
    "COSL SAS": "https://software.ucsb.edu/software-catalog/sas",
    "COSL Mathematica": "https://software.ucsb.edu/software-catalog/mathematica",
    "COSL Matlab": "https://software.ucsb.edu/software-catalog/matlab",
    "GRIT Software": "https://grit.ucsb.edu/support/software",
    "DREAM Lab": "https://www.library.ucsb.edu/dreamlab/desktop-resources"
}

HASH_FILE = os.path.join(SCRIPT_DIR, "hashes.json")
SNAPSHOT_DIR = os.path.join(SCRIPT_DIR, "snapshots")

# Bump when fetching/extraction changes in a way that invalidates saved state.
# Old state is discarded and every page re-baselines on the next run instead
# of producing one round of bogus "everything changed" tickets.
STATE_VERSION = 2

# Caps for the diff embedded in Jira tickets and printed to the console.
# Jira Cloud rejects descriptions past ~32k characters.
MAX_DIFF_LINES = 150
MAX_DIFF_CHARS = 6000

# Testing controls
ENABLE_TEST_MODE = False
TEST_FORCE_CHANGE_FOR = "COSL Adobe"

# Real Jira creation
CREATE_REAL_JIRA_ISSUES = True

# Jira config
JIRA_URL = "https://ucsb-atlas.atlassian.net"
JIRA_EMAIL = os.getenv("JIRA_EMAIL")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_PROJECT_KEY = "RDS"
JIRA_PARENT_KEY = "RDS-436"


def load_hashes():
    if not os.path.exists(HASH_FILE):
        return {}
    with open(HASH_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict) or data.get("_version") != STATE_VERSION:
        return {}
    pages = data.get("pages")
    return pages if isinstance(pages, dict) else {}


def save_hashes(hashes):
    with open(HASH_FILE, "w", encoding="utf-8") as f:
        json.dump({"_version": STATE_VERSION, "pages": hashes}, f,
                  indent=2, sort_keys=True)


def snapshot_path(name):
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return os.path.join(SNAPSHOT_DIR, slug + ".txt")


def load_snapshot(name):
    path = snapshot_path(name)
    if not os.path.exists(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def save_snapshot(name, text):
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)
    with open(snapshot_path(name), "w", encoding="utf-8") as f:
        f.write(text)


def extract_text(html):
    """Reduce a page to readable text, one line per fragment, so hashes and
    diffs react to content edits rather than script tokens or menu tweaks."""
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript", "template",
                     "nav", "header", "footer"]):
        tag.decompose()

    main = soup.find("main")
    target = main if main and main.get_text(strip=True) else (soup.body or soup)

    lines = []
    for raw_line in target.get_text("\n").splitlines():
        line = " ".join(raw_line.split())
        if line:
            lines.append(line)
    return "\n".join(lines)


def fetch_page_text(name, url):
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    text = extract_text(response.text)
    if not text:
        raise ValueError("page fetched but no readable text extracted")

    if ENABLE_TEST_MODE and name == TEST_FORCE_CHANGE_FOR:
        text += "\nFAKE_TEST_CHANGE injected by test mode"

    return text


def build_diff(old_text, new_text):
    diff_lines = list(difflib.unified_diff(
        old_text.splitlines(),
        new_text.splitlines(),
        fromfile="previous content",
        tofile="current content",
        lineterm="",
        n=2,
    ))
    added = sum(1 for line in diff_lines
                if line.startswith("+") and not line.startswith("+++"))
    removed = sum(1 for line in diff_lines
                  if line.startswith("-") and not line.startswith("---"))
    return added, removed, "\n".join(diff_lines)


def truncate_diff(diff_text):
    lines = diff_text.splitlines()
    kept = lines[:MAX_DIFF_LINES]
    text = "\n".join(kept)
    if len(text) > MAX_DIFF_CHARS:
        cut = text.rfind("\n", 0, MAX_DIFF_CHARS)
        text = text[:cut] if cut > 0 else text[:MAX_DIFF_CHARS]
        kept = text.splitlines()
    hidden = len(lines) - len(kept)
    if hidden > 0:
        text += f"\n... truncated, {hidden} more diff line(s) not shown ..."
    return text


def adf_paragraph(text):
    return {"type": "paragraph", "content": [{"type": "text", "text": text}]}


def build_description(page_url, added, removed, diff_text):
    content = [
        adf_paragraph("Automated monitoring detected a content change."),
        {
            "type": "paragraph",
            "content": [
                {"type": "text", "text": "Source page: "},
                {
                    "type": "text",
                    "text": page_url,
                    "marks": [{"type": "link", "attrs": {"href": page_url}}],
                },
            ],
        },
    ]

    if diff_text:
        content.append(adf_paragraph(
            f"What changed ({added} line(s) added, {removed} removed; "
            "'+' lines are new, '-' lines were removed):"
        ))
        content.append({
            "type": "codeBlock",
            "attrs": {"language": "diff"},
            "content": [{"type": "text", "text": truncate_diff(diff_text)}],
        })
    else:
        content.append(adf_paragraph(
            "No previous snapshot was available, so the exact difference "
            "could not be shown. Future changes to this page will include "
            "a diff."
        ))

    content.append(adf_paragraph(
        "Please review and update the RCD website if needed."))

    return {"type": "doc", "version": 1, "content": content}


def create_jira_subtask(page_name, page_url, added=None, removed=None,
                        diff_text=None):
    if added is not None:
        summary = f"Change detected: {page_name} (+{added}/-{removed} lines)"
    else:
        summary = f"Change detected: {page_name}"

    payload = {
        "fields": {
            "project": {"key": JIRA_PROJECT_KEY},
            "parent": {"key": JIRA_PARENT_KEY},
            "summary": summary,
            "issuetype": {"name": "Sub-task"},
            "description": build_description(page_url, added, removed,
                                             diff_text),
        }
    }

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{JIRA_URL}/rest/api/3/issue",
        headers=headers,
        auth=HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN),
        data=json.dumps(payload),
        timeout=30,
    )

    return response.status_code, response.text


def main():
    # Never crash on odd characters when output is redirected to a log file
    if sys.stdout and hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(errors="replace")

    print("RUNNING MONITOR")
    print("ENABLE_TEST_MODE =", ENABLE_TEST_MODE)
    if ENABLE_TEST_MODE:
        print("TEST_FORCE_CHANGE_FOR =", TEST_FORCE_CHANGE_FOR)
    print("CREATE_REAL_JIRA_ISSUES =", CREATE_REAL_JIRA_ISSUES)
    print("-" * 40)

    old_hashes = load_hashes()
    new_hashes = {}
    new_snapshots = {}

    for name, url in URLS.items():
        try:
            text = fetch_page_text(name, url)
            current_hash = hashlib.md5(text.encode("utf-8")).hexdigest()
            new_hashes[name] = current_hash
            old_text = load_snapshot(name)

            if name not in old_hashes:
                print(f"{name}: FIRST RUN (baseline saved, no ticket)")
                new_snapshots[name] = text

            elif old_hashes[name] == current_hash:
                print(f"{name}: NO CHANGE")
                if old_text is None:
                    new_snapshots[name] = text

            else:
                new_snapshots[name] = text
                if old_text is not None:
                    added, removed, diff_text = build_diff(old_text, text)
                else:
                    added = removed = diff_text = None

                if diff_text:
                    print(f"{name}: CHANGE DETECTED "
                          f"(+{added}/-{removed} lines)")
                    for line in truncate_diff(diff_text).splitlines():
                        print(f"    {line}")
                else:
                    print(f"{name}: CHANGE DETECTED "
                          "(no previous snapshot, diff unavailable)")

                if CREATE_REAL_JIRA_ISSUES:
                    status_code, response_text = create_jira_subtask(
                        name, url, added, removed, diff_text)
                    if status_code in (200, 201):
                        try:
                            issue_key = json.loads(response_text).get("key")
                        except ValueError:
                            issue_key = None
                        print(f"  Created Jira sub-task: "
                              f"{issue_key or '(key unknown)'}")
                    else:
                        print(f"  Jira error {status_code}: {response_text}")
                else:
                    print(f"  DRY RUN: Would create Jira subtask for '{name}'")

        except Exception as e:
            print(f"{name}: ERROR - {e}")
            if name in old_hashes:
                # Keep the previous baseline so one failed fetch does not
                # erase it and swallow the next real change.
                new_hashes[name] = old_hashes[name]

    if not ENABLE_TEST_MODE:
        save_hashes(new_hashes)
        for name, text in new_snapshots.items():
            save_snapshot(name, text)
        print("\nState saved (hashes.json + snapshots/)")
    else:
        print("\nTEST MODE - hashes and snapshots not saved")


if __name__ == "__main__":
    main()
