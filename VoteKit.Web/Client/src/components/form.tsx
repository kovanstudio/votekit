import * as React from "react";
import ReactSelect from "react-select";

let id = 0;

export function Checkbox({
  label = null,
  labelComponent = null,
  ...rest
}: { label?: string; labelComponent?: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  let selfid = React.useRef(`checkbox-id-${id++}`);

  return (
    <div className="input-checkbox">
      <input type="checkbox" id={selfid.current} {...rest} />
      {label ?? labelComponent ? <label htmlFor={selfid.current}>{labelComponent || label}</label> : null}
    </div>
  );
}

export function Radio({ label = null, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  let selfid = React.useRef(`radio-id-${id++}`);

  return (
    <div className="input-radio">
      <input type="radio" id={selfid.current} {...rest} />
      {label ? <label htmlFor={selfid.current}>{label}</label> : null}
    </div>
  );
}

export const defaultStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "rgba(126, 55, 255, 0.9)" : "#e6e6e6",
    boxShadow: 0,
    minHeight: "34px",

    ":hover": {
      borderColor: state.isFocused ? "rgba(126, 55, 255, 0.9)" : "#e6e6e6",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    padding: "6px",
  }),

  clearIndicator: (base) => ({
    ...base,
    padding: "6px",
  }),

  singleValue: base => ({
    ...base,
    lineHeight: "1.25"
  }),
};

export function Select({ ...props }) {
  return <ReactSelect classNamePrefix={"r-select"} {...props} styles={defaultStyles} />;
}
