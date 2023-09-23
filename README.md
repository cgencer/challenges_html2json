Symbols Coding Test
Write a Javascript node program that takes an HTML that looks like this:
<div style="background-color: yellow; font-size: 14px"
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
</div>
And converts that HTML to an object and prints it. It should look like this:
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

Requirements:
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
to josh@symbols.app. We will clone, review, and contact you as soon as possible.