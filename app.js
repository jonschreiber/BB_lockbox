var express = require('express');
var app = express();
var _ = require('lodash');
var lockbox = require('./lib/lockbox.js');
var testform = '<form method="post" action="/"><input type="text" name="moo" /><input type="submit" /></form>';

app.use(express.bodyParser());

app.get('/', function(req, res){
	res.send(testform);
	if (req.query.unlock=='y') {
		lockbox.locked = false;
	}
	if (req.query.lock=='y') {
		lockbox.locked = true;
	}
	res.send('lockbox is ' + lockbox.locked);
	console.log('yes');
});

app.post('/', function(req, res) {
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var records = req.body.records;
	console.log('\nPOST Received', ip);
	//console.log(req.body.records);

    _.each(records, function(obj){
        var name = obj.name,
            value = obj.value;

        var listenFor = ['steering_wheel_angle',
        				 'brake_pedal_status',
        				 'window_position_passenger'];

        if (_.indexOf(listenFor, name) > -1) {

            console.log(name, value);

            switch (name) {
                case 'steering_wheel_angle':
                    if (value > 0) {
                        console.log('** STEERING WHEEL RIGHT');
                    } else {
                        console.log('** STEERING WHEEL LEFT');
                    }
                    //console.log(obj.name, obj.value);
                break;
                case 'brake_pedal_status':
                break;
            }

            console.log('LOCKBOX IS ', lockbox.locked);

        } else {

            console.log ('...',_.indexOf(listenFor, name), name, value);
        }


    });
	res.send('ok!  ' +testform+ ' ' +ip);
});

app.listen(3000);