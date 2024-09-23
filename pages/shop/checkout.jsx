// 導入時就自動轉為JS資料格式.svg
import { useEffect, useState } from 'react'
import ShopLayout from '@/components/layout/shop-layout'
import styles from '@/styles/Shop.module.css';
import Image from 'next/image'
import CustomSelect from '@/components/SelectComponent';
import Link from 'next/link'
import CheckoutItems from '@/components/shopping-cart/checkout-items';
import { useCart } from '@/hooks/use-cart';
import { useAuth, updateDiamonds } from '@/hooks/use-auth';
import { useRouter } from 'next/router';

export const playerData = [
  {
    account: 'yamaha56788',
    character: [
      { value: '1', label: '席格爾騎士' },
      { value: '2', label: '提爾鬥士' },
      { value: '3', label: '歐瑟遊俠' },
      { value: '4', label: '尤爾弓手' },
    ],
    diamond: 2200
  },
];

const ProductDetail = () => {
  const { auth, updateDiamonds } = useAuth()
  const { items, qty, totalPrice, clearCart } = useCart();
  const [selectedOption, setSelectedOption] = useState(playerData[0].character[0]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [products, setProducts] = useState([]);

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  // useEffect(() => {
  //   if (!auth.token || items.length === 0) {
  //     router.push('/')
  //   }
  // })

  const handleCheckOut = async (e) => {
    // e.preventDefault()
    setLoading(true);
    try {
      const orderData = {
        fk_player_account: auth.login,
        amount: totalPrice,
        products: items.map((item) => ({
          id: item.id,
          quantity: item.qty,
        }))
      };

      const response = await fetch('http://localhost:8080/shop/my-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // console.log('Order created successfully:', result);
        const newDiamondCount = auth.diamond - totalPrice;

        const updateResponse = await fetch(`http://localhost:8080/shop/update-diamonds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            login: auth.login,
            diamond: newDiamondCount
          })
        });

        const updateResult = await updateResponse.json();

        if (updateResponse.ok && updateResult.success) {
          // Update the diamond count in the auth state and localStorage
          updateDiamonds(newDiamondCount);
          setLoading(false);
        } else {
          console.error('Error updating diamond count:', updateResult);
        }

        console.log('Diamonds updated successfully');
        // router.push("/shop/record")
      } else {
        console.error('Error creating order:', result);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  useEffect(() => {
    document.title = '結帳 - 內容確認 | Dragonfire & Sorcery'
  }, []);

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  return (
    <>
      <div>
        <div className="container my-5">
          <div className="row">
            <div className="col-12">
              <div className="row justify-content-center">
                <div className="col-11 col-lg-6">
                  <h1 className={styles.h2ShopTitle} data-heading="Confirm order">Confirm order</h1>
                </div>
                <div className="col-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="container text-start">
          <div className="row justify-content-center">
            <div className="col-11 col-md-10">
              <div className={`row  flex-column flex-lg-row justify-content-center ${styles.CheckoutColumn}`}>
                <div className={`col-12 col-lg-7 justify-content-between position-relative p-3 text-primary ${styles.bgBlur}`}>
                  <div className="row py-2 py-md-4 ">
                    <div className="row forPC-flex">
                      <div className="col-3 position-relative">
                        <p className="text-primary fs-large text-center">商品</p>
                      </div>
                      <div className="col-3 m-auto">

                      </div>
                      <div className="col-3 m-auto">
                        <p className="text-primary fs-large text-center">單價</p>
                      </div>
                      <div className="col-3 m-auto">
                        <p className="text-primary fs-large text-center">小計</p>
                      </div>
                    </div>
                    <CheckoutItems />
                  </div>
                  <div className="row border-top p-4 justify-content-between align-items-center">
                    <div className="col-2 text-center fs-x-large">Total</div>
                    <div className="col-6 text-center fs-large">鑽石　{formatAmount(totalPrice)}</div>
                  </div>
                </div>

                {playerData.map((v) => {
                  return (
                    <div key={v.account} className={`col-12 col-lg-5 p-4 ${styles.bgBlur}`}>
                      <div className="row mb-4 my-md-4">
                        <div className="col-12 col-md-4 mb-2 my-md-auto d-flex d-md-block align-items-center justify-content-center">
                          <p className='text-large text-primary m-0 fs-large'>Account</p>
                          <p className='m-0 text-primary'>帳號</p>
                        </div>
                        <div className="col m-auto text-primary">
                          <input type='text' value={auth.login} className={`w-100 ${styles.disabled}`} disabled />
                        </div>
                      </div>
                      <div className="row my-4">
                        <div className="col-12 col-md-4 mb-2 my-md-auto d-flex d-md-block align-items-center">
                          <p className='text-large text-primary m-0 fs-large'>Character</p>
                          <p className='m-0 text-primary'>角色</p>
                        </div>
                        <div className="col m-auto text-primary">
                          <CustomSelect className="form-select" options={v.character} onChange={handleSelectChange} />
                        </div>
                      </div>
                      <div className="row my-4">
                        <div className="col-12 col-md-4  mb-2 mt-md-1 d-flex d-md-block align-items-center">
                          <p className='text-large text-primary m-0 fs-large'>Diamond</p>
                          <p className='m-0 text-primary'>持有鑽石</p>
                        </div>
                        <div className="col m-auto">
                          <input id='diamond' name='diamond' type='text' value={formatAmount(auth.diamond)} className={`w-100 ${styles.disabled}`} disabled /><br />
                          {items.length !== 0 && totalPrice > auth.diamond ? (
                            <ul className='list02'>
                              <li className='text-bg-danger mt-2 py-1 fs-small'>鑽石餘額不足，還差&nbsp;{totalPrice - auth.diamond}&nbsp;顆鑽石，請先儲值</li>
                            </ul>
                            // <p className='text-bg-danger mt-1 fs-small'>※ </p>
                          ) : null
                          }
                        </div>
                      </div>

                      <div className="row justify-content-center align-items-center mt-3">
                        {items.length !== 0 && totalPrice > auth.diamond ? (
                          <Link
                            role="button"
                            className="col-5 btn btn-outline"
                            href='/shop/recharge'
                          >
                            儲值
                            <div className="button__horizontal"></div>
                            <div className="button__vertical"></div>
                          </Link>
                        ) : (
                          <button type="button" className="ms-3 col-5 btn btn-primary forPC-block" data-bs-toggle="modal"
                            data-bs-target="#payNowModal"
                            onClick={handleCheckOut}>
                            確定購買
                            <div className="button__horizontal"></div>
                            <div className="button__vertical"></div>
                          </button>)
                        }
                        <Link className="mt-3 text-center text-primary link link-opacity-75-hover" href="/shop">
                          繼續購物
                        </Link>
                      </div>
                      <div className="notice mt-4">
                        <p className='mb-2'>注意事項：</p>
                        <ul className='list'>
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
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className={`forSP-block ${styles.buyNowBtnSP}`}>
          <button role="button" className={`col-12 btn btn-primary p-3 w-100 ${styles["fixed-btn"]}`} href='#/'
            data-bs-toggle="modal"
            data-bs-target="#payNowModal"
            onClick={handleCheckOut}>
            確定購買
          </button>
        </div>

        {/* Pay Now Modal */}
        <div
          className="modal fade"
          id="payNowModal"
          tabIndex={-1}
          aria-labelledby="payNowModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-3 border-primary rounded-0">
              <div className="modal-header text-bg-primary border-0 rounded-0">
                <h1 className="modal-title fs-5 text-dark" id="payNowModalLabel">
                  虛寶購買完成
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    router.push("/shop/record");
                    clearCart();
                  }
                  }
                />
              </div>

              <div className="modal-body text-bg-dark text-primary">
                <div className="row">
                  <div className="col-12">
                    <p className='text-center p-4 text-light'>購買完成 ! 請至遊戲中確認。</p>
                    <div className="row m-4 align-items-center">
                      <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2">
                        <p className='fs-large m-0 text-primary'>Character</p>
                        <p className='m-0 text-primary'>角色</p>
                      </div>
                      <div className="col m-auto text-primary">
                        <input type='text' value={selectedOption.label} className={`w-100 ${styles.disabled}`} disabled />
                      </div>
                    </div>
                    <div className="row m-4 align-items-center">
                      <div className="col-12 col-md-4 d-flex flex-md-column align-items-center align-items-md-start mb-2">
                        <p className='fs-large m-0 text-primary'>Item</p>
                        <p className='m-0 text-primary'>購買商品</p>
                      </div>
                      <div className="col m-auto text-primary">
                        <div className={`w-100 ${styles.textareaDisabled}`}>
                          {items.map((v, i) => {
                            return <p className='mb-0' key={v.id}>{v.product_name}</p>
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                <button type="button" className="btn btn-secondary col-4" data-bs-dismiss="modal" onClick={() => {
                  router.push("/shop/record");
                  clearCart();
                }}>確定
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ProductDetail.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>
}

export default ProductDetail