//Import these to run decorators
import '@isbit/main/events';
import '@isbit/main/services';
import '@isbit/main/database';

import { Container } from 'inversify';
import {buildProviderModule} from 'inversify-binding-decorators';
import {DatabaseManager, Symbols} from './database.manager';


export class IoCManager {
  readonly #container: Container;

  constructor() {
    this.#container = new Container({
      autoBindInjectable: true,
      defaultScope: 'Request',
    });

    this.#container.load(buildProviderModule());

    this.wire();
  }

  public get container(): Container{
    return this.#container;
  }

  private wire(): void {
    this.#container.bind(Symbols.appDB).toDynamicValue(() => DatabaseManager.getDatabaseInstance(Symbols.appDB));
    this.#container.bind(Symbols.userDb).toDynamicValue(() => DatabaseManager.getDatabaseInstance(Symbols.userDb));
  }
}
