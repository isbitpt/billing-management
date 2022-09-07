require('dotenv').config();
import 'reflect-metadata';

import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {Container} from 'inversify';

import {DatabaseManager, EventManager, IoCManager} from './managers';
import {UserDatabasesRepository} from './database';
import {TYPES} from './ioc';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

class App {
  #win: BrowserWindow = null;
  readonly #container: Container;

  constructor() {
    this.#container = (new IoCManager()).container;
  }


  public async startApp(): Promise<void> {
    await DatabaseManager.initDB(this.#container);

    await EventManager.registerEvents(this.#container);

    this.registerElectronEvents();

    const testDb = (process.env.TEST_DB || false ) === '1';

    if (testDb) {
      const userDatabasesRepository = this.#container.get<UserDatabasesRepository>(TYPES.Repository);
      await userDatabasesRepository.createNewDatabase(`TestBd${Math.random()}`, '123das');

      const loadedDatabases = await userDatabasesRepository.getAllDatabases();
      console.log(loadedDatabases);
    }

    await app.whenReady();

    this.createWindow();
  }

  private registerElectronEvents() {
    try {
      // Quit when all windows are closed.
      app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit();
        }
      });

      app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (this.#win === null) {
          this.createWindow();
        }
      });

    } catch (e) {
      // Catch Error
      // throw e;
    }
  }

  private createWindow(): BrowserWindow {

    const size = screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    this.#win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: (serve),
        contextIsolation: false,  // false if you want to run e2e test with Spectron
      },
    });

    if (serve) {
      const debug = require('electron-debug');
      debug();

      require('electron-reloader')(module);
      this.#win.loadURL('http://localhost:4200');
    } else {
      // Path when running electron executable
      let pathIndex = './index.html';

      if (fs.existsSync(path.join(__dirname, '../../dist/index.html'))) {
        // Path when running electron in local folder
        pathIndex = '../../dist/index.html';
      }

      const url = new URL(path.join('file:', __dirname, pathIndex));
      this.#win.loadURL(url.href);
    }

    // Emitted when the window is closed.
    this.#win.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.#win = null;
    });

    return this.#win;
  }
}
(new App()).startApp();
