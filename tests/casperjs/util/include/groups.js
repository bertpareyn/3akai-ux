casper.echo('Include group utilities');

// Keeps track of the created groups that are available for testing
var createdGroups = [];

/**
 * Utility functions for groups
 *
 * @return  {Object}    Returns an object with referenced group utility functions
 */
var groupUtil = function() {

    /**
     * Creates a group
     *
     * @param {Function}   callback          Standard callback function
     * @param {Group}      callback.group    The group data coming back from the server
     */
    var createGroup = function(members, managers, callback) {
        var group = null;

        var rndString = mainUtil().generateRandomString();
        data = casper.evaluate(function(rndString, members, managers) {
            return JSON.parse(__utils__.sendAJAX('/api/group/create', 'POST', {
                'displayName': 'group-' + rndString,
                'description': '',
                'visibility': 'public',
                'joinable': 'yes',
                'members': members,
                'managers': managers
            }, false));
        }, rndString, members, managers);

        casper.then(function() {
            if (data) {
                casper.echo('Created group-' + rndString + '.');
                createdGroups.push(data);
                group = data;
            } else {
                casper.echo('Could not create group-' + rndString + '.', 'ERROR');
            }
        });

        casper.then(function() {
            callback(group);
        });
    };

    /**
     * Help function to open the manageAccess of a group
     */
    var openManageAccess = function() {
        casper.waitForSelector('#group-clip-container .oae-clip-content button', function(){
            casper.click('#group-clip-container .oae-clip-content button');
            casper.waitForSelector('button.group-trigger-manageaccess', function() {
                casper.click('button.group-trigger-manageaccess');
            });
        });
    };

    /**
     * Add the given user to the given group by using the manageaccess screen.
     *
     * @param   {String}    username    The name of the user you want to add to the group
     * @param   {String}    groupUrl    The group.profilePath of the group you want to use
     */
    var addUserToGroup = function(username, groupUrl) {
        casper.thenOpen('http://test.oae.com'+groupUrl, function() {
            openManageAccess();
            casper.waitForSelector('#manageaccess-share-add-more', function() {
                casper.click('#manageaccess-share-add-more');
                casper.waitForSelector('.as-selections', function() {
                    casper.evaluate(function(username) {
                        document.querySelector('#manageaccess-share .as-selections input').value = username;
                        document.querySelector('#manageaccess-share-role').value = 'manager';
                    }, username);
        
                    // Click on the input field to make the autosuggest list load
                    casper.click('#manageaccess-share .as-selections input');
        
                    // Wait for the auto suggest list for the users
                    casper.waitForSelector('.as-list li', function() {
                        // Click the first user (the one we want)
                        casper.click('.as-list li');
                        // Click the add button
                        casper.click('#manageaccess-share-update');
        
                        // Wait for the save button to load
                        casper.waitForSelector('#manageaccess-overview-save', function() {
                            // Save the user to the group
                            casper.click('#manageaccess-overview-save');
                            casper.echo('Added user ' + username + ' to group as manager');
                        });
                    });
                });
            });
        });
    };

    /**
    * Change the visibility of this group
    * @param   {String}    type    The type of visibility you want to have
    *                              can be 'private', 'public', 'loggedin' everything else will be public
    * @param   {Object}    group   The group you want to change the visibility from
    */
    var changeVisibility = function(type, group) {
        casper.thenOpen('http://test.oae.com'+group.profilePath, function() {
            openManageAccess();
            casper.click('#manageaccess-change-visibility');
            casper.waitForSelector('#manageaccess-visibility', function() {
                if(type === 'private' || type === 'public' || type === 'loggedin') {
                    casper.click('#oae-visibility-'+type);
                } else {
                    casper.click('#oae-visibility-public');
                }
                casper.click('#manageaccess-visibility-save');
                casper.waitForSelector('#manageaccess-overview-save', function() {
                    casper.click('#manageaccess-overview-save');
                });
            });
        });
    };

    return {
        'createGroup': createGroup,
        'createdGroups': createdGroups,
        'addUserToGroup': addUserToGroup,
        'changeVisibility': changeVisibility
    };
};
