import * as React from "react";
import * as ReactDOM from "react-dom";
import { TwitterPicker, SketchPicker, CompactPicker } from "react-color";

export { SketchPicker, TwitterPicker, CompactPicker };

export default function ColorPicker({
  value = "ffffff",
  onChange,
  className = "",
  full = false,
}: {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  full?: boolean;
}) {
  const [popup, setPopup] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [draft, setDraft] = React.useState<string>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const calculatePosition = () => {
    let pos = inputRef.current.getBoundingClientRect();
    let size = full ? { width: 220, height: 284 } : { width: 245, height: 89 };

    let attachX = "left";
    let attachY = "top";

    if (pos.left + size.width > window.innerWidth) {
      attachX = "right";
    }

    if (pos.top + size.height + 10 > window.innerHeight && pos.top > window.innerHeight / 2) {
      attachY = "bottom";
    }

    let style = {};

    let topOffset = window.pageYOffset || document.documentElement.scrollTop;
    let leftOffset = window.pageXOffset || document.documentElement.scrollLeft;

    if (attachX == "left") {
      Object.assign(style, { left: `${Math.max(0, pos.left + leftOffset)}px` });
    } else if (attachX == "right") {
      Object.assign(style, {
        left: `${Math.max(0, pos.left + leftOffset - size.width)}px`,
      });
    } else if (attachX == "center") {
      Object.assign(style, {
        left: `${Math.max(0, pos.left + leftOffset + (pos.width - size.width) / 2)}px`,
      });
    }

    if (attachY == "top") {
      Object.assign(style, { top: `${pos.bottom + topOffset + 10}px` });
    } else {
      Object.assign(style, {
        top: `${pos.top + topOffset - size.height - 10}px`,
      });
    }

    return style;
  };

  return (
    <div className="input-color">
      <input
        ref={inputRef}
        className={`${className} input-control`}
        type="text"
        placeholder="#ffffff"
        value={draft !== null ? draft : `#${value}`}
        onChange={(e) => {
          let val = /^#?(([0-9a-fA-F]{3}){1,2})$/i.exec(e.target.value);

          if (val) {
            let hex = val[1];

            if (hex.length == 3) {
              hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
              onChange(hex);
              setDraft(e.target.value);
            } else {
              setDraft(null);
              onChange(hex);
            }
          } else {
            setDraft(e.target.value);
          }
        }}
        onFocus={() => setPopup(true)}
        onBlur={() => {
          if (hover) {
            return;
          }

          setPopup(false);
          setDraft(null);
        }}
      />

      <div onClick={() => setPopup(true)} className="color-indicator" style={{ backgroundColor: `#${value || "ffffff"}` }} />

      {popup ? (
        <PickerContainer style={{ position: "absolute", zIndex: 2000, ...calculatePosition() }}>
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={(e) => {
              setHover(false);
              inputRef.current.focus();
            }}
          >
            {full ? (
              <SketchPicker color={`#${value}`} onChange={(c) => onChange(c.hex.replace(/^#/, ""))} />
            ) : (
              <CompactPicker color={`#${value}`} onChange={(c) => onChange(c.hex.replace(/^#/, ""))} />
            )}
          </div>
        </PickerContainer>
      ) : null}
    </div>
  );
}

function PickerContainer({ children, style }) {
  const element = React.useRef<HTMLDivElement>();

  if (!element.current) {
    element.current = document.createElement("div");
  }

  React.useEffect(() => {
    document.body.appendChild(element.current);
    return () => {
      document.body.removeChild(element.current);
    };
  }, []);

  React.useEffect(() => {
    Object.assign(element.current.style, style);
  }, [style]);

  return ReactDOM.createPortal(children, element.current);
}
