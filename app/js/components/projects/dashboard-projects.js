import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import app from 'ampersand-app';

export default class DashboardProjects extends React.Component {
    render() {
        const { location: { pathname } } = this.props;
        let addButton;

        if (pathname.indexOf('/projects') !== -1) {
            addButton = (
                <LinkContainer to="/projects/new">
                    <Button bsStyle="primary" className="pull-right">
                        <strong>+</strong>
                        Add Project
                    </Button>
                </LinkContainer>
            );
        }

        return (
            <div className="projects">
                <div className="page-header clearfix">
                    <h1 className="pull-left">Projects</h1>
                    {addButton}
                </div>
                {this.props.children}
            </div>
        );
    }
};
