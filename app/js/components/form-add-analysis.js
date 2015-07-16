'use strict';

import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import FieldInput from './field-input';

export default class FormAddAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false
        };
        if (!this.props.consortium) {
            throw new ReferenceError('consortium must be passed');
        }
    }

    cancel() {
        this.refs.name.reset();
        this.props.onCancel();
    }

    handleNameFieldChange() {
        // ToDo don't enable submit if there are analysis name conflicts
        let name = this.refs.name;
        let state = this.state;
        state.valid = (name && name.valid) ? true : false;
        state.nameError = name && name.error;
        this.setState(state);
    }

    /**
     * Run tests against the name field onChange
     * @return {array} array contains tests which return error msg strings
     */
    testsName() {
        const name = this.refs.name.value;
        const testUniqueAnalysis = () => {
            let analysis;
            if (!this.props.consortium.analysis) {
                return;
            }
            for (var i = this.props.consortium.analysis.length - 1; i >= 0; i--) {
                analysis = this.props.consortium.analysis[i];
                if (analysis.name === name) {
                    return 'Analysis names must be unique';
                }
            }
        };
        return [
            testUniqueAnalysis
        ];
    }

    validationStateName() {
        let nameField = this.refs.name;
        if (!nameField || nameField.pristine) {
            return '';
        } else if (nameField.valid) {
            return 'success';
        } else {
            return 'error';
        }
    }

    submit(evt) {
        evt.preventDefault();
        this.state.submitting = true;
        this.setState(this.state);
        this.props.onSubmit({
            name: this.refs.name.value
        }, this.submitComplete.bind(this));
    }

    submitComplete(err, result) {
        if (err) {
            // pass
        } else {
            this.refs.name.reset();
        }
        delete this.state.submitting;
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <form className="clearfix" onSubmit={this.submit.bind(this)} >
                    <FieldInput
                        bsStyle={this.validationStateName()}
                        onChange={this.handleNameFieldChange.bind(this)}
                        type="text"
                        label="Name:"
                        ref="name"
                        tests={this.testsName.bind(this)}
                        help={this.state.nameError}
                        hasFeedback
                        notNull />
                    <ButtonToolbar className="pull-right">
                        <Button
                            onClick={this.cancel.bind(this)}
                            type="button"
                            bsStyle='default'>Cancel
                        </Button>
                        <Button
                            type="submit"
                            bsStyle='primary'
                            disabled={!this.state.valid || this.state.submitting}>Save
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }
}
