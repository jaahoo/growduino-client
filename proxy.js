var http = require('http'),
    httpProxy = require('http-proxy');

var connect = require('connect');
var bodyParser = connect.bodyParser();
var request = require('request');

//var TARGET = 'arduino.natur.cuni.cz';
//var TARGET = '78.108.106.180';
//var TARGET = '192.168.1.44';
var TARGET = '192.168.1.44';

var proxy = httpProxy.createProxyServer({target: "http://"+TARGET});

var express = require('express');
var app = express();


/* special method needs because of strange arguino connection closing */
function proxyPost(req, res) {
    bodyParser(req, res, function() {
        request({
            method: 'POST',
            url: 'http://'+TARGET+req.url,
            json: req.body,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Origin': 'http://'+TARGET,
                'Referer': 'http://'+TARGET+'/'
            }
        }, function (error, response, body) {
            res.statusCode = 200;
            res.end();
        });
    });
}

app.get(/^\/(sensors|triggers|alerts|webcam|DATA|config.jso|client.jso|calib.jso|fanconfig.jso|wifilist.jso|wifi_active.jso|partial\/config.jso|send_test_mail)/, function(req, res) {
    proxy.proxyRequest(req, res);
});
app.post(/^\/(sensors|triggers|alerts|webcam|DATA|config.jso|client.jso|calib.jso|fanconfig.jso|wifilist.jso|wifi_active.jso|partial\/config.jso|send_test_mail)/, function(req, res) {
    proxyPost(req, res);
});

app.use('/bower', express.static(__dirname + '/bower83'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/fonts', express.static(__dirname + '/bower_components/bootstrap/fonts'));
app.get('/js/settings.js', function(req, res) {
    res.sendfile('./src/js/settings.js');
});
app.use(express.static(__dirname + '/src'));

//app.use(express.static(__dirname + '/'));
//app.use(express.static(__dirname + '/dist'));

app.listen(8000, function () {
    console.log("listening on port 8000");
});


