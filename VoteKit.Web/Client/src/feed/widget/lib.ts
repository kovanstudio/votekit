export function observeResize(element: HTMLElement, trigger) {
  let unobserver: () => void;

  if (window["ResizeObserver"]) {
    let ro = new window["ResizeObserver"](([e]) => {
      trigger({ width: e.contentRect.width, height: e.contentRect.height });
    });

    ro.observe(element);

    unobserver = () => ro.disconnect();
  } else if (window["MutationObserver"]) {
    let lastSize = { width: element.clientWidth, height: element.clientHeight };

    let mo = new MutationObserver(() => {
      if (element.clientHeight != lastSize.height || element.clientWidth != lastSize.width) {
        lastSize.width = element.clientWidth;
        lastSize.height = element.clientHeight;

        trigger(lastSize);
      }
    });

    mo.observe(element, { attributes: true, childList: true, subtree: true });

    unobserver = () => mo.disconnect();
  } else {
    let lastSize = { width: element.clientWidth, height: element.clientHeight };

    let timer = setInterval(() => {
      if (element.clientHeight != lastSize.height || element.clientWidth != lastSize.width) {
        lastSize.width = element.clientWidth;
        lastSize.height = element.clientHeight;

        trigger(lastSize);
      }
    }, 500);

    unobserver = () => clearInterval(timer);
  }

  trigger({ width: element.clientWidth, height: element.clientHeight });

  return unobserver;
}

export function post(name, payload = {}) {
  window.parent.postMessage({ event: name, payload }, "*");
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
