import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ShopLayout from "@/components/layout/shop-layout"
import styles from "@/styles/Shop.module.css"
import Link from 'next/link'
import Image from 'next/image'
import { FaClipboardList, FaHeart, FaTrashCan, FaPenToSquare } from "react-icons/fa6"
import { AiFillTag } from "react-icons/ai"
import { useCart } from '@/hooks/use-cart'
import PurchaseHistory from '@/components/shopping-cart/purchase-history'
import RechargeHistory from '@/components/shopping-cart/recharge-history'
import { useAuth } from '@/hooks/use-auth'
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import LoginForm from "@/components/member/login-form";

const ShoppingRecord = () => {
  const [scrolled, setScrolled] = useState(false)
  const [memo, setMemo] = useState('')
  const [tempMemo, setTempMemo] = useState('')
  const [currentProductId, setCurrentProductId] = useState(null)
  const [products, setProducts] = useState([])
  const [memos, setMemos] = useState({})
  const { addItem, favoritesStorageKey, toggleFavorite, updateFavoritesInLocalStorage } = useCart();
  const router = useRouter()
  const [favorites, setFavorites] = useState([])
  const [localFavorites, setLocalFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false)
  const { auth } = useAuth()
  const { hash } = router
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");

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
    document.title = '商城記錄 | Dragonfire & Sorcery';
  }, []);

  // 未登錄狀態下的最愛清單
  useEffect(() => {
    if (auth.login) return
    const storedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
    setLocalFavorites(storedFavorites);
  }, [auth.login, favoritesStorageKey]);

  useEffect(() => {
    if (auth.login) return
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/shop/p-list');
        const data = await response.json();
        const products = data.result;
        // 根據最愛商品ID過濾商品
        const favoriteProducts = products.filter(product => localFavorites.includes(product.id));
        // console.log(favoriteProducts);

        setFavorites(favoriteProducts);
        // console.log(favorites);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [auth.login, localFavorites]);

  // 會員登錄狀態下的最愛清單
  useEffect(() => {
    if (!auth.login) {
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/shop/combined-favorites/${auth.login}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const favoriteProducts = data.map(item => ({
          id: item.product.id,
          product_name: item.product.product_name,
          product_desc: item.product.product_desc,
          price: item.product.price,
          image: item.product.image,
        }));
        // console.log(data[0].product.id);
        // console.log(favoriteProducts.length);
        setFavorites(favoriteProducts);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [auth.login, auth.token, products]);

  const handleToggleFav = async (productId) => {
    console.log("Toggling favorite for productId:", productId);
    setToggledProductId(productId)

    setTimeout(async () => {
      try {
        await toggleFavorite(productId);
        console.log("Successfully toggled favorite for productId:", productId);

        const updatedFavorites = favorites.filter(fav => fav.id !== productId);
        console.log("Updated favorites list:", updatedFavorites);

        setFavorites(updatedFavorites);
      } catch (error) {
        console.log('Error toggling favorite:', error);
        // } finally {
        //   setToggledProductId(null); // 重置 toggledProductId
      }
    }, 500);
  };

  const [toggledProductId, setToggledProductId] = useState(null);

  const handleMemoChange = (e) => {
    const { value } = e.target;
    if (value.length <= 50) {
      setMemo(value);
    }
  }
  // add memo
  const handleAddMemo = () => {
    if (currentProductId) {
      setMemos((prevMemos) => ({
        ...prevMemos,
        [currentProductId]: memo,
      }));
      setMemo('')
      setIsEditing(true)
    }
    console.log(currentProductId);
  };

  const handleEditMemo = (productId) => {
    setCurrentProductId(productId);
    setTempMemo(memos[productId] || '')
    setIsEditing(true)
  }

  const handleUpdateMemo = () => {
    if (currentProductId) {
      setMemos((prevMemos) => ({
        ...prevMemos,
        [currentProductId]: tempMemo,
      }));
      setCurrentProductId(null)
      setTempMemo('')
    }
  };

  // 清空備忘錄
  const handleClearMemo = (productId) => {
    if (productId) {
      setMemos((prevMemos) => {
        const updatedMemos = { ...prevMemos };
        delete updatedMemos[productId];
        return updatedMemos;
      });
    }
  };

  const addItemToCart = (product) => {
    addItem(product);
    setSelectedProduct(product); // Save the selected product
  };

  // 監聽滾輪
  useEffect(() => {
    const handleScroll = () => {
      // 監聽滾動事件，當用戶手動滾動時重置狀態
      setScrolled(false);
    };

    const hash = window.location.hash;
    if (hash) {
      // 清除所有Tab的active和show class
      document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('show', 'active'));

      // 根據URL片段添加active和show class
      const linkElement = document.querySelector(`.nav-link[data-bs-target="${hash}-pane"]`);
      const paneElement = document.querySelector(`${hash}-pane`);
      if (linkElement && paneElement) {
        linkElement.classList.add('active');
        paneElement.classList.add('show', 'active');

        // 使用requestAnimationFrame代替setTimeout
        requestAnimationFrame(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement && !scrolled) {
            const yOffset = -200; // 偏移量
            const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({ top: y, behavior: 'smooth' }); // 使用平滑滾動
            setScrolled(true);
          }
        });
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, hash]);

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="row justify-content-center">
              <div className="col-11 col-lg-6">
                <h1 className={styles.h2ShopTitle} data-heading="My Record">My Record</h1>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-10">
            <ul className="nav nav-tabs shop" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={`${styles.anchor} nav-link `} id="wishList" data-bs-toggle="tab" data-bs-target="#wishList-pane" type="button" role="tab" aria-controls="wishList-pane" aria-selected="false"><FaHeart className="mb-1 me-2" /><br className='forSP-block' />我的收藏</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`${styles.anchor} nav-link active`} id="purchaseHistory" data-bs-toggle="tab" data-bs-target="#purchaseHistory-pane" type="button" role="tab" aria-controls="purchaseHistory-pane" aria-selected="true"><FaClipboardList className='mb-1 me-2' /><br className='forSP-block' />購買記錄</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`${styles.anchor} nav-link`} id="rechargeHistory" data-bs-toggle="tab" data-bs-target="#rechargeHistory-pane" type="button" role="tab" aria-controls="rechargeHistory-pane" aria-selected="false"><AiFillTag className="me-2" /><br className='forSP-block' />儲值記錄</button>
              </li>
            </ul>

            <div className={`tab-content text-primary border-bottom ${styles.bgBlur}`} id="myTabContent">
              {/* 我的最愛 */}
              <div className="tab-pane fade " id="wishList-pane" role="tabpanel" aria-labelledby="wishList" tabIndex="0">
                {!auth.login ? (
                  <div className="p-5 text-center">
                    <p className='text-light'>欲查看收藏清單請&nbsp;<Link className='link-primary' href={"#/"}
                      onClick={showLoginModal}
                    >登入</Link></p>
                  </div>
                ) : (
                  favorites.length === 0 ? (
                    <div className="p-5 text-center">
                      <p className='text-light'>尚無收藏</p>
                    </div>
                  ) : (
                    favorites.map((product) => {
                      return (
                        product && (
                          <div key={product.id} className={`p-2 ${styles.recordRow}`}>
                            <div className={`d-flex ${toggledProductId === product.id ? styles["product-row-exit"] : null
                              } ${styles.item_image}`}>
                              <div className="d-flex align-items-start col-4 col-md-2 pt-md-3">
                                <Link href={`/shop/product/${product.id} w-100`}>
                                  <Image src={product.image} alt="item" className="w-100" width="100" height="100" />
                                  <div className={styles.smog}></div>
                                </Link>
                              </div>
                              <div className="col-7 col-md-9">
                                <div className={`row ${styles.wishListItems}`}>
                                  <div className="col-12 col-lg-9">
                                    <h4 className='fs-regular mt-3'><Link href={`/shop/product/${product.id}`} className={styles.productLink}>{product.product_name}</Link></h4>
                                    <p className="fw-300 fs-small">{product.product_desc}</p>
                                  </div>
                                  <div className='col-12 col-lg-2 float-start float-md-end h-100 d-flex align-items-start align-items-md-center flex-column mb-3'>
                                    <p className='text-primary my-3'>鑽石 {product.price}</p>
                                    <button className='w-100 btn btn-outline' onClick={() => addItemToCart(product)} data-bs-toggle="modal"
                                      data-bs-target="#addToCartModal">購買
                                      <div className="button__horizontal"></div>
                                      <div className="button__vertical"></div></button>
                                  </div>
                                  <div className='col-9 forPC-block'>
                                    {memos[product.id] ? (
                                      <div className={styles.myMemo}>
                                        <div className='col-10'>{memos[product.id]}</div>
                                        <button type='button' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(product.id)}>編輯註解</button>
                                      </div>
                                    ) : (
                                      <button type="button" className={styles.addMemo} data-bs-toggle="modal" data-bs-target="#addMemoModal" onClick={() => setCurrentProductId(product.id)}>新增備忘錄</button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-1">
                                <div className="row">
                                  <div className='col-12 my-3'>
                                    <button type="button" className='bg-transparent border-0 text-primary' onClick={() => handleToggleFav(product.id)}>
                                      <FaTrashCan />
                                    </button>
                                    {memos[product.id] ? (
                                      <button type="button" className='bg-transparent border-0 text-primary forSP-block' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(product.id)}><FaPenToSquare /></button>
                                    ) : (
                                      <button type="button" className='bg-transparent border-0 text-primary forSP-block' data-bs-toggle="modal" data-bs-target="#addMemoModal" onClick={() => setCurrentProductId(product.id)}><FaPenToSquare /></button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-12 forSP-block'>
                              {memos[product.id] ? (
                                <div className={styles.myMemo}>
                                  <div className='col-10'>{memos[product.id]}</div>
                                  <button type='button' data-bs-toggle="modal" data-bs-target="#editMemoModal" onClick={() => handleEditMemo(product.id)}>編輯</button>
                                </div>
                              ) : (
                                null
                              )}
                            </div>
                          </div>
                        ))
                    }
                    )
                  )
                )
                }
              </div>



              {/* 購買記錄 */}
              <div className="tab-pane fade show active" id="purchaseHistory-pane" role="tabpanel" aria-labelledby="purchaseHistory" tabIndex="0">
                <PurchaseHistory />
              </div>

              {/* 儲值記錄 */}
              <div className="tab-pane fade" id="rechargeHistory-pane" role="tabpanel" aria-labelledby="rechargeHistory" tabIndex="0">
                <RechargeHistory />
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* addMemo Modal */}
      <div
        className="modal fade"
        id="addMemoModal"
        tabIndex={-1}
        aria-labelledby="addMemoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addMemoModalLabel">
                新增備忘錄
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setMemo('')}
              />
            </div>

            <div className={`modal-body pt-4 ${styles.recordModal}`}>
              {currentProductId && (
                <div className="row">
                  <div className="col-4">
                    {console.log(favorites.find(p => p.id === currentProductId))}
                    <Image src={favorites.find(p => p.id === currentProductId)?.image} alt="item" width={100} height={100} className={`${styles["pic"]} ${styles["product-gradient"]}`} /></div>
                  <div className="col-8 d-flex flex-column justify-content-center">
                    <h4 className='fs-regular'>{currentProductId && favorites.find(p => p.id === currentProductId)?.product_name}</h4>
                    <p className="fw-300 fs-small">{currentProductId && favorites.find(p => p.id === currentProductId)?.product_desc}</p>
                    <p className='text-primary my-2'>鑽石 {currentProductId && favorites.find(p => p.id === currentProductId)?.price}</p>
                  </div>
                </div>
              )}
              <div className="row px-4 position-relative justify-content-center">
                <textarea name="memo" id="memo" cols="" rows="6" className='fw-300 fs-regular p-2 text-bg-secondary border' value={memo} onChange={handleMemoChange} />
                <span>{memo.length}/50</span>
                <label htmlFor="memo" hidden>留言內容</label>
              </div>
            </div>

            <div className="modal-footer flex-column">
              <div className="d-flex justify-content-center flex-wrap">
                <button type="button" className="col-12 mb-3 btn btn-outline" data-bs-dismiss="modal" onClick={() => handleAddMemo(currentProductId)}>新增<div className="button__horizontal"></div><div className="button__vertical"></div></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* editMemo Modal */}
      <div
        className="modal fade"
        id="editMemoModal"
        tabIndex={-1}
        aria-labelledby="editMemoModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editMemoModalLabel">
                編輯備忘錄
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className={`modal-body pt-4 ${styles.recordModal}`}>
              {currentProductId && (
                <div className="row">
                  <div className="col-4">
                    <Image src={currentProductId && favorites.find(p => p.id === currentProductId)?.image} alt="item" width={100} height={100} className={`${styles["pic"]} ${styles["product-gradient"]}`} /></div>
                  <div className="col-8 d-flex flex-column justify-content-center">
                    <h4 className='fs-regular'>{currentProductId && favorites.find(p => p.id === currentProductId)?.product_name}</h4>
                    <p className="fw-300 fs-small">{currentProductId && favorites.find(p => p.id === currentProductId)?.product_desc}</p>
                    <p className='text-primary my-2'>鑽石 {currentProductId && favorites.find(p => p.id === currentProductId)?.price}</p>
                  </div>
                </div>
              )}
              <div className="row px-4 position-relative justify-content-center">
                <textarea name="memo" id="memo" cols="" rows="4" className='fw-300 fs-regular p-2 text-bg-secondary border' value={tempMemo} onChange={handleMemoChange} />
                <span>{tempMemo.length}/50</span>
                <label htmlFor="memo" hidden>留言內容</label>
              </div>
            </div>

            <div className="modal-footer flex-column">
              <div className="d-flex justify-content-center flex-wrap">
                <button type="button" className="col-12 mb-3 btn btn-outline" data-bs-dismiss="modal" onClick={handleUpdateMemo}>修改<div className="button__horizontal"></div><div className="button__vertical"></div></button>
                <Link role="button" href="#/" className="col-12 mb-3 text-primary text-center fs-small" data-bs-dismiss="modal" onClick={() => handleClearMemo(currentProductId)}>刪除備忘錄</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

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

            <div className="modal-body pb-0">
              {selectedProduct && (
                <div className="row">
                  <div className="col-4">
                    <Image src={selectedProduct.image} alt="" width={150} height={150} className={styles["pic"]} />
                  </div>
                  <div className="col-8 m-auto fw-bold">{selectedProduct.product_name}</div>
                </div>
              )
              }
            </div>

            <div className="modal-footer flex-column">
              <div className="d-flex justify-content-center flex-wrap flex-column">
                <button type="button" className="col-12 my-3 btn btn-secondary" data-bs-dismiss="modal"
                  onClick={() => {
                    router.push('/shop/shopping-cart')
                  }}
                  href='/shop/shopping-cart'>查看購物車
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div>
                </button>
                <Link className="text-center text-primary text link link-opacity-75-hover"
                  onClick={() => {
                    router.push('/shop')
                  }}
                  href="" data-bs-dismiss="modal">繼續購物</Link>
              </div>
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

ShoppingRecord.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>;
};

export default ShoppingRecord