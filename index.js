// External Dependencies
const fs     = require('fs');
const github = require('@actions/github');
const core   = require('@actions/core');

const context = github.context;
const repo    = context.payload.repository;
const org     = repo.organization;
const owner   = org || repo.owner;

const FILES          = new Set();
const FILES_MODIFIED = new Set();
const FILES_ADDED    = new Set();
const FILES_DELETED  = new Set();
const FILES_RENAMED  = new Set();

const gh   = github.getOctokit(core.getInput('token'));
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

		return gh.paginate(`GET ${url}`, args);

	} else {
		core.info('You are using this action on an event for which it has not been tested. Only the "push" and "pull_request" events are officially supported.');

		return [];
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

		core.setOutput('all', JSON.stringify(Array.from(FILES.values()), 4));
		core.setOutput('added', JSON.stringify(Array.from(FILES_ADDED.values()), 4));
		core.setOutput('deleted', JSON.stringify(Array.from(FILES_DELETED.values()), 4));
		core.setOutput('modified', JSON.stringify(Array.from(FILES_MODIFIED.values()), 4));
		core.setOutput('renamed', JSON.stringify(Array.from(FILES_RENAMED.values()), 4));

		fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(Array.from(FILES.values())), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(Array.from(FILES_MODIFIED.values())), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(Array.from(FILES_ADDED.values())), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(Array.from(FILES_DELETED.values())), 'utf-8');
		fs.writeFileSync(`${process.env.HOME}/files_renamed.json`, JSON.stringify(Array.from(FILES_RENAMED.values())), 'utf-8');

		process.exit(0);
	});
});

