# COINSTAC

_Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation_

A research project by your friends @[MRN](http://www.mrn.org/).

## About
Collaboration is hard.  Leak-tight privacy is hard.  Computation is hard.

_But there is hope!_

COINSTAC is a cross platform program designed to make decentralized research collaboration easy.  Specifically, it enables users to join a group of research collaborators and collectively execute analyses scripts/programs/pipelines on their common research data.  It provides:

- utility to search and join research groups (e.g. consortia)
- share analysis utilities (scripts, pipelines)
- synchronize results across members, and permit re-analysis in order to converge on results

Why a decentralized, distributed model?
-  full datasets can be heavy to transfer (huge files), and often is not permitted to be shared openly due to research privacy constraints
-  smart bullies have already shown ability to extract personal information from various aggregrated, anonymized datasets.  COINSTAC applies "differential privacy" strategies to go above and beyond in order to truly anonymize private data, whilst still permitting collaboration
-  Machine Learning algorithms help allow contributors to use their source-data for large analyses efforts without ever having to transfer a single file manually, or leave their own computer!

Magic!

## Setup and Installation

Production-ready binaries are not yet released.  COINSTAC is only available in developer-mode ATM.  If you'd like to contribute or try it out, please, drop us a line first (GH issues or email).  Before you get started you’ll need the following on your machine:

* **[git](http://git-scm.com/):** version control software necessary to download the project.
* **[COINS API](https://github.com/MRN-Code/nodeapi):** the COINSTAC client needs a server to work. Refer to the [server’s setup documentation](https://github.com/MRN-Code/nodeapi#couchdb).
* **CouchDB**: We'll let you to install this per your own liking!

To install and configure the client:

2. “Clone” the repository onto your machine: `git clone https://github.com/MRN-Code/coinstac.git`.
3. Install dependencies: `cd` into the project’s directory and run `npm install`.
4. Configure the client: see [the “config” section](#config).

## Usage

Ensure nodeapi and the CouchDB server are running. Then, start the client:

1. **`npm run webpack`:** boot the [Webpack](https://webpack.github.io/) development server (WPDS). Electron fetches UI assets from the WPDS.
1. **`npm start`:** to launch the app in dev mode. `Ctrl + Shift + r` to refresh the electron instance once the initial Webpack content is built. You will see that the Webpack content is `VALID` or `INVALID` in your terminal after it has finished processing the app.

### Generating Builds
If you want to boot into production mode, simply `export COINS_ENV='production' && npm i && npm run build`. In the `dist/` folder you should now be able to double click an executable program to open COINSTAC!

### Hot Tips

- COINSTAC keeps some data stored on the filesystem. If you want to clear these for testing, do so with:

```shell
rm -rf ~/.coinstac
```

## CLI

`electron . [--args...]`

Always run `electron . --help` to see the latest and most accurate options.

* @flag `--development` / `-dev` - Sets the COINS_ENV to `development`
* @flag `--webpack` / `-w` - Boots the WPDS as a child process of the electron COINSTAC app

## Config

This project uses [config](https://www.npmjs.com/package/config) to pass configuration to the application. You’ll need to make a _config/local.json_ file to override _config/default.json_ with your API and database connections.

It should have an `api` key with connectivity information for the [MRN-Code/nodeapi](MRN-Code/nodeapi) and a `db` key with connectivity information for your CouchDB server. API and the local database configurations match [node-style URL objects](https://nodejs.org/api/url.html):

```json
{
    "api": {
        "protocol": "https",
        "hostname": "localcoin.mrn.org",
        "port": 8443,
        "pathname": "/api/v1.3.0"
    },
    "db": {
        "remote": {
            "protocol": "https",
            "hostname": "localcoin.mrn.org",
            "port": 8443,
            "pathname": "couchdb"
        }
    }
}
```
