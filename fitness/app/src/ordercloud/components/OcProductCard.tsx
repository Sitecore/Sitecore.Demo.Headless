import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent } from 'react'
import formatPrice from '../utils/formatPrice'

interface OcProductCardProps {
  product: BuyerProduct
  imgSrcMap: (product: BuyerProduct) => string
  hrefMap: (product: BuyerProduct) => string
}

const OcProductCard: FunctionComponent<OcProductCardProps> = ({ product, imgSrcMap, hrefMap }) => {
  const price = formatPrice((product.PriceSchedule && product.PriceSchedule.PriceBreaks[0]) ? product.PriceSchedule.PriceBreaks[0].Price : 99)
  const imageSource = imgSrcMap(product)
  const href = hrefMap(product)
  return (
      <a className="product-card card bg-dark mb-4" href={href}>
        <div className="card-img-top">
          <img src={imageSource} alt="{product.Name}"/>
        </div>
        <div className="product-card-price">{price}</div>
        <div className="card-body">
          <h5 className="card-title text-truncate w-100" title={product.Name}>{product.Name}</h5>
          <p className="card-text" dangerouslySetInnerHTML={{__html: product.Description}} />
        </div>
      </a>
  )
}

export default OcProductCard
