import {BrowserWindow, screen} from 'electron';
import * as fs from 'fs';
import * as path from 'path';

const serve = process.env.SERVE === '1';

let window: BrowserWindow = null;

export const buildMainWindow = async () => {
  const size = screen.getPrimaryDisplay().workAreaSize;

  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
    show: false
  });

  setTimeout(async () => {
    if (serve) {
      const debug = require('electron-debug');
      debug({
        showDevTools: true
      });

      require('electron-reloader')(module);
      await window.loadURL('http://localhost:4200');
    } else {
      // Path when running electron executable
      let pathIndex = './index.html';

      if (fs.existsSync(path.join(__dirname, '../../../dist/index.html'))) {
        // Path when running electron in local folder
        pathIndex = '../../../dist/index.html';
      }

      const url = new URL(path.join('file:', __dirname, pathIndex));
      await window.loadURL(url.href);
    }
  });

  window.on('closed', () => {
    window = null;
  });

  return window;
};
