import requests
import hashlib
import json
import os
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

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
    if os.path.exists(HASH_FILE):
        with open(HASH_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_hashes(hashes):
    with open(HASH_FILE, "w", encoding="utf-8") as f:
        json.dump(hashes, f, indent=2)


def get_page_hash(name, url):
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    content = response.text

    if ENABLE_TEST_MODE and name == TEST_FORCE_CHANGE_FOR:
        content += "FAKE_TEST_CHANGE"

    return hashlib.md5(content.encode("utf-8")).hexdigest()


def create_jira_subtask(page_name, page_url):
    summary = f"Change detected: {page_name}"

    description_text = (
        f"Automated monitoring detected a content change.\n\n"
        f"Source page: {page_url}\n\n"
        f"Please review and update the RCD website if needed."
    )

    payload = {
        "fields": {
            "project": {
                "key": JIRA_PROJECT_KEY
            },
            "parent": {
                "key": JIRA_PARENT_KEY
            },
            "summary": summary,
            "issuetype": {
                "name": "Sub-task"
            },
            "description": {
                "type": "doc",
                "version": 1,
                "content": [
                    {
                        "type": "paragraph",
                        "content": [
                            {
                                "type": "text",
                                "text": description_text
                            }
                        ]
                    }
                ]
            }
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
        data=json.dumps(payload)
    )

    return response.status_code, response.text


def main():
    print("RUNNING MONITOR")
    print("ENABLE_TEST_MODE =", ENABLE_TEST_MODE)
    if ENABLE_TEST_MODE:
        print("TEST_FORCE_CHANGE_FOR =", TEST_FORCE_CHANGE_FOR)
    print("CREATE_REAL_JIRA_ISSUES =", CREATE_REAL_JIRA_ISSUES)
    print("-" * 40)

    old_hashes = load_hashes()
    new_hashes = {}

    for name, url in URLS.items():
        try:
            current_hash = get_page_hash(name, url)
            new_hashes[name] = current_hash

            if name not in old_hashes:
                print(f"{name}: FIRST RUN")

            elif old_hashes[name] == current_hash:
                print(f"{name}: NO CHANGE")

            else:
                print(f"{name}: CHANGE DETECTED")

                if CREATE_REAL_JIRA_ISSUES:
                    status_code, response_text = create_jira_subtask(name, url)
                    print(f"  Jira response: {status_code}")
                    print(f"  Jira body: {response_text}")
                else:
                    print(f"  DRY RUN: Would create Jira subtask for '{name}'")

        except Exception as e:
            print(f"{name}: ERROR - {e}")

    if not ENABLE_TEST_MODE:
        save_hashes(new_hashes)
        print("\nHashes updated in hashes.json")
    else:
        print("\nTEST MODE - hashes not saved")


if __name__ == "__main__":
    main()
