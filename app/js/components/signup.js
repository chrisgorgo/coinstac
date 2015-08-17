'use strict';

import React from 'react';
import LayoutNoAuth from './layout-noauth';

export default class Signup extends React.Component {
    render() {
        return <LayoutNoAuth formType="signup" />;
    }
};
