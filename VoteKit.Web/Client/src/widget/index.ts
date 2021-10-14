import EventEmitter from "./eventEmitter";

export class VoteKit extends EventEmitter {
  log: any[];

  get version() {
    return 2;
  }

  constructor(conf) {
    super();

    this.log = [];
  }
}

export default new VoteKit({});
