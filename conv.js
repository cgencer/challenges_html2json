const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const http = require('http');
const PORT = 8080;

const parser = (input) => {
	// grab each tag
	// $1 - tag
	// $2 - attribute-set
	// $3 - content
	/*
	<(?![\/]+)([img|div|p|footer|span]*)([^>]*)>([^<]*)[(^\1)]*
	*/
	const tags = /<(?![\/]+)([img|div|p|footer|span]*)([^>]*)>([^<]*)[(^\1)]*/gim;
	// grab each of the attributes of the tags
	// $1 - attribute
	// $2 - quoted attribute-set
	// $3 - ' / "
	// $4 - clean attribute-set
	// $5 - ' / "
	/*
	(?:[\s]*)([class|style|id]*)=((["']+)((?:\\3|(?:(?!\3)).)*)(\3)*)
	*/
	const attribs = /(?:[\s]*)([class|style|id]*)=((["']+)((?:\\3|(?:(?!\3)).)*)(\3)*)/gim;
	const parents = /<(?![\/]+)([img|div|p|footer|span]*)[^>]*>[^<]*(<(?![\/]+)(?<!\1)(?:([img|div|p|footer|span]*)[^>]*>)*[^<]*<\/\3>)*/gim;
	let theJson = '';

	theJson += '{"tags": [';
	while ((m = tags.exec(input)) !== null) {
	    if (m.index === tags.lastIndex) {
	        tags.lastIndex++;
	    }
	    theJson += '{"tag": "' + m[1] + '"';
	    let cleanedText = m[3].trim().replaceAll('\n',' ');
	    if(cleanedText !== '')
	    	theJson += ',"text":"' + cleanedText + '"';

	    m.forEach((match, groupIndex) => {
	 
	        if(groupIndex == 2){
				while ((n = attribs.exec(match)) !== null) {
					if(n[1]=='id')
						theJson += ',"id": "' + n[4] + '"';
					if(n[1]=='style'){
						let styles = n[4].split(';');
						theJson += ',"style":{';
						for (var s = 0; s < styles.length; s++) {

							let parts = styles[s].split(':');
							let part = '';
							for (var p = 0; p < 2; p++) {
								part += '"' + parts[p].trim() + '"';
								part += (p===0) ? ':' : '';
							}
							theJson += (p == 2) ? part + ',' : part;
						}
						theJson += '}';
					}
		        };
	    	};
	    });
		theJson += '},';
	};

	theJson += ']}';
	theJson = theJson.replaceAll(',}', '}').replaceAll(',]', ']');
	let parsedObject = JSON.parse(theJson);
	let queue = [];
	let childIndex, parentIndex = null;
	// restore the family ties after a long time away...
	for (var j = 0; j < parsedObject.tags.length; j++) {
		while ((p = parents.exec(input)) !== null) {
		    if (p.index === parents.lastIndex)
		        parents.lastIndex++;

		    if(p[1] && p[2] && p[3]){
			    for (var i = 0; i < parsedObject.tags.length; i++) {
			    	const dogTag = parsedObject.tags[i].tag;
				    if (dogTag === p[1]) parentIndex = i;
				    if (dogTag === p[3]) childIndex  = i;
			    }
				queue.push({parent: parentIndex, 
							child:  childIndex, 
							tag: p[1],
							theKid: JSON.stringify(parsedObject.tags[childIndex])});
				const removalRegExp = new RegExp(p[2], 'img');
				input = input.replace(removalRegExp, '');
		    }
			childIndex = null;
			parentIndex = null;
		}
	}
	queue = _.orderBy(queue, ['parent'], ['desc']);

	for (var i = 0; i < queue.length; i++) {
		if(!parsedObject.tags[ queue[i].parent ].children)
			parsedObject.tags[ queue[i].parent ].children = [];
		parsedObject.tags[ queue[i].parent ].children.push( parsedObject.tags[ queue[i].child ] );
	}
	queue = _.orderBy(queue, ['child'], ['desc']);
	for (var i = 0; i < queue.length; i++) {
		parsedObject.tags.splice(queue[i].child, 1);
	}

	var jsonPretty = JSON.stringify(JSON.parse(JSON.stringify(parsedObject.tags[0])),null,4);  
	return(jsonPretty);
}

const fileMode = process.argv.indexOf('-f') > -1 ? true : false;
const webMode = process.argv.indexOf('-w') > -1 ? true : false;

fileName = path.resolve(process.argv[3]);

if(fileMode){
	// load the file
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) throw error;
		console.log(parser(data));
	});
}else if(webMode){
	// browser-mode
	fs.readFile(fileName, 'utf8', (err, data) => {
		if (err) throw error;
		var server = http.createServer(function(req, res) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.write('<pre>' + parser(data) + '</pre>');
			res.end();
		}).listen(PORT);
		console.log('listening on http://localhost:'+PORT);
	});
}
