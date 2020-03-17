module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(992);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 266:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 374:
/***/ (function() {

eval("require")("@actions/github");


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 992:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

// External Dependencies
const fs                  = __webpack_require__(747);
const { context, GitHub } = __webpack_require__(374);
const core                = __webpack_require__(266);

const commits = context.payload.commits.filter(c => c.distinct);
const repo    = context.payload.repository;
const org     = repo.organization;
const owner   = org || repo.owner;

const FILES          = [];
const FILES_MODIFIED = [];
const FILES_ADDED    = [];
const FILES_DELETED  = [];
const FILES_RENAMED  = [];

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

async function processCommit(commit) {
	args.ref = commit.id;
	result   = await gh.repos.getCommit(args);

	if (result && result.data) {
		const files = result.data.files;

		files.forEach( file => {
			isModified(file) && FILES.push(file.filename);
			isAdded(file) && FILES.push(file.filename);
			isRenamed(file) && FILES.push(file.filename);

			isModified(file) && FILES_MODIFIED.push(file.filename);
			isAdded(file) && FILES_ADDED.push(file.filename);
			isDeleted(file) && FILES_DELETED.push(file.filename);
			isRenamed(file) && FILES_RENAMED.push(file.filename);
		});
	}
}


Promise.all(commits.map(processCommit)).then(() => {
	process.stdout.write(`::debug::${JSON.stringify(FILES, 4)}`);
	process.stdout.write(`::set-output name=all::${JSON.stringify(FILES, 4)}`);
	process.stdout.write(`::set-output name=added::${JSON.stringify(FILES_ADDED, 4)}`);
	process.stdout.write(`::set-output name=deleted::${JSON.stringify(FILES_DELETED, 4)}`);
	process.stdout.write(`::set-output name=modified::${JSON.stringify(FILES_MODIFIED, 4)}`);
	process.stdout.write(`::set-output name=renamed::${JSON.stringify(FILES_RENAMED, 4)}`);

	fs.writeFileSync(`${process.env.HOME}/files.json`, JSON.stringify(FILES), 'utf-8');
	fs.writeFileSync(`${process.env.HOME}/files_modified.json`, JSON.stringify(FILES_MODIFIED), 'utf-8');
	fs.writeFileSync(`${process.env.HOME}/files_added.json`, JSON.stringify(FILES_ADDED), 'utf-8');
	fs.writeFileSync(`${process.env.HOME}/files_deleted.json`, JSON.stringify(FILES_DELETED), 'utf-8');
	fs.writeFileSync(`${process.env.HOME}/files_renamed.json`, JSON.stringify(FILES_RENAMED), 'utf-8');

	process.exit(0);
});


/***/ })

/******/ });