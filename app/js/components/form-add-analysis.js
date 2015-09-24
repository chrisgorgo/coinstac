import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Input } from 'react-bootstrap';
import uuid from 'uuid';

import FieldInput from './field-input';

function getInitialState() {
    return {
        help: null,
        style: null,
        value: ''
    };
}

class FormAddAnalysis extends Component {
    constructor(props) {
        super(props);
        this.clearValue = this.clearValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = getInitialState();
    }
    clearValue() {
        this.setState(getInitialState());
    }
    getValue() {
        return this.refs.label.getValue();
    }
    handleChange() {
        this.setState({
            value: this.getValue(),
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        debugger;

        this.props.onSubmit(this.getValue());
        this.clearValue();
    }
    validateState() {
        let isValid;
        try {
            isValid = this.props.validate(this.getValue());
        } catch (error) {
            this.setState({
                help: error.message,
                style: 'danger',
            });
            return false;
        }

        this.setState({
            help: null,
            style: null,
        });
        return true;
    }




    // handleLabelFieldChange() {
    //     // ToDo don't enable submit if there are analysis label conflicts
    //     let label = this.refs.label;
    //     let state = this.state;
    //     state.valid = (label && label.valid) ? true : false;
    //     state.labelError = label && label.error;
    //     this.setState(state);
    // }

    /**
     * Run tests against the label field onChange
     * @return {array} array contains tests which return error msg strings
     */
    // testsName() {
    //     const label = this.refs.label.value;
    //     const testUniqueAnalysis = () => {
    //         let analysis;
    //         if (!this.props.consortium.analyses) {
    //             return;
    //         }
    //         for (var i = this.props.consortium.analyses.length - 1; i >= 0; i--) {
    //             analysis = this.props.consortium.analyses[i];
    //             if (analysis.label === label) {
    //                 return 'Analysis labels must be unique';
    //             }
    //         }
    //     };
    //     return [
    //         testUniqueAnalysis
    //     ];
    // }

    // validationStateName() {
    //     let labelField = this.refs.label;
    //     if (!labelField || labelField.pristine) {
    //         return '';
    //     } else if (labelField.valid) {
    //         return 'success';
    //     } else {
    //         return 'error';
    //     }
    // }

    // submit(evt) {
    //     evt.preventDefault();
    //     this.state.submitting = true;
    //     this.setState(this.state);
    //     this.props.onSubmit({
    //         label: this.refs.label.value,
    //         id: uuid.v4()
    //     }, this.submitComplete.bind(this));
    // }

    // submitComplete(err, result) {
    //     if (err) {
    //         // pass
    //     } else {
    //         this.refs.label.reset();
    //     }
    //     delete this.state.submitting;
    //     this.setState(this.state);
    // }

    render() {
        const { help, style, value } = this.state;

        return (
            <form className="clearfix" onSubmit={this.handleSubmit}>
                <Input
                    bsStyle={style}
                    help={help}
                    label="Analysis Label:"
                    onChange={this.handleChange}
                    ref="label"
                    value={value}
                    type="text" />
                <ButtonToolbar className="pull-right">
                    <Button
                        bsStyle="default"
                        onClick={this.clearValue}
                        type="reset">Cancel</Button>
                    <Button
                        bsStyle="primary"
                        type="submit">Save</Button>
                </ButtonToolbar>
            </form>
        );
    }
}

FormAddAnalysis.displayName = 'FormAddAnalysis';

FormAddAnalysis.propTypes = {
    // isError: PropTypes.bool.isRequired,
    // errorMessage: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
};

export default FormAddAnalysis;
