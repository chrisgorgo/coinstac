import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Input } from 'react-bootstrap';

function getInitialState() {
    return {
        help: null,
        label: '',
        style: null,
    };
}

class FormAddAnalysis extends Component {
    constructor(props) {
        super(props);
        this.clearValues = this.clearValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = getInitialState();
    }
    clearValues() {
        this.setState(getInitialState());
    }
    getValues() {
        return {
            label: this.refs.label.getValue(),
        };
    }
    handleChange() {
        this.setState({
            label: this.getValues().label,
        });
    }
    handleSubmit(e) {
        const { onSubmit, validate } = this.props;
        const values = this.getValues();

        e.preventDefault();

        // Validate and submit form's values
        validate(values)
            .then(() => {
                this.setState({
                    help: null,
                    style: null,
                });
                onSubmit(values);
                this.clearValues();
            })
            .catch(error => {
                this.setState({
                    help: error.message,
                    style: 'error',
                });
            });
    }
    render() {
        const { label, help, style, value } = this.state;

        return (
            <form className="clearfix" onSubmit={this.handleSubmit}>
                <Input
                    bsStyle={style}
                    help={help}
                    label="Analysis Label:"
                    onChange={this.handleChange}
                    ref="label"
                    value={label}
                    type="text" />
                <ButtonToolbar className="pull-right">
                    <Button
                        bsStyle="default"
                        onClick={this.clearValues}
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
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
};

export default FormAddAnalysis;
