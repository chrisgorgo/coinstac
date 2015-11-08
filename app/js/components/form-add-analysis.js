import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar, Input } from 'react-bootstrap';

import regions from '../../common/utils/freesurfer-regions';

class FormAddAnalysis extends Component {
    constructor(props) {
        super(props);
        this.clearValues = this.clearValues.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderRegions = this.renderRegions.bind(this);

        this.state = {
            label: this.props.label || '',
        };
    }
    clearValues() {
        this.setState({
            label: '',
            region: 0,
            ui_error: null,
        });
    }
    getValues() {
        return {
            label: this.refs.label.getValue(),
            region: this.refs.region.getValue(),
        };
    }
    handleChange() {
        const { label, region } = this.getValues();

        this.setState({
            label,
            region,
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
    renderRegions() {
        var options = [
            <option disabled="true" key="-1" value="0">
                Select a region…
            </option>
        ];

        Object.keys(regions).forEach((region, index) => {
            options.push(
                <option key={index} value={region}>
                    {regions[region]}
                </option>
            );
        });

        return (
            <Input
                defaultValue="0"
                label="Region of Interest"
                onChange={this.handleChange}
                ref="region"
                type="select"
                value={this.state.region}>
                {options.map(option => option)}
            </Input>
        );
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
                {this.renderRegions()}
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
