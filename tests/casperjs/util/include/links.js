casper.echo('Include link utilities');

// Keeps track of the created links that are available for testing
var createdLinks = [];

/**
 * Utility functions for collaborative documents
 *
 * @return  {Object}    Returns an object with referenced link utility functions
 */
var linkUtil = function() {

    /**
     * Creates a link
     *
     * @param {Function}   callback              Standard callback function
     * @param {link}      callback.link    The link data coming back from the server
     */
    var createLink = function(callback) {
        var link = null;
        casper.start('http://test.oae.com/', function() {
            var rndString = mainUtil().generateRandomString();
            data = casper.evaluate(function(rndString) {
                return JSON.parse(__utils__.sendAJAX('/api/content/create', 'POST', {
                    'resourceSubType': 'link',
                    'link': 'http://test.oae.com',
                    'displayName': 'link-' + rndString,
                    'description': '',
                    'visibility': 'public'
                }, false));
            }, rndString);

            casper.then(function() {
                if (data) {
                    casper.echo('Created link-' + rndString + '.');
                    createdLinks.push(data);
                    link = data;
                } else {
                    casper.echo('Could not create link-' + rndString + '.', 'ERROR');
                }
            });
        });

        casper.then(function() {
            callback(link);
        });
    };

    return {
        'createLink': createLink,
        'createdLinks': createdLinks
    };
};
