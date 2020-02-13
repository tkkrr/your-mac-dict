const vscode = require('vscode')
const path = require('path')

const xsl = require('./xslt_process')


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

	context.subscriptions.push(
		vscode.commands.registerCommand('YourMacDict.start', () => {
			CatCodingPanel.createOrShow(context.extensionPath, getSearchPhrase());
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('YourMacDict.doRefactor', () => {
			if (CatCodingPanel.currentPanel) {
				CatCodingPanel.currentPanel.doRefactor()
			}
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer("YourMacDict", {
			async deserializeWebviewPanel(webviewPanel, state) {
				console.log(`Got state: ${state}`);
				CatCodingPanel.revive(webviewPanel, context.extensionPath, "initial");
			}
		});
	}

		
}
exports.activate = activate;

function deactivate() {}


/**
 * Manages cat coding webview panels
 */
class CatCodingPanel {
	static CurrentPanel = undefined

	static createOrShow(extensionPath, searchWord) {
		const column = vscode.window.activeTextEditor
			? vscode.ViewColumn.Beside
			: undefined

		// If we already have a panel, show it.
		if (CatCodingPanel.currentPanel) {
			CatCodingPanel.currentPanel._update(searchWord)
			CatCodingPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			'yourMacDict',
			'YourMacDict',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath, searchWord)
	}

	static revive(panel, extensionPath, searchWord) {
		CatCodingPanel.currentPanel = new CatCodingPanel(panel, extensionPath, searchWord)
	}

	constructor(panel, extensionPath, searchWord) {
		this._panel = panel
		this._extensionPath = extensionPath
		this._disposables = []
		this._searchWord = searchWord
		

		// Set the webview's initial html content
		this._update()

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

		// Update the content based on view changes
		this._panel.onDidChangeViewState( e => {
			
			if (this._panel.visible) {
				this._update()
			}
		}, null, this._disposables)

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage( message => {
			vscode.window.showErrorMessage(message.text)
			switch (message.command) {
				case 'alert':
					vscode.window.showErrorMessage(message.text)
					return
			}
		}, null, this._disposables )
	}

	doRefactor() {
		// Send a message to the webview webview.
		// You can send any JSON serializable data.
		this._panel.webview.postMessage({ command: 'refactor' });
	}

	dispose() {
		CatCodingPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	_update(searchWord) {
		const webview = this._panel.webview;

		if(searchWord)this._searchWord = searchWord

		this._panel.title = "Your Mac Dict"
		this._panel.webview.html = this._getHtml(webview);

		return
	}

	_getHtml(webview) {
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'main.js')
		);
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		const nonce = getNonce()

		try{
			let html = xsl.xsltproc( this._searchWord )

			// WebView とコミュニケーションをとるために <script> を埋め込む
			let idx = html.search(/<\/body>/)
			html = html.slice(0, idx) + `<script nonce="${nonce}" src="${scriptUri}"></script>` + html.slice(idx)
			
			// To resolve "Content-Security-Policy"
			idx = html.search(/<meta/)
			html = html.slice(0, idx) + `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">` + html.slice(idx)

			return html
		}catch(e){
			console.log(e)
		}
	}
}

// create one-time token
function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

module.exports = {
	activate,
	deactivate
}
