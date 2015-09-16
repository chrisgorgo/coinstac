'use strict';
var fs = require('fs');
require('../app/js/services/promise-uncaught-polyfill')(global);
Promise.promisifyAll(fs);
