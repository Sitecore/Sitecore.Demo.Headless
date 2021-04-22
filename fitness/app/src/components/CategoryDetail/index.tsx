import { FunctionComponent, useMemo } from 'react'
import { NavLink } from "react-router-dom"
import OcProductList from '../../ordercloud/components/OcProductList'
import useOcCategoryDetail from '../../ordercloud/hooks/useOcCategoryDetail'
import { getMasterImageUrl } from '../ProductDetail'


const CategoryDetail: FunctionComponent<{categoryId:string}> = ({categoryId}) => {
  const { category } = useOcCategoryDetail(categoryId)

  const categoryBannerUrl = useMemo(() => {
    if (!category) return '';
    return `${getMasterImageUrl(category)}&t=w800`
  }, [category])


  return (
    <>
      <div className="direction-fixedHeader headerBar">
        <NavLink className="btn-back" to={"/shop"}>
          Lighthouse Fitness
        </NavLink>
        <h1 className="headerBar-title">{`Shop ${category && category.Name}`}</h1>
      </div>
      <main>
        <div className="category-product-list">
          <div className="category-product-list-banner">
            <div>
              <img src={categoryBannerUrl} alt={category.Name} />
            </div>
            <h1>{category && category.Name}</h1>
          </div>
          <OcProductList 
            columns={{xs:2}} 
            options={{categoryID: categoryId}} 
            imgSrcMap={p => `${getMasterImageUrl(p)}&t=w400`} 
            hrefMap={p => `/products/${p.ID}`}
          />
        </div>
      </main>
    </>
  )
}

export default CategoryDetail
