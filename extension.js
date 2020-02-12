const vscode = require('vscode');
const execSync = require('child_process').execSync
const path = require('path')



const getSearchPhrase = () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return null;
	const text = editor.document.getText();
	if (!text) return null;
	let selStart, selEnd;

	if (editor.selection.isEmpty) {
		selStart = editor.document.offsetAt(editor.selection.anchor);
		// the next or previous character at the caret must be a word character
		let i = selStart - 1;
		if (!((i < text.length - 1 && /\w/.test(text[i + 1])) || (i > 0 && /\w/.test(text[i]))))
			return null;
		for (; i >= 0; i--) {
			if (!/\w/.test(text[i])) break;
		}
		if (i < 0) i = 0;
		for (; i < text.length; i++) {
			if (/\w/.test(text[i])) break;
		}
		const wordMatch = text.slice(i).match(/^\w+/);
		selStart = i;
		selEnd = selStart + (wordMatch ? wordMatch[0].length : 0);
	} else {
		selStart = editor.document.offsetAt(editor.selection.start);
		selEnd = editor.document.offsetAt(editor.selection.end);
	}

	let phrase = text.slice(selStart, selEnd).trim();
	phrase = phrase.replace(/\s\s+/g,' ');
	// limit the maximum searchable length to 100 characters
	phrase = phrase.slice(0, 100).trim();
	return phrase;
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "your-mac-dict" is now active!');

	let disposable = vscode.commands.registerCommand('extension.dict', function () {
		// The code you place here will be executed every time your command is executed
		// const child = exec(
		// 	"python3 /Users/tucker/Desktop/test_test/your-mac-dict/hoge.py human",
			// function (error, stdout, stderr) {
			// 	console.log(stdout)
			// 	console.log(stderr)
			// 	if (error !== null) {
			// 		console.log('exec error: ' + error)
			// 	}
			// 	return stdout
			// }
		// )
		const word = getSearchPhrase()

		const pypath = path.resolve(__dirname, "hoge.py") 
		console.log( pypath )
		
		const cmd = ["python3", pypath, word].join(" ")

		const child = execSync(cmd).toString()
		vscode.window.showInformationMessage(child);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
