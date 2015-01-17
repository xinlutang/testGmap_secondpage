/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var base_url = "http://www.pineconetassel.com/sitelertest/";
var worker_signedin = false;
var customer_signedin = false;
var customer_uname;
var customer_upass;
var worker_uname;
var worker_upass;
var uname_record;
var upass_record;
var siteler_id;
var cdata;
//object for customer profile
var xcm = new Object();
var xcp = new Object();
//object for worker profile
var xwm = new Object();
var xwp = new Object();





var db;

var droptable = false;



var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady : function() {
	
		console.log(navigator.notification);
      //  console.log(FileTransfer);
		var map = plugin.google.maps.Map.getMap();

  		//loadPage(map, "welcome");
  		// loadPage(map, "marker1");

    	loadPage(map, "jobmap");
/*
		db = window.sqlitePlugin.openDatabase({
			name : "DB"
		});

		db.transaction(function(tx) {
			if (droptable)
				tx.executeSql('DROP TABLE IF EXISTS users');

			tx.executeSql('SELECT count(*) as cnt FROM sqlite_master WHERE type="table" AND name="users"', [], function(tx, res) {
				//alert("users"+res.rows.item(0).cnt);

				if (res.rows.item(0).cnt === 0) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, sID text, uName text, uPass text, fName text, lName text, uDate integer, uType text)');

					var timestamp = new Date().getTime() / 1000;

					tx.executeSql("INSERT INTO users (uType, uDate) VALUES (?,?)", ["customer", parseInt(timestamp)], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

					tx.executeSql("INSERT INTO users (uType, uDate) VALUES (?,?)", ["worker", parseInt(timestamp)], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

				}

			});

			db.transaction(function(tx) {
				tx.executeSql("SELECT uName as uname, uPass as upass from users WHERE uType = 'worker'", [], function(tx, res) {
					worker_uname = res.rows.item(0).uname;
					worker_upass = res.rows.item(0).upass;
				}, function(e) {
					console.log("ERROR: " + e.message);
					app.showAlert(e.message, "ERROR");
				});
			});

			db.transaction(function(tx) {
				tx.executeSql("SELECT uName as uname, uPass as upass from users WHERE uType = 'customer'", [], function(tx, res) {
					customer_uname = res.rows.item(0).uname;
					customer_upass = res.rows.item(0).upass;

				}, function(e) {
					console.log("ERROR: " + e.message);
				});
			});

		});

		db.transaction(function(tx) {
			if (droptable)
				tx.executeSql('DROP TABLE IF EXISTS contacts');

			tx.executeSql('SELECT count(*) as cnt FROM sqlite_master WHERE type="table" AND name="contacts"', [], function(tx, res) {
				//alert("contacts"+res.rows.item(0).cnt);

				if (res.rows.item(0).cnt === 0) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (id integer primary key, uType text, uwEmail text, upEmail text, uwPhone text, ucPhone text,uhPhone text)');

					tx.executeSql("INSERT INTO contacts (uType) VALUES (?)", ["customer"], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

					tx.executeSql("INSERT INTO contacts (uType) VALUES (?)", ["worker"], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

				}

			});

		});

		db.transaction(function(tx) {

			if (droptable)
				tx.executeSql('DROP TABLE IF EXISTS homeaddress');

			tx.executeSql('SELECT count(*) as cnt FROM sqlite_master WHERE type="table" AND name="homeaddress"', [], function(tx, res) {
				//alert("homeaddress"+res.rows.item(0).cnt);

				if (res.rows.item(0).cnt === 0) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS homeaddress (id integer primary key, uType text, uhStreet text,uhCity text,uhState text,uhZip text)');

					tx.executeSql("INSERT INTO homeaddress (uType) VALUES (?)", ["customer"], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

					tx.executeSql("INSERT INTO homeaddress (uType) VALUES (?)", ["worker"], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

				}

			});

		});

		db.transaction(function(tx) {
			if (droptable)
				tx.executeSql('DROP TABLE IF EXISTS workaddress');

			tx.executeSql('SELECT count(*) as cnt FROM sqlite_master WHERE type="table" AND name="workaddress"', [], function(tx, res) {
				//	alert("workaddress"+res.rows.item(0).cnt);

				if (res.rows.item(0).cnt === 0) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS workaddress (id integer primary key, uType text, uCompany text, ucStreet text,ucCity text,ucState text,ucZip text)');

					tx.executeSql("INSERT INTO workaddress (uType) VALUES (?)", ["customer"], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

				}

			});

		});

		db.transaction(function(tx) {

			if (droptable)
				tx.executeSql('DROP TABLE IF EXISTS vehicles');

			tx.executeSql('SELECT count(*) as cnt FROM sqlite_master WHERE type="table" AND name="vehicles"', [], function(tx, res) {
				//alert("vehicles"+res.rows.item(0).cnt);

				if (res.rows.item(0).cnt === 0) {
					tx.executeSql('CREATE TABLE IF NOT EXISTS vehicles (id integer primary key, vMake text, vModel text,vColor text,vLicense text)');

					tx.executeSql("INSERT INTO vehicles (vMake) VALUES (?)", [" "], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});
					tx.executeSql("INSERT INTO vehicles (vMake) VALUES (?)", [" "], function(tx, res) {

					}, function(e) {
						console.log("ERROR: " + e.message);
						app.showAlert(e.message, "ERROR");
					});

				}

			});

		});
		*/
	//	load_worker_job_map();

		app.receivedEvent('deviceready');
							
							
	//	window.location = '#worker_menu_page';

	},

	// Update DOM on a Received Event
	receivedEvent : function(id) {

		var parentElement = document.getElementById(id);
		console.log('Received Event: ' + id);

	},

	showAlert : function(message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert( title ? (title + ": " + message) : message);
		}
	},
	
	
	
    showMap: function() {

        var pins = [
            {
                lat: 34.0983425,
                lon: -118.3267434,
                title: "A Cool Title",
                snippet: "A Really Cool Snippet",
                icon: mapKit.iconColors.HUE_ROSE
            },
            {
                lat: 34.1,
                lon: -118.3267434,
                title: "A Cool Title, with no Snippet",
                icon: {
                  type: "asset",
                  resource: "www/img/logo.png", //an image in the asset directory
                  pinColor: mapKit.iconColors.HUE_VIOLET //iOS only
                }
            },
            {
                lat: 34.0983425,
                lon: -118.3267434,
                title: "Awesome Title",
                snippet: "Awesome Snippet",
                icon: mapKit.iconColors.HUE_GREEN
            }
        ];
        //var pins = [[49.28115, -123.10450], [49.27503, -123.12138], [49.28286, -123.11891]];
        var error = function() {
          console.log('error');
        };
        var success = function() {
          document.getElementById('hide_map').style.display = 'block';
          document.getElementById('show_map').style.display = 'none';
          mapKit.addMapPins(pins, function() { 
                                      console.log('adMapPins success');  
                                      document.getElementById('clear_map_pins').style.display = 'block';
                                  },
                                  function() { console.log('error'); });
        };
        mapKit.showMap(success, error);
    },
    hideMap: function() {
        var success = function() {
          document.getElementById('hide_map').style.display = 'none';
          document.getElementById('clear_map_pins').style.display = 'none';
          document.getElementById('show_map').style.display = 'block';
        };
        var error = function() {
          console.log('error');
        };
        mapKit.hideMap(success, error);
    },
    clearMapPins: function() {
        var success = function() {
          console.log('Map Pins cleared!');
        };
        var error = function() {
          console.log('error');
        };
        mapKit.clearMapPins(success, error);
    },
    changeMapType: function() {
      var success = function() {
          console.log('Map Type Changed');
        };
        var error = function() {
          console.log('error');
        };
        mapKit.changeMapType(mapKit.mapType.MAP_TYPE_SATELLITE, success, error);
    }
};
