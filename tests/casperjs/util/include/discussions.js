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
        var discussionUrl = null;
        var rndString = mainUtil().generateRandomString();
        casper.thenOpen('http://test.oae.com' + group.profilePath + '/discussions', function() {
            //casper.click('...');
            // Need to fix this, but it doesn't work without the wait, it wil timeout without it
            casper.wait(6000,function() {
                casper.waitForSelector('.oae-trigger-creatediscussion', function() {
                    casper.click('.oae-trigger-creatediscussion');
                    casper.waitForSelector('#creatediscussion-create', function() {
                        casper.fill('form#creatediscussion-form', {
                            'creatediscussion-name': 'Discussion ' + rndString,
                            'creatediscussion-topic': 'Talk about all the things!'
                        }, false);
                        // Wait a bit for the button to be abled so you can click on it
                        // Else the button will be disabled when you try to click and the discussion will not be created
                        casper.wait(2000, function() {casper.click('#creatediscussion-create');});
                        casper.waitForSelector('.oae-clip-content', function() {
                            casper.echo('created discussion \'Discussion ' + rndString + '\' in group \'' + group.displayName + '\'');
                            discussionUrl = casper.getCurrentUrl();
                            callback(rndString, discussionUrl)
                        });
                    });
                });
            });
        });
    };

    /**
     * Post something to the discussion with this url
     *
     * @param   {String}    discussionUrl   The url of the discussion you want to post something to
     * @param   {String}    comment         The comment you want to post
     */
    var postToDiscussionUrl = function(discussionUrl, comment) {
        casper.thenOpen(discussionUrl, function() {
            casper.waitForSelector('form.comments-new-comment-form', function() {
                casper.fill('form.comments-new-comment-form', {
                    'comments-new-comment': comment
                });
                casper.wait(2000, function() {
                    casper.click('.comments-new-comment-form button[type="submit"]');
                });
                casper.echo('Posted \'' + comment + '\' to the discussion with url \'' + discussionUrl + '\'.');
            });
        });
    };

    /**
     * Post something to the discussion
     *
     * @param   {Object}    discussion      The discussion you want to post something to
     * @param   {String}    comment         The comment you want to post
     */
    var postToDiscussion = function(discussion, comment) {
        casper.thenOpen('http://test.oae.com' + discussion.profilePath, function() {
            casper.waitForSelector('form.comments-new-comment-form', function() {
                casper.fill('form.comments-new-comment-form', {
                    'comments-new-comment': comment
                });
                casper.wait(2000, function() {
                    casper.click('.comments-new-comment-form button[type="submit"]');
                });
                casper.echo('Posted \'' + comment + '\' to the discussion \'' + discussion.displayName + '\'.');
            });
        });
    };

    return {
        'createDiscussion': createDiscussion,
        'createGroupDiscussion': createGroupDiscussion,
        'postToDiscussionUrl': postToDiscussionUrl,
        'postToDiscussion': postToDiscussion
    };
};
