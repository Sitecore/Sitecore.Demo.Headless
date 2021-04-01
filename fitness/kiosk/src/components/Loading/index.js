import React from "react";
/* eslint-disable-next-line import/no-extraneous-dependencies */
import PropTypes from "prop-types";
import loadingImg from "../../assets/img/loading.gif";

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.showLoading = this.showLoading.bind(this);
    this.state = {
      showLoading: false
    };

    this.timer = setTimeout(this.showLoading, this.props.timeout);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showLoading() {
    this.setState({ showLoading: true });
  }

  render() {
    const { showLoading } = this.state;

    if (!showLoading) {
      return null;
    }

    return (
      <div style={{ margin: "auto" }}>
        <img src={loadingImg} width="380px" alt="Loading..." />
      </div>
    );
  }
}

Loading.propTypes = {
  timeout: PropTypes.number
};

Loading.defaultProps = {
  timeout: 250
};

export default Loading;
