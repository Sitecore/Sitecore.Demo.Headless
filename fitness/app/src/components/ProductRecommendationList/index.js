import React from "react";
import ProductRecommendationListItem from "../ProductRecommendationListItem";
import { getAll } from "../../services/ProductService";
import { Text } from "@sitecore-jss/sitecore-jss-react";

class ProductRecommendationList extends React.Component {
  state = {
    products: [],
    loading: true,
    error: false
  };

  componentDidMount() {
    getAll()
      .then(response => {
        this.setState({ products: response.data });
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ error: true });
        console.error(error);
      });
  }

  render() {
    const { products, loading, error } = this.state;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (error) {
      return <h1>Error</h1>;
    }

    const { fields } = this.props;

    if (!products || products.length <= 0) {
      return null;
    }

    return (
      <div className="productRecommendationList">
        <div className="productRecommendationList-header">
          <Text
            tag="h4"
            field={fields.title}
            className="productRecommendationList-title"
          />
        </div>

        <div className="productRecommendationList-content">
          <div className="productRecommendationList-items">
            {products.map((productData, index) => (
              <ProductRecommendationListItem key={index} {...productData} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductRecommendationList;
