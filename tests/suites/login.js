// Add a title comment so that you know what's happening and when
casper.test.comment('Sakai OAE - Log in with a user\n');

var username = "dieter";
var password = "dieter";
var link = "http://cam.oae.com";

/**
 * Initialize CasperJS and point it to cam.oae.com
 */

casper.start(link, function () {
    // Set the size of the viewport
    casper.viewport(1600, 1200);
});

/**
 * Wait for the navigation is loaded
 */

casper.waitForSelector('#topnavigation_right_content a', function() {

    // Assert that the sign in button is there
    this.test.assertVisible('a.topnavigation-menu-item', 'Sign in button is visible');

    // Assert that the sign in dropdown is hidden
    this.test.assertNotVisible('#topnavigation_user_options_login_fields', 'Dropdown is not visible');

    /**
     * Click on the "Sign in" button
     */

    this.thenClick('#topnavigation_right_content a', function(){
    
        // Assert that the sign in dropdown is visible
        this.test.assertVisible('#topnavigation_user_options_login_fields', 'Dropdown is visible');

        // Assert that the form and all its elements are there
        this.test.assertExists('form#topnavigation_user_options_login_form','Login form is found');
        this.test.assertExists('#topnavigation_login_username','Username field form is found');
        this.test.assertExists('#topnavigation_login_password','Password field form is found');

        this.test.info("\nTry to login with NO username and NO password in the form");
        this.test.info("---------------------------------------------------------");
        
        /**
         * Fill the form and submit the form
         */
        this.fill('form#topnavigation_user_options_login_form', {}, false);
        this.thenClick('#topnavigation_user_options_login_button_login',function(){
        
            // Verify that the user is logged in
            this.wait(1000, function() 
            {
                var url = this.getCurrentUrl();
                if (url.indexOf("/me") !=-1)
                {
                    this.test.assertUrlMatch('\/me');
                    this.echo("You're logged in", 'ERROR');
                    this.test.assertNotVisible('#topnavigation_login_username_error','Error username not found');
                    this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
                }
                else
                {
                    this.test.assertUrlMatch('\/#');
                    this.echo("You're not logged in", 'INFO');
                    this.test.assertVisible('#topnavigation_login_username_error','Error username found');
                    this.test.assertVisible('#topnavigation_login_password_error','Error password found');
                }
            });
        });
    });
});

casper.then(function(){

    this.test.info("\nTry to login with a username and NO password in the form");
    this.test.info("---------------------------------------------------------");

    /**
    * Fill the form and submit the form
    */
    this.fill('form#topnavigation_user_options_login_form', {'topnavigation_login_username' : username }, false);
    this.thenClick('#topnavigation_user_options_login_button_login',function(){

        // Verify that the user is logged in
        this.wait(1000, function() 
        {
            var url = this.getCurrentUrl();
            if (url.indexOf("/me") !=-1)
            {
                this.test.assertUrlMatch('\/me');
                this.echo("You're logged in", 'ERROR');
                this.test.assertNotVisible('#topnavigation_login_username_error','Error username not found');
                this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
            }
            else
            {
                this.test.assertUrlMatch('\/#');
                this.echo("You're not logged in", 'INFO');
                this.test.assertNotVisible('#topnavigation_login_username_error','Error username not found');
                this.test.assertVisible('#topnavigation_login_password_error','Error password found');
            }
        });
    });

    this.then(function(){

        this.test.info("\nTry to login with a password and NO username in the form");
        this.test.info("---------------------------------------------------------");

        /**
         * Clear the current page
         */

        this.clear();
        this.thenOpen(link,function(){
            /**
             * Wait for the navigation is loaded
             */
            this.waitForSelector('#topnavigation_right_content a', function() {
            
                this.thenClick('#topnavigation_right_content a', function(){
                    
                    /**
                     * Fill the form and submit the form
                     */
                    this.fill(  'form#topnavigation_user_options_login_form', { 
                                'topnavigation_login_password' : password }, false);
                    this.thenClick('#topnavigation_user_options_login_button_login',function(){

                        // Verify that the user is logged in
                        this.wait(1000, function() 
                        {
                            var url = this.getCurrentUrl();
                            if (url.indexOf("/me") !=-1)
                            {
                                this.test.assertUrlMatch('\/me');
                                this.echo("You're logged in", 'ERROR');
                                this.test.assertNotVisible('#topnavigation_login_username_error','Error username not found');
                                this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
                            }
                            else
                            {
                                this.test.assertUrlMatch('\/#');
                                this.echo("You're not logged in", 'INFO');
                                this.test.assertVisible('#topnavigation_login_username_error','Error username found');
                                this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
                            }
                        });
                    });
                });  
            });
        });
        
    });

    this.then(function(){

        this.test.info("\nTry to login with username and password in the form");
        this.test.info("---------------------------------------------------------");

        /**
         * Fill the form and submit the form
         */
        this.fill('form#topnavigation_user_options_login_form', { 
            'topnavigation_login_username' : username,
            'topnavigation_login_password' : password }
            , false);
        this.thenClick('#topnavigation_user_options_login_button_login',function(){

            // Verify that the user is logged in
            this.wait(1000, function() 
            {
                var url = this.getCurrentUrl();
                if (url.indexOf("/me") !=-1)
                {
                    this.test.assertUrlMatch('\/me');
                    this.echo("You're logged in", 'INFO');
                    this.test.assertNotVisible('#topnavigation_login_username_error','Error username not found');
                    this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
                }
                else
                {
                    this.test.assertUrlMatch('\/me');
                    this.echo("You're not logged in", 'ERROR');
                    this.test.assertVisible('#topnavigation_login_username_error','Error username found');
                    this.test.assertNotVisible('#topnavigation_login_password_error','Error password not found');
                }
                casper.test.done();
            });
        });
    });
});

// Run the whole test suite (all the above)
casper.run();