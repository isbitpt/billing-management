//Import these to run decorators
import '@isbit/main/events';
import '@isbit/main/services';
import '@isbit/main/database';

import { Container } from 'inversify';
import {buildProviderModule} from 'inversify-binding-decorators';
import {DatabaseSymbols} from '../database/database-symbols';
import {DatabaseManager} from '../database/database.manager';


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
    this.#container
      .bind(DatabaseSymbols.applicationDatabaseSymbol)
      .toDynamicValue(() => DatabaseManager.getDatabaseInstance(DatabaseSymbols.applicationDatabaseSymbol));
    this.#container
      .bind(DatabaseSymbols.financeManagementDatabaseSymbol)
      .toDynamicValue(() => DatabaseManager.getDatabaseInstance(DatabaseSymbols.financeManagementDatabaseSymbol));
  }
}
