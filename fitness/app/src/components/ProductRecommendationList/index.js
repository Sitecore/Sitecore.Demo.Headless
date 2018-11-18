import React from "react";
import ProductRecommendationListItem from "../ProductRecommendationListItem";
import { getAll, ProductDisplayCount } from "../../services/ProductService";
import { Text } from "@sitecore-jss/sitecore-jss-react";
import ProductItemLoader from "../ProductItemLoader";
import withSizes from "react-sizes";

class ProductRecommendationList extends React.Component {
  state = {
    products: [],
    loading: true,
  };

  componentDidMount() {
    getAll()
      .then(response => {
        this.setState({ products: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { products, loading, error } = this.state;
    const { fields, height, width } = this.props;

    let productItems = [];
    if (loading) {
      for (let i = 0; i < ProductDisplayCount; i++) {
        productItems.push(
          <ProductItemLoader key={i} width={width} height={height} />
        );
      }
    } else {
      productItems = products.map((productData, index) => (
        <ProductRecommendationListItem key={index} {...productData} />
      ));
    }

    return (
      <div className="productRecommendationList">
        <div className="list-header">
          <Text tag="h4" field={fields.title} className="list-title" />
        </div>
        <div className="productRecommendationList-content">
          <div className="productRecommendationList-items">{productItems}</div>
        </div>
      </div>
    );
  }
}

const mapSizesToProps = function(sizes) {
  return {
    width: sizes.width,
    height: sizes.height
  };
};

export default withSizes(mapSizesToProps)(ProductRecommendationList);
