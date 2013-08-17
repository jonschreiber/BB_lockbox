console.log('client listener starting..');

var _ = require('lodash');
var dataSource = 'bb_c-max_day_1_part_1';

var io = require('socket.io-client'),
socket = io.connect('http://playbacktool-pl475c6m.dotcloud.com', {
    port: 80
});
socket.on('connect', function () { 
    socket.emit('init', '9BaOZYnbn5');
    socket.emit('setDataSource', 'bb_c-max_day_1_part_1');
    socket.emit('names','windshield_wiper_status,brake_pedal_status,parking_brake_status,headlamp_status,high_beam_status');
	console.log("socket connected"); 
});

socket.on('ready', function(dataSource){ 
	/* dataSource is the name of one of the five drives:
	   bb_c-max_day_1_part_1
	   bb_c-max_day_1_part_2
	   bb_c-max_day_2_night
	   bb_c-max_day_2_part_1
	   bb_c-max_day_2_part_2
	*/	
	console.log('Socket READY');
    socket.emit('play');
});

socket.on('output', function(data){ 
    //This where the OpenXC data streams in as data.records. 
    // Here's an example usage with jquery
    var content = "";
    //console.log(data.records, data.records.name, data.records.value);    
    _.each(data.records, function(obj){
        console.log(obj.name, obj.value);
    });
    
});

socket.on('message', function(msg){ //general messages from the stream
        console.log('Message: ', msg); 
});

socket.on('status', function(s){ // Messages of any change in the state of the connection
        console.log('Status: ', s);
        status = s;
});

