casper.echo('Include content utilities');

// Keeps track of the created content that is available for testing
var createdContent = [];

/**
 * Utility functions for content
 *
 * @return  {Object}    Returns an object with referenced content utility functions
 */
var contentUtil = function() {

    /**
     * Creates a file through the UI and returns the URL to it
     *
     * @param  {[String]}   file       Optional URL to the file to create
     * @param  {Function}   callback   Standard callback function
     */
    var createFile = function(file, callback) {
        var fileToUpload = 'tests/casperjs/data/balloons.jpg';
        var contentUrl = null;

        casper.thenOpen('http://test.oae.com/me', function() {
            casper.waitForSelector('#me-clip-container .oae-clip-content > button', function() {
                casper.click('#me-clip-container .oae-clip-content > button');
                casper.click('.oae-trigger-upload');
                casper.wait(1000, function() {
                    casper.click('#me-clip-container .oae-clip-content > button');
                });
            });
            casper.then(function() {
                casper.waitForSelector('#upload-dropzone', function(){
                    casper.fill('#upload-dropzone form', {
                        'file': fileToUpload
                    }, false);
                    casper.click('button#upload-upload');
                    casper.waitForSelector('#oae-notification-container .alert', function() {
                        contentUrl = casper.getElementAttribute('#oae-notification-container .alert h4 + a', 'href');
                        casper.echo('Created content item at ' + contentUrl);
                        casper.echo(contentUrl);
                        callback(contentUrl);
                    });
                });
            });
        });
    };

    /**
     * Creates a link through the UI and returns the URL to it
     *
     * @param  {[String]}   link       Optional URL to the link to create
     * @param  {Function}   callback   Standard callback function
     */
    var createLink = function(link, callback) {
        var linkToCreate = link || 'http://www.oaeproject.org';
        var contentUrl = null;

        casper.thenOpen('http://test.oae.com/me', function() {
            casper.waitForSelector('#me-clip-container .oae-clip-content > button', function() {
                casper.click('.oae-trigger-createlink');
                casper.wait(1000, function() {
                    casper.sendKeys('#createlink-link-dump', 'http://www.oaeproject.org');
                    casper.evaluate(function() {
                        document.getElementById('createlink-next').removeAttribute('disabled');
                    });
                    casper.click('#createlink-next');
                    casper.click('button#createlink-create');
                    casper.waitForSelector('#oae-notification-container .alert', function() {
                        contentUrl = casper.getElementAttribute('#oae-notification-container .alert h4 + a', 'href');
                        casper.echo('Created link at ' + contentUrl);
                        callback(contentUrl);
                    });
                });
            });
        });
    };

    /**
     * Creates a revision for a content item
     *
     * @param  {Function}    callback    Standard callback function
     */
    var createRevision = function(callback) {
        casper.waitForSelector('#content-clip-container .oae-clip-content > button', function() {
            casper.click('.oae-trigger-uploadnewversion');

            // TODO: We need a way to know when the uploadnewversion widget has bootstrapped itself
            // There is currently no way to determine this from casper, so we do a simple wait
            casper.wait(3000, function() {
                casper.waitForSelector('form#uploadnewversion-form', function() {
                    casper.fill('form#uploadnewversion-form', {
                        'file': 'tests/casperjs/data/apereo.jpg'
                    });
                    casper.waitForSelector('#oae-notification-container .alert', function() {
                        casper.click('#oae-notification-container .close');
                        casper.echo('Created a new revision');
                        callback();
                    });
                });
            });
        });
    };

    /**
     * Creates a file in the group through the UI and returns the URL to it
     *
     * @param  {Object}   group       Group object of the group you want to add the file to
     * @param  {Function} callback    Standard callback function
     */
    var createGroupFile = function(group, callback) {
        var contentUrl = null;

        casper.thenOpen('http://test.oae.com' + group.profilePath, function() {
            casper.waitForSelector('#group-clip-container .oae-clip-content > button', function() {
                casper.click('#group-clip-container .oae-clip-content > button');
                casper.click('.oae-trigger-upload');
                casper.wait(1000, function() {
                    casper.click('#group-clip-container .oae-clip-content > button');
                });
            });
            casper.then(function() {
                casper.waitForSelector('#upload-dropzone', function() {
                    casper.fill('#upload-dropzone form', {
                        'file': 'tests/casperjs/data/balloons.jpg'
                }, false);
                    // Wait a bit for the button to be abled so you can click on it
                    // Else the button will be disabled when you try to click and the content will not be created
                    casper.wait(2000,function(){
                        casper.click('button#upload-upload');
                    });
                    casper.waitForSelector('#oae-notification-container .alert', function() {
                        contentUrl = casper.getElementAttribute('#oae-notification-container .alert h4 + a', 'href');
                        casper.echo('Created content item at ' + contentUrl);
                        callback(contentUrl);
                    });
                });
            });
        });
    };

    /**
     * Comment on a file
     *
     * @param   {String}    fileUrl     The file object that needs to be commented on
     * @param   {String}    comment     The comment you want to place on the file
     */
    var commentOnFile = function(file, comment) {
        casper.thenOpen('http://test.oae.com' + fileUrl, function() {
            casper.waitForSelector('form.comments-new-comment-form', function() {
                casper.fill('form.comments-new-comment-form', {
                    'comments-new-comment': comment
                });
                casper.wait(2000, function() {
                    casper.click('.comments-new-comment-form button[type="submit"]');
                });
                casper.echo('Made comment \'' + comment + '\' on File with url \'' + fileUrl + '\'.');
            });
        });
    /*
        data = casper.evaluate(function(file, comment) {
            return JSON.parse(__utils__.sendAJAX('/api/content/' + file.id + '/messages', 'POST', {
                'body': comment
            }, false));
        }, file, comment);

        casper.then(function() {
            if (data) {
                casper.echo('Created comment \'' + comment + '\' on file \'' + file.displayName + '\'.');
            } else {
                casper.echo('Could not create comment \'' + comment + '\' on file \'' + file.displayName + '\'.');
            }
        });*/
    };

    return {
        'createFile': createFile,
        'createLink': createLink,
        'createRevision': createRevision,
        'createGroupFile': createGroupFile,
        'commentOnFile': commentOnFile
    };
};
