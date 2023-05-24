import * as vscode from 'vscode'

const extensionId = 'whosydd.go-tags'

export default async (context: vscode.ExtensionContext) => {
  // 获取版本信息
  const preVersion = context.globalState.get<string>(extensionId) // undefined
  const curVersion = vscode.extensions.getExtension(extensionId)!.packageJSON.version // 0.2.0

  if (preVersion === undefined || isUpdate(preVersion, curVersion)) {
    vscode.window
      .showInformationMessage(
        'Go Tags 0.2.0 NEW!',
        {
          modal: true,
          detail:
            "Now need to use QuickFix to add tags.\nCheck Extension's detail for more information.",
        },
        'Confirm'
      )
      .then(async value => {
        // 保存当前版本
        if (value === 'Confirm') {
          await context.globalState.update(extensionId, curVersion)
        }
      })
  }
}

// 判断更新
const isUpdate = (preVersion: string, curVersion: string): boolean => {
  // undefined
  if (preVersion.indexOf('.') === -1) {
    return true
  }

  // [major,minor,patch]
  var preVerArr = preVersion.split('.').map(Number)
  var curVerArr = curVersion.split('.').map(Number)

  // 0.2.0 -> 0.1.0
  if (curVerArr[1] > preVerArr[1]) {
    return true
  } else {
    return false
  }
}
