# 🌈 Color Pop cloud functions

## Setup the environment
Before working with this project, make sure you have the following prerequisites installed:
- Node.js v10+
- [Firebase CLI](https://www.npmjs.com/package/firebase-tools)

Run the `firebase init` at **project root** to connect it with one of your own Firebase projects.

## Available scripts

### `npm run build`
Compiles the Typescript cloud function in `src` directory to JavaScript in `lib` directory.

### `npm run serve`
Starts a development server to test the cloud function.

### `npm start` or `npm run shell`
Starts Node.js shell in the cloud function in the development server.

### `npm run deploy`
Deploys only the cloud functions to the Firebase project linked with this project.