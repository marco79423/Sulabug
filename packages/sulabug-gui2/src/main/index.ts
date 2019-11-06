import {app, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import {format as formatUrl} from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'


function createWindow(name: string, url: string) {
  const window = new BrowserWindow({
    webPreferences: {
      webSecurity: false, // for same-origin policy
      nodeIntegration: true,
    }
  })

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  window.loadURL(url)
  window.webContents.on('dom-ready', () => {
    window.webContents.send('ready', name)
  })
  return window
}

app.on('ready', async () => {
  let targetUrl
  if (isDevelopment) {
    targetUrl = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  } else {
    targetUrl = formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    })
  }

  if (isDevelopment) {
    const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer')

    for (const extension of [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]) {
      await installExtension(extension)
    }
  }

  const managerWindow = createWindow('manager', `${targetUrl}#manager`)
  const browserWindow = createWindow('browser', `${targetUrl}#browser`)

  ipcMain.on('sulabug-action', (e, action) => {
    managerWindow.webContents.send('sulabug-action', action)
    browserWindow.webContents.send('sulabug-action', action)
  })
})

