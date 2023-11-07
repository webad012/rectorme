import * as vscode from 'vscode';

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

		const cpTempStdout = require('child_process').execSync('mktemp -p /tmp RectorMe-'+rectoredPathName+'-XXX');
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
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
