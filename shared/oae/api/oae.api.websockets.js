/*!
 * Copyright 2013 Apereo Foundation (AF) Licensed under the
 * Educational Community License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

define(['exports', 'jquery', 'underscore', 'sockjs'], function(exports, $, _) {

    // The API endpoint for push notifications
    var sockjsUrl = '/api/push';
    // The configuration to run SockJS with
    var sockjsOptions = {
        'debug': true,
        'devel': true,
        'protocols_whitelist': ['websocket']
    };
    // Holds the SockJS instance
    var sockjs = null;
    // Actions that need to take place once the user is connected to a websocket
    var deferredActions = [];
    // Defines if the user is currently connected to a websocket
    var connected = false;

    /**
     * Initializes the SockJS library and defines onopen and onmessage actions
     *
     * @param  {Object}      me              The currently logged in user object
     * @param  {Function}    callback        Standard callback function
     * @param  {Function}    callback.err    Error object containing error code and message (if any)
     */
    var init = exports.init = function(me, callback) {
        // Only set up a websocket for an authenticated user
        if (me.anon) {
            callback();
        }

        // Construct the websocket
        sockjs = new SockJS(sockjsUrl, sockjsOptions);

        /**
         * Authenticae with the backend before messages can be retrieved.
         * Execute any deferred actions that were cached.
         * `sockjs.onopen` is executed when the websocket connection has been successfully set up.
         */
        sockjs.onopen = function() {
            sendMessage('authentication', {
                    'userId': me.id,
                    'tenantAlias': me.tenant.alias,
                    'signature': me.signature
                }, function(err) {
                if (err) {
                    return callback(err);
                }

                connected = true;

                if (deferredActions.length > 0) {
                    _.each(deferredActions, function(action) {
                        sendMessage(action.name, action.payload, action.callback);
                    });
                }

                callback();
            });
        };

        /**
         * Trigger a custom push event when a new message is received on the websocket.
         *
         * @param  {Event}  ev   A SockJS Event
         */
        sockjs.onmessage = function(ev) {
            var msg = null;
            try {
                msg = JSON.parse(ev.data);
            } catch (err) {
                console.error('Could not parse json');
                return;
            }

            if (msg && msg.stream) {
                $(document).trigger('push.' + msg.stream, msg.activity);
            } else {
                $(document).trigger('websockets.internal.' + msg.id, msg);
            }
        };
    };

    /**
     * Allows you to subscribe to a feed
     *
     * @param  {String}      resourceId          The ID of the resource to subscribe to
     * @param  {String}      activityStreamId    Can be either of activity|notification|message and defines the type of stream you're subscribing to
     * @param  {String}      token               Token provided by the resource to authenticate with
     * @param  {Function}    callback            Standard callback function
     * @param  {Function}    callback.error      Error object containing error code and message (if any)
     * @param  {Function}    callback.payload    The payload of the response (if any)
     */
    var subscribe = exports.subscribe = function(resourceId, activityStreamId, token, callback) {
        callback = callback || function() {};

        var name = 'subscribe';
        var payload = {
            'stream': {
                'resourceId': resourceId,
                'activityStreamId': activityStreamId
            },
            'token': token
        };

        if (!connected) {
            deferredActions.push({'name': name, 'payload': payload, 'callback': callback});
        } else {
            sendMessage(name, payload, callback);
        }
    };

    /**
     * Sends a message over the websocket
     *
     * @param  {String}     name                The name for this message
     * @param  {Object}     payload             Any other data that needs to be sent along
     * @param  {Function}   callback            Function that will be called when a response is received
     * @param  {Object}     callback.err        Error object containing error code and message (if any)
     * @param  {Object}     callback.payload    The payload of the response (if any)
     * @api private
     */
    var sendMessage = function(name, payload, callback) {
        var id = Math.floor(Math.random() * 1000000);

        // Attach an event listener that will only get called once.
        $(document).one('websockets.internal.' + id, function(ev, message) {
            if (message.error) {
                return callback(message.error);
            }

            return callback(null, message.payload);
        });

        // The data we'll be sending
        var msg = JSON.stringify({
            'id': id,
            'name': name,
            'payload': payload
        });

        // Write out the message
        sockjs.send(msg);
    };
});
