// External Dependencies
const fs                  = require('fs');
const { context, GitHub } = require('@actions/github');
const core                = require('@actions/core');


const commits = context.payload.commits.filter(c => c.distinct);
const repo    = context.payload.repository.name;
const org     = context.payload.repository.organization;

const FILES          = [];
const FILES_MODIFIED = [];
const FILES_ADDED    = [];
const FILES_DELETED  = [];

commits.forEach(commit => {
	commit.modified && FILES.push(...commit.modified);
	commit.added && FILES.push(...commit.added);

	commit.modified && FILES_MODIFIED.push(...commit.modified);
	commit.added && FILES_ADDED.push(...commit.added);
	commit.removed && FILES_DELETED.push(...commit.removed);
});

process.stdout.write(`::warning::${JSON.stringify(FILES, 4)}`);

fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(FILES), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(FILES_MODIFIED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(FILES_ADDED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(FILES_DELETED), 'utf-8');

process.exit(0);

