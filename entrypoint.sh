#!/bin/bash

node /get-changed-files.js || exit 1

export FILES=$(< /tmp/files.json)
export FILES_MODIFIED=$(< /tmp/files_modified.json)
export FILES_ADDED=$(< /tmp/files_added.json)
export FILES_DELETED=$(< /tmp/files_deleted.json)

exit 0
