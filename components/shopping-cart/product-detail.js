import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import { useCart } from "@/hooks/use-cart"
import styles from "@/styles/Shop.module.css"
import Image from "next/image"
import Link from "next/link"
import { detailIcon, cartPlusIcon } from "@/asset/icon"
import AutoCloseModal from "@/components/AutoCloseModalComponent.js"
import FavoriteButton from "@/components/shopping-cart/favorite-button.js"
import animation from "@/styles/animation.module.css"
import { useAuth } from '@/hooks/use-auth.js'
import LoginForm from "@/components/member/login-form";

const ProductDetail = ({ product, error }) => {
  const [products, setProducts] = useState(null)
  const { addItem, favorites, toggleFavorite } = useCart()
  const router = useRouter()
  const { auth } = useAuth()
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState()

  useEffect(() => {
    if (product) {
      const fetchData = async () => {
        try {
          const listResponse = await fetch(`http://localhost:8080/shop/p-list/${product.product_id}`)
          if (!listResponse.ok) {
            throw new Error("網路回應有問題唷，請再確認");
          }
          const listData = await listResponse.json();
          setProducts(listData.result);
        } catch (error) {
          console.error("讀取資料有誤:(", error);
        }
      }
      fetchData();
    }
  }, [product])

  const showModal = (message) => {
    setMessage(message);
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  // LoginForm
  const showLoginModal = () => {
    setIsLoginModal(true);
  };

  const closeLoginModal = () => {
    setIsLoginModal(false);
  };

  // Auto Modal
  const showAutoModal = (message) => {
    setMessage(message);
    setIsAutoModal(true);
  };

  const closeAutoModal = () => {
    setIsAutoModal(false);
  };


  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  const gotoCheckout = () => {
    router.push('/shop/checkout');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleClick = useCallback(async () => {
    if (!products || isLoading) {
      console.log(products);
      return;
    }
    try {
      console.log('Adding item to cart'); // Debugging
      await addItem(products);
      console.log('Navigating to checkout'); // Debugging
      router.push('/shop/checkout');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  }, [products, addItem, router, isLoading]);

  if (error) {
    return (
      <div className="container d-flex justify-content-center vh-100">
        <div className={`row col-10 justify-content-center border h-50 ${styles.bgBlur}`}>
          <h5 className="d-flex align-items-center justify-content-center text-primary">
            {error}
          </h5>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`container text-start ${animation["scale-up-top"]}`}>
        <div
          className={`row m-0 justify-content-center align-items-center align-items-lg-stretch ${styles.pDetailColumn}`}
        >
          <div className="col-11 col-lg-5 border-primary position-relative p-0">
            <div className={`w-100 h-100 d-flex align-items-center justify-content-center ${styles.productBg}`}>
              <div className="row justify-content-center m-0">
                {product?.items.map((v) => (
                  <div className="col-6" key={v.item_id}>
                    <figure className="text-center">
                      <Image
                        src={v.item_image}
                        alt=""
                        width={290}
                        height={290}
                        className={styles["pic"]}
                        style={{ height: "auto" }}
                        fetchpriority="high"
                      />
                    </figure>
                  </div>

                ))}
              </div>
              <Link
                href="#/"
                role="button"
                className={styles.detailBtn}
                data-bs-toggle="modal"
                data-bs-target="#detailModal"
              >
                <Image
                  src={detailIcon}
                  alt=""
                  style={{ width: "auto" }}
                />
              </Link>
            </div>
          </div>
          <div className={`col-11 col-lg-5 p-4 text-primary ${styles.bgBlur}`}>
            <div className="row justify-content-between">
              <div className="col-8">
                <h3 className="fw-normal">{product?.product_name}</h3>
              </div>
              <div className="col-3 align-items-center forSP-flex">
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <FavoriteButton
                    productId={+(product?.product_id)}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    showModal={showModal}
                  />
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center ms-2">
                  <Link
                    href="#/"
                    role="button"
                    className="link d-flex justify-content-center align-items-center"

                    onClick={() => {
                      if (products) {
                        addItem(products)
                      }
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#addToCartModal"
                  >
                    <Image src={cartPlusIcon} alt="" height={20} width={20} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center my-3">
              <span className="text-primary me-3 fs-small">鑽石</span>
              <h3 className="fw-normal">{formatAmount(product?.price)}</h3>
            </div>
            <p className="fs-regular mb-3">{product?.product_desc}</p>
            {product?.items.map(
              (item, index) =>
                item.item_image && (
                  <ul className="list" key={index}>
                    <li>{item.item_name}</li>
                  </ul>
                )
            )}
            <div className="row align-items-center my-4 forPC-flex">
              <div className="col-3 d-flex justify-content-center align-items-center">
                <FavoriteButton
                  productId={+(product?.product_id)}
                  showModal={showModal}
                />
                <p className="ms-2 fs-small text-primary fw-normal">
                  加入
                  <br />
                  最愛
                </p>
              </div>
              <button
                type="button"
                className="col-4 btn btn-secondary"
                onClick={() => addItem(products)}
                data-bs-toggle="modal"
                data-bs-target="#addToCartModal"
              >
                加入購物車
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div>
              </button>
              <button
                role="button"
                className="ms-3 col-4 btn btn-primary"
                disabled={isLoading}
                onClick={() => { auth.login ? handleClick() : showLoginModal() }}
              >
                立即購買
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div>
              </button>
            </div>
            <div className="notice mt-4">
              <p className="mb-2">注意事項：</p>
              <ul className="list">
                <li>
                  產包購買完成後若登入會員帳號進行遊戲則等同產包已被消耗使用，無法接受申請退款。
                </li>
                <li>各種產包會在購買的當下套用於購買的帳號。</li>
                <li>
                  各種道具的說明可以參考遊戲內商店或是道具說明欄的詳細的道具說明。
                </li>
              </ul>
            </div>
          </div>
        </div>
        {isModalVisible && <div className="modal">{message}</div>}
      </div>

      <div className={`forSP-block ${styles.buyNowBtnSP}`}>
        <button
          role="button"
          className={`w-100 col-12 btn btn-primary p-3 ${styles["fixed-btn"]}`}
          disabled={isLoading}
          onClick={() => { auth.login ? handleClick() : showLoginModal() }}
        >
          立即購買
        </button>
      </div>
      {auth.login ? (<AutoCloseModal
        show={isModalVisible}
        onClose={closeModal}
        message={message}
      />
      ) : (
        <LoginForm
          show={isLoginModal}
          onClose={closeLoginModal}
          showAutoModal={showAutoModal}
        />
      )}
      <AutoCloseModal
        show={isAutoModal}
        onClose={closeAutoModal}
        message={message}
      />
    </>
  );
}

export default ProductDetail