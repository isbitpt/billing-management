import {BrowserWindow, screen} from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let window: BrowserWindow = null;

export const buildMainWindow = async () => {
  const serve = process.env.SERVE === '1';

  const size = screen.getPrimaryDisplay().workAreaSize;

  const resolveIndexPath = async () => {
    if (serve) {
      return 'http://localhost:4200';
    } else {
      // Path when running electron executable
      let pathIndex = './index.html';

      if (fs.existsSync(path.join(__dirname, '../../../dist/index.html'))) {
        // Path when running electron in local folder
        pathIndex = '../../../dist/index.html';
      }

      const indexPath = path.join('file:', __dirname, pathIndex);

      const url = new URL(indexPath);

      return url.href;
    }
  };

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
    }

    const indexPath = await resolveIndexPath();

    await window.loadURL(indexPath);
  });

  window.webContents.on('did-fail-load', async () => {
    const indexPath = await resolveIndexPath();

    await window.loadURL(indexPath);
  });

  window.on('closed', () => {
    window = null;
  });


  return window;
};
