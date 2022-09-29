import {OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';

export abstract class BaseComponent implements OnInit, OnDestroy {
  #ngUnsubscribe: Subject<void> = new Subject<void>();
  #onInit: Subject<void> = new Subject<void>();
  #onDestroy: Subject<void> = new Subject<void>();

  protected get ngUnsubscribe(): Observable<void> {
    return this.#ngUnsubscribe.asObservable();
  }

  protected get onInit(): Observable<void> {
    return this.#onInit.asObservable();
  }

  protected get onDestroy(): Observable<void> {
    return this.#onDestroy.asObservable();
  }

  public ngOnDestroy(): void {
    this.#onDestroy.next();

    this.#onInit.complete();
    this.#ngUnsubscribe.complete();
    this.#onDestroy.complete();
  }

  public ngOnInit(): void {
    this.#onInit.next();
  }
}
