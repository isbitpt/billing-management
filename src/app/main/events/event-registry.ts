import {AppEvent} from './app-event';

export interface EventRegistry {
  getEvents(): AppEvent[];
}
