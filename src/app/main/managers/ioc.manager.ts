//Import these to run decorators
import '../events';
import '../services';
import '../database';

import { Container } from 'inversify';
import {buildProviderModule} from 'inversify-binding-decorators';

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
    //Manual wires can be done here
  }
}
