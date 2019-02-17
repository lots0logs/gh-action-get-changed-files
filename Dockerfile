FROM node:lts

COPY . .

RUN yarn

ENTRYPOINT ["node", "/entrypoint.js"]

LABEL maintainer="Dustin Falgout <dustin@falgout.us>"
LABEL repository=https://github.com/lots0logs/gh-action-get-changed-files
LABEL com.github.actions.name="Get Changed Files"
LABEL com.github.actions.description="Saves changed files as JSON for use by other actions."
LABEL com.github.actions.icon=file
LABEL com.github.actions.color=gray-dark
