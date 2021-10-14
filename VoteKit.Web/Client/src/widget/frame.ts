import EventEmitter from "./eventEmitter";

export default class Frame extends EventEmitter {
  wrapper: HTMLDivElement;
  frame: HTMLIFrameElement;
  src: URL;
  data: any;
  
  constructor() {
    super();
  }
}
