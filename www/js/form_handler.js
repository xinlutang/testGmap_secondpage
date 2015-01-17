var source = $("#customer-schedule-template").html();
var customer_schedule_templat = Handlebars.compile(source);
//worker_schedule_templatsource = $("#worker-schedule-template").html();
//var worker_schedule_templat = Handlebars.compile(source);

/**
 * Change the embed page view.
 * @param {Object} map
 * @param {String} pageName
 */
function loadPage(map, pageName) {
 // alert("loadPage");
  $(document).trigger("pageLeave", map);
  $.get("./pages/" + pageName + ".html", function(html) {
    $("#map_container").html(html);
    $.mobile.activePage.trigger("create");
    
    // PrettyPrint
    // @refer https://code.google.com/p/google-code-prettify/
    if (typeof prettyPrint === "function") {
      prettyPrint();
    }
    
    map.clear();
    map.off();
    
    // Embed a map into the div tag.
    var div = $("#map_canvas")[0];
    if (div) {
    //	alert("map.setdiv" + div);
      map.setDiv(div);
    }
    else
    {
    	    	alert("no map.setdiv");

    }
    
    // Execute the code
    setTimeout(function() {
      $(document).trigger("pageLoad", map);
    }, 1000);
  });
  //	alert("loadPage done");

}





function autotab(current, to, pattern, message) {
	var haserror = false;
	//alert(current.value);
	if (!current.value.match(pattern) && !current.value.length == 0) {
		app.showAlert(message, "ERROR");
		haserror = true;
		current.focus()
	}
	if (current.value.length == current.getAttribute("maxlength") && !haserror) {
		to.focus();
	}
}

function load_worker_job_map() {
	//alert("load map");

	var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);
	// Default to Hollywood, CA when no geolocation support

	if (navigator.geolocation) {
		function success(pos) {
			// Location found, show map with these coordinates
			drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		}

		function fail(error) {
			drawMap(defaultLatLng);
			// Failed to find location, show default map
		}

		// Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
		navigator.geolocation.getCurrentPosition(success, fail, {
			maximumAge : 500000,
			enableHighAccuracy : true,
			timeout : 6000
		});
	} else {
		drawMap(defaultLatLng);
		// No geolocation support, show default map
	}

	//window.location = "#worker_mapview_page";

}

