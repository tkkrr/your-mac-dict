const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const xsl = require('./createHtml')


const getSearchPhrase = () => {
	const editor = vscode.window.activeTextEditor
    const selection = editor.selection
    let text = editor.document.getText(selection)

    if (!text) {
        const range = editor.document.getWordRangeAtPosition(selection.active)
        text = editor.document.getText(range)
    }

    return text;
}


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "your-mac-dict" is now active!');

	/// 0. List dictionay file path
	const bases = [
		// Confirmed: MBP13(L15, 10.14.6)
		"/System/Library/Assets/com_apple_MobileAsset_DictionaryServices_dictionaryOSX",

		// Confirmed: MBP16(L19, 10.15.7)
		"/System/Library/AssetsV2/PreinstalledAssetsV2/InstallWithOs/com_apple_MobileAsset_DictionaryServices_dictionaryOSX",

		// Confirmed: MBA13(E20, 12.0.1)
		"/System/Library/AssetsV2/com_apple_MobileAsset_DictionaryServices_dictionaryOSX",
	]

	context.subscriptions.push(
		vscode.commands.registerCommand('YourMacDict.start', () => {
			let dictPath = context.globalState.get("dictionary_path")
			
			try {
				fs.accessSync(dictPath, fs.constants.F_OK)
			} catch(e) {
				// Needs to update the dictionary path.
				// HERE! we change to Japanese-English English-Japanese dictionary as default.

				/// 1. Check path exists.
				let passPath = []
	
				bases.forEach((base, idx) => {
					try {
						fs.accessSync(base, fs.constants.F_OK)
						passPath.push(base)
					}catch(e){
						console.log(`Path of bases[${idx}] is not found.`)
					}
				})
	
				if (passPath.length === 0) {
					// Cannot get Dict path. 
					// Please tell me your environment (Mac Model & MacOS Version) on issue.
					// ref: https://github.com/tkkrr/your-mac-dict/issues
					vscode.window.showInformationMessage(`Sorry, you don't have dictionary on your Mac.`)
					return
				}
	
				/// 2. Extract Japanese-English English-Japanese dictionary
				let dictName = passPath.reduce( (prev, path) => {
					if (prev) return prev
					const dire = fs.readdirSync(path, { withFileTypes: true })
					const dicts = dire.filter(dirent => dirent.isDirectory())
						.map( (item) => {
							const dictionaryName = fs.readdirSync(`${path}/${item.name}/AssetData`)[0]
							if(dictionaryName.includes("Sanseido The WISDOM English-Japanese Japanese-English Dictionary"))
								return `${path}/${item.name}/AssetData/${dictionaryName}`
						})
					if (dicts.length > 0) return dicts[0]
				}, "")

				console.log(dictName)

				context.globalState.update("dictionary_path", `${dictName}/Contents/Resources/Body.data`)
				
			}

			ResultPanel.createOrShow(context.extensionPath, dictPath, getSearchPhrase());
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('YourMacDict.doRefactor', () => {
			if (ResultPanel.CurrentPanel) {
				ResultPanel.CurrentPanel.doRefactor()
			}
		})
	);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer("YourMacDict", {
			async deserializeWebviewPanel(webviewPanel, state) {
				console.log(`Got state: ${state}`);
				ResultPanel.revive(webviewPanel, context.extensionPath, context.globalState.get("dictionary_path"), "initial");
			}
		});
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('YourMacDict.dict', async () => {

			/// 1. Check path exists.
			let passPath = []

			bases.forEach((base, idx) => {
				try {
					fs.accessSync(base, fs.constants.F_OK)
					passPath.push(base)
				}catch(e){
					console.log(`Path of bases[${idx}] is not found.`)
				}
			})

			if (passPath.length === 0) {
				// Cannot get Dict path. 
				// Please tell me your environment (Mac Model & MacOS Version) on issue.
				// ref: https://github.com/tkkrr/your-mac-dict/issues
				vscode.window.showInformationMessage(`Sorry, you don't have dictionary on your Mac.`)
				return
			}

			/// 2. Extract dictionary list
			let fileNames = []
			passPath.forEach(path => {
				const dire = fs.readdirSync(path, { withFileTypes: true })
				fileNames = [...fileNames, 
					...dire.filter(dirent => dirent.isDirectory())
						.map( (item) => {
							const dictionaryName = fs.readdirSync(`${path}/${item.name}/AssetData`)[0]
							return `${path}/${item.name}/AssetData/${dictionaryName}`
						})
					]
			})

			/// 3. Ask which dictionary to use
			const result = await vscode.window.showQuickPick( fileNames.map(item => path.basename(item, ".dictionary")), {
				placeHolder: 'Please selected your dictionary',
			})

			const dictionaryPath = fileNames.filter(item => item.includes(result))[0]
			context.globalState.update("dictionary_path", `${dictionaryPath}/Contents/Resources/Body.data`)
			vscode.window.showInformationMessage(`Complete your setting!\nYour Mac Dict is ${result}!!`)
		})
	)

}
exports.activate = activate;

function deactivate() {}


/**
 * Manages webview panels
 */
class ResultPanel {
	static CurrentPanel = undefined

	static createOrShow(extensionPath, dictPath, searchWord) {
		const column = vscode.window.activeTextEditor
			? vscode.ViewColumn.Beside
			: undefined

		// If we already have a panel, show it.
		if (ResultPanel.CurrentPanel) {
			ResultPanel.CurrentPanel._dictPath = dictPath
			ResultPanel.CurrentPanel._searchWord = searchWord
			ResultPanel.CurrentPanel._update()
			ResultPanel.CurrentPanel._panel.reveal(column)
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

		ResultPanel.CurrentPanel = new ResultPanel(panel, extensionPath, dictPath, searchWord)
	}

	static revive(panel, extensionPath, dictPath, searchWord) {
		ResultPanel.CurrentPanel = new ResultPanel(panel, extensionPath, dictPath, searchWord)
	}

	constructor(panel, extensionPath, dictPath, searchWord) {
		this._panel = panel
		this._extensionPath = extensionPath
		this._disposables = []
		this._searchWord = searchWord
		this._dictPath = dictPath
		

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
		ResultPanel.CurrentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	_update() {
		const webview = this._panel.webview;

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
			let html = xsl.pochi( this._dictPath, this._searchWord )

			// WebView とコミュニケーションをとるために <script> を埋め込む
			let idx = html.search(/<\/body>/)
			html = html.slice(0, idx) + `<script nonce="${nonce}" src="${scriptUri}"></script>` + html.slice(idx)
			
			// Attaced Apple like style
			let styles = fs.readFileSync( path.resolve( path.dirname(this._dictPath), "DefaultStyle.css"), "utf8" )
			styles = styles.replace("font-size: 12pt", "font-size: 16pt")
			styles = styles.replace(/color: text/g, "color:whitesmoke")
			styles = styles.replace(/-webkit-link/g, "lightskyblue")
			styles = styles.replace(/-apple-system-secondary-label/g, "grey")
			styles = styles.replace(/-apple-system-tertiary-label/g, "dimgrey")
			styles = styles.replace(/-apple-system-text-background/g, "black")
			idx = html.search(/<\/head>/)
			html = html.slice(0, idx) + `<style nonce=${nonce}>${styles}</style>` + html.slice(idx)

			// To resolve "Content-Security-Policy"
			idx = html.search(/<meta/)
			html = html.slice(0, idx) + `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'">` + html.slice(idx)
			
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
