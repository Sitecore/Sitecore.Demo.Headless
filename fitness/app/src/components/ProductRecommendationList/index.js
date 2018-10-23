import React from "react";
import ProductRecommendationListItem from "../ProductRecommendationListItem";
import { Text } from "@sitecore-jss/sitecore-jss-react";

const ProductRecommendationList = ({ fields }) => {
  if (!fields.items || fields.items.length <= 0) {
    return null;
  }

  return (
    <React.Fragment>
      <div className="productRecommendationList">
        <div className="productRecommendationList-header">
          <Text tag="h4" field={fields.title} className="productRecommendationList-title"  />
        </div>
        
        <div className="productRecommendationList-content">
          <div className="productRecommendationList-items">
            {fields.items.map((productData, index) => (
              <ProductRecommendationListItem key={index} {...productData} />
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductRecommendationList;
