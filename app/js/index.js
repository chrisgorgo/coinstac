'use strict';

import React from 'react';
import Router from 'react-router';
import routes from './routes';

let RouteHandler = Router.RouteHandler;

routes.run((Root) => {
    React.render(<Root />, document.body);
});
