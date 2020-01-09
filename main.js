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

const gh   = new GitHub(core.getInput('token'));
const args = { owner: org, repo };

function isAdded(file) {
	return 'added' === file.status;
}

function isDeleted(file) {
	return 'deleted' === file.status;
}

function isModified(file) {
	return 'modified' === file.status;
}

async function processCommit(commit) {
	args.ref = commit.id;
	result   = await gh.repo.getCommit(args);

	if (result && result.data) {
		const files = result.data.files;

		files.forEach( file => {
			isModified(file) && FILES.push(...files.modified);
			isAdded(file) && FILES.push(...files.added);

			isModified(file) && FILES_MODIFIED.push(...files.modified);
			isAdded(file) && FILES_ADDED.push(...files.added);
			isDeleted(file) && FILES_DELETED.push(...files.removed);
		});
	}
}

commits.forEach(processCommit);

process.stdout.write(`::warning::${JSON.stringify(FILES, 4)}`);
process.stdout.write(`::set-output name=all::${JSON.stringify(FILES, 4)}`);
process.stdout.write(`::set-output name=added::${JSON.stringify(FILES_ADDED, 4)}`);
process.stdout.write(`::set-output name=deleted::${JSON.stringify(FILES_DELETED, 4)}`);
process.stdout.write(`::set-output name=modified::${JSON.stringify(FILES_MODIFIED, 4)}`);

fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(FILES), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(FILES_MODIFIED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(FILES_ADDED), 'utf-8');
fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(FILES_DELETED), 'utf-8');

process.exit(0);

