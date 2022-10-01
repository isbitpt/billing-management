import {buildSplashWindow} from './windows/splash-window.window';

require('dotenv').config();
import 'reflect-metadata';

import { app, BrowserWindow } from 'electron';

import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import {Container} from 'inversify';

import {IoCManager} from './ioc/ioc.manager';
import {DatabaseManager} from './database/database.manager';
import {EventManager} from './events/event.manager';
import {buildMainWindow} from './windows/main-window.window';

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
process.env.SERVE = serve  ? '1' : '0';

class App {
  readonly #container: Container;

  constructor() {
    this.#container = (new IoCManager()).container;
  }

  public async startApp(): Promise<void> {
    if (serve) {
      app.commandLine.appendSwitch('remote-debugging-port', '9229');
    }

    await DatabaseManager.initDB();
    await EventManager.registerEvents(this.#container);
    await this.registerElectronEvents();

    await app.whenReady();

    await installExtension(REDUX_DEVTOOLS);

    await this.createWindows();
  }

  private async registerElectronEvents(): Promise<void> {
    try {
      // Quit when all windows are closed.
      app.on('window-all-closed', async () => {
        await DatabaseManager.close();

        app.quit();
      });
    } catch (e) {
      await DatabaseManager.close();
    }
  }

  private async createWindows(): Promise<void> {
    const splashWindow = await buildSplashWindow();
    const mainWindow = await buildMainWindow();
    mainWindow.on('ready-to-show', () => {
      setTimeout(() => {
        splashWindow.destroy();
        mainWindow.show();
      },1000);
    });
  }
}
(new App()).startApp();
