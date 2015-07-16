'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import ProjectsForm from './projects-form';
// import * as store from '../stores/store';
// import _ from 'lodash';

export default class ProjectsSingle extends React.Component {
    static propTypes: {
        projectId: React.propTypes.string
    }
    render() {
        const projectId = this.props.params.projectId;

        return (
            <div className="projects-single">
                <ButtonLink bsStyle="link" to="projects">
                    <span className="glyphicon glyphicon-arrow-left" aria-hidden="true">&nbsp;</span>
                    Back
                </ButtonLink>
                <h3>Edit Project</h3>
                <ProjectsForm projectId={projectId} />
            </div>
        );
    }
};
