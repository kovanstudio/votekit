import EventEmitter from "./eventEmitter";

type RenderOptions = {
  ssoToken?: string
};

export class VoteKit extends EventEmitter {
  log: any[];

  get version() {
    return 2;
  }

  constructor(conf) {
    super();

    this.log = [];

    setTimeout(() => {
      this.trigger("init", this);
    }, 10);
  }

  render(src: string, options: RenderOptions = {}) {

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
