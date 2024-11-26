import * as vscode from 'vscode'
import { camelCase } from 'camel-case'
import { snakeCase } from 'snake-case'
import { pascalCase } from 'pascal-case'
import { constantCase } from 'constant-case'

const supportedCases: string[] = ['snake', 'camel', 'pascal', 'constant', 'none']
const defaultCases: { [key: string]: string } = { json: 'camel', yaml: 'snake' }

export let configCases: { [key: string]: string } = {}
export function updateConfigCases(cases: { [key: string]: string }): void {
  let invalidCases: string[] = []

  configCases = {}
  // 遍历cases的key和value
  for (const key in cases) {
    if (supportedCases.includes(cases[key])) {
      configCases[key] = cases[key]
    } else {
      invalidCases.push(key)
    }
  }
  if (Object.keys(configCases).length === 0) {
    configCases = defaultCases
  }

  if (invalidCases.length > 0) {
    let msg = `Invalid [${invalidCases.map(c => `"${c}"`).join(', ')}] in "go-tags.cases". `
    msg +=
      ' Reference [https://github.com/guyanyijiu/go-struct-tag#configuration](https://github.com/guyanyijiu/go-struct-tag#configuration)'
    vscode.window.showErrorMessage(msg, 'open settings.json').then(option => {
      if (option === 'open settings.json') {
        vscode.commands.executeCommand('workbench.action.openSettingsJson')
      }
    })
  }
}

export function casedName(name: string, tag: string): string{
  let result: string = name

  if (!(tag in configCases)) {
    return snakeCase(name)
  }
    switch (configCases[tag]) {
      case 'snake':
      result = snakeCase(name)
        break
      case 'camel':
        result = camelCase(name)
        break
      case 'pascal':
        result = pascalCase(name)
        break
      case 'constant':
        result = constantCase(name)
        break
    }
  return result
  }

export function isSupportedCase(c: string): boolean {
  return supportedCases.includes(c)
}
