# GitHub Action: Get Changed Files
Saves lists of changed files in the `outputs` object and on the filesystem for use by other actions.

### Workflow Config Example
```
- uses: lots0logs/gh-action-get-changed-files@2.2.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

### Inputs
* **`token`**: [The `GITHUB_TOKEN` secret](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token).

### Outputs
All output values are a single JSON encoded array.

* **`all`**: Added, deleted, renamed and modified files
* **`added`**: Added files
* **`deleted`**: Deleted files
* **`renamed`**: Renamed files
* **`modified`**: Modified files

### JSON Files Created By This Action

* `${HOME}/files.json`
* `${HOME}/files_modified.json`
* `${HOME}/files_added.json`
* `${HOME}/files_deleted.json`
* `${HOME}/files_renamed.json`
