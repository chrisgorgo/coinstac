'use strict';

import React from 'react';
import {Button, ButtonToolbar} from 'react-bootstrap';
import FieldInput from './field-input';
import uuid from 'uuid';

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
        this.refs.label.reset();
        this.props.onCancel();
    }

    handleLabelFieldChange() {
        // ToDo don't enable submit if there are analysis label conflicts
        let label = this.refs.label;
        let state = this.state;
        state.valid = (label && label.valid) ? true : false;
        state.labelError = label && label.error;
        this.setState(state);
    }

    /**
     * Run tests against the label field onChange
     * @return {array} array contains tests which return error msg strings
     */
    testsName() {
        const label = this.refs.label.value;
        const testUniqueAnalysis = () => {
            let analysis;
            if (!this.props.consortium.analyses) {
                return;
            }
            for (var i = this.props.consortium.analyses.length - 1; i >= 0; i--) {
                analysis = this.props.consortium.analyses[i];
                if (analysis.label === label) {
                    return 'Analysis labels must be unique';
                }
            }
        };
        return [
            testUniqueAnalysis
        ];
    }

    validationStateName() {
        let labelField = this.refs.label;
        if (!labelField || labelField.pristine) {
            return '';
        } else if (labelField.valid) {
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
            label: this.refs.label.value,
            id: uuid.v4()
        }, this.submitComplete.bind(this));
    }

    submitComplete(err, result) {
        if (err) {
            // pass
        } else {
            this.refs.label.reset();
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
                        onChange={this.handleLabelFieldChange.bind(this)}
                        type="text"
                        label="Analysis Label:"
                        ref="label"
                        tests={this.testsName.bind(this)}
                        help={this.state.labelError}
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
