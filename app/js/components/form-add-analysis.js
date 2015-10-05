import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Input } from 'react-bootstrap';

class FormAddAnalysis extends Component {
    constructor(props) {
        super(props);
        this.clearValues = this.clearValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            label: this.props.label || '',
        };
    }
    clearValues() {
        this.setState({
            label: '',
            ui_error: null,
        });
    }
    getValues() {
        return {
            label: this.refs.label.getValue(),
        };
    }
    handleChange() {
        this.setState({
            label: this.getValues().label,
            ui_error: null,
        });
    }
    handleSubmit(e) {
        e.preventDefault();

        this.props.onSubmit(this.getValues())
            .then(() => this.clearValues())
            .catch(error => {
                this.setState({
                    ui_error: error.message,
                });
            });
    }
    render() {
        const { label, ui_error } = this.state;
        const labelInputProps = {
            label: 'Analysis Label:',
            onChange: this.handleChange,
            ref: 'label',
            type: 'text',
            value: label,
        };

        if (ui_error) {
            labelInputProps.bsStyle = 'error';
            labelInputProps.help = ui_error;
        }

        return (
            <form className="clearfix" onSubmit={this.handleSubmit}>
                <Input {...labelInputProps} />
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
    ui_error: PropTypes.string,
    values: PropTypes.object,
};

export default FormAddAnalysis;
