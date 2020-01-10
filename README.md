# GitHub Action: Get Changed Files
Saves lists of changed files in the `outputs` object and on the filesystem for use by other actions.

### Workflow Config Example
```
- use: lots0logs/gh-action-get-changed-files@2.0.5
  with:
    token: YOUR_PERSONAL_ACCESS_TOKEN
```

### Inputs
* **`token`**: GitHub Personal Access Token

### Outputs
All output values are a single JSON encoded array.

* **`all`**: Added, deleted, and modified files
* **`added`**: Added files
* **`deleted`**: Deleted files
* **`modified`**: Modified files

### JSON Files Created By This Action

* `${HOME}/files.json`
* `${HOME}/files_modified.json`
* `${HOME}/files_added.json`
* `${HOME}/files_deleted.json`
