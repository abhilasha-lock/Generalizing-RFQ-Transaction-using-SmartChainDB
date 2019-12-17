## Run and Test BigchainDB Server from the master Branch

Running and testing the BigchainDB Server is easy. Make sure you have a recent version of Docker Compose installed. When you are ready, fire up a terminal and run:

```
git clone https://github.com/bigchaindb/bigchaindb.git
cd bigchaindb
make run
```
BigchainDB should be reachable now on http://localhost:9984/.

There are also other commands you can execute:

- `make start`: Run BigchainDB from source and daemonize it (stop it with make stop).
- `make stop`: Stop BigchainDB.
- `make logs`: Attach to the logs.
- `make test`: Run all unit and acceptance tests.
- `make test-unit-watch`: Run all tests and wait. Every time you change code, tests will be run again.
- `make cov`: Check code coverage and open the result in the browser.
- `make doc`: Generate HTML documentation and open it in the browser.
- `make clean`: Remove all build, test, coverage and Python artifacts.
- `make reset`: Stop and REMOVE all containers. WARNING: you will LOSE all data stored in BigchainDB.

To view all commands available, run make.

## Run Stardog server to query Ontology

1. Download Stardog [here](https://downloads.stardog.com/stardog/stardog-latest.zip). Then unzip to a destination directory. We used /data/stardog.

2. Next tell Stardog where its home directory is:
```
$ export STARDOG_HOME=/data/stardog
```

3. Start the Stardog server:
```
$ /data/stardog/bin/stardog-admin server start
```

4. Test that Stardog is running by visiting http://localhost:5820/. Or you can do this instead:
```
$ stardog-admin server status
```
5. Download Stardog Studio [here](https://www.stardog.com/studio/)

6. Add the new connection and upload GeneralizedRequest.ttl ontology to query.


## Running the React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

