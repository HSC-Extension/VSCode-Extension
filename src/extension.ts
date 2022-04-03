import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import axios from 'axios';
import getAllFilePaths from './utils/getAllFilePaths';
import output from './domain/output';
export function activate(context: vscode.ExtensionContext) {
	// Adding commands from command folder
	context.subscriptions.push(vscode.commands.registerCommand('hsc-tools.checkhtml', async () => {
		if (vscode.workspace.workspaceFolders === undefined) {
			output.appendLine('ERROR: Failed to read files, open a workspace first!!');
			return;
		}
		let folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const files = getAllFilePaths(folderPath);

		output.appendLine(`Checking ${files.length} HTML's files`);

		for(let index in files) {
			output.appendLine(`Checking ${files[index]}...`);
			await verifyHTML(files[index]);
		}

	}));
	//Extension up and searching for files
	vscode.window.showInformationMessage('HSC-Tool up, searching for files to check!');
	if (vscode.workspace.workspaceFolders !== undefined) {
		let folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		const files = getAllFilePaths(folderPath);
		output.appendLine(`Detected ${files.length} HTML files`);
	}
}
export function deactivate() {}

const verifyHTML = async (path: string) => {

	const htmlString = getStringFromHtml(path);


	const url = 'https://validator.w3.org/nu/?out=json';
	const { data } = await axios({
		method: 'post',
		url: url,
		data: htmlString,
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'text/html; charset=utf-8',
		},
	});

	type W3Message = {
		type: string,
		lastLine: number,
		firstColumn: number,
		lastColumn: number,
		message: string
	};

	data.messages.forEach((message: W3Message) => {
		output.appendLine(`${message.type}: \n | > Line => ${message.lastLine} \n | > Columns => ${message.firstColumn} - ${message.lastColumn} \n | > ${message.message}`);
	});
	output.appendLine('\n\n');
};

const getStringFromHtml = (path: string) => {
	const content = readFileSync(path, 'utf-8');
	return content;
};