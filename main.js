// External Dependencies
const fs                  = require('fs');
const { context, GitHub } = require('@actions/github');
const core                = require('@actions/core');


const commits = gh.context.payload.commits.filter(c => c.distinct);
const repo    = gh.context.payload.repository.name;
const org     = gh.context.payload.repository.organization;

const FILES          = [];
const FILES_MODIFIED = [];
const FILES_ADDED    = [];
const FILES_DELETED  = [];


const gh = new GitHub(core.getInput('token'));

commits.forEach(commit => {
	commit = octokit.git.getCommit({ org, repo, commit.sha });

	FILES.push(...commit.modified, ...commit.added);
	FILES_MODIFIED.push(...commit.modified);
	FILES_ADDED.push(...commit.added);
	FILES_DELETED.push(...commit.removed);
});

fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(FILES), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(FILES_MODIFIED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(FILES_ADDED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(FILES_DELETED), 'utf-8');

process.exit(0);

