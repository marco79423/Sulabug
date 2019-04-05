import {app, BrowserWindow, ipcMain, screen} from 'electron'
import * as path from 'path'
import {format as formatUrl} from 'url'

import * as config from './config'

const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow
let readingWindow

function createMainWindow() {
  const window = new BrowserWindow({
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

  window.on('closed', () => {
    mainWindow = null
    readingWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

function createReadingWindow(comicInfId) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const window = new BrowserWindow({
    icon: path.join(__static, 'icon.ico'),

    width: width,
    height: height,

    webPreferences: {
      webSecurity: false, // for same-origin policy
      nodeIntegration: true,
    }
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

ipcMain.on('open-reading-page', (event, comicInfoId) => {
  if (readingWindow == null) {
    readingWindow = createReadingWindow(comicInfoId)
  } else {
    readingWindow.send('comic-info-id-changed', comicInfoId)
  }
})

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', async () => {
  if (isDevelopment) {
    const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer')

    for (const extension of [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]) {
      await installExtension(extension)
    }
  }

  mainWindow = createMainWindow()
})
