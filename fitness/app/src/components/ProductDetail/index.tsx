import { BuyerProduct } from 'ordercloud-javascript-sdk';
import { ChangeEvent, FormEvent, FunctionComponent, useMemo, useState } from 'react'
import { NavLink, useHistory } from "react-router-dom";
import useOcProductDetail from '../../ordercloud/hooks/useOcProductDetail'
import formatPrice from '../../ordercloud/utils/formatPrice';

interface ProductDetailProps {
  productId: string

}

export const getImageUrlByType = (a:any, type:string) => {
  let image = a.Images.find(i => i.ImageType === type)
  return image ? image.imageUrl : a.Images[0].imageUrl;
}

export const getMasterImageUrl = (p:BuyerProduct) => {
  if(p.xp.MasterAsset && p.xp.MasterAsset.length ){
    return getImageUrlByType(p.xp.MasterAsset[0], 'downloadOriginal')
  }

  if(p.xp.Assets && p.xp.Assets.length ){
    return getImageUrlByType(p.xp.Assets[0], 'downloadOriginal')
  }

  return "https://via.placeholder.com/400"
}

export const getSortedProductAssets = (p:BuyerProduct) => {
  return p.xp.Assets.slice().sort((a, b) => (b.Identifier === p.xp.MasterAsset[0].Identifier ? 1 : -1))
}

const ProductDetail: FunctionComponent<ProductDetailProps> = ({ productId }) => {
  const { product } = useOcProductDetail(productId)
  
  const history = useHistory()

  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  const assets = useMemo(() => {
    if (!product) return [] as any[];
    return getSortedProductAssets(product);
  }, [product])
  console.log(history);

  const imagePreviewUrls = useMemo(() => {
    return assets.map(a => getImageUrlByType(a, 'preview'))
  }, [assets])

  const currentImageUrl = useMemo(() => {
    if (!assets.length) return '';
    return getImageUrlByType(assets[activeAssetIndex], 'downloadOriginal')
  }, [assets, activeAssetIndex])

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }
  
  const handleQuantityChange = (e:ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  }
  
  const calculatedPrice = useMemo(() => {
    if (product) {
      const price = (product.PriceSchedule && product.PriceSchedule.PriceBreaks[0]) ? product.PriceSchedule.PriceBreaks[0].Price : 99;
      return formatPrice(quantity > 1 ? price * quantity : price);
    }
  }, [product, quantity])

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    alert('Add to cart clicked!')
  }

  return (
    <>
      <div className="direction-fixedHeader headerBar">
        <NavLink className="btn-back" to={"/"}>
          Lighthouse Fitness
        </NavLink>
        <h1 className="headerBar-title">{product && product.Name}</h1>
      </div>
      <main>
        {product && (
          <div className="product-detail row">
            <div className="col-xs-12 col-md-6">
              <div className={`product-detail-images ${imageLoaded ? 'loaded' : ''}`}>
                <figure className="product-detail-current-image">
                  <img className="w-100 img-thumbnail" onLoad={handleImageLoaded} src={`${currentImageUrl}&t=w800`} alt="thumbnail"/>
                </figure>
                <div className="row row-cols-5 no-gutters product-detail-image-list">
                  {imagePreviewUrls.map((url, i) => {
                    return <div className="col" key={url} onClick={() => setActiveAssetIndex(i)}><img className={`w-100 img-thumbnail ${i === activeAssetIndex ? 'border-warning bg-warning' : 'bg-dark'}`} src={`${url}&t=gallery`} alt="thumbnail"/></div>
                  })}
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-6">
                <h2 className="text-warning">{product.Name}</h2>
                <p dangerouslySetInnerHTML={{__html: product.xp.LongDescription || product.Description}} />
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input id="quantity" type="number" className="form-control product-quantity-input" placeholder="Quantity" aria-label="Quantity" value={quantity} onChange={handleQuantityChange} aria-describedby="addToCart"/>
                  </div>
                  <button className="btn btn-primary" type="submit" id="addToCart">{`${calculatedPrice} Add to Cart`}</button>
                </form>

            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default ProductDetail
