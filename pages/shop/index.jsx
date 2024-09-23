import ShopLayout from "@/components/layout/shop-layout";
import { useEffect, useState } from 'react';
import styles from "@/styles/Shop.module.css";
import AutoCloseModal from '@/components/AutoCloseModalComponent';
import SearchComponent from "@/components/search-component"
import Link from 'next/link'
import FavoriteButton from '@/components/shopping-cart/favorite-button.js';
import LoadingAnimeDragon from "@/components/loading-anime";
import animation from "@/styles/animation.module.css"
import Image from "next/image"
import { useCart } from '@/hooks/use-cart';

const ShopIndex = () => {
  const [products, setProducts] = useState([]);
  const { favorites, toggleFavorite } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [originalProducts, setOriginalProducts] = useState([]);

  useEffect(() => {
    document.title = '商城 | Dragonfire & Sorcery'
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/shop/p-list');
      if (!response.ok) {
        throw new Error('網路回應有問題唷，請再確認');
      }
      const data = await response.json();
      // console.log('Fetched data:', data);

      if (!Array.isArray(data.result)) {
        throw new Error('讀取的資料非陣列喔喔喔!');
      }

      const initState = data.result.map((v) => ({
        ...v,
        fav: favorites.includes(v.id),
      }));
      setProducts(initState);
      setOriginalProducts(initState);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000)
    } catch (error) {
      console.error('讀取資料有誤:(', error);
    }
  };

  const handleSearch = (searchData) => {
    if (searchData.reset) {
      // 恢復商品列表並清空搜尋值
      setProducts(originalProducts);
      return;
    }

    if (searchData.type === 'name') {
      if (searchData.value === '') {
        // 當搜尋欄位為空時，回到原本的產品列表
        setProducts(originalProducts);
      } else {
        const result = products.filter((product) =>
          product.product_name.includes(searchData.value) || product.product_desc.includes(searchData.value)
        );
        setProducts(result);
      }
    } else if (searchData.type === 'price') {
      let { min, max } = searchData.value;

      const allPrices = originalProducts.map(product => product.price);
      const maxPrice = Math.max(...allPrices);
      const minPrice = Math.min(...allPrices);

      min = min === '' ? minPrice : parseFloat(min);
      max = max === '' ? maxPrice : parseFloat(max);

      const result = originalProducts.filter(
        (product) => product.price >= min && product.price <= max
      );
      setProducts(result);
    }
  };

  // Auto Close Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('')

  const showModal = (message) => {
    setMessage(message)
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // if (isLoading) {
  //   return (
  //     <div>
  //       <LoadingAnimeDragon />
  //     </div>
  //   )
  // }

  const formatAmount = amount => {
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-center align-items-center">
              <div className="col-11 col-md-6">
                <h1 className={styles.h2ShopTitle} data-heading="Shop">Shop</h1>
              </div>
              <div className="col-3 pe-0 d-none d-lg-block">
                <SearchComponent onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="col-12">
        </div>
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="row justify-content-center">

              {products.map((v) => (
                <div className={`col-5 col-md-3 mx-1 mb-3 mb-md-4 border border-primary p-0 position-relative ${animation["scale-up-center"]}`} key={v.id}>
                  <Link href={`/shop/product/${v.id}`} className={`${styles.productCard}`}>
                    <div className={`card ${styles.bgBlur}`}>
                      <div className="position-relative">
                        <h5 className={`px-5 px-md-5 card-header text-center`}>
                          {v.product_name}
                        </h5>
                        <div className="position-absolute top-0 end-0 pe-2 pe-md-2 h-100 d-flex align-items-center">
                          <FavoriteButton productId={v.id} isFavorited={v.fav} toggleFavorite={toggleFavorite} showModal={showModal} />
                        </div>
                      </div>
                      <div className={`card-body bg-light ${styles.bgShadow}`}>
                        <Image
                          src={v.image}
                          className={`card-img-top`}
                          alt="product pic"
                          width={290} height={290}
                          style={styles.img}
                        />
                        <div className={`${styles.box} ${styles.effect} w-100`}>
                          <label className="">$ {formatAmount(v.price)}</label>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>)
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Add To List Modal */}
      <AutoCloseModal show={isModalVisible} onClose={closeModal} message={message} />
    </>
  );
}

ShopIndex.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export default ShopIndex