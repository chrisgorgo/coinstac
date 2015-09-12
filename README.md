# coinstac

## install
- install `couchdb` if developing on a local database
- run `npm i`

## usage

1. setup your config.  see the config section below
1. start the couchdb server, if developing locally
1. start the [nodeapi](MRN-Code/nodeapi)
1. run `npm start` to launch the app in dev mode, and `Ctrl + Shift + r` to refresh the electron instance once the initial webpack content is built.  You will see that the webpack content is `VALID` or `INVALID` in your terminal after it has finished processing the app.

## config
This project uses [config](https://www.npmjs.com/package/config) to pass configuration to the application. You’ll need to make a _config/default.json_ file. It should have connectivity information for the API and the local database that match [node-style URL objects](https://nodejs.org/api/url.html):

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

See _config/default.example.json_ for an example.
