import {app, BrowserWindow, ipcMain, Menu, screen, Tray} from 'electron'
import * as path from 'path'
import {format as formatUrl} from 'url'

import * as config from './config'

const isDevelopment = process.env.NODE_ENV !== 'production'

function checkSingleton() {
  const lock = app.requestSingleInstanceLock()
  if (!lock) {
    app.quit()
  }
}

(function main() {
  checkSingleton()

  // global reference to mainWindow (necessary to prevent window from being garbage collected)
  let mainWindow = null
  let readingWindow = null
  let isQuiting = false

  function createMainWindow() {
    const window = new BrowserWindow({
      title: config.APPLICATOIN_NAME,
      icon: path.join(__static, 'icon.ico'),

      width: config.WINDOW_WIDTH,
      height: config.WINDOW_HEIGHT,
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
        label: '開啟 Sulabug', click: function () {
          window.show()
        }
      },
      {
        label: '關閉程式', click: function () {
          isQuiting = true
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)

    if (isDevelopment) {
      window.webContents.openDevTools()
    }

    if (isDevelopment) {
      window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
      window.loadURL(formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      }))
    }

    const mainWindowEventHandlers = {
      'close': function (event) {
        if (!isQuiting) {
          event.preventDefault()
          window.hide()
          tray.displayBalloon({
            title: 'Sulabug',
            content: 'Sulabug 仍在執行中'
          })
        }
      },
      'show': function () {
        tray.setHighlightMode('always')
      },
      'closed': () => {
        mainWindow = null
        readingWindow = null
      }
    }
    Object.keys(mainWindowEventHandlers).forEach(eventName => window.on(eventName, mainWindowEventHandlers[eventName]))

    window.webContents.on('devtools-opened', () => {
      window.focus()
      setImmediate(() => {
        window.focus()
      })
    })

    return window
  }

  function createReaderWindow(comicInfId) {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize

    const window = new BrowserWindow({
      title: config.APPLICATOIN_NAME,
      icon: path.join(__static, 'icon.ico'),

      width: width,
      height: height,

      webPreferences: {
        webSecurity: false, // for same-origin policy
        nodeIntegration: true,
      },
    })

    window.setMenu(null)

    if (isDevelopment) {
      window.webContents.openDevTools()
    }

    if (isDevelopment) {
      window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}#reader/comics/${comicInfId}`)
    } else {
      window.loadURL(`${__dirname}/index.html#reader/comics/${comicInfId}`)
    }

    window.on('closed', () => {
      readingWindow = null
    })

    return window
  }

  const appEventHandlers = {
    'second-instance': () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    },
    // quit application when all windows are closed
    'window-all-closed': () => {
      // on macOS it is common for applications to stay open until the user explicitly quits
      if (process.platform !== 'darwin') {
        app.quit()
      }
    },
    'activate': () => {
      // on macOS it is common to re-create a window even after all windows have been closed
      if (mainWindow === null) {
        mainWindow = createMainWindow()
      }
    },
    'ready': async () => {
      if (isDevelopment) {
        const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer')

        for (const extension of [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]) {
          await installExtension(extension)
        }
      }
      mainWindow = createMainWindow()
    }
  }

  Object.keys(appEventHandlers).forEach(eventName => app.on(eventName, appEventHandlers[eventName]))

  const mainEventHandlers = {
    'open-reading-page': (event, comicId) => {
      if (readingWindow == null) {
        readingWindow = createReaderWindow(comicId)
      } else {
        readingWindow.send('comic-info-id-changed', comicId)
      }
    }
  }

  Object.keys(mainEventHandlers).forEach(eventName => ipcMain.on(eventName, mainEventHandlers[eventName]))
}())
