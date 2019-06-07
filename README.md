SKeyMa - Simple Key Management Server
=====================================

Introduction
------------

SKeyMa is a NodeJS implementation of a Key Management Server that exposes an API to store and retrieve cryptographic keys (currently only symmetric encryption keys like AES keys are supported). The API, called the SKM API, is a simple REST API.

The SKM API is designed to be very simple to use. Refer to the [online documentation](http://skeyma.readthedocs.org/en/latest/) for details.


Features
--------

- Simple REST API to store/get keys stored in an encrypted form
- Get multiple keys with a single request
- Option for Server-created keys for convenience

Installing and Running the Server
---------------------------------

### Prerequisites
The SKeyMa Server is written as a NodeJS application. You need to install NodeJS version 0.8.x or above in order to run it. You can obtain a NodeJS distribution for your platform from the [NodeJS project page](http://www.nodejs.org). You will also need the ensure that the Node Package Manager (NPM) is installed and functional.

### Installation
After you have downloaded the server distribution, you will need to install/update the node module dependencies:
From a command-line shell, working from the directory where the main script `keystore.js` is, run:
```
npm install
```
You should see `npm` install the dependencies under `node_modules` 

### Running from a command-line shell
Simply invoke the `node` runtime passing it the path to the `keystore.js` file from this distribution, optionaly followed by command-line arguments.
Example:
```
node keystore.js --debug
```

### Key Database
The key database (stored by default in a file named keys.db in the same directory as the keystore.js application) is a SQLite3 database. The SQL file data/sqlite/initdb.sql can be used to create an empty database. Alternatively, the file test/emptydb.db contains a pre-formatted empty database.
The command-line option --db <filename> can be used to specify an alternate location to store the database file.
Consult the SQLite documentation for details on how to manage the database file (backups, etc.)

Support
-------

If you are having issues, please let us know.

License
-------

The project is licensed under the MIT license.
