import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import styles from "@/styles/Shop.module.css"
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import LoginForm from "@/components/member/login-form";

const PurchaseHistory = function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const { addItem } = useCart();
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5


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

  // 當 auth 變化時，設置 playerAccount
  useEffect(() => {
    if (!auth.login) {
      // console.log('No player account found, waiting for auth state...');
      return;
    }

    // console.log('Fetching orders for player:', auth.login);

    setLoading(true);

    fetch(`http://localhost:8080/shop/my-order/${auth.login}/details`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log('Fetched orders:', data);
        const formattedOrders = data.map(order => ({
          ...order,
          items: order.orderItems.map(item => ({
            id: item.product.id,
            product_name: item.product.product_name,
            product_desc: item.product.product_desc,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity,
          }))
        }));
        setOrders(formattedOrders);
        setLoading(false);
      }).catch(error => {
        // console.error('Error fetching orders:', error);
        setError(error);
        setLoading(false);
      });
  }, [auth]);

  if (!auth.login) {
    return (
      <>
        <div className="p-5 text-center">
          <p className='text-light'>欲查看購買記錄請&nbsp;
            <Link className='link-primary' href="#/"
              onClick={showLoginModal}
            >登入</Link>
          </p>
        </div>

        <LoginForm
          show={isLoginModal}
          onClose={closeLoginModal}
          showAutoModal={showAutoModal}
        />
      </>);
  }

  if (orders.length === 0) {
    return <div className="p-5 text-center">
      <p className='text-light'>尚無購物記錄</p>
    </div>;
  }

  if (loading) {
    // console.log('Loading');
    return <div className="p-5 text-center">
      <p className='text-light'>加載中...</p>
    </div>;
  }

  if (error) {
    // console.log(`Error: ${error.message}`);
    return <div className="p-5 text-center">
      <p className='text-light'>錯誤: {error.message}</p>
    </div>;
  }

  const totalPages = Math.ceil(orders.length / pageSize)
  const displayedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };


  return (
    <>
      {/* pagination */}
      <div className={`py-4 ${styles.recordRow} justify-content-center align-items-center`}>
        <nav aria-label="Page navigation" className='m-2'>
          <ul className="pagination pagination-sm" role="navigation">
            {/* {currentPage > 1 ? ( */}
            <li className={`page-item px-2 ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePreviousPage}>
              <Link className="page-link" href="#/" aria-label="Previous">
                &laquo;<span className="`forPC-revert"> 前 5 筆</span>
              </Link>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li className={`page-item px-1 ${currentPage === i + 1 ? 'active' : ''}`} key={i}><Link href="#/" className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</Link></li>
            ))}
            {/* {currentPage < totalPages ? ( */}
            <li className={`page-item px-1 ${currentPage === totalPages ? 'disabled' : ''}`} onClick={handleNextPage}>
              <Link className="page-link" href="#/" aria-label="Next">
                <span className="forPC-revert">後 {currentPage === totalPages - 1 ? orders.length - (5 * currentPage) : '5'} 筆 </span>&raquo;
              </Link>
            </li>
          </ul>
        </nav>
        <p className='text-primary ms-md-3'>{(currentPage - 1) * pageSize + 1} ~ {Math.min(currentPage * pageSize, orders.length)} 筆 (共 {orders.length} 筆)</p>
      </div>
      {displayedOrders.length > 0 ? (
        <div className="col-12">
          {/* ------- 每筆訂單資料 start -------- */}
          {displayedOrders.map((order, index) => (
            <div className={`p-2 ${styles.recordRow}`} key={index}>
              <div className='row justify-content-center'>
                <div className='col-12 col-lg-3 px-3 p-md-3 d-flex d-lg-block align-items-center'>
                  <div className='me-3'>
                    <div className='purchaseDate'><p className='text-primary'>{order.created_at}</p></div>
                    <div className='purchaseNo'><p className='text-primary fs-small'>訂單編號：{order.id}</p></div>
                  </div>
                  <div className='col col-lg-12 d-flex justify-content-flex-start align-items-center mt-lg-3'>
                    <p className='px-2 py-1 text-center text-bg-secondary'>總計NTD {formatAmount(order.amount)}</p>
                  </div>
                </div>
                <div className='row col-12 col-lg-9' id='flush-collapseOne'>
                  {/* --------- 訂單內品項 --------- */}
                  {order.items.map((item, idx) => (
                    <div className={`col-12 d-flex ${styles.item_image}`} key={idx}>
                      <div className="col-4 col-md-3 col-lg-2 d-flex align-items-start align-items-lg-center">
                        <Link href={`/shop/product/${item.fk_product_id}`} className='w-100'>
                          <Image src={item.image} alt="item" className={`w-100 ${styles["product-gradient"]}`} width="100" height="100" />
                          <div className={`top-0 ${styles.smog}`}></div>
                        </Link>
                      </div>
                      <div className="col-8 col-lg">
                        <div className={`row ${styles.wishListItems}`}>
                          <div className="col-12 col-lg-7">
                            <h4 className='fs-regular mt-3'>
                              <Link href={`/shop/product/${item.fk_product_id}`} className={styles.productLink}>
                                {item.product_name}
                              </Link>
                            </h4>
                            <p className="fw-300 fs-small">{item.product_desc}</p>
                          </div>
                          <div className='col-12 col-lg-3 float-start float-lg-end h-100 d-flex align-items-start align-items-lg-center flex-column mb-3'>
                            <p className='text-primary my-3'>鑽石 {formatAmount(item.price)}</p>
                            <button className='w-100 btn btn-outline' data-bs-toggle="modal"
                              data-bs-target="#addToCartModal"
                              onClick={() => addItem(item)}>再買一次
                              <div className="button__horizontal"></div>
                              <div className="button__vertical"></div></button>
                          </div>
                          <div className='col forPC-block'>
                            <div className='fs-small'>購入數量： {item.quantity}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))} {/* --------- 訂單內每個品項 ----- */}
                </div>

              </div>
            </div>
          ))} {/* ------- 每筆訂單資料 end -------- */}
        </div>
      ) : (
        <div className="p-5 text-center">
          <p className='text-light'>尚無購物記錄</p>
        </div>
      )}

      {/* Add To List Modal */}
      <AutoCloseModal
        show={isAutoModal}
        onClose={closeAutoModal}
        message={message}
      />
    </>
  );
};

export default PurchaseHistory;
