import * as vscode from 'vscode'

export const provideCompletionItems = (
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken,
  ctx: vscode.CompletionContext
) => {
  // 获取配置项
  const files: string[] = vscode.workspace
    .getConfiguration('go-tags', { languageId: 'go' })
    .get('associations')!

  // 获取需要操作的字符串
  const lineText = document.lineAt(position).text

  // 定义何时出现
  if (lineText.match(/string|int|float|complex|bool|interface|byte|rune|error/)) {
    const lineSlice = lineText.substring(0, position.character).trim().split(/\s+/)
    const param = lineSlice[0]

    return files.map(file => {
      return createCompletionItem(file, param)
    })
  }
}

// 光标选中当前自动补全 item 时触发动作，一般情况下无需处理
export const resolveCompletionItem = (item: vscode.CompletionItem) => {
  return null
}

const createCompletionItem = (file: string, param: string) => {
  let item: vscode.CompletionItem
  item = new vscode.CompletionItem(`${file}`, vscode.CompletionItemKind.Snippet)
  item.insertText = `${file}:"${param.toLowerCase()}"`

  return item
}
