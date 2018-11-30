import React from "react";
import PropTypes from "prop-types";
import ContentLoader from "react-content-loader";

class EventItemLoader extends React.Component {
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
    const { width, height } = this.props;

    if (!showLoading) {
      return null;
    }

    return (
      <div className="events-item">
        <div className="events-item-image-container">
          <div className="events-item-image">
            <ContentLoader
              height={184}
              width={width}
              speed={2}
              primaryColor={"#333"}
              secondaryColor={"#999"}
            >
              <rect x="0" y="0" rx="5" ry="5" width={width} height="184" />
            </ContentLoader>
          </div>
        </div>
        <div className="events-item-content">
          <div className="events-item-content-inner">
            <ContentLoader
              height={223}
              width={width}
              speed={2}
              primaryColor={"#333"}
              secondaryColor={"#999"}
              style={{ width: "100%" }}
            >
              <rect x="0" y="0" rx="5" ry="5" width={width} height="60" />
              <rect x="0" y="65" rx="5" ry="5" width={width} height="20" />
              <rect x="0" y="90" rx="5" ry="5" width={width} height="100" />
            </ContentLoader>
          </div>
        </div>
      </div>
    );
  }
}

EventItemLoader.propTypes = {
  timeout: PropTypes.number
};

EventItemLoader.defaultProps = {
  timeout: 100
};

export default EventItemLoader;
