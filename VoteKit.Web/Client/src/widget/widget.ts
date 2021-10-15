import EventEmitter from "./eventEmitter";
import Frame from "./frame";

export type RenderOptions = {
  ssoToken?: string
};

export default class Widget extends EventEmitter {
  frame: Frame;

  constructor(src: string, options: RenderOptions) {
    super();

    this.frame = new Frame({
      src,
      data: {
        ssoToken: options.ssoToken,
        origin: window.location.origin
      }
    });
  }

  render() {
    
  }

  destroy() {

  }
}
