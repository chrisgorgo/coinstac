import React, { Component } from 'react';

import ConsortiumSingle from './consortium-single';

class ConsortiumSingleController extends Component {
    render() {
        const _id = this.props.query._id;
        return <ConsortiumSingle _id={_id} />
    }
}

ConsortiumSingleController.displayName = 'ConsortiumSingleController';

export default ConsortiumSingleController;
