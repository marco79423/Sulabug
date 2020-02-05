import {app, BrowserWindow, Menu, Tray} from 'electron'
import {applyMiddleware, createStore} from 'redux'
import {forwardToRenderer, replayActionMain} from 'electron-redux'

import * as config from './config'
import * as path from 'path'

declare const __static: string

class Main {
  browserWindow
  isQuiting = false

  public run() {
    this._quitIfAnotherExecutionExists()

    app.on('ready', async () => {
      await this._setupEnv()
      await this._setupMain()
      await this._setupRenderers()
    })
  }

  private _quitIfAnotherExecutionExists() {
    const lock = app.requestSingleInstanceLock()
    if (!lock) {
      app.quit()
    }
  }

  private async _setupEnv() {
    await this._installExtensions()
  }

  private async _setupMain() {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (this.browserWindow) {
        if (this.browserWindow.isMinimized()) this.browserWindow.restore()
        this.browserWindow.focus()
      }
    })

    const store = createStore(
      state => state,
      applyMiddleware(
        forwardToRenderer, // IMPORTANT! This goes last
      ),
    )

    replayActionMain(store)
  }

  private async _setupRenderers() {
    this.browserWindow = this._createBrowserWindow()
  }

  private _createBrowserWindow() {
    const window = new BrowserWindow({
      title: config.ApplicationName,
      icon: path.join(__static, 'icon.ico'),

      width: config.WindowWidth,
      height: config.WidthHeight,
      resizable: false,

      webPreferences: {
        webSecurity: false, // for same-origin policy
        nodeIntegration: true,
      }
    })

    window.setMenu(null)

    const tray = new Tray(path.join(__static, 'icon.ico'))
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '開啟 Sulabug', click: () => {
          window.show()
        }
      },
      {
        label: '關閉程式', click: () => {
          this.isQuiting = true
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)

    if (config.IsDevelopment) {
      window.webContents.openDevTools()
    }

    window.loadURL(`${this._getBaseUrl()}#browser`)

    window.on('close', event => {
      if (!this.isQuiting) {
        event.preventDefault()
        window.hide()
        tray.displayBalloon({
          title: 'Sulabug',
          content: 'Sulabug 仍在執行中'
        })
      }
    })

    window.on('show', event => {
      tray.setHighlightMode('always')
    })

    window.on('show', event => {
      this.browserWindow = null
    })

    return window
  }

  private _getBaseUrl(): string {
    if (config.IsDevelopment) {
      return `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    } else {
      return `${__dirname}/index.html`
    }
  }

  private async _installExtensions() {
    const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer')

    for (const extension of [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]) {
      try {
        const name = await installExtension(extension)
        console.log(`已安裝擴充： ${name}`)
      } catch (e) {
        console.error(`安裝擴充失敗： ${e}`)
      }
    }
  }
}

const main = new Main()
main.run()

