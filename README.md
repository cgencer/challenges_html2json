# Challenge:

Write a Javascript node program that takes an HTML that looks like the input.html file.
And converts that HTML to an object and prints it. It should look like this:
```json
{
	tag: 'div’,
	text: 'Hello, friends',
	style: {
		backgroundColor: 'yellow',
		fontSize: '14px'
	},
	id: 'first-div',
	children: [{
		tag: 'p',
		text: 'Lorem ipsum dolor sit',
		class: 'para',
		style: {
			fontFamily: 'monospace',
			fontSize: '11px',
		}
	}, {
		tag: 'footer',
		style: {
			width: 'auto',
			height: '100px',
			color: 'blue',
		},
		children: [{ 
			tag: 'span', 
			text: 'This is the end' 
		}]
	}]
}
```
## Requirements:
- The program must run from the CLI by reading a file and the browser by textarea input.
For example, running node server.js markup.html should print out the Object
specified above. The input format is an HTML string, and browser API should not be
used. The solution should be designed as a library that can be used/run from the
browser or nodejs.
- You can use any Javascript library alongside your code except those that do the
HTML-to-object parsing and conversion themselves. The main parsing and conversion
loop must still be written by you. You can also write everything from scratch - there is no
preference, and you will not be graded less/more if you choose not to use libraries. As
long as the code runs, it doesn't matter.
- You have 48 hours to write the code, including tests, create a public repository, upload
the code there, and write instructions on installing and running the code in the README
file. Ideally, the instructions should be a simple yarn or npm install command and
published to the npm registry.
- Send the links to your GitHub repository and NPM package by the end of the 48 hours
to ************. We will clone, review, and contact you as soon as possible.

## Installation

Just do a **npm i** after cloning the repo

## Usage

### - npm run terminal

Loads the data file and parses it, outputting back to the terminal.

### - npm run web

To run the same thing via the browser.

## Notes

I know that this job requires a cleanly planeed recursive parser. But I wanted to test out if I might be able to do it with RegExp-based queries. Javascript lacks of support for recursive queries, so I had to severe the parent-child relationship and build it by indexing the objects later on.

For the sake of completing the main code within 24h, I also used a not-so clean type of handling the objects by JSON stringify/parse methods.

As recursive queries and repeating patterns within JS-RegExp are not possible, I had to either code a text-parser or use blocks of RegExp to simulate the recursive behaviour. Even though you can't recurse the RegExp, you still can fetch the parent of html tags. I've used the array queue to preserve the relationships of the tree-structure and after flattening trough HTML-tag parsing with RegExp, I've built up the tree starting from bottom-up to the top-level.

### Here are the RegExp expressions I've used:
* __tags:__ Fetches all HTML tags in a flattened order.

/<(?![\/]+)([img|div|p|footer|span]*)([^>]*)>([^<]*)[(^\1)]*/gim;

$1 - tag
$2 - attribute-set
$3 - content

* __attribs:__ Fetches every attribute seperately for each HTML-tag.

/(?:[\s]*)([class|style|id]*)=((["']+)((?:\\3|(?:(?!\3)).)*)(\3)*)/gim;

It uses back-referencing for matching single/double quotes

$1 - attribute
$2 - quoted attribute-set
$3 - ' / "
$4 - clean attribute-set
$5 - ' / "

* __parents:__ Fetches the parent-child relationship of the HTML tags and stores them for later usage in __queue__ array.

/<(?![\/]+)([img|div|p|footer|span]*)[^>]*>[^<]*(<(?![\/]+)(?<!\1)(?:([img|div|p|footer|span]*)[^>]*>)*[^<]*<\/\3>)*/gim;

This one was pretty nasty, uses back-referencing to match closing html-tags and marking excluded tags.
