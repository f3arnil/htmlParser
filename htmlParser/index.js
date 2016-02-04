'use strict'

var _ = require('underscore');

var domObject = {};
var notClosingTags = ['img', 'meta','br'];
var getInnerTagsArray = function (array, from, to) {
    console.log('>>>', from, to)
    var arr = [];
    for (var x = from; x < to; x++) {
        arr.push(array[x]);
    }
    return arr;
}

// TAG info API

var getTagName = function (tag) {
    var name = tag.split(' ')[0].replace('<', '').replace('>', '');
    return name;
}

var isClosingTag = function (tag) {
    var tagName = getTagName(tag);
    if (tagName[0] === '/') {
        return true;
    }
    return false;
}

var isSelfClosingTag = function (tag) {
    tag = tag.replace('<', '').replace('>', '');
    if (tag[tag.length - 1] === '/') {
        return true;
    }
    return false;
}

var getAttrsString = function (tag) {
    var tagName = getTagName(tag);
    var from = tagName.length + 2;
    var to = tag.length - 1;
    return tag.substring(from, to).replace('>', '');
}

var hasClosingTag = function (tagName, position, array) {
    var prevEl = 'none';
    var closingFound = false;
//    for (var i = position; i > 0; --i) {
//        var el = array[i];
//        if (!isClosingTag(el) && !isSelfClosingTag(el)) {
//            prevEl = getTagName(el);
//            i = 0;
//        }
//    }
//    console.log('Prev el '+prevEl, getTagName(array[position]));
//    var next = 0;
//    for (var x = position; x < array.length; ++x) {
//        if (tagName === getTagName(array[x])) {
//            next++;
//        }
//        if (isClosingTag(array[x])) {
//            if ((getTagName(array[x]) === prevEl) && (next == 0)) {
//                return;
//            }
//            var tName = getTagName(array[x]).replace('/', '');
//            if ((tName === tagName)) {
//                if (next > 0) {
//                    next--;
//                } else {
//                    closingFound = true;
//                    console.log('Gatched!!!')
//                }
//
//            }
//        }
//    }
    return closingFound;
}

///

var backToNested = function (nested, nestingLevel) {
    nested = nested.replace('/', '').replace('<', '').replace('>', '');
    nestingLevel.reverse();
    var found = false;
    _.each(nestingLevel, function (nesting, index) {
        if ((nesting === nested) && (!found)) {
            var data = _.rest(nestingLevel, index + 1);
            nestingLevel = data;
            found = true;
        }
    });
    return nestingLevel.reverse();

}

var hierarchyToObject = function (array) {
    var roadMap = [];
    var nestingLevel = [];
    _.each(array, function (tag, index, list) {

        var tagName = getTagName(tag);
        var attributes = getAttrsString(tag);

        if (isClosingTag(tag)) {
            nestingLevel = backToNested(tagName, nestingLevel);
        } else {
            if (!isSelfClosingTag(tag)) {
                nestingLevel.push(tagName);
            } else {

            }
        }

        var parentNode = 'none';
        if (nestingLevel.length > 1) {
            if (!isSelfClosingTag(tag)) {
                parentNode = _.initial(nestingLevel).join('.');
            } else {
                parentNode = nestingLevel.join('.');
            }

        }

        if (!isClosingTag(tag)) {
            roadMap.push({
                tagName: tagName,
                stringAttr: attributes,
                parentNode: parentNode,
                tag: tag
            })
        }

    });

    return roadMap;

};

var getHierarchy = function (htmlCode) {
    var html = htmlCode.toString();
    var regExp = new RegExp("<(.|\n)*?>", "g");
    var tagsArray = html.match(regExp);
    //console.log(tagsArray);

    var a = hierarchyToObject(tagsArray);

    //console.log(a);
    return a;
}

var htmlToObject = function (html) {
    var data = getHierarchy(html);
    //var htmlObject = getHierarchy(html.toString()); //findTags(html.toString());
    return data;
}



module.exports = {
    htmlToObject: htmlToObject
}
