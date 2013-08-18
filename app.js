var express = require('express');
var app = express();
var _ = require('lodash');
var http = require('http');
var lockbox = require('./lib/lockbox.js');

var testform = '<br /><form method="post" action="/">Steering Wheel Angle: <input type="text" name="steering_wheel_angle" /><input type="submit" /></form>';

var steering_wheel_side ='',
	brake_pedal_status ='',
	windshield_wiper_status ='',
	headlamp_status ='';

app.use(express.bodyParser());

app.get('/', function(req, res){
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log ('\nGET ', ip);
	if (req.query.unlock=='y') {
		console.log('UNLOCKING');
		lockbox.locked = false;

		var options = {
		  host: '192.168.33.99',
		  path: '/',
		  port: '8889',
		  method: 'GET'
		};

		callback = function(response) {
		  var str = ''
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var req = http.request(options, callback);
		//This is the data we are posting, it needs to be a string or a buffer
		req.end();

	}
	/*
	if (typeof(req.query.lock) != 'undefined' && req.query.lock=='y') {
		lockbox.locked = true;	
	}
	*/
	res.send('<html><body>The lockbox is ' + lockbox.locked ? 'LOCKED' : 'UNLOCKED' + testform + '</body></html>');
});

app.post('/', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var records = req.body.records;
	console.log('\nPOST Received', ip);
	//console.log(req.body);

    _.each(records, function(obj){
        var name = obj.name,
            value = obj.value;

        var listenFor = ['steering_wheel_angle',
        				 'brake_pedal_status',
        				 'windshield_wiper_status',
        				 'headlamp_status'];

        if (_.indexOf(listenFor, name) > -1) {

            console.log(name, value);

            switch (name) {
                case 'steering_wheel_angle':
                    if (value > 0) {
                        console.log('** STEERING WHEEL RIGHT');
                        // set the steering wheel side
                        //steering_wheel_side = 'RIGHT';
                    } else {
                        //console.log('** STEERING WHEEL LEFT');
                        steering_wheel_side = 'LEFT';
                    }
                    //console.log(obj.name, obj.value);
                break;
                case 'brake_pedal_status':
                	brake_pedal_status = value;
                break;
                case 'windshield_wiper_status':
                	windshield_wiper_status = value;
                break;
                case 'headlamp_status':
                	headlamp_status = value;
                break;
            }

            console.log('COMBO: sw:'+steering_wheel_side, 'brake:'+brake_pedal_status, 'windshield:'+windshield_wiper_status, 'headlamp:'+headlamp_status);
            
            // check the combo
            if (steering_wheel_side == 'LEFT' && brake_pedal_status ) {
            	lockbox.locked = false;

				var options = {
				  host: '192.168.33.99',
				  path: '/',
				  port: '8889',
				  method: 'GET'
				};

				callback = function(response) {
				  var str = ''
				  response.on('data', function (chunk) {
				    str += chunk;
				  });

				  response.on('end', function () {
				    console.log(str);
				  });
				}

				var req = http.request(options, callback);
				//This is the data we are posting, it needs to be a string or a buffer
				req.end();


            }

            console.log('LOCKBOX IS ', lockbox.locked);

        } else {

            //console.log ('...',_.indexOf(listenFor, name), name, value);
        }


    });
	res.send('ok!  ' +testform+ ' ' +ip);
});

app.listen(3001);