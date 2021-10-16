import EventEmitter from "./eventEmitter";
import Frame from "./frame";

export type RenderOptions = {
  ssoToken?: string
};

export default class Widget extends EventEmitter {
  frame: Frame;
  backdrop: HTMLDivElement;

  constructor(src: string, options: RenderOptions) {
    super();

    this.frame = new Frame({
      src: new URL(src),
      data: {
        ssoToken: options.ssoToken,
        origin: window.location.origin
      }
    });

    this.frame.css({
      transform: "",
      height: "80vh",
      width: "400px",
    });
  }

  render() {
    this.renderBackdrop();

    this.frame.load();

    const style = {
      opacity: 1,
      transform: "translateX(-50%)",
      left: "50%",
      right: 0,
      top: "10vh",
      bottom: 0,
      maxWidth: "800px",
      maxHeight: "80vh",
      width: "70vw",
      height: "80vh",
      pointerEvents: "auto",
      borderRadius: "4px",
      boxShadow: "0 2px 13px 0 rgba(0,0,0,0.19)",
    };

    this.frame.css(style);

    this.frame.on("RESIZE", ({ payload }) => {
      console.log('res', payload)
      this.frame.css({ width: `${payload.width}px`, height: `${payload.height}px` })
    });
  }

  renderBackdrop() {
    this.backdrop = document.createElement("div");

    Object.assign(this.backdrop.style, {
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: "rgba(0,0,0,.3)",
      zIndex: 998,
      opacity: 0,
      transition: "opacity 0.7s ease",
    });

    document.body.appendChild(this.backdrop);

    setTimeout(() => Object.assign(this.backdrop.style, { opacity: 1 }), 10);
  }

  destroy() {
    if (this.backdrop) this.backdrop.parentElement?.removeChild(this.backdrop);
  }
}
