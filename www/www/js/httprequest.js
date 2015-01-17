function httpsetup(uname, upass) {
	
	cordovaHTTP.useBasicAuth(uname, upass, function() {
		console.log('success1!');
	}, function() {
		console.log('error :(');
	});

	cordovaHTTP.setHeader("Header", "Value", function() {
		console.log('success2!');

	}, function() {
		console.log('error :(');

	});

	cordovaHTTP.enableSSLPinning(true, function() {
		console.log('success3!');
	}, function() {
		console.log('error :(');
	});

	cordovaHTTP.acceptAllCerts(true, function() {
		console.log('success4!');
	}, function() {
		console.log('error :(');
	});
}
