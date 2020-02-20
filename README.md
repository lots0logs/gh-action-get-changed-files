# GitHub Action: Get Changed Files
Saves lists of changed files in the `outputs` object and on the filesystem for use by other actions.

### Workflow Config Example
```
- uses: lots0logs/gh-action-get-changed-files@2.0.6
  with:
    token: GITHUB_TOKEN
```

### Inputs
* **`token`**: [The `GITHUB_TOKEN` secret](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token).

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
