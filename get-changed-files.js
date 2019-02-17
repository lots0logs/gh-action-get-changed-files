// External Dependencies
const fs          = require('fs');
const { Toolkit } = require('actions-toolkit');

const tools       = new Toolkit;
const { payload } = tools.context;
const commits     = payload.commits.filter(c => c.distinct);

const FILES          = [];
const FILES_MODIFIED = [];
const FILES_ADDED    = [];
const FILES_DELETED  = [];

commits.forEach( async info => {
	const args   = tools.context.repo({ commit_sha: info.sha });
	const commit = await tools.github.getCommit(args);
	
	const files          = commit.files.map(f => f.filename);
	const files_modified = commit.files.filter(f => 'modified' === f.status).map(f => f.filename);
	const files_added    = commit.files.filter(f => 'added' === f.status).map(f => f.filename);
	const files_deleted  = commit.files.filter(f => 'deleted' === f.status).map(f => f.filename);
	
	FILES.push(...files_modified, ...files_added);
	FILES_MODIFIED.push(...files_modified);
	FILES_ADDED.push(...files_added);
	FILES_DELETED.push(...files_deleted);
});

fs.writeFileSync('/tmp/files.json', JSON.stringify(FILES), 'utf-8');
fs.writeFileSync('/tmp/files_modified.json', JSON.stringify(FILES_MODIFIED), 'utf-8');
fs.writeFileSync('/tmp/files_added.json', JSON.stringify(FILES_ADDED), 'utf-8');
fs.writeFileSync('/tmp/files_deleted.json', JSON.stringify(FILES_DELETED), 'utf-8');

process.exit(0);

