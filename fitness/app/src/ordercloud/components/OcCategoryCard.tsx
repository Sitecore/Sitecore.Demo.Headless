import { Category } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'

interface OcProductCardProps {
  category: Category
  hrefMap: (c: Category) => string;
  imgSrcMap: (c: Category) => string
}

const OcCategoryCard: FunctionComponent<OcProductCardProps> = ({ category, imgSrcMap, hrefMap }) => {
  const imageSource = imgSrcMap(category)
  const href = hrefMap(category);
  return (
      <a className="category-card card bg-dark mb-4" href={href}>
        <div className="card-img-top">
          <img src={imageSource} alt="{category.Name}"/>
        </div>
        <div className="card-body">
          <h2 className="card-title text-truncate w-100" title={category.Name}>{category.Name}</h2>
        </div>
      </a>
  )
}

export default OcCategoryCard
