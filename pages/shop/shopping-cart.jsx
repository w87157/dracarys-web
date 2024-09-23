// 'use client';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ShopLayout from "@/components/layout/shop-layout"
import styles from "@/styles/Shop.module.css"
import Link from 'next/link'
import CartList from '@/components/shopping-cart/cart-list'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import AutoCloseModal from "@/components/AutoCloseModalComponent.js";
import LoginForm from "@/components/member/login-form";

const ShoppingCart = (selectedProduct) => {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter();
  const { auth } = useAuth()
  const [animatingItems, setAnimatingItems] = useState([])
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleClearCart = () => {
    setAnimatingItems(items.map(item => item.id));

    setTimeout(() => {
      clearCart();
      setAnimatingItems([]);
    }, 500);
  };

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

  useEffect(() => {
    document.title = '購物車 | Dragonfire & Sorcery';
  }, []);

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-center">
              <div className="col-11 col-lg-6">
                <h1 className={styles.h2ShopTitle} data-heading="Your Cart">Your Cart</h1>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <form className="col-10 p-0">
            <table className={`${styles.tableBgBlur} table`}>
              <colgroup>
                <col className="col-2" />
                <col className="col-4" />
                <col className="col-2" />
                <col className="col-1" />
                <col className="col-3" />
              </colgroup>
              <thead className='forPC-revert'>
                <tr className='border-bottom'>
                  <th className="text-center fs-large" scope="col">
                    Product
                  </th>

                  <th className="text-center fs-large" scope="col"></th>
                  <th className="text-center fs-large" scope="col">
                    Price
                  </th>
                  <th className="text-center fs-large" scope="col">
                    Quantity
                  </th>
                  <th className="text-center fs-large" scope="col">
                    Subtoatal
                  </th>
                </tr>
              </thead>
              <CartList animatingItems={animatingItems} />
            </table>

            <div className='row'>
              <div className='col-2 text-center d-flex align-items-center justify-content-center'><Link href='#/' className='link-primary link-opacity-75-hover' onClick={handleClearCart}>清空</Link></div>
              <div className='col'>
                <div className="row justify-content-center justify-content-md-end my-3 fs-large fs-md-x-large">
                  <div className="col-6 col-md-1 text-center text-primary fw-bold">
                    Total
                  </div>
                  <div className="col-6 col-md-4 text-center text-primary fw-bold">
                    <span className='fs-regular fw-normal'>鑽石</span> {formatAmount(totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center justify-content-md-end">
              <div className="col-12 col-md-3 d-flex justify-content-center flex-wrap flex-column align-items-center">
                {items && items.length !== 0 ? (
                  auth.login ? (
                    <button className="col-12 btn btn-primary forPC-block" type='button'
                      onClick={() => { router.push('/shop/checkout') }}
                    >結帳
                      <div className="button__horizontal"></div>
                      <div className="button__vertical"></div>
                    </button>
                  ) : (
                    <button className="col-12 btn btn-primary forPC-block" type='button'
                      onClick={showLoginModal}
                    >
                      結帳
                      <div className="button__horizontal"></div>
                      <div className="button__vertical"></div>
                    </button>
                  )
                ) : (
                  <button className="col-12 btn btn-primary forPC-block" type='button'
                    data-bs-toggle="modal"
                    data-bs-target="#emptyCartModal"
                  >
                    結帳
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                )}

                <Link className="mt-3 text-center text-primary link link-opacity-75-hover" href="/shop">
                  繼續購物
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className={`forSP-block ${styles.buyNowBtnSP}`}>
        {items && items.length === 0 ? (
          <button role="button" className={`col-12 btn btn-primary p-3 w-100 ${styles["fixed-btn"]}`} href='#/'
            data-bs-toggle="modal"
            data-bs-target="#emptyCartModal">
            結帳
          </button>
        ) : (
          <button role="button" className={`col-12 btn btn-primary p-3 w-100 ${styles["fixed-btn"]}`} href='#/'
            onClick={() => { router.push('/shop/checkout') }}>
            結帳
          </button>
        )}
      </div>

      {/* Empty Cart Modal */}
      <div
        className="modal fade"
        id="emptyCartModal"
        tabIndex={-1}
        aria-labelledby="emptyCartModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content border-3 border-primary rounded-0">
            <div className="modal-body text-bg-dark text-primary">
              <p className='text-center m-3'>請選擇至少一個商品！</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add To List Modal */}
      <AutoCloseModal
        show={isAutoModal}
        onClose={closeAutoModal}
        message={message}
      />

      {/* LoginForm Modal */}
      <LoginForm
        show={isLoginModal}
        onClose={closeLoginModal}
        showAutoModal={showAutoModal}
      />
    </>
  )
}


ShoppingCart.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export default ShoppingCart