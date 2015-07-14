'use strict';

import React from 'react';
import routes from './routes';

// Load application stylesheets
require('../styles/app.scss');

routes.run((Root) => {
    React.render(<Root />, document.getElementById('app'));
});
