var createDocument = (function(){
    var versions = ['MSXML2.DOMDocument.6.0', 'MSXML2.DOMDocument.3.0', 'MSXML2.DOMDocument'],
        version,
        i,
        len;

        for (i = 0, len = versions.length; i < len; i += 1) {
            try {
                new ActiveXObject(versions[i]);
                version = versions[i];
                break;
            } catch (ex) {
                // 不处理
            }
        }

    if (version) {
        return function () {
            return new ActiveXObject(version);
        }
    }
}());

if (typeof ActiveXObject !== 'undefined') {
    var xmldoc = createDocument();
    xmldoc.async = false;
    xmldoc.load('xml.xml');
    if (xmldoc.parseError != 0) {
	    alert(xmldoc.parseError.reason);
	    alert(xmldoc.parseError.srcText);
      	alert(xmldoc.parseError.url);
    } else {
    	alert(xmldoc.documentElement.tagName);
    }

    var xmldoc2 = createDocument();
    xmldoc2.onreadystatechange = function () {
        if (xmldoc2.readyState === 4) {
            if (xmldoc.parseError != 0) {
 	           alert(xmldoc2.parseError.reason);
 	           alert(xmldoc2.parseError.srcText);
   	 	        alert(xmldoc2.parseError.url);
            } else {
 	           alert(xmldoc2.documentElement.tagName);
            }
        }
    };
    xmldoc2.load('xml2.xml');
}

function serializeXml(xmldoc){
    if (typeof XMLSerializer !== 'undefined') {
        return (new XMLSerializer()).serializeToString(xmldoc);
    } else if (typeof ActiveXObject !== 'undefined') {
        return xmldoc.xml;
    } else {
        throw new Error('Could not serialize XML DOM.');
    }
}

function parseXml(xml){
    var xmldoc = null;

    if (typeof DOMParser !== 'undefined') {
        xmldoc = (new DOMParser()).parseFromString(xml, 'text/xml');

        var errors = xmldoc.getElementsByTagName('parsererror');
        if (errors.length) {
            throw new Error('XML parser error: ' + errors[0].textContent);
        }
    } else if (typeof ActiveXObject !== 'undefined') {
        xmldoc = createDocument();
        xmldoc.loadXML(xml);

        if (xmldoc.parseError != 0) {
            throw new Error('XML parser error: ' + xmldoc.parseError.reason);
        }
    } else {
        throw new Error('No XML parser available.');
    }

    return xmldoc;
}
try{
	var xmldoc = parseXml('<a><b><c/></d></a>');
} catch (ex) {
	alert(ex.message);
}
var xml = serializeXml(xmldoc);
alert(xml);
