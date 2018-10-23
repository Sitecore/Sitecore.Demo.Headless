import React from "react";
import { Text, RichText, Image, Link } from "@sitecore-jss/sitecore-jss-react";

const ProductRecommendationListItem = ({ fields }) => {
  return (
    <div className="productRecommendationList-item">
      <div className="productRecommendationList-item-inner">
        <Link field={fields.link} className="product-link">
          <div className="productRecommendationList-item-image">
            <Image field={fields.image} />
          </div>
          <div className="productRecommendationList-item-body">
            <Text
              field={fields.title}
              tag="h5"
              className="productRecommendationList-item-title"
            />
            <div className="productRecommendationList-item-desc">
              <RichText field={fields.description} tag="p" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductRecommendationListItem;