function drawMap(latlng) {
	var myOptions = {
		zoom : 10,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

	// Add an overlay to the map of current lat/lng
	var marker = new google.maps.Marker({
		position : latlng,
		map : map,
		title : "My Location!"
	});
}

function qrScanner() {
	var qrcode;
	$('#onsitecheckin_btn').button('enable');

	cordova.plugins.barcodeScanner.scan(function(result) {

		$('#qrcode_result').val(result.text);
		qrcode = result.text;
		searchJob(qrcode);
		app.showAlert("qrcode=" + qrcode, "SCAN RESULT");
	}, function(error) {
		//var message =
		app.showAlert("Scanning failed: " + error, "FAILURE");
	});
	return false;
}

function searchJob(qrcode) {
	var text;
	text = "Owner: Customer 1\n";
	text += "service: Sedan Basic $20.00\n";
	text += "Make: Honda, Model: Accord, Year: 2014\n";
	text += "LIC# 1234\n";
	text += "Date: 2014-11-30 8:00Am~12:00pm\n";

	//alert(text);

	$('#onsitejobdetail').val(text);

}

function testph1() {
	var ph1 = $('#xcm_workph1').val();
	var numbers = /^[0-9]+$/;
	if (ph1.match(numbers)) {
		alert("Only numbers are here:" + ph1);
	} else {
		alert("Something that was not a number was entered:" + ph1);
	}
}

function onsiteLocInfo(lat, lon, date) {
	//var lat1;
	var suc = function(p) {
		lat = p.coords.latitude;
		lon = p.coords.longitude;
		date = new Date(p.timestamp);
		var location = "job location: \nlatitude= " + lat + "; longitude=" + lon + "\n timestamp:" + date;
		app.showAlert(location, "INFO");

	};
	var locFail = function() {
		var massage = "GPS location failure";
		app.showAlert(massage, "ERROR");
	};

	navigator.geolocation.getCurrentPosition(suc, locFail);

}

function onsiteCheckIn() {

	$('#onsitecheckin_btn').button('disable');
	$('#onsitecheckout_btn').button('enable');
	var lat;
	var lon;
	var date;
	//="2014-12-01 10:00am";
	onsiteLocInfo(lat, lon, date);
	//alert("job location: latitude= "+lat+"; longitude="+lon+"<br>Start time:"+date);

}

function onsiteCheckOut() {

	$('#onsitecheckin_btn').button('disable');
	$('#onsitecheckout_btn').button('disable');
	var lat;
	var lon;
	var date;
	onsiteLocInfo(lat, lon, date);
	//alert("job location: latitude= "+lat+"; longitude="+lon+"<br>End time:"+date);
}

function updateWorkerProfileTables() {

	var name = $('#name').val();
	alert(name);

}

function load_customer_schedule(type) {
	var postData = 'sid=' + siteler_id;
	//alert(postData);

	var phpurl = base_url + 'customer_check_schedule.php';
	//$("#customer_schedule").html(customer_schedule_templat(data));

	var request = $.ajax({
		url : phpurl,
		type : "POST",
		data : postData,
		dataType : "json"
	});

	request.done(function(data) {
		//	alert(data.sid);

		//	alert(data.appointments[0].date.date);
		$("#customer_schedule").html(customer_schedule_templat(data));
	});

	request.fail(function(jqXHR, textStatus) {
		app.showAlert("Request failed: " + textStatus, "ERROR");
	});

	window.location = "#customer_check_schedule_page";

}

function load_customer_ballence() {
	alert("load_customer_ballence");
	window.location = "#customer_ballance_page";
}

function load_worker_schedule(type) {
	//alert(type)
	var postData = 'sid=' + "W0000013";
	//	alert(postData);
	//alert(postData);
	var phpurl = base_url + 'worker_check_schedule.php';

	var source = $("#worker-schedule-template").html();

	var worker_schedule_templat = Handlebars.compile(source);

	var request = $.ajax({
		url : phpurl,
		type : "POST",
		data : postData,
		dataType : "json"
	});

	request.done(function(data) {
		$("#worker_schedule").html(worker_schedule_templat(data));
	});

	request.fail(function(jqXHR, textStatus) {
		app.showAlert("Request failed: " + textStatus, "ERROR");
	});

	window.location = "#worker_check_schedule_page";

}

function load_job_detail(slotid) {

	var postData = 'slotid=' + slotid;
	//	alert(postData);
	//  alert(postData);

	var phpurl = base_url + 'worker_get_job_detail.php';

	var source = $("#job-detail-template").html();
	var worker_job_detail_templat = Handlebars.compile(source);

	var request = $.ajax({
		url : phpurl,
		type : "POST",
		data : postData,
		dataType : "json"
	});

	request.done(function(data) {
		$("#job_owner_detail").html(worker_job_detail_templat(data));
	});

	request.fail(function(jqXHR, textStatus) {
		app.showAlert("Request failed: " + textStatus, "ERROR");
	});

	window.location = "#worker_check_schedule_job_page";

}

function load_worker_statement() {
	//alert("load_customer_ballence");
	window.location = "#worker_view_account_page";
}

function checkCustomerPromotion() {
	app.showAlert("No Promotion Appliable", "Promotion");
	$('#promotion_rate').val(10);
}

function updateCustomerPromotion() {

	var postData = 'sid=' + siteler_id;
	//	alert(postData);
	//alert(postData);
	var phpurl = base_url + 'update_customer_promotion.php';

	var source = $("#customer-promotion-template").html();

	var customer_promotion_template = Handlebars.compile(source);

	var data = {
		promotions : [{
			daterange : "1 Jan 2015 - 31 Jan 2015",
			class : [{
				type : "Gold Member",
				desc : "3 services in last quater",
				rate : "10%"
			}, {
				type : "Silver Member",
				desc : "2 services in last quater",
				rate : "5%"

			}, {
				type : "Group",
				desc : "Yahoo,Google, Facebook",
				rate : "15%"

			}]
		}, {
			daterange : "1 Feb 2015 - 25 Feb 2015",
			class : [{
				type : "Gold Member",
				desc : "3 services in last quater",
				rate : "20%"
			}, {
				type : "Silver Member",
				desc : "2 services in last quater",
				rate : "25%"

			}, {
				type : "Group",
				desc : "Yahoo",
				rate : "35%"

			}]
		}]
	};

	$("#customer_promotion").html(customer_promotion_template(data));
	app.showAlert("The discount rate is only valid when you book the appointment today.", "Info");

	/*
	 var request = $.ajax({
	 url : phpurl,
	 type : "POST",
	 data : postData,
	 dataType : "json"
	 });

	 request.done(function(data) {
	 //alert("promotion")
	 $("#customer_promotion").html(cutomer-promotion-template(data));
	 });

	 request.fail(function(jqXHR, textStatus) {
	 app.showAlert("Request failed: " + textStatus, "ERROR");
	 });
	 */
	window.location = "#customer_promotion_page";

}

//this function is called after the customer successfully post their "become_customer_member_form"
//all the form fiels except credit card info will be stored into many db tables

function updateCustomerProfileTables() {

	xcm.uname = $('#xcm_uname').val();
	xcm.upass = $('#xcm_upass').val();
	xcm.fname = $('#xcm_fname').val();
	xcm.lname = $('#xcm_lname').val();

	//alert(xcm.fname);

	db.transaction(function(tx) {

		var timestamp = new Date().getTime() / 1000;

		tx.executeSql("UPDATE OR REPLACE users SET sID=?, uName = ?, uPass=?, fName=?, lName=?, uDate=? WHERE uType = 'customer'", [xcm.siteler_id, xcm.uname, xcm.upass, xcm.fname, xcm.lname, parseInt(timestamp)], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("users" + e.message, "ERROR");
		});

	});

	xcm.workemail = $('#xcm_workemail').val();
	xcm.registeremail = $('#xcm_registeremail').val();

	xcm.workph1 = $('#xcm_workph1').val();
	xcm.workph2 = $('#xcm_workph2').val();
	xcm.workph3 = $('#xcm_workph3').val();

	xcm.workph = xcm.workph1 + "-" + xcm.workph2 + "-" + xcm.workph3;

	xcm.cellph1 = $('#xcm_cellph1').val();
	xcm.cellph2 = $('#xcm_cellph2').val();
	xcm.cellph3 = $('#xcm_cellph3').val();

	xcm.cellph = xcm.cellph1 + "-" + xcm.cellph2 + "-" + xcm.cellph3;

	xcm.homeph1 = $('#xcm_homeph1').val();
	xcm.homeph2 = $('#xcm_homeph2').val();
	xcm.homeph3 = $('#xcm_homeph3').val();

	xcm.homeph = xcm.homeph1 + "-" + xcm.homeph2 + "-" + xcm.homeph3;

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE contacts SET uwEmail = ?, upEmail=?, uwPhone=?, ucPhone=?, uhPhone=? WHERE uType = 'customer'", [xcm.workemail, xcm.registeremail, xcm.workph, xcm.cellph, xcm.homeph], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("contacts" + e.message, "ERROR");
		});

	});

	xcm.company = $('#xcm_company').val();
	xcm.company_street = $('#xcm_company_street').val();
	xcm.company_city = $('#xcm_company_city').val();
	xcm.company_state = $('#xcm_company_state').val();
	xcm.company_zip = $('#xcm_company_zip').val();

	xcm.home_street = $('#xcm_street').val();
	xcm.home_city = $('#xcm_city').val();
	xcm.home_state = $('#xcm_state').val();
	xcm.home_zip = $('#xcm_zip').val();

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE workaddress SET uCompany = ?, ucStreet=?, ucCity=?, ucState=?, ucZip=? WHERE uType = 'customer'", [xcm.company, xcm.company_street, xcm.company_city, xcm.company_state, xcm.company_zip], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE homeaddress SET uhStreet=?, uhCity=?, uhState=?, uhZip=? WHERE uType = 'customer'", [xcm.home_street, xcm.home_city, xcm.home_state, xcm.home_zip], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

	});

	xcm.creditcard = $('#xcm_creditcard').val();
	xcm.cvv = $('#xcm_cvv').val();
	xcm.exp_month = $('#xcm_exp_month').val();
	xcm.exp_year = $('#xcm_exp_year').val();

	xcm.v1make = $('#xcm_v1make').val();
	xcm.v1model = $('#xcm_v1model').val();
	xcm.v1color = $('#xcm_v1color').val();
	xcm.v1license = $('#xcm_v1license').val();

	xcm.v2make = $('#xcm_v2make').val();
	xcm.v2model = $('#xcm_v2model').val();
	xcm.v2color = $('#xcm_v2color').val();
	xcm.v2license = $('#xcm_v2license').val();

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE vehicles SET vMake = ?, vModel=?, vColor=?, vLicense=? WHERE id = 1", [xcm.v1make, xcm.v1model, xcm.v1color, xcm.v1license], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

		tx.executeSql("UPDATE OR REPLACE vehicles SET vMake = ?, vModel=?, vColor=?, vLicense=? WHERE id = 2", [xcm.v2make, xcm.v2model, xcm.v2color, xcm.v2license], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

}


