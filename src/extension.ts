import * as vscode from 'vscode';

const greenDecorationType = vscode.window.createTextEditorDecorationType({
	color: "#495c2d"
});
const redDecorationType = vscode.window.createTextEditorDecorationType({
	color: "#bc0004"
});

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('rectorme.rectorme', (params) => {

		const configuration = vscode.workspace.getConfiguration('rectorme');
		const rectorPath = configuration.rectorPath;

		if(rectorPath === '')
		{
			vscode.window.showErrorMessage('config rectorPath empty');
			return;
		}

		let rectoredPathName = params.path;
		if(rectoredPathName.includes('/'))
		{
			const rectoredPathNameParts = rectoredPathName.split("/");
			rectoredPathName = rectoredPathNameParts[rectoredPathNameParts.length - 1];
		}

		const cpTempStdout = require('child_process').execSync('mktemp -p /tmp '+rectoredPathName+'-XXXXXXX --suffix .RectorMe');
		const tempFilePath = cpTempStdout.toString().trim();

		const rectorCommand = rectorPath+"/vendor/bin/rector process "
								+"--config "+rectorPath+"/rector.php --dry-run "
								+params.path
								+" > "+tempFilePath;

		let generatingStatusMessage = vscode.window.setStatusBarMessage('RectorMe running');

		require('child_process').exec(rectorCommand, (err: String, stdout: string, stderr: string) => {
			generatingStatusMessage.dispose();
			generatingStatusMessage = vscode.window.setStatusBarMessage('RectorMe completed');

			/// rector has no complains/suggestions
			if(
				err === null
				&& stdout === ''
				&& (
					stderr === ''
					||
					stderr.endsWith('100%')
				)
			)
			{
				vscode.window.showInformationMessage('No complains/suggestions for '+rectoredPathName);
				return;
			}

			if(typeof err === 'object')
			{
				err = new String(err);
			}

			/**
			 * dry-run is reason for invalid exit code so basic err check is not enough
			 */
			// if (err) {
			if (!err.endsWith('100%')) {
				console.log('error: ', err);
				console.log('stdout: ', stdout);
				console.log('stderr: ', stderr);
				vscode.window.showErrorMessage('RectorMe error: ' + err);
				return;
			}

			var tempPathUri = vscode.Uri.parse("file://" + tempFilePath);
			vscode.window.showTextDocument(tempPathUri);
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			if(editor === undefined)
			{
				return;
			}
			if(!editor.document.fileName.endsWith('.RectorMe'))
			{
				return;
			}
			decorateEditor(editor);
		});
	});
	context.subscriptions.push(disposable);
}

function decorateEditor(editor: vscode.TextEditor) {
	let sourceCode = editor.document.getText();
  
	let greenDecorationsArray: vscode.DecorationOptions[] = [];
	let redDecorationsArray: vscode.DecorationOptions[] = [];
  
	const sourceCodeArr = sourceCode.split("\n");
  
	for (let lineIndex = 0; lineIndex < sourceCodeArr.length; lineIndex++) {
		const line = sourceCodeArr[lineIndex];

		if(line.startsWith('+')) {
			let range = new vscode.Range(
				new vscode.Position(lineIndex, 0),
				new vscode.Position(lineIndex, line.length)
			);
			greenDecorationsArray.push({ range });
		} else if (line.startsWith('-')) {
			let range = new vscode.Range(
				new vscode.Position(lineIndex, 0),
				new vscode.Position(lineIndex, line.length)
			);
			redDecorationsArray.push({ range });
		}
	}
  
	editor.setDecorations(greenDecorationType, greenDecorationsArray);
	editor.setDecorations(redDecorationType, redDecorationsArray);
  }

// This method is called when your extension is deactivated
export function deactivate() {}
