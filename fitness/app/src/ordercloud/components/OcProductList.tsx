import { BuyerProduct } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useMemo } from 'react'
import useOcProductList from '../hooks/useOcProductList'
import { OcProductListOptions } from '../redux/ocProductList'
import OcProductCard from './OcProductCard'

export interface OcListColumns {
  [size:string]: number
}

export interface OcProductListProps {
  columns?: OcListColumns
  options?: OcProductListOptions
  imgSrcMap: (product: BuyerProduct) => string
  hrefMap: (product: BuyerProduct) => string
}

export const DEFAULT_COLUMNS:OcListColumns = {
  xs: 2,
  sm: 3,
  md: 4,
}

const OcProductList: FunctionComponent<OcProductListProps> = ({ options, columns, imgSrcMap, hrefMap }) => {
  const products = useOcProductList(options)

  const columnClasses = useMemo(() => {
    const cols = columns || DEFAULT_COLUMNS;
    let result = '';
    Object.entries(cols).forEach(e => {
      result += `row-cols-${e[0]}-${e[1]} `;
    })
    return result;
  }, [columns])


  return (
    <div className={`row row-cols-2 ${columnClasses}`}>
      {products &&
        products.map((p) => (
          <div className="col d-flex" key={p.ID}>
            <OcProductCard product={p} imgSrcMap={imgSrcMap} hrefMap={hrefMap}/>
          </div>
        ))}
    </div>
  )
}

export default OcProductList
