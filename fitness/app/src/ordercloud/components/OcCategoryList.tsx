import { Category } from 'ordercloud-javascript-sdk'
import { FunctionComponent, useMemo } from 'react'
import useOcCategoryList from '../hooks/useOcCategoryList'
import { OcCategoryListOptions } from '../redux/ocCategoryList'
import OcCategoryCard from './OcCategoryCard'

export interface OcListColumns {
  [size:string]: number
}

export interface OcCategoryListProps {
  columns?: OcListColumns
  options?: OcCategoryListOptions
  imgSrcMap: (category: Category) => string
  hrefMap: (category: Category) => string
}

export const DEFAULT_COLUMNS:OcListColumns = {
  xs: 2,
  sm: 3,
  md: 4,
}

const OcCategoryList: FunctionComponent<OcCategoryListProps> = ({ options, columns, imgSrcMap, hrefMap }) => {
  const categories = useOcCategoryList(options)

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
      {categories &&
        categories.map((p) => (
          <div className="col d-flex" key={p.ID}>
            <OcCategoryCard category={p} imgSrcMap={imgSrcMap} hrefMap={hrefMap}/>
          </div>
        ))}
    </div>
  )
}

export default OcCategoryList
