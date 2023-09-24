const tags = /<(?![\/]+)([img|div|p|footer|span]*)([^>]*)>([^<]*)[(^\1)]*/gim;
const attribs = /(?:[\s]*)([class|style|id]*)=((["']+)((?:\\3|(?:(?!\3)).)*)(\3)*)/gim;
let theJson = '';
const input = `<div style="background-color: yellow; font-size: 14px"
id="first-div">
	Hello, friends
	<p class="para" style="font-faimly: monospace; font-size: 11px">
		Lorem ipsum dolor sit
	</p>
	<footer style="width: auto; height: 100px; color: blue">
		<span>
			This is the end
		</span>
	</footer>
</div>`;


// grab each tag
// $1 - tag
// $2 - attribute-set
// $3 - content
/*
<(?![\/]+)([img|div|p|footer|span]*)([^>]*)>([^<]*)[(^\1)]*
*/

// grab each of the attributes of the tags
// $1 - attribute
// $2 - quoted attribute-set
// $3 - ' / "
// $4 - clean attribute-set
// $5 - ' / "
/*
(?:[\s]*)([class|style|id]*)=((["']+)((?:\\3|(?:(?!\3)).)*)(\3)*)
*/



const fileMode = process.argv.indexOf('-f') > -1 ? true : false;
if(fileMode){
	// load the file
	fileName = process.argv[2];
}else{
	// browser-mode
}
/*
	tag: 'div’,
	text: 'Hello, friends',
	style: {
		backgroundColor: 'yellow',
		fontSize: '14px'
	},
	id: 'first-div',
*/
/*
{"tag":"div","text":"Hello, friends","style":{"backgroundColor":"yellow","fontSize":"14px"},"id":"first-div"}
*/
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
console.dir(JSON.parse(theJson));