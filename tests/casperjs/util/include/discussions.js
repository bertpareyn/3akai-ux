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
    /*
    var createGroupDiscussion = function(groupname) {
        casper.start('http://test.oae.com/me/discussions', function() {
            var rndString = mainUtil().generateRandomString();
            casper.waitForSelector('#lhnavigation-page', function() {
                casper.echo('test');
                casper.click('.oae-trigger-creatediscussion');
                casper.waitForSelector('form#creatediscussion-form', function() {
                    casper.captureSelector('discussions3.png','#creatediscussion-permissions');
                    casper.echo('form');
                    casper.fill('form#creatediscussion-form', {
                        'creatediscussion-name': rndString,
                        'creatediscussion-topic': 'Talk about all the things!'
                    }, false);
                    casper.click('#creatediscussion-change-permissions');
                    casper.captureSelector('discussions5.png','#creatediscussion-change-permissions');
                    //TOT HIER GAAT HET GOED, HET FORM WORDT INGEVULD
                    //HIERNA WORDT OF DE NIET KNOP INGEDRUKT OF HET NIEUWE SCHERM NIET INGELADEN
                    casper.wait(1000, function() {
                        casper.capture('discussions4.png');
                        casper.test.assertExists('#creatediscussion-permissions-container[style="display: none"]');
                        casper.test.assertExists('#creatediscussion-permissions-container[style="display: block"]');
                        casper.test.assertExists('#creatediscussion-permissions-container[display="none"]');
                        casper.test.assertExists('#creatediscussion-permissions-container[display="block"]');
                        casper.test.assertExists('#creatediscussion-permissions-container');
                        casper.test.assertVisible('#creatediscussion-permissions-container');
                        casper.test.assertNotVisible('#creatediscussion-permissions-container');
                    });
                    casper.waitUntilVisible('#creatediscussion-permissions-container', function() {
                        casper.capture('discussions.png');
                        casper.echo('list');
                        casper.evaluate(function(groupname) {
                            document.querySelector('#setpermissions-container .as-selections input').value = groupname;
                        }, groupname);
                        casper.capture('discussions2.png');
                        casper.click('#setpermissions-container .as-selections input');
                        casper.waitForSelector('.as-list li', function() {
                            casper.echo('save');
                            casper.click('.as-list li');
                            casper.click('#setpermissions-savepermissions');
                            casper.waitForSelector('#creatediscussion-create', function() {
                                casper.echo('create');
                                casper.click('#creatediscussion-create');
                            });
                        });
                    });
                });
            });
        });
    };*/


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
                        casper.then(function() {
                            casper.fill('form#creatediscussion-form', {
                                'creatediscussion-name': 'Discussion ' + rndString,
                                'creatediscussion-topic': 'Talk about all the things!'
                            }, false);
                        });
                        casper.then(function() {
                            casper.click('#creatediscussion-create');
                            casper.waitForSelector('.oae-clip-content', function() {
                                casper.echo('created discussion \'Discussion ' + rndString + '\' in group with path \'' + groupUrl + '\'');
                                });
                            });
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
