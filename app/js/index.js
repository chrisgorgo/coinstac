'use strict';

import React from 'react';
import routes from './routes';

// Load application stylesheets
require('../styles/app.scss');
require('reactabular/style.css')

routes.run((Root) => {
    React.render(<Root />, document.getElementById('app'));
});
