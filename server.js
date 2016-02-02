'use strict'

var fs = require('fs');
var http = require('http');
var htmlparser = require("htmlparser");

var server = new http.Server();

server.listen(3000, '127.0.0.1');

server.on('request', function (req, res) {
    fs.readFile('./index.html', function (err, data) {
        if (err) {
            console.log(err);
            res.end(err)
        }

        data = htmlToObject(data);
        console.log(data);
        res.end('<pre>' + JSON.stringify(data) + '</pre>');
        console.log('Read done!');
    })

});

var getTagInnerData = function (pos, tagName, html) {
    var tagEndName = '</'+tagName+'>';
    var to = html.indexOf(tagEndName, pos);
    var data = html.substring(pos,to);
    return data.replace(/(?:\r\n|\r|\n)/g, '');
}

var parseHtml = function (html) {
    var from = 0;
    var to = html.length;
    var parse = true;
    var object = {};
    while (parse) {
        var start = html.indexOf('<', from);
        var tagEnd = html.indexOf('>', start);
        var tagName = html.substring(start + 1, tagEnd);
        if (from >= to || start < from) {
            parse = false;
        } else {
            console.log(tagName);
            object[tagName] = getTagInnerData(tagEnd, tagName, html);
            from = tagEnd;
//            console.log(from, to);
        }

    }
    return object;
}

var htmlToObject = function (html) {
    var htmlObject = parseHtml(html.toString());
    return htmlObject;
}
