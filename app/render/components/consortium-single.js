import { Button, Panel } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import ConsortiumAnalysis from './consortium-analysis';
import ConsortiumSingleResult from './consortium-single-result';
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
        const { analyses, actions: { removeAnalysis } } = this.props;
        return (
            <ul className="list-unstyled">
                {analyses.map((analysis, index) => {
                    return (
                        <li key={index}>
                            <ConsortiumAnalysis
                                removeAnalysis={removeAnalysis}
                                {...analysis} />
                        </li>
                    );
                })}
            </ul>
        );
    }

    renderResults() {
        const { ui_results: results } = this.props;

        if (results.length > 0) {
            return (
                <div className="consortium-single-results">
                    {results.map(result => {
                        return (
                            <ConsortiumSingleResult
                                key={result._id}
                                {...result} />
                        );
                    })}
                </div>
            );
        } else {
            return <div>Loading results…</div>;
        }
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
            isMember,
            label,
            tags,
            ui_isLoading,
            users,
        } = this.props;
        const { addAnalysis, addUser, removeUser } = this.props.actions;
        const { showAddAnalysis } = this.state;
        let memberButton;

        if (ui_isLoading) {
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
                            <FormAddAnalysis onSubmit={addAnalysis} />
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
    isMember: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    ui_results: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
    ui_error: PropTypes.string.isRequired,
    ui_isLoading: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
};

export default ConsortiumSingle;
