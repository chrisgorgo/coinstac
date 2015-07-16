'use strict';
import React from 'react';
import {Input} from 'react-bootstrap';
import _ from 'lodash';

/**
 * FieldInput
 * @property {boolean} valid reflects whether tests are passing against <input>
 * @property {*} value raw text value from <input>
 * @property {boolean} isPristine
 * Composed element over react-bootstrap.  All props may be used from react-bootstrap Input
 *
 * Additionally, supports
 * <FieldInput
 *
 */
export default class FieldInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasFeedback: false,
            help: '',
            isMounted: false,
            validationClass: '',
            valid: null
        };

        this.pristine = true;

        // remap onChange handler
        if (_.isFunction(this.props.onChange)) {
            this._onChange = this.props.onChange;
            delete this.props.onChange;
        }
    }
    componentDidMount() {
        this.state.isMounted = true;
        this.setState(this.state);
    }
    componentWillUnmount() {
        this.state.isMounted = false;
        this.setState(this.state); // ToDo - may not make sense to set tate in unmount
    }
    get value() {
        if (this.state && this.state.isMounted) {
            return this.refs.input.getInputDOMNode().value;
        }
    }
    set value(val) {
        if (this.state && this.state.isMounted) {
            this.refs.input.getInputDOMNode().value = val;
        }
    }
    handleInputChange(evt) {
        // apply input tests
        this.error = this.runTests();
        this.valid = this.error ? false : true;
        this.pristine = false;

        // exec original change handler
        if (this._onChange) {
            this._onChange();
        }
    }

    reset() {
        this.value = null;
        this.valid = null;
        this.pristine = true;
    }

    /**
     * Runs a series of tests on the input. If tests returning an error string
     * on fail, or a falsy value on pass
     * @return {*}
     */
    runTests() {
        let testNotNull = () => {
            return this.value ? null : 'Cannot be blank';
        }
        let tests = [];

        // add user passed tests
        if (this.props.tests) {
            tests = tests.concat(this.props.tests());
        }

        if (this.props.hasOwnProperty('notNull')) {
            tests.push(testNotNull);
        }

        for (var i = tests.length - 1; i >= 0; i--) {
            let error = tests[i]();
            if (error) {
                return error;
            }
        };
    }
    render() {
        return (
            <Input ref="input" {...this.props} onChange={this.handleInputChange.bind(this)} />
        );
    }
}