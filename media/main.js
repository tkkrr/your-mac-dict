(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState();
    console.log(oldState)

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'refactor':
                vscode.postMessage({
                    command: 'alert',
                    text: 'check it'
                });
                break;
        }
    });
}());