# coinstac

## Configuration

This project uses [config](https://www.npmjs.com/package/config) to pass configuration to the application. You’ll need to make a _config/default.json_ file. It should have keys for the API and the database that match [Node-style URL objects](https://nodejs.org/api/url.html):

```json
{
    "api": {
        "hostname": "localhost",
        "port": 9000
    },
    "db": {
        "hostname": "localhost",
        "port": 5984
    }
}
```

See _config/default.example.json_ for an example.

## install
- run `npm i`

## development
- run `npm start`
    - this runs the `electron` process with a `development` flag.  In turn, this tells the application to source data from a `webpack-development-server` vs the filesystem.
