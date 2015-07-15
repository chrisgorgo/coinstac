'use strict';

import React from 'react';
import fs from 'fs';

export default class DashboardFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: fs.readdirSync('./')
        };
    }
    render() {
        var files = this.state.files.map((filename) => {
          return (
            <div>
                <span>{filename}</span>
            </div>
          );
        });
        return (
            <div>
                <h2>Files</h2>
                {files}
            </div>
        );
    }
};
