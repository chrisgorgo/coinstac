'use strict';

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';

import FormManageProjectController from './form-manage-project-controller';

export default class PageProject extends React.Component {
    static propTypes: {
        projectId: React.propTypes.string
    }
    render() {
        const projectId = this.props.params.projectId;

        return (
            <div className="projects-single">
                <LinkContainer to="/projects">
                    <Button bsStyle="link" to="projects">
                        <span
                            className="glyphicon glyphicon-arrow-left"
                            aria-hidden="true">
                        </span>
                        Back
                    </Button>
                </LinkContainer>
                <h3>Edit Project</h3>
                <FormManageProjectController projectId={projectId} />
            </div>
        );
    }
};