function updateCustomerEditProfileTables() {

	xcm.uname = $('#xcp_uname').val();
	xcm.upass = $('#xcp_upass').val();
	xcm.fname = $('#xcp_fname').val();
	xcm.lname = $('#xcp_lname').val();

	//alert(xcm.fname);

	db.transaction(function(tx) {

		var timestamp = new Date().getTime() / 1000;

		tx.executeSql("UPDATE OR REPLACE users SET sID=?, uName = ?, uPass=?, fName=?, lName=?, uDate=? WHERE uType = 'customer'", [xcm.siteler_id, xcm.uname, xcm.upass, xcm.fname, xcm.lname, parseInt(timestamp)], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("users" + e.message, "ERROR");
		});

	});

	xcm.workemail = $('#xcp_workemail').val();
	xcm.registeremail = $('#xcp_registeremail').val();

	xcm.workph1 = $('#xcp_workph1').val();
	xcm.workph2 = $('#xcp_workph2').val();
	xcm.workph3 = $('#xcp_workph3').val();

	xcm.workph = xcm.workph1 + "-" + xcm.workph2 + "-" + xcm.workph3;

	xcm.cellph1 = $('#xcp_cellph1').val();
	xcm.cellph2 = $('#xcp_cellph2').val();
	xcm.cellph3 = $('#xcp_cellph3').val();

	xcm.cellph = xcm.cellph1 + "-" + xcm.cellph2 + "-" + xcm.cellph3;

	xcm.homeph1 = $('#xcp_homeph1').val();
	xcm.homeph2 = $('#xcp_homeph2').val();
	xcm.homeph3 = $('#xcp_homeph3').val();

	xcm.homeph = xcm.homeph1 + "-" + xcm.homeph2 + "-" + xcm.homeph3;

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE contacts SET uwEmail = ?, upEmail=?, uwPhone=?, ucPhone=?, uhPhone=? WHERE uType = 'customer'", [xcm.workemail, xcm.registeremail, xcm.workph, xcm.cellph, xcm.homeph], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("contacts" + e.message, "ERROR");
		});

	});

	xcm.company = $('#xcp_company').val();
	xcm.company_street = $('#xcp_company_street').val();
	xcm.company_city = $('#xcp_company_city').val();
	xcm.company_state = $('#xcp_company_state').val();
	xcm.company_zip = $('#xcp_company_zip').val();

	xcm.home_street = $('#xcp_street').val();
	xcm.home_city = $('#xcp_city').val();
	xcm.home_state = $('#xcp_state').val();
	xcm.home_zip = $('#xcp_zip').val();

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE workaddress SET uCompany = ?, ucStreet=?, ucCity=?, ucState=?, ucZip=? WHERE uType = 'customer'", [xcm.company, xcm.company_street, xcm.company_city, xcm.company_state, xcm.company_zip], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE homeaddress SET uhStreet=?, uhCity=?, uhState=?, uhZip=? WHERE uType = 'customer'", [xcm.home_street, xcm.home_city, xcm.home_state, xcm.home_zip], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

	});

	xcm.creditcard = $('#xcp_creditcard').val();
	xcm.cvv = $('#xcp_cvv').val();
	xcm.exp_month = $('#xcp_exp_month').val();
	xcm.exp_year = $('#xcp_exp_year').val();

	xcm.v1make = $('#xcp_v1make').val();
	xcm.v1model = $('#xcp_v1model').val();
	xcm.v1color = $('#xcp_v1color').val();
	xcm.v1license = $('#xcp_v1license').val();

	xcm.v2make = $('#xcp_v2make').val();
	xcm.v2model = $('#xcp_v2model').val();
	xcm.v2color = $('#xcp_v2color').val();
	xcm.v2license = $('#xcp_v2license').val();

	db.transaction(function(tx) {

		tx.executeSql("UPDATE OR REPLACE vehicles SET vMake = ?, vModel=?, vColor=?, vLicense=? WHERE id = 1", [xcm.v1make, xcm.v1model, xcm.v1color, xcm.v1license], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("address" + e.message, "ERROR");
		});

		tx.executeSql("UPDATE OR REPLACE vehicles SET vMake = ?, vModel=?, vColor=?, vLicense=? WHERE id = 2", [xcm.v2make, xcm.v2model, xcm.v2color, xcm.v2license], function(tx, res) {

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

}




function updateWorkerProfileTables() {
	app.showAlert("under construction", "ERROR");

}

//this function is called when the customer want to update profile.
// the edit profile form will be filled from data obtained from database

function updateCustomerProfileForm() {

	db.transaction(function(tx) {

		tx.executeSql("SELECT sID as sid, fName as fname, lName as lname, uName as uname, uPass as upass FROM users WHERE uType = 'customer'", [], function(tx, res) {
			$('#xcp_siteler_id').val(res.rows.item(0).sid);
			$('#xcp_uname').val(res.rows.item(0).uname);
			$('#xcp_upass').val(res.rows.item(0).upass);
			$('#xcp_fname').val(res.rows.item(0).fname);
			$('#xcp_lname').val(res.rows.item(0).lname);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("SELECT uwEmail as wemail, upEmail as pemail, uwPhone as wphone, ucPhone as cphone, uhPhone as hphone FROM contacts WHERE uType = 'customer'", [], function(tx, res) {

			$('#xcp_workemail').val(res.rows.item(0).wemail);
			$('#xcp_registeremail').val(res.rows.item(0).pemail);

			var wphone = res.rows.item(0).wphone;
			var temp = wphone.split("-");

			$('#xcp_workph1').val(temp[0]);
			$('#xcp_workph2').val(temp[1]);
			$('#xcp_workph3').val(temp[2]);

			var cphone = res.rows.item(0).cphone;
			var temp = cphone.split("-");
			$('#xcp_cellph1').val(temp[0]);
			$('#xcp_cellph2').val(temp[1]);
			$('#xcp_cellph3').val(temp[2]);

			var hphone = res.rows.item(0).hphone;
			var temp = hphone.split("-");

			$('#xcp_homeph1').val(temp[0]);
			$('#xcp_homeph2').val(temp[1]);
			$('#xcp_homeph3').val(temp[2]);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("SELECT uCompany as company, ucStreet as street, ucCity as city, ucState as state, ucZip as zip FROM workaddress WHERE uType = 'customer'", [], function(tx, res) {

			$('#xcp_company').val(res.rows.item(0).company);
			$('#xcp_company_street').val(res.rows.item(0).street);
			$('#xcp_company_city').val(res.rows.item(0).city);
			$('#xcp_company_state').val(res.rows.item(0).state);
			$('#xcp_company_zip').val(res.rows.item(0).zip);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("SELECT  uhStreet as street, uhCity as city, uhState as state, uhZip as zip FROM homeaddress WHERE uType = 'customer'", [], function(tx, res) {

			$('#xcp_street').val(res.rows.item(0).street);
			$('#xcp_city').val(res.rows.item(0).city);
			$('#xcp_state').val(res.rows.item(0).state);
			$('#xcp_zip').val(res.rows.item(0).zip);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert(e.message, "ERROR");
		});

	});

	db.transaction(function(tx) {

		tx.executeSql("SELECT vMake as make, vModel as model, vColor as color, vLicense as license FROM vehicles WHERE id = 1", [], function(tx, res) {
			$('#xcp_v1make').val(res.rows.item(0).make);
			$('#xcp_v1model').val(res.rows.item(0).model);
			$('#xcp_v1color').val(res.rows.item(0).color);
			$('#xcp_v1license').val(res.rows.item(0).license);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("vehicles" + e.message, "ERROR");
		});

		tx.executeSql("SELECT vMake as make, vModel as model, vColor as color, vLicense as license FROM vehicles WHERE id = 2", [], function(tx, res) {
			$('#xcp_v2make').val(res.rows.item(0).make);
			$('#xcp_v2model').val(res.rows.item(0).model);
			$('#xcp_v2color').val(res.rows.item(0).color);
			$('#xcp_v2license').val(res.rows.item(0).license);

		}, function(e) {
			console.log("ERROR: " + e.message);
			app.showAlert("vehicles" + e.message, "ERROR");
		});

	});

	window.location = "#customer_edit_profile_page";
}

function updateMembershipCard() {

	/*	db.transaction(function(tx) {
	 tx.executeSql("select uDate as date, uType as type from users", [], function(tx, res) {
	 //app.showAlert(res.rows.length,'Reresult');

	 var i;
	 for ( i = 0; i < res.rows.length; i++)
	 alert(res.rows.item(i).date + "/" + res.rows.item(i).type);

	 }, function(e) {
	 console.log("ERROR: " + e.message);
	 alert("ERROR: " + e.message);
	 });
	 });*/

	app.showAlert("updateMembershipCard, under construction", "Warning");

};

$('form').submit(function() {

	var landmarkID = $(this).parent().attr('data-landmark-id');

	var postData = $(this).serialize();
	//	alert(postData);

	switch(landmarkID) {

	case 'become_worker_form':
		//	alert("become_worker_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'become_siteler.php',
			success : function(data) {
				console.log(data);
				app.showAlert(data, "Result");

				window.location = "#worker_page";

			},
			error : function() {
				console.log(data);
				app.showAlert('There was an error in registration form', "ERROR");
			}
		});

		break;

	case 'worker_login_form':
		var uname = $('#worker_uname').val();

		var upass = $('#worker_upassword').val();

		db.transaction(function(tx) {
			tx.executeSql("SELECT uName as uname, uPass as upass from users WHERE uType = 'worker'", [], function(tx, res) {
				worker_uname = res.rows.item(0).uname;
				worker_upass = res.rows.item(0).upass;
				if (worker_uname != uname) {
					app.showAlert("Your user name dose not matches our records.", "Log In Error");
					window.location = "#worker_login_dialog_page";
				};
				if (worker_upass != upass) {
					app.showAlert("Your user paasword dose not matches our records.", "Log In Error");
					window.location = "#worker_login_dialog_page";
				};
			}, function(e) {
				app.showAlert(e.message, "ERROR");
			});
		});
		window.location = "#worker_menu_page";

		//var phpurl = base_url + 'user_login.php';
		/*
		 $.ajax({
		 type : 'POST',
		 data : postData,
		 url : phpurl,
		 success : function(data) {
		 //console.log(data);
		 if (data == "ok") {
		 worker_signedin = true;
		 db.transaction(function(tx) {

		 var timestamp = new Date().getTime() / 1000;

		 tx.executeSql("UPDATE OR REPLACE users SET uName = ?, uPass=?, uDate=? WHERE uType = 'worker'", [worker_uname, worker_upass, parseInt(timestamp)], function(tx, res) {

		 }, function(e) {
		 console.log("ERROR: " + e.message);
		 app.showAlert(e.message, "ERROR");
		 });

		 });

		 window.location = "#worker_menu_page";
		 } else
		 app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");
		 },
		 error : function() {
		 console.log(data);
		 app.showAlert('There was an error in your login', "ERROR");
		 }
		 });
		 */
		break;

	case 'worker_onsite_checkin_form':
		//alert("worker_onsite_checkin_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'worker_onsite_checkin.php',
			success : function(data) {
				console.log(data);
				alert(data);
				if (data == "ok")
					window.location = "#worker_menu_page";
				else
					app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");
			},
			error : function() {
				console.log(data);
				app.showAlert('There was an error check in');
			}
		});

		break;

	case 'worker_onsite_checkout_form':
		alert("worker_onsite_checkout_form");
		worker_signedin = false;
		/*
		 $.ajax({
		 type : 'POST',
		 data : postData,
		 url : base_url + 'worker_onsite_checkout.php',
		 success : function(data) {
		 console.log(data);
		 alert(data);
		 if (data == "ok")
		 window.location = "#worker_menu_page";
		 else
		 alert("username/password does not match our records, please sign up an account or sign in again.");
		 },
		 error : function() {
		 console.log(data);
		 alert('There was an error adding your comment');
		 }
		 });
		 */
		break;

	case 'worker_check_schedule_form':
		alert("worker_check_schedule_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'worker_check_schedule.php',
			success : function(data) {
				console.log(data);
				alert(data);
				if (data == "ok") {
					window.location = "#worker_menu_page";

				} else
					app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");
			},
			error : function() {
				console.log(data);
				alert('There was an error adding your comment');
			}
		});

		break;

	case 'worker_check_account_form':
		alert("worker_check_account_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'worker_check_account.php',
			success : function(data) {
				console.log(data);
				alert(data);
				if (data == "ok")
					window.location = "#worker_menu_page";
				else
					app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");
			},
			error : function() {
				console.log(data);
				alert('There was an error adding your comment');
			}
		});

		break;

	case 'edit_worker_profile_form':
		alert("edit_worker_profile_form");
		var phpurl = base_url + 'edit_worker_profile.php';
		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {
				console.log(data);

				var response = JSON.parse(data);
				app.showAlert(response.message, "Result");
				//should get from server return.
				xcm.siteler_id = response.sid;

				updateWorkerProfileTables();

				window.location = "#worker_menu_page";

			},
			error : function() {
				console.log(data);
				alert('There was an error adding your comment');
			}
		});

		break;
	case 'customer_login_form':

		//alert("customer_login_form");
		customer_uname = $('#customer_uname').val();

		customer_upass = $('#customer_upassword').val();

		db.transaction(function(tx) {
			tx.executeSql("SELECT sID as sid, uName as uname, uPass as upass FROM users WHERE uType = 'customer'", [], function(tx, res) {
				uname_record = res.rows.item(0).uname;
				upass_record = res.rows.item(0).upass;

				if (uname_record != customer_uname) {
					app.showAlert("Your siteler user name does not match out with record, please check and try again", "ERROR");
					window.location = "#customer_page";
				} else if (upass_record != customer_upass) {
					app.showAlert("Your siteler user password does not match with out record, please check and try again", "ERROR");

					window.location = "#customer_page";
				} else {
					siteler_id = res.rows.item(0).sid;
					window.location = "#customer_menu_page";

					/*
					 var phpurl = base_url + 'user_login.php';
					 $.ajax({
					 type : 'POST',
					 data : postData,
					 url : phpurl,
					 success : function(data) {
					 //console.log(data);
					 //alert(data);
					 var response = JSON.parse(data);

					 if (response.status == "ok") {
					 customer_signedin = true;
					 siteler_id = response.sid;

					 //update the customer login time
					 db.transaction(function(tx) {

					 var timestamp = new Date().getTime() / 1000;

					 tx.executeSql("UPDATE OR REPLACE users SET uDate=? WHERE uType = 'customer'", [parseInt(timestamp)], function(tx, res) {

					 }, function(e) {
					 console.log("ERROR: " + e.message);
					 app.showAlert(e.message, "ERROR");
					 });

					 });

					 window.location = "#customer_menu_page";
					 } else
					 app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");
					 },
					 error : function() {
					 console.log(data);
					 app.showAlert("username/password does not match our records, please sign up an account or sign in again.", "ERROR");

					 }
					 });*/
				}

			}, function(e) {
				console.log("ERROR: " + e.message);
				app.showAlert("Users" + e.message, "ERROR");
			});
		});

		break;

	case 'one-time_appointment_form':

		var phpurl = base_url + 'onetime_appointment.php';
		//	alert(postData);

		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {
				//	alert(data);
				var response = JSON.parse(data);
				app.showAlert(response.message, "Result");

				window.location = "#customer_page";

			},
			error : function() {
				alert('There was an error adding your make_appointment form, try again');
			}
		});

		break;

	case 'contact_us_form':

		var phpurl = base_url + 'sendemail.php';
		//alert(postData);
		//alert(phpurl);

		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {
				//alert(data);
				var response = JSON.parse(data);
				app.showAlert(response.message, "Result");

				window.location = "#customer_page";

			},
			error : function() {
				app.showAlert('There is a network error! Please try again', "ERROR");
			}
		});

		break;

	case 'make_appoinmtment_form':

		var phpurl = base_url + 'member_make_appointment.php';
		alert(postData);

		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {
				//alert(data);
				var response = JSON.parse(data);
				app.showAlert(response.message, "Result");

				window.location = "#customer_menu_page";

			},
			error : function() {
				alert('There was an error adding your make_appointment form, try again');
			}
		});

		break;

	case 'edit_customer_profile_form':

		//alert("sid"+siteler_id);

		var phpurl = base_url + 'customer_edit_profile.php';

		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {

				var response = JSON.parse(data);

				if (response.status == "ok") {
					app.showAlert(response.message, "Result");
                    
                    updateCustomerEditProfileTables();
                    
					window.location = "#customer_menu_page";
				}
			},
			error : function() {
				console.log(data);
				//	alert('There was an error adding your comment');
				app.showAlert('There was an error adding your comment', "ERROR");
			}
		});

		break;

	case 'check_customer_account_form':
		alert("check_customer_account_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'check_customer_account.php',
			success : function(data) {
				console.log(data);
				if (data == "ok")
					window.location = "#customer_menu_page";
				else
					alert(data);
			},
			error : function() {
				console.log(data);
				alert('There was an error adding your comment');
			}
		});

		break;

	case 'check_customer_schedule_form':
		alert("check_customer_schedule_form");

		$.ajax({
			type : 'POST',
			data : postData,
			url : base_url + 'check_customer_schedule.php',
			success : function(data) {
				console.log(data);
				if (data == "ok")
					window.location = "#customer_menu_page";
				else
					alert(data);
			},
			error : function() {
				console.log(data);
				alert('There was an error adding your comment');
			}
		});

		break;

	case 'become_customer_member_form':
		//	app.showAlert("become_customer_member_form","Form");
		var phpurl = base_url + 'become_member.php';
		alert(postData);
		$.ajax({
			type : 'POST',
			data : postData,
			url : phpurl,
			success : function(data) {
				//alert(data);
				var response = JSON.parse(data);

				app.showAlert(response.message, "Result");

				if (data.status == "ok") {
					//should get from server return.
					xcm.siteler_id = response.sid;

					updateCustomerProfileTables();

				}

				window.location = '#customer_login_dialog_page';

			},
			error : function() {
				//console.log(data);
				app.showAlert('There was an error in registration form', 'ERROR');
			}
		});

		break;

	default:
		break;

	}

	return false;
});

