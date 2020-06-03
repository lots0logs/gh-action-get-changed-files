// External Dependencies
const fs                  = require('fs');
const { context, GitHub } = require('@actions/github');
const core                = require('@actions/core');

const repo    = context.payload.repository;
const org     = repo.organization;
const owner   = org || repo.owner;

const FILES          = new Set();
const FILES_MODIFIED = new Set();
const FILES_ADDED    = new Set();
const FILES_DELETED  = new Set();
const FILES_RENAMED  = new Set();

const gh   = new GitHub(core.getInput('token'));
const args = { owner: owner.name, repo: repo.name };

function isAdded(file) {
	return 'added' === file.status;
}

function isDeleted(file) {
	return 'deleted' === file.status;
}

function isModified(file) {
	return 'modified' === file.status;
}

function isRenamed(file) {
	return 'renamed' === file.status;
}

async function getCommits() {
	if ('push' === context.eventName) {
		return context.payload.commits;

	} else if ('pull_request' === context.eventName) {
		const url = context.payload.pull_request.commits_url;

		return gh.paginate(`GET ${url}`);
	}
}

async function processCommit(commit) {
	args.ref = commit.id;
	result   = await gh.repos.getCommit(args);

	if (result && result.data) {
		const files = result.data.files;

		files.forEach( file => {
			isModified(file) && FILES.add(file.filename);
			isAdded(file) && FILES.add(file.filename);
			isRenamed(file) && FILES.add(file.filename);

			isModified(file) && FILES_MODIFIED.add(file.filename);
			isAdded(file) && FILES_ADDED.add(file.filename);
			isDeleted(file) && FILES_DELETED.add(file.filename);
			isRenamed(file) && FILES_RENAMED.add(file.filename);
		});
	}
}

getCommits().then(commits => {
	commits = commits.filter(c => c.distinct);

	Promise.all(commits.map(processCommit)).then(() => {
		core.debug(JSON.stringify(FILES, 4));

		core.setOutput('all', JSON.stringify(FILES, 4));
		core.setOutput('added', JSON.stringify(FILES_ADDED, 4));
		core.setOutput('deleted', JSON.stringify(FILES_DELETED, 4));
		core.setOutput('modified', JSON.stringify(FILES_MODIFIED, 4));
		core.setOutput('renamed', JSON.stringify(FILES_RENAMED, 4));

		fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(FILES), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(FILES_MODIFIED), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(FILES_ADDED), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(FILES_DELETED), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_renamed.json`, JSON.stringify(FILES_RENAMED), 'utf-8');

		process.exit(0);
	});
});

