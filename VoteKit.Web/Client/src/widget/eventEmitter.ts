export default class EventEmitter {
  listeners: { [name: string]: ((event) => void)[] };

  constructor() {
    this.listeners = {};
  }

  trigger(name, event?) {
    this.listeners[name]?.forEach((x) => x(event));
    this.listeners["*"]?.forEach((x) => x({ data: event, name }));
  }

  on(name, fn) {
    this.listeners[name] = this.listeners[name] || [];
    this.listeners[name].push(fn);
  }

  off(name, fn) {
    if (this.listeners[name]) {
      this.listeners[name] = this.listeners[name].filter((f) => f != fn);
    }
  }

  one(name, fn) {
    let wrapper;

    wrapper = (...args) => {
      this.listeners[name] = this.listeners[name].filter((f) => f != wrapper);
      fn(...args);
    };

    this.listeners[name] = this.listeners[name] || [];
    this.listeners[name].push(wrapper);
  }

  offAll() {
    this.listeners = {};
  }
}
