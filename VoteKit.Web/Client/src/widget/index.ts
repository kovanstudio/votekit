import EventEmitter from "./eventEmitter";
import Widget, { RenderOptions } from "./widget";

/**

 window.votekit = (window.votekit || { 
  queue: [], 
  on: function(n,x) { window.votekit.queue.push("on", [n,x]) }), 
  render: function(s,o) { window.votekit.queue.push("render", [s,o]) }) 
};

 */

export class VoteKit extends EventEmitter {
  activeWidget?: Widget;

  get version() {
    return 2;
  }

  constructor(conf) {
    super();

    conf.queue?.forEach?.(([name, args]) => this[name]?.(...args));

    setTimeout(() => {
      this.trigger("init", this);
    }, 10);
  }

  render(src: string, options: RenderOptions = {}) {
    if (!src) {
      return;
    }

    if (this.activeWidget) {
      this.activeWidget.destroy();
    }

    this.activeWidget = new Widget(src, options);
    this.activeWidget.render();

    return this.activeWidget;
  }
}

let mod;

if (window["votekit"]) {
  if (window["votekit"].loaded) {
    mod = window["votekit"];
  } else {
    mod = new VoteKit(window["votekit"]);
  }
} else {
  mod = new VoteKit({});
}

export default mod;
