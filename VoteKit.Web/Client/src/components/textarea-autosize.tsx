import { forwardRef, useState } from "react";

function TextareaAutosizeImpl(props, ref) {
  const [height, setHeight] = useState(0);

  return (
    <textarea
      style={{ height: height ? `${height}px` : "" }}
      ref={ref}
      {...props}
      onInput={(e) => {
        setHeight((e.target as HTMLInputElement).scrollHeight);
      }}
    />
  );
}

const TextareaAutosize = forwardRef(TextareaAutosizeImpl);

export default TextareaAutosize;
