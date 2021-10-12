import "../css/modal.scss";

import React from "react";
import ReactDOM from "react-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default class Modal extends React.Component<{ onClose?: () => void }> {
  element: HTMLDivElement;

  constructor(props) {
    super(props);

    this.element = document.createElement("div");
    this.element.className = "modal-wrapper";

    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(e) {
    if (e.target !== this.element) return;
    if (this.props.onClose) this.props.onClose();
  }

  componentDidMount() {
    disableBodyScroll(this.element, { reserveScrollBarGap: true });

    document.body.appendChild(this.element);
    this.element.addEventListener("click", this.handleClickOutside);
    requestAnimationFrame(() => (this.element.className = "modal-wrapper active"));
  }

  componentWillUnmount() {
    this.element.removeEventListener("click", this.handleClickOutside);
    this.element.classList.remove("active");

    setTimeout(() => {
      document.body.removeChild(this.element);
    }, 100);

    enableBodyScroll(this.element);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.element);
  }
}
