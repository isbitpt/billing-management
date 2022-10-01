import {BrowserWindow} from 'electron';
import * as fs from 'fs';
import * as path from 'path';

let splashWindow: BrowserWindow;

export const buildSplashWindow = async () => {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    center: true,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    frame: false,
    titleBarStyle: 'hidden'
  });

  let pathIndex = './splash.html';

  if (fs.existsSync(path.join(__dirname, '../../../dist/splash.html'))) {
    // Path when running electron in local folder
    pathIndex = '../../../dist/splash.html';
  }

  const url = new URL(path.join('file:', __dirname, pathIndex));
  await splashWindow.loadURL(url.href);

  splashWindow.on('closed', () => {
    splashWindow = null;
  });

  return splashWindow;
};
