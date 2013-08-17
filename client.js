console.log('client listener');

var _ = require('lodash');

var io = require('socket.io-client'),
socket = io.connect('http://playbacktool-pl475c6m.dotcloud.com?sourceID=1&startTime=1375905080&endTime=1375905095&names=windshield_wiper_status,brake_pedal_status,parking_brake_status,headlamp_status,high_beam_status,&format=json&apikey=9BaOZYnbn5', {
    port: 80
});
socket.on('connect', function () { 
    socket.emit('init', '9BaOZYnbn5');
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
});

socket.on('output', function(data){ 
    //This where the OpenXC data streams in as data.records. 
    // Here's an example usage with jquery
    var content = "";
    console.log(data.records);
    /*
    _.each(data.records, function(i, obj){
        dataPoints[obj.name] = obj.value;         
    });

    console.log(content);
    */
});