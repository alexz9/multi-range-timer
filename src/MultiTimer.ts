import { EventCallback, events, IMutableRange, IRange, status, StatusTypes } from "./types";
import toValidRanges from "./utils/toValidRanges";
import toTimerData from "./utils/toTimerData";
import Emitter from "./Emitter";

interface ITimer {
  start: () => void
  stop: () => void
  subscribe: (callback: EventCallback) => void
  unsubscribe: (callback: EventCallback) => void
  status: StatusTypes
  range?: IRange
}

export class MultiTimer implements ITimer {
  #delay: number = 1000;
  #status: StatusTypes = status.STOPPED;
  #range: IMutableRange | undefined;
  #ranges: IMutableRange[];  
  #timer: any;
  #emitter;

  constructor(ranges: IRange[]) {
    this.#ranges = toValidRanges(ranges);
    this.#emitter = new Emitter();
  }

  start() {
    if (!this.#timer) {
      this.#tick();
    }
  }
  stop() {
    this.#status = status.STOPPED;
    clearTimeout(this.#timer);
    this.#emitter.emit(events.STOP, this.#getState());
  }
  subscribe(callback: EventCallback) {
    this.#emitter.subscribe(events.START, callback);
    this.#emitter.subscribe(events.STOP, callback);
    this.#emitter.subscribe(events.TICK, callback);
  }
  unsubscribe(callback: EventCallback) {
    this.#emitter.unsubscribe(events.START, callback);
    this.#emitter.unsubscribe(events.STOP, callback);
    this.#emitter.unsubscribe(events.TICK, callback);
  }

  #tick() {
    const now = new Date();
    this.#range = this.#ranges.find((item: any) => item.start <= now && item.end >= now);

    // все диапазоны таймеров закончились, прекращаем работу
    if (!this.#range && this.#ranges[this.#ranges.length - 1].end < now) {
      return this.stop();
    }

    // отправляем события ожидания, запуска, тика
    if (!this.#range && this.#status === status.WORKED) {
      this.#status = status.PENDING;
      this.#emitter.emit(events.STOP, this.#getState());
    }
    if (this.range && this.#status !== status.WORKED) {
      this.#status = status.WORKED;
      this.#emitter.emit(events.START, this.#getState());
    }
    if (this.#range) {
      this.#emitter.emit(events.TICK, toTimerData(this.#range));
    }

    this.#timer = setTimeout(() => this.#tick(), this.#delay);
  }
  get status() {
    return this.#status;
  }
  get range() {
    return this.#range;
  }
  #getState(){
    return {
      status: this.status,
      range: this.range
    }
  }
}