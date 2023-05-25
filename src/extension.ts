import * as vscode from 'vscode'
import showWhatsNew, { Version } from './showWhatsNew'

export async function activate(context: vscode.ExtensionContext) {
  // 显示新内容
  showWhatsNew(context, {
    extensionId: 'whosydd.go-tags',
    title: 'Go Tags 0.2.0 NEW!',
    detail: "Now need to use QuickFix to add tags.\nCheck Extension's detail for more information.",
    version: Version.minor,
  })

  const addTagsProvider = new AddTagsProvider()
  const codeAction = vscode.languages.registerCodeActionsProvider('go', addTagsProvider, {
    providedCodeActionKinds: AddTagsProvider.providedCodeActionKinds,
  })

  context.subscriptions.push(codeAction)
}

// This method is called when your extension is deactivated
export function deactivate() {}

class AddTagsProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix]
  private structAtLine = ''

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection
  ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
    if (this.isShowAddTags(document, range)) {
      return [
        new vscode.CodeAction(`Add JSON Tag`, vscode.CodeActionKind.QuickFix),
        new vscode.CodeAction(`Add Tags`, vscode.CodeActionKind.QuickFix),
        new vscode.CodeAction(`Remove Tags`, vscode.CodeActionKind.QuickFix),
      ]
    }
    if (this.isShowAddOmitEmpty(document, range)) {
      return [new vscode.CodeAction(`Add Omitempty`, vscode.CodeActionKind.QuickFix)]
    }
  }

  resolveCodeAction?(
    codeAction: vscode.CodeAction,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction> {
    const editor = vscode.window.activeTextEditor!

    // add json tag
    if (codeAction.title === 'Add JSON Tag') {
      vscode.commands
        .executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri)
        .then((obj: any) => {
          editor.edit(editBuilder => {
            const structs = obj.filter(
              (item: vscode.SymbolInformation) => item.name === this.structAtLine
            )
            structs[0].children.forEach((item: any) => {
              editBuilder.insert(
                new vscode.Position(item.range.end.c, item.range.end.e),
                ' `' + `json:"${item.name.toLowerCase()}"` + '`'
              )
            })
          })
        })
    }

    // add Tags
    if (codeAction.title === 'Add Tags') {
      vscode.window
        .showInputBox({
          placeHolder: 'json, yaml, xml',
        })
        .then(str => {
          const arr = str?.split(',')!
          vscode.commands
            .executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri)
            .then((obj: any) => {
              editor.edit(editBuilder => {
                const structs = obj.filter(
                  (item: vscode.SymbolInformation) => item.name === this.structAtLine
                )
                structs[0].children.forEach((item: any) => {
                  const str = arr.reduce((pre, cur) => {
                    let res = `${cur.trim()}:"${item.name.toLowerCase()}" `
                    return pre + res
                  }, '')

                  const line = editor.document.lineAt(item.range.end.c)

                  if (line.text.match(/`\w.*:".*"`/)) {
                    editBuilder.insert(
                      new vscode.Position(item.range.end.c, item.range.end.e - 1),
                      ' ' + str.trimEnd()
                    )
                  } else {
                    editBuilder.insert(
                      new vscode.Position(item.range.end.c, item.range.end.e),
                      ' `' + str.trimEnd() + '`'
                    )
                  }
                })
              })
            })
        })
    }

    // remove tags
    if (codeAction.title === 'Remove Tags') {
      vscode.commands.executeCommand('go.remove.tags')
    }

    // Add Omitempty
    if (codeAction.title === 'Add Omitempty') {
      const editor = vscode.window.activeTextEditor!
      editor.edit(editBuilder => {
        const selects = editor.selections
        console.log('selects:', selects)
        editor.selections.forEach(position => editBuilder.insert(position.active, ',omitempty'))
      })
    }

    return
  }

  // 何时显示提示
  private isShowAddTags(document: vscode.TextDocument, range: vscode.Range) {
    const line = document.lineAt(range.start.line)
    this.structAtLine = line.text.split(' ')[1]
    return line.text.includes('struct')
  }
  private isShowAddOmitEmpty(document: vscode.TextDocument, range: vscode.Range) {
    const line = document.lineAt(range.start.line)
    return line.text.match(/`\w.*:".*"`/)
  }
}
