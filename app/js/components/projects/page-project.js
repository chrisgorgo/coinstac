'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import FormManageProjectController from './form-manage-project-controller';

export default class PageProject extends React.Component {
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
                <FormManageProjectController projectId={projectId} />
            </div>
        );
    }
};
