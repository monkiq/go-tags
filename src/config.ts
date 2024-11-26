import * as vscode from 'vscode';
import { updateConfigCases } from './cases';

let configListener: vscode.Disposable;

export function init() {
    loadConfig();
    configListener = vscode.workspace.onDidChangeConfiguration(() => {
        loadConfig();
    });
}

export function disposable() {
    configListener.dispose();
}

function loadConfig() {
    let caseStyles = vscode.workspace.getConfiguration('go-tags').get('cases');
    if (caseStyles !== null && typeof caseStyles === 'object') {
        updateConfigCases(caseStyles as { [key: string]: string });
    }
}