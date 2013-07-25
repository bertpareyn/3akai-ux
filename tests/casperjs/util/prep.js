// Set up test tenant
casper.test.begin('Prepare environment for tests', function(test) {
	casper.start('http://admin.oae.com', function() {
		casper.waitForSelector('#admin-login-form', function() {
			casper.then(function() {
				userUtil().doAdminLogIn('administrator', 'administrator');
			});

			casper.then(function() {
				adminUtil().createTenant('test', 'CasperJS Tenant', 'test.oae.com', function() {
					adminUtil().writeConfig('test', {
						'oae-principals/recaptcha/enabled': false
					}, function() {
						userUtil().doAdminLogOut();
					});
				});
			});
		});
	});

	casper.run(function() {
		test.done();
	});
});