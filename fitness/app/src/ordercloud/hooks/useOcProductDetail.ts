import { BuyerProduct, Spec, Variant } from 'ordercloud-javascript-sdk'
import { useEffect, useMemo } from 'react'
import { setProductId } from '../redux/ocProductDetail'
import { useOcDispatch, useOcSelector } from '../redux/ocStore'

const useOcProductDetail = (
  productId: string
): {
  product?: BuyerProduct
  specs?: Spec[]
  variants?: Variant[]
} => {
  const dispatch = useOcDispatch()

  const { product, specs, variants, isAuthenticated } = useOcSelector((s) => ({
    product: s.ocProductDetail.product,
    specs: s.ocProductDetail.specs,
    variants: s.ocProductDetail.variants,
    isAuthenticated: s.ocAuth.isAuthenticated,
  }))

  useEffect(() => {
    let promise
    if (productId && isAuthenticated) {
      promise = dispatch(setProductId(productId))
    }
    return () => promise && promise.abort()
  }, [dispatch, productId, isAuthenticated])

  const result = useMemo(
    () => ({
      product,
      specs,
      variants,
    }),
    [product, specs, variants]
  )

  return result
}

export default useOcProductDetail
