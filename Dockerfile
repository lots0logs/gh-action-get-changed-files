FROM node:lts

COPY . .

RUN yarn

ENTRYPOINT ["node", "/entrypoint.js"]

LABEL maintainer='Dustin Falgout <dustin@falgout.us>'
LABEL repository=https://github.com/lots0logs/gh-action-get-changed-files
LABEL com.github.actions.name=get-changed-files
LABEL com.github.actions.description='Saves changed files to the environment for use by other actions.'
LABEL com.github.actions.icon=search
LABEL com.github.actions.color=gray-dark
