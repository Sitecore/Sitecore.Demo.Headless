import { Category } from "ordercloud-javascript-sdk";
import { FunctionComponent } from "react";
import OcCategoryList from "../../ordercloud/components/OcCategoryList"
import { getMasterImageUrl } from "../ProductDetail";

const getCategoryListImage = (c:Category) => {
    return `${getMasterImageUrl(c)}&t=w400`
}

const CategoryList:FunctionComponent = (props) => {
    return (
        <main>
            <div className="category-list">
                <OcCategoryList columns={{xs:2}} imgSrcMap={getCategoryListImage} hrefMap={c => `/shop/${c.ID}`}/>
            </div>
        </main>
    )
}

export default CategoryList;