import { Button } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import FormAddAnalysis from './form-add-analysis';

class ConsortiumSingle extends Component {
    constructor(props) {
        super(props);
        this.renderAnalyses = this.renderAnalyses.bind(this);
        this.renderResults = this.renderResults.bind(this);
        this.renderTags = this.renderTags.bind(this);
        this.renderUsers = this.renderUsers.bind(this);
        this.toggleShowAddAnalysis = this.toggleShowAddAnalysis.bind(this);

        // Set initial state
        this.state = {
            showAddAnalysis: false,
        };
    }

    /**
     * Render analyses.
     *
     * @todo  Implement 'Delete' button
     */
    renderAnalyses() {
        const { analyses } = this.props;

        return (
            <ul className="list-unstyled">
                {analyses.map(x => {
                    return (
                        <li key={x.label} className="clearfix">
                            {x.label}
                            <span className="text-muted pull-right">
                                (id: {x.id})
                            </span>
                            <Button
                                bsStyle="error"
                                className="pull-right">Delete</Button>
                        </li>
                    );
                })}
            </ul>
        );
    }

    /** @todo  Implement */
    renderResults() {
        return;
    }

    renderTags() {
        const { tags } = this.props;
        return (
            <div>
                {tags.map((tag, index) => {
                    return (
                        <span key={index} className="label label-default">
                            {tag}
                        </span>
                    );
                })}
            </div>
        );
    }

    renderUsers() {
        const { users } = this.props;

        return (
            <ul className="list-inline">
                {users.map((user, index) => {
                    return <li key={index}>{user.username}</li>;
                })}
            </ul>
        );
    }

    toggleShowAddAnalysis() {
        this.setState({
            showAddAnalysis: !this.state.showAddAnalysis,
        });
    }

    render() {
        const {
            analyses,
            description,
            isLoading,
            isMember,
            label,
            results,
            tags,
            users,
        } = this.props;
        const { addUser, removeUser, addAnalysis } = this.props.actions;
        const { showAddAnalysis } = this.state;
        let memberButton;

        if (isLoading) {
            return (
                <div className="consortium-single consortium-single--no-result">
                    Loading consortium…
                </div>
            );
        }

        if (isMember) {
            memberButton = (
                <Button
                    block
                    className="clearfix pull-right"
                    onClick={removeUser}
                    type="button">Leave Consortium</Button>
            );
        } else {
            memberButton = (
                <Button
                    block
                    bsStyle="success"
                    className="clearfix pull-right"
                    onClick={addUser}
                    type="button">Join Consortium</Button>
            );
        }

        /**
         * @todo  Move this into the state tree. Probably somewhere in the
         *        Consortium service? Make to the parent controller element?
         */
        function validateAnalysis(analysisLabel = '') {
            if (analysisLabel.length < 5) {
                throw new Error('Label must have at least 5 characters')
            } else if (analyses.some(x => x.label === analysisLabel)) {
                throw new Error(`Label ${analysisLabel} already exists`);
            }

            return true;
        }

        return (
            <div className="consortium-single">
                <h1>{label}</h1>
                {memberButton}
                <p className="lead">{description}</p>

                <div className="row">
                    <div className="col-xs-12">
                        <h2>Analyses</h2>
                        <p>These analyses are run on all raw data added to the project</p>
                        <Button
                            bsSize="xsmall"
                            bsStyle="primary"
                            className="clearfix pull-right"
                            onClick={this.toggleShowAddAnalysis}
                            type="button">New Analysis Type</Button>
                        <div className={showAddAnalysis ? null : 'hidden'}>
                            <FormAddAnalysis
                                onSubmit={addAnalysis}
                                validate={validateAnalysis} />
                        </div>
                    </div>
                    <div className="col-xs-12">
                        {this.renderAnalyses()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-sm-6">
                        <h3>Tags:</h3>
                        {this.renderTags()}
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <h3>Users:</h3>
                        {this.renderUsers()}
                    </div>
                </div>

                <h2>Results:</h2>
                {this.renderResults()}
            </div>
        );
    }
};

ConsortiumSingle.displayName = 'ConsortiumSingle';

ConsortiumSingle.propTypes = {
    actions: PropTypes.object.isRequired,
    analyses: PropTypes.array.isRequired,
    description: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isMember: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    results: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
};

export default ConsortiumSingle;
