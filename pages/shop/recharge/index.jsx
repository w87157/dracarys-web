// 導入時就自動轉為JS資料格式.svg
import { useEffect, useState } from 'react';
import ShopLayout from '@/components/layout/shop-layout'
import styles from '@/styles/Shop.module.css';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';
import LoginForm from "@/components/member/login-form";
import AutoCloseModal from "@/components/AutoCloseModalComponent";

const Recharge = () => {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const router = useRouter();
  const { auth } = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = '鑽石儲值 | Dragonfire & Sorcery';
  }, []);

  const handleCheckboxChange = (id, price, value) => {
    setSelectedProducts(prevSelected => {
      const isSelected = prevSelected.some(product => product.id === id);
      if (isSelected) {
        return prevSelected.filter(product => product.id !== id);
      } else {
        return [...prevSelected, { id: id, price: price, value: value }];
      }
    });
  };

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const totalValue = selectedProducts.reduce((sum, product) => sum + product.value, 0);

  const handleCreateOrder = async () => {
    // setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/shop/my-d-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fk_player_account: auth.login,
          amount: totalAmount,
          status: 'pending',
          products: selectedProducts
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        const { orderId } = responseData;
        const fk_player_account = auth.login;
        // 生成符合綠界要求的 MerchantTradeNo
        const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Taipei', // 更新為正確的時區
        }).replace(/\//g, '/').replace(/,/g, '');
        // const ReturnURL = 'https://a89d-1-160-29-159.ngrok-free.app/ecpay/callback'

        window.location.href = `http://localhost:8080/ecpay/d_recharge?fk_player_account=${fk_player_account}&orderId=${orderId}&MerchantTradeDate=${MerchantTradeDate}&TotalAmount=${totalAmount}&ItemName=${encodeURIComponent(selectedProducts.map(p => p.name).join('#'))}`;
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/shop/d-list')
      if (!response.ok) {
        throw new Error('網路回應有問題唷。請再確認')
      }
      const data = await response.json()
      // console.log('fetch data:', data.result);

      setProducts(data.result)
    } catch (error) {
      console.log('讀取資料有誤', error);
    }
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

  useEffect(() => {
    fetchData()
  }, [])

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
                <h1 className={styles.h2ShopTitle} data-heading="Recharge">Recharge</h1>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-lg-5">
            <div className="row my-1 my-lg-4 d-flex justify-content-center">
              <div className="col-12 col-md-3 d-flex flex-md-column my-md-auto mb-2 align-items-center align-items-md-start">
                <p className='text-large text-primary m-0 fs-large'>Account</p>
                <p className='m-0 text-primary'>帳號</p>
              </div>
              <div className="col-12 col-md-7 text-primary">
                <input type='text' value={auth.login ? auth.login : '未登入玩家'} className={`w-100 ${styles.disabled}`} disabled />
              </div>
            </div>
          </div>
          <div className="col-11 col-lg-5">
            <div className="row my-4 d-flex justify-content-center">
              <div className="col-12 col-md-3 d-flex flex-md-column my-md-auto mb-2 align-items-center align-items-md-start">
                <p className='text-large text-primary m-0 fs-large'>Diamond</p>
                <p className='m-0 text-primary'>持有鑽石</p>
              </div>
              <div className="col-12 col-md-7 text-primary">
                <input type='text' value={formatAmount(auth.diamond)} className={`w-100 ${styles.disabled}`} disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <form className="col-10 p-0 border-bottom">
            <div className={`${styles.bgBlur} border-top border-bottom d-flex flex-column flex-lg-row flex-wrap py-2 px-1 px-md-3`}>
              {products.map((product) => (
                <div className="form-check col-12 col-lg-6 d-flex align-items-center my-2" key={product.id}>
                  <input className="form-check-input align-middle text-dark" type="checkbox" onChange={() => handleCheckboxChange(product.id, product.price, product.value)} value="" id={`flexCheckDefault${product.id}`} />

                  <label className="col form-check-label d-flex ms-3" htmlFor={`flexCheckDefault${product.id}`}>
                    <div className="col-2 d-flex align-items-center">
                      <Image
                        width={80}
                        height={80}
                        src="/shop/black-dimond.jpg"
                        alt=""
                        className={`w-100 ${styles["product-gradient"]}`}
                        style={{ height: "auto" }}
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-center ms-3 text-primary">
                      <h5 className='fs-regular fw-normal text-light '>{product.d_name}
                        {/* <br className='forSP-block' /><span className='ms-md-3 fs-regular'>{product.d_amount}</span> */}
                      </h5>
                      <p className='m-0 fs-regular text-primary'>NTD {formatAmount(product.price)}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className={`row justify-content-center align-items-center py-3 ps-3 pe-5 flex-column flex-md-row ${styles.bgBlur}`}>
              <div className={`col-12 col-md-5 d-flex justify-content-start ${styles["fs-x-large"]}`}>
                <div className="col-6 text-center text-primary fw-bold">
                  Total
                </div>
                <div className="col-6 text-center text-primary fw-bold">
                  NTD {formatAmount(totalAmount)}
                </div>
              </div>
              <div className="col-7 justify-content-end flex-wrap forPC-flex">
                {auth.login ? (
                  <button type="button" className="col-4 my-3 btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={selectedProducts.length === 0 ? "#warningModal" : "#rechargeConfirmModal"}>
                    確定
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                ) : (
                  <button type="button" className="col-4 my-3 btn btn-primary"
                    onClick={showLoginModal}
                  >
                    確定
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className={`forSP-block ${styles.buyNowBtnSP}`}>
        {auth.login ? (
          selectedProducts.length === 0 ? (
            <button role="button" className={`w-100 col-12 btn btn-primary p-3 ${styles["fixed-btn"]}`}
              data-bs-toggle="modal"
              data-bs-target="#warningModal"
              >
              確定
            </button>
          ) : (
            <button role="button" className={`w-100 col-12 btn btn-primary p-3 ${styles["fixed-btn"]}`}
              data-bs-toggle="modal"
              data-bs-target="#rechargeConfirmModal">
              確定
            </button>
          )
        ) : (
          <button role="button" className={`w-100 col-12 btn btn-primary p-3 ${styles["fixed-btn"]}`}
            onClick={showLoginModal}
          >
            確定
          </button>
        )}
      </div>

      {/* Recharge Confirm Modal */}
      <div
        className="modal fade"
        id="rechargeConfirmModal"
        tabIndex={-1}
        aria-labelledby="rechargeConfirmModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-3 border-primary rounded-0">
            <div className="modal-header text-bg-primary border-0 rounded-0">
              <h1 className="modal-title fs-5 text-dark" id="rechargeConfirmModalLabel">
                請確認儲值內容
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body text-bg-dark text-primary">
              <div className="row">
                <div className="col-12">
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary'>Account</p>
                      <p className='m-0 text-primary'>帳號</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <input type='text' value={auth.login} className={`w-100 ${styles.disabled}`} disabled />
                    </div>
                  </div>
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary'>Item</p>
                      <p className='m-0 text-primary'>購買商品</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <div className={`w-100 ${styles.textareaDisabled}`}>
                        {products
                          .filter(product => selectedProducts.some(selectedProduct => selectedProduct.id === product.id))
                          .map(product => (
                            <p className='mb-0' key={product.id}>{product.d_name}</p>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary'>Total</p>
                      <p className='m-0 text-primary'>金額</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <input type='text' value={`NTD ${formatAmount(totalAmount.toFixed(2))}`} className={`w-100 ${styles.disabled}`} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
              <button type="button" className="btn btn-secondary col-4"
                // data-bs-target="#rechargeSuccessModal"
                // data-bs-toggle="modal"
                onClick={handleCreateOrder}>去付款
                <div className="button__horizontal"></div>
                <div className="button__vertical"></div></button>
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Success Modal */}
      <div
        className="modal fade"
        id="rechargeSuccessModal"
        tabIndex={-1}
        aria-labelledby="rechargeSuccessModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-3 border-primary rounded-0">
            <div className="modal-header text-bg-primary border-0 rounded-0">
              <h1 className="modal-title fs-5 text-dark" id="rechargeSuccessModalLabel">
                鑽石儲值成功
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body text-bg-dark text-primary">
              <div className="row">
                <div className="col-12">
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary'>Account</p>
                      <p className='m-0 text-primary'>帳號</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <input type='text' value={auth.login} className={`w-100 ${styles.disabled}`} disabled />
                    </div>
                  </div>
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary '>Total</p>
                      <p className='m-0 text-primary'>金額</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <input type='text' value={`NTD ${totalAmount.toFixed(2)}`} className={`w-100 ${styles.disabled}`} disabled />
                    </div>
                  </div>
                  <div className="row m-4">
                    <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2 my-md-auto">
                      <p className='fs-large m-0 text-primary'>Diamond</p>
                      <p className='m-0 text-primary'>現有鑽石</p>
                    </div>
                    <div className="col m-auto text-primary">
                      <input type='text' value={auth.diamond} className={`w-100 ${styles.disabled}`} disabled />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
              <button role="button" className="btn btn-secondary col-5"
                onClick={() => {
                  router.push('/shop/shopping-cart')
                }}
                data-bs-dismiss="modal">返回購物車頁面</button>
              <Link className="text-center text-primary text link link-opacity-75-hover"
                onClick={() => {
                  router.push('/shop')
                }}
                href="" data-bs-dismiss="modal">繼續購物</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <div
        className="modal fade"
        id="warningModal"
        tabIndex={-1}
        aria-labelledby="warningModalLabel"
        aria-hidden="true"
      >
        <div className="col-4 modal-dialog modal-dialog-centered modal-sm">
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

Recharge.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>
}
export default Recharge