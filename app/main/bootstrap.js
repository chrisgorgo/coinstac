'use strict';
require('./utils/define-globals')();
require('./utils/parse-cli-input.js')();
require('./utils/build-index.js'); // generate index.html
require('./utils/configure-promise-polyfill.js')();
require('./utils/configure-error-serialization.js')();
require('./utils/promisify-fs')();
require('./utils/upsert-coinstac-user-dir.js')();
