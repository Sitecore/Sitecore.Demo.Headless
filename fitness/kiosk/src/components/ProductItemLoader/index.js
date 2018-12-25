import React from "react";
import PropTypes from "prop-types";
import ContentLoader from "react-content-loader";

class ProductItemLoader extends React.Component {
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
    const { width } = this.props;

    if (!showLoading) {
      return null;
    }

    return (
      <div className="productRecommendationList-item">
        <div className="productRecommendationList-item-inner">
          <div
            className="productRecommendationList-item-image"
            style={{ background: "transparent" }}
          >
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
          <div className="productRecommendationList-item-body">
            <ContentLoader
              height={223}
              width={width}
              speed={2}
              primaryColor={"#333"}
              secondaryColor={"#999"}
              style={{ width: "100%" }}
            >
              <rect x="0" y="0" rx="5" ry="5" width={width} height="60" />
              <rect x="0" y="65" rx="5" ry="5" width={width} height="30" />
              <rect x="0" y="100" rx="5" ry="5" width={width} height="30" />
            </ContentLoader>
          </div>
        </div>
      </div>
    );
  }
}

ProductItemLoader.propTypes = {
  timeout: PropTypes.number
};

ProductItemLoader.defaultProps = {
  timeout: 250
};

export default ProductItemLoader;
