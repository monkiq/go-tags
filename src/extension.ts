import * as vscode from 'vscode'
import { provideCompletionItems, resolveCompletionItem } from './completionItemHandler'

export function activate(context: vscode.ExtensionContext) {
  const files: string[] = vscode.workspace.getConfiguration(`go-tags`).get('associations')!

  let disposable = vscode.languages.registerCompletionItemProvider(
    ['go'],
    {
      provideCompletionItems,
      resolveCompletionItem,
    },
    ...files
  )

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
