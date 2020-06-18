//const express = require('express');
//const app = express();
//app.listen(3000, () => console.log('listening at 3000'));

//var pcap = require('pcap'),
//   pcap_session = pcap.createSession(interface, filter);

//pcap_session.on('packet', function (raw_packet) {
    //        // do some stuff with a raw packet
    //  });
    var express = require('express');
    var app = express();
    var http = require('http').createServer(app);
    app.use(express.static('public'));
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var s; 

io.on('connection', (socket) => {   
    s = socket;
    console.log('a user connected');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

var pcap = require('pcap'),
tcp_tracker = new pcap.TCPTracker(),
pcap_session = pcap.createSession('en0', { filter: "ip proto \\tcp" });

tcp_tracker.on('session', function (session) {
console.log("Start of session between " + session.src_name + " and " + session.dst_name);
session.on('end', function (session) {
  console.log("End of TCP session between " + session.src_name + " and " + session.dst_name);
});
});

pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    if(s){
        console.log(raw_packet)
    s.emit('packet', packet);
}


tcp_tracker.track_packet(packet);
});

