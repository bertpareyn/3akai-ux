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
     * @param  {Function}     callback               Standard callback function
     * @param  {Discussion}   callback.discussion    The created discussion object
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
                    casper.echo('Created \'Discussion' + rndString + '\'.');
                    discussions.push(data);
                } else {
                    casper.echo('Could not create discussion \'Discussion' + rndString + '\'.', 'ERROR');
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
     * @param   {String}    groupUrl    The group.profilePath of the group you want to add a discussion.
     */
    var createGroupDiscussion = function(groupUrl, callback) {
        var rndString = mainUtil().generateRandomString();
        casper.thenOpen('http://test.oae.com' + groupUrl + '/discussions', function() {
            // Need to fix this, but it doesn't work without the wait, it wil timeout without it
            casper.wait(5000,function() {
                casper.waitForSelector('.oae-trigger-creatediscussion', function() {
                    casper.click('.oae-trigger-creatediscussion');
                    casper.waitForSelector('#creatediscussion-create', function() {
                        casper.fill('form#creatediscussion-form', {
                            'creatediscussion-name': 'Discussion ' + rndString,
                            'creatediscussion-topic': 'Talk about all the things!'
                        }, false);
                        casper.click('#creatediscussion-create');
                        casper.waitForSelector('.oae-clip-content', function() {
                            casper.echo('created discussion \'Discussion ' + rndString + '\' in group with path \'' + groupUrl + '\'');
                        });
                    });
                });
            });
        });
                
        casper.then(function() {
            callback(rndString);
        });

    };

    return {
        'createDiscussion': createDiscussion,
        'createGroupDiscussion': createGroupDiscussion
    };
};
