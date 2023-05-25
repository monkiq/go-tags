import * as vscode from 'vscode'

interface ShowWhatsNewOptions {
  extensionId: string
  title: string
  detail: string
  version: Version
}

export enum Version {
  major,
  minor,
  patch,
}

export default async (context: vscode.ExtensionContext, options: ShowWhatsNewOptions) => {
  const { extensionId, title, detail, version } = options
  // 获取版本信息
  const preVersion = context.globalState.get<string>(extensionId) // undefined
  const curVersion = vscode.extensions.getExtension(extensionId)!.packageJSON.version // 0.2.0

  if (preVersion === undefined || isUpdated(preVersion, curVersion, version)) {
    vscode.window
      .showInformationMessage(
        title,
        {
          modal: true,
          detail,
        },
        'Confirm'
      )
      .then(async value => {
        // 确认后保存当前版本
        if (value === 'Confirm') {
          await context.globalState.update(extensionId, curVersion)
        }
      })
  }
}

// 判断更新
const isUpdated = (preVersion: string, curVersion: string, version: Version): boolean => {
  // undefined
  if (preVersion.indexOf('.') === -1) {
    return true
  }

  // [major,minor,patch]
  var preVerArr = preVersion.split('.').map(Number)
  var curVerArr = curVersion.split('.').map(Number)

  if (curVerArr[version] > preVerArr[version]) {
    return true
  } else {
    return false
  }
}
