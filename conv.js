const regex = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;

// Alternative syntax using RegExp constructor
// const regex = new RegExp('(\\S+)=["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?', 'g')

const str = `input type="hidden" name="transactionId" id="transactionId" value="IS2301066344"`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}
