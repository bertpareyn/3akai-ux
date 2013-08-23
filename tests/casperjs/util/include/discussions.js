casper.echo('Include discussion utilities');

/**
 * Utility functions for discussions
 *
 * @return  {Object}    Returns an object with referenced discussions utility functions
 */
var discussionUtil = function() {

    /**
     * Creates a discussion
     *
     * @param   {Int}           numToCreate             The number of discussions to create
     * @param   {Function}      callback                Standard callback function
     * @param   {Discussion}    callback.discussion     The created discussion object
     */
    var createDiscussion = function(numToCreate, callback) {
        var toCreate = numToCreate || 1;
        var discussions = [];

        casper.start('http://test.oae.com/').repeat(toCreate, function() {
            var rndString = mainUtil().generateRandomString();
            data = casper.evaluate(function(rndString) {
                return JSON.parse(__utils__.sendAJAX('/api/discussion/create', 'POST', {
                    'displayName': 'Discussion ' + rndString,
                    'description': 'Talk about all the things!',
                    'visibility': 'public'
                }, false));
            }, rndString);

            casper.then(function() {
                if (data) {
                    casper.echo('Created \'Discussion ' + rndString + '\'.');
                    discussions.push(data);
                } else {
                    casper.echo('Could not create discussion \'Discussion ' + rndString + '\'.', 'ERROR');
                }
            });
        });

        casper.then(function() {
            callback(discussions);
        });
    };

    /**
     * Creates a discussion in the given groupUrl
     *
     * @param   {Object}    group   The group object you want to add a discussion to.
     */
    var createGroupDiscussion = function(group, callback) {
        var rndString = mainUtil().generateRandomString();
        var discussion = null;
        data = casper.evaluate(function(group, rndString) {
            return JSON.parse(__utils__.sendAJAX('/api/discussion/create', 'POST', {
                'displayName': 'Discussion ' + rndString,
                'description': 'Talk about all the things!',
                'visibility': 'public',
                'members': group.id
            }, false));
        }, group, rndString);

        casper.then(function() {
            if (data) {
                casper.echo('Created \'Discussion ' + rndString + '\'in group \'' + group.displayName + '\'.');
                discussion = data;
            } else {
                casper.echo('Could not create discussion \'Discussion ' + rndString + '\' in group \'' + group.displayName + '\'.', 'ERROR');
            }
        });

        casper.then(function() {
            callback(discussion);
        });
    };

    /**
     * Post something to the discussion
     *
     * @param   {Object}    discussion      The discussion you want to post something to
     * @param   {String}    comment         The comment you want to post
     */
    var postToDiscussion = function(discussion, comment) {
        data = casper.evaluate(function(discussion, comment) {
            return JSON.parse(__utils__.sendAJAX('/api/discussion/' + discussion.id + '/messages', 'POST', {
                'body': comment
            }, false));
        }, discussion, comment);

        casper.then(function() {
            if (data) {
                casper.echo('Created post \'' + comment + '\' to discussion \'' + discussion.displayName + '\'.');
            } else {
                casper.echo('Could not create post \'' + comment + '\' to discussion \'' + discussion.displayName + '\'.');
            }
        });
    };

    return {
        'createDiscussion': createDiscussion,
        'createGroupDiscussion': createGroupDiscussion,
        'postToDiscussion': postToDiscussion
    };
};
