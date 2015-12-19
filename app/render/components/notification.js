'use strict';
import NotificationSystem from 'react-notification-system';
import React from 'react';
import app from 'ampersand-app';

export default class Notify extends React.Component {

    /**
     * push a notification to the application
     * https://github.com/igorprado/react-notification-system#creating-a-notification
     * @param  {object} notification
     * @return {undefined}
     */
    push(notification) {
        this.notificationSystem.addNotification(notification);
    }

    /**
     * build the notification system _once_, and enforce that it is not dually instantiated.
     * put the notification system on the app as a global
     * @return {undefined}
     */
    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;
        if (app.notifications) {
            throw new ReferenceError('notification system already registered')
        }
        app.notifications = this;
    }

    render() {
        return (
            <div>
                <NotificationSystem ref="notificationSystem" />
            </div>
        );
    }
};
