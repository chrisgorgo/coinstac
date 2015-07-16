'use strict';

import React from 'react';
import ProjectsForm from './projects-form';

export default class ProjectsNew extends React.Component {
    render() {
        return (
            <div className="projects-new">
                <h3>New</h3>
                <ProjectsForm />
            </div>
        );
    }
};
