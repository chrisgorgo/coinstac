# COINSTAC

_Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation_

A research project from [MRN](http://www.mrn.org/).

## Setup and Installation

_**Supported systems:** The COINSTAC client is only known to work on Mac OS X and Ubuntu-based systems. Windows support is planned in later phases._

Before you get started you’ll need the following on your machine:

* **[git](http://git-scm.com/):** version control software necessary to download the project.
* **[Node.js](http://nodejs.org/):** specifically, COINSTAC requires io.js 2.5.0. The _n_ Node version manager will help out, but it needs Node.js to work.
* **[“n” package](http://npmjs.org/n):** run `npm install -g n`
* **[npm](https://www.npmjs.com/package/npm):** this project and its dependencies **require npm 2**. Install it with `npm install -g npm@2.14.8`.
* **[nodeapi](https://github.com/MRN-Code/nodeapi) and CouchDB server:** the COINSTAC client needs a server to work. Refer to the [server’s setup documentation](https://github.com/MRN-Code/nodeapi#couchdb).

Now, to install and configure the client:

1. Switch to io.js 2.5.0: `n io 2.5.0`.
2. “Clone” the repository onto your machine: `git clone https://github.com/MRN-Code/coinstac.git`.
3. Install dependencies: `cd` into the project’s directory and run `npm install`.
4. Configure the client: see [the “config” section](#config).

## Usage

The below assumes you want to boot into the app in development mode. If you want to boot into production mode, simply `export COINS_ENV='production' && npm i && npm run build`. In the `dist/` folder you should now be able to double click an executable program to open COINSTAC!

Ensure nodeapi and the CouchDB server are running. Then, start the client:

1. **`npm run webpack`:** boot the [Webpack](https://webpack.github.io/) development server (WPDS). Electron fetches UI assets from the WPDS.
1. **`npm start`:** to launch the app in dev mode. `Ctrl + Shift + r` to refresh the electron instance once the initial Webpack content is built. You will see that the Webpack content is `VALID` or `INVALID` in your terminal after it has finished processing the app.

### Cleanup

COINSTAC keeps projects stored on the filesystem. You may need to remove these projects while testing. Do so with:

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
