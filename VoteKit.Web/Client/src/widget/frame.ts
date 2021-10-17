import EventEmitter from "./eventEmitter";

const mobile = !!navigator.userAgent && /iPhone|iPod|Android/.test(navigator.userAgent);

export default class Frame extends EventEmitter {
  wrapper: HTMLDivElement;
  frame: HTMLIFrameElement;
  src: URL;
  data: any;
  destroyed = false;

  constructor({ src, data }: { src: URL, data: { [key: string]: string } }) {
    super();

    this.src = src;
    this.data = data;

    window.addEventListener("message", (msg) => {
      if (this.destroyed) return;
      if (msg.origin != this.src.origin) return;
      if (msg.source !== this.frame.contentWindow) return;

      if (msg.data.event) {
        this.trigger(msg.data.event, msg.data);
      }
    });

    this.createFrame();
  }

  css(obj: { [key: string]: any }) {
    Object.assign(this.wrapper.style, obj);
  }

  postMessage(msg) {
    if (this.destroyed) return;
    this.frame.contentWindow.postMessage(msg, this.src.origin);
  }

  load() {
    let url = new URL(this.src.toString());

    url.searchParams.set("mode", "widget");
    url.searchParams.set("mobile", "true");
    url.searchParams.set("locale", navigator.language.slice(0, 2).toLowerCase());

    for (const dataKey in this.data) {
      let val = this.data[dataKey];

      if (typeof val !== "undefined" && val !== null)
        url.searchParams.set(dataKey, this.data[dataKey]);
    }

    document.body.appendChild(this.wrapper);

    this.frame.src = url.toString();
  }

  createFrame() {
    let wrapper = document.createElement("div");

    wrapper.innerHTML = `<iframe name="announcekit-frame" allowfullscreen="true" allow="fullscreen" title="AnnounceKit Widget" sandbox="allow-same-origin allow-scripts allow-top-navigation allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads"></iframe>`;
    wrapper.className = "votekit-frame-wrapper";

    let frame = wrapper.firstChild as HTMLIFrameElement;

    this.wrapper = wrapper;
    this.frame = frame;

    this.resetStyle();

    wrapper.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });

    document.addEventListener("click", (e) => {
      this.trigger("clickoutside");
    });

    document.addEventListener("touchstart", (e) => {
      this.trigger("clickoutside");
    });
  }

  resetStyle() {
    this.frame.setAttribute("style", "");
    this.wrapper.setAttribute("style", "");

    Object.assign(this.frame.style, {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      border: 0,
      width: "100%",
      height: "100%",
    });

    Object.assign(this.wrapper.style, {
      width: 0,
      height: 0,
      overflow: "hidden",
      top: "-1000em",
      position: "fixed",
      opacity: 0,
      zIndex: 2147483001,
      transform: "",
      pointerEvents: "none",
    });
  }

  destroy() {
    if (this.destroyed) {
      return;
    }

    if (this.wrapper.parentElement) {
      this.wrapper.parentElement.removeChild(this.wrapper);
    }

    this.destroyed = true;
  }
}
