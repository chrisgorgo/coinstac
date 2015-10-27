# coinstac
Hi reader!  Don't look at me.  I'm not pretty yet!  COINSTAC docs will come soon :)

## install
- install `couchdb` if developing on a local database
- run `npm i`

## usage
The below assumes you want to boot into the app in development mode.  If you want to boot into production mode, simply `export COINS_ENV='production' && npm i && npm run build`.  In the `dist/` folder you should now be able to double click an executable program to open COINSTAC!

### configure
1. setup your config.  see the config section below

### boot dependent packages
1. start the couchdb server, if developing locally (`couchdb -b`)
1. start the [nodeapi](MRN-Code/nodeapi)

### boot the COINSTAC client
1. `npm i` to install dependencies
2. run `node webpack-server.js` to boot the webpack development server (WPDS).  Electron fetches UI assests from the WPDS.
1. `npm start` to launch the app in dev mode.  `Ctrl + Shift + r` to refresh the electron instance once the initial webpack content is built.  You will see that the webpack content is `VALID` or `INVALID` in your terminal after it has finished processing the app.

## cli
`electron . [--args...]`

Always run `electron . --help` to see the latest and most accurate options.
* @flag `--development` / `-dev` - Sets the COINS_ENV to `development`
* @flag `--webpack` / `-w` - Boots the WPDS as a child process of the electron COINSTAC app

## config
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
