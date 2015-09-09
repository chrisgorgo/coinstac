import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
export default class FormAddProject extends React.Component {

    data() {
        return {
            name: this.refs.name.getValue()
        };
    }

    render() {
        return (
            <div className="projects-new">
                <h3>New Project</h3>
                <form onSubmit={this.props.handleClickSave} className="clearfix">
                    <Input
                        ref="name"
                        type="text"
                        label="Name:"
                        {...this.props.errors.name} />
                    <ButtonToolbar className="pull-right">
                        <Button
                            onClick={this.props.handleClickCancel}
                            bsStyle="link">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            bsStyle="primary">
                            <span className="glyphicon glyphicon-ok" aria-hidden="true">&nbsp;</span>
                            Add
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }

};
