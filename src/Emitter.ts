interface IEmitter {
  subscribe: (type: string, callback: any) => void
  unsubscribe: (type: string, callback: any) => void
  emit: (type: string, data: any) => void
}

class Emitter implements IEmitter {
  #events: { [key: string]: any } = {};

  subscribe(type: string, callback: any) {
    if (this.#events[type]) {
      this.#events[type].push(callback);
    } else {
      this.#events[type] = [callback];
    }
  }
  unsubscribe(type: string, callback: any) {
    this.#events[type] = this.#events[type].filter((item: any) => item !== callback);
  }
  emit(type: string, data: any) {
    if (this.#events[type]) {
      this.#events[type].forEach((item: any) => item.call(null, { type, data }));
    }
  }
}

export default Emitter;