import { FunctionComponent } from 'react'
import useOcProductDetail from '../hooks/useOcProductDetail'

interface OcProductDetailProps {
  productId: string
}

const OcProductDetail: FunctionComponent<OcProductDetailProps> = ({ productId }) => {
  const { product, specs, variants } = useOcProductDetail(productId)

  return (
    <div>
      <h2>Product</h2>
      <pre>
        <code>{JSON.stringify(product, null, 2)}</code>
      </pre>
      {specs && (
        <>
          <h2>Specs</h2>
          <pre>
            <code>{JSON.stringify(specs, null, 2)}</code>
          </pre>
        </>
      )}
      {variants && (
        <>
          <h2>Variants</h2>
          <pre>
            <code>{JSON.stringify(variants, null, 2)}</code>
          </pre>
        </>
      )}
    </div>
  )
}

export default OcProductDetail
