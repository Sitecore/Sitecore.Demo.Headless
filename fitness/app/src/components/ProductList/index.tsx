import { FunctionComponent } from 'react'
import { useOcSelector } from '../../ordercloud/redux/ocStore'
import OcProductList from '../../ordercloud/components/OcProductList'

interface ProductListProps {
  productId: string
}

const ProductList: FunctionComponent<ProductListProps> = ({ productId }) => {

  return (
    <div></div>
    // <OcProductList />
  )
}

export default ProductList
