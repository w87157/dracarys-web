import ShopLayout from '@/components/layout/shop-layout'
import styles from '@/styles/Shop.module.css';
import Image from 'next/image'
import ProductDetail from '@/components/shopping-cart/product-detail'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = router.query; // 使用 useRouter 鉤子獲取路由參數
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (productId) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/shop/p-item/${productId}`);
      if (!response.ok) {
        throw new Error('網路回應有問題唷，請再確認');
      }
      const data = await response.json();

      if (!data.product || !data.items) {
        throw new Error('商品資料或項目資料缺失');
      }

      const productData = {
        product_id: data.product.id,
        product_name: data.product.product_name,
        product_desc: data.product.product_desc,
        category: data.product.category,
        price: data.product.price,
        image: data.product.image,
        onshelf_status: data.product.onshelf_status,
        items: data.items.map(item => ({
          item_id: item.id,
          item_name: item.item_name,
          item_desc: item.item_desc,
          item_image: item.image,
        })),
      };
      setProduct(productData);
      // console.log(product.image);
      setIsLoading(false);
    } catch (error) {
      console.error('讀取資料有誤:(', error);
      setError('您要找的商品已下架');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = '商品 | Dragonfire & Sorcery'
  }, []);


  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, fetchData]);

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-center">
              <div className="col-11 col-lg-6">
                <h1 className={styles.h2ShopTitle} data-heading="PRODUCT DETAIL">Product Detail</h1>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </div>
      </div>

      <ProductDetail product={product} isLoading={isLoading} error={error} />



      {/* Add To Cart Modal */}
      <div
        className="modal fade"
        id="addToCartModal"
        tabIndex={-1}
        aria-labelledby="addToCartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addToCartModalLabel">
                已加入購物車
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-4">
                  <Image
                    src={product?.image}
                    alt=""
                    width={150}
                    height={150}
                    className={styles["pic"]}
                    fetchpriority="high"
                  />
                </div>
                <div className="col-8 m-auto fw-bold">
                  {product?.product_name}
                </div>
              </div>
            </div>

            <div className="modal-footer flex-column">
              <div className="d-flex justify-content-center flex-wrap flex-column">
                <button
                  type="button"
                  className="col-11 col-md-12 my-3 btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    router.push("/shop/shopping-cart");
                  }}
                  href="/shop/shopping-cart"
                >
                  VIEW CART
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div>
                </button>
                <Link
                  className="text-center text-primary text link link-opacity-75-hover"
                  onClick={() => {
                    router.push("/shop");
                  }}
                  href=""
                  data-bs-dismiss="modal"
                >
                  繼續購物
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Detail Modal */}
      <div
        className="modal fade"
        id="detailModal"
        tabIndex={-1}
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        {product && (
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="detailModalLabel">
                  {product.product_name}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              <div className="modal-body text-light">
                {product.items.map((item, index) => (
                  item.item_image && (
                    <div className={`row ${styles.item_image}`} key={index}>
                      <div className="col-4">
                        <Image src={item.item_image} alt="" width={100} height={100} className={styles["pic"]} 
                        fetchpriority="high"/>
                        <div className={styles.smog}></div>
                      </div>
                      <p className="col-8 mb-3 m-md-auto fw-300">{item.item_name}:<br />{item.item_desc}</p>
                    </div>
                  )
                ))}

              </div>
            </div>
          </div>
        )}
      </div>
    </>

  )
}

ProductDetailPage.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>
}

export default ProductDetailPage