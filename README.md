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
* @flag `--development` - Sets the COINS_ENV to `development`
* @flag `--webpack` - Boots the WPDS as a child process of the electron COINSTAC app

## config
This project uses [config](https://www.npmjs.com/package/config) to pass configuration to the application. You’ll need to make a _config/default.json_ or _config/local.json_ file.  See _config/default.example.json_ for an example.
  Move it to one of the aforementioned pathnames and update to your needs.  It should have connectivity information for the [MRN-Code/nodeapi](MRN-Code/nodeapi) contained within.  API and the local database configurations match [node-style URL objects](https://nodejs.org/api/url.html):

```json
{
    "api": {
        "protocol": "http",
        "hostname": "localhost",
        "port": 8800,
        "pathname": "/api/v1.3.0"
    },
    "db": {
        "remote": {
            "protocol": "http",
            "hostname": "localhost",
            "port": 5984
        }
    }
}
```
