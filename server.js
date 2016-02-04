'use strict'

var fs = require('fs');
var http = require('http');
var url = require('url');

var parser = require('./htmlParser');


var server = new http.Server(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    if (parsedUrl.path === '/') {
        fs.readFile('./index.html', function (err, data) {
            if (err) {
                console.log(err);
                res.end(err)
            }
            console.log('Read done! Lets parse!');
            data = parser.htmlToObject(data);
            res.end('<script> console.log(' + JSON.stringify(data) + ');</script>');

        })
    } else {
        res.statusCode = 404;
        res.end('<h1>Page not found</h1>');
    }


});

server.listen(3000, '127.0.0.1');

//server.on('request', );
