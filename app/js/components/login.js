'use strict';

import React from 'react';
import LayoutNoAuth from './layout-noauth';

export default class Login extends React.Component {
    render() {
        return <LayoutNoAuth formType="login" />;
    }
};
