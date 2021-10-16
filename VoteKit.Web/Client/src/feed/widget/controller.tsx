import { useEffect, useLayoutEffect } from "react";
import { debounce, observeResize, post } from "./lib";

export default function WidgetController() {
  useLayoutEffect(() => {
    let debouncedPost = debounce(post, 100);

    return observeResize(document.body, size => {
      debouncedPost("RESIZE", size);
    });
  }, [])

  useEffect(() => {
    post("INIT")
  }, []);

  return <div/>
}
