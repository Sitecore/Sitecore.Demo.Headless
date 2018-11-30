/* eslint-disable */

import React from "react";
import { Fragment } from "react";
import AnchorLabel from "../../components/AnchorLabel";

function withScrollToTop(WrappedComponent) {
  return class extends React.Component {
    constructor() {
      super();
      this.top = React.createRef();
    }

    scrollTop() {
      this.top.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }

    render() {
      return (
        <Fragment>
          <a ref={this.top} />
          <WrappedComponent {...this.props} />
          <a className="backToTop" onClick={() => this.scrollTop()}>
            <AnchorLabel />
          </a>
        </Fragment>
      );
    }
  };
}

export default withScrollToTop;
