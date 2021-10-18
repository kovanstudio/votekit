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

    this.frame.css({
      maxWidth: "800px",
      maxHeight: "80vh",
      width: "70vw",
      height: "0",
      borderRadius: "4px",
      boxShadow: "0 2px 13px 0 rgba(0,0,0,0.19)",
      transform: "translateX(-50%)",
      left: "50%",
    });

    this.frame.on("INIT", ({ payload: { size } }) => {
      this.frame.css({
        opacity: 1,
        top: "10vh",
        pointerEvents: "auto",
        transition: "all 0.25s ease-in",
        height: `${size.height}px`
      })
    });

    this.frame.on("RESIZE", ({ payload }) => {
      this.frame.css({ height: `${payload.height}px` })
    });

    this.frame.on("clickoutside", () => this.close())

    this.frame.load();
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

  close() {
    if (this.backdrop?.parentElement) {
      Object.assign(this.backdrop.style, { opacity: 0, pointerEvents: "none" });
      setTimeout(() => this.backdrop.parentElement?.removeChild(this.backdrop), 200);
    }

    this.frame.css({ opacity: 0, pointerEvents: "none" });
    setTimeout(() => this.frame.destroy(), 200);
  }

  destroy() {
    this.close();
  }
}
