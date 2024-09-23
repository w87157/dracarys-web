import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import styles from "@/styles/Shop.module.css"
import animation from "@/styles/Shop.module.css"
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import LoginForm from "@/components/member/login-form";

const RechargeHistory = function RechargeHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5
  const [isAutoModal, setIsAutoModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [message, setMessage] = useState("");

  const totalPages = Math.ceil(orders.length / pageSize)
  // const currentPage = parseInt(page, 10)
  const displayedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handleRechargeOnly = (order) => {
    if (!order || typeof order.amount === 'undefined' || isNaN(Number(order.amount))) {
      console.error('Invalid order or order amount', order);
      return;
    }

    const totalAmount = Math.round(Number(order.amount));
    const orderItems = order.orderItems || [];

    if (!isNaN(totalAmount) && totalAmount > 0) {
      const fk_player_account = auth.login;
      const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Taipei',
      }).replace(/\//g, '/').replace(/,/g, '');
      // const ReturnURL = 'https://a89d-1-160-29-159.ngrok-free.app/ecpay/callback'

      window.location.href = `http://localhost:8080/ecpay/d_recharge?fk_player_account=${fk_player_account}&orderId=${order.id}&MerchantTradeDate=${MerchantTradeDate}&TotalAmount=${totalAmount}`;
    } else {
      console.error('Invalid TotalAmount:', totalAmount);
    }
  };

  // 當 auth 變化時，設置 playerAccount
  useEffect(() => {
    if (!auth.login) {
      return;
    }

    setLoading(true);
    fetch(`http://localhost:8080/shop/my-d-order/${auth.login}/details`, {
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
        const formattedOrders = data.map(order => ({
          ...order,
          items: order.orderItems.map(item => ({
            ...item,
            product_name: item.diamond.d_name,
            price: item.diamond.price,
            image: '/shop/black-dimond.jpg', // or item.diamond.image if available
            quantity: item.quantity,
          }))
        }));
        setOrders(formattedOrders);
        setLoading(false);
      })
      .catch(error => {
        // console.error('Error fetching orders:', error);
        setError(error);
        setLoading(false);
      });
  }, [auth]);

  if (!auth.login) {
    return (
      <><div className="p-5 text-center">
        <p className='text-light'>欲查看儲值記錄請&nbsp;
          <Link className='link-primary' href={"#/"}
            onClick={showLoginModal} >登入</Link>
        </p>
      </div>
        <LoginForm
          show={isLoginModal}
          onClose={closeLoginModal}
          showAutoModal={showAutoModal}
        />
      </>
    )

      ;
  }

  if (orders.length === 0) {
    return <div className="p-5 text-center">
      <p className='text-light'>尚無購物記錄</p>
    </div>;
  }

  if (loading) {
    // console.log('Loading');
    return <div className="p-5 text-center">
      <p className='text-light'>尚無購物記錄</p>
    </div>;
  }

  if (error) {
    // console.log(`Error: ${error.message}`);
    return <div className="p-5 text-center">
      <p className='text-light'>尚無購物記錄</p>
    </div>;
  }

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
          <ul className="pagination pagination-sm">
            {/* {currentPage > 1 ? ( */}
            <li className={`page-item px-2 ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePreviousPage}>
              <Link className="page-link" href="#/" aria-label="Previous">
                &laquo;<span className="forPC-revert"> 前 5 筆</span>
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
        <>
          <div className="col-12">
            {/* ------- 每筆訂單資料 start -------- */}
            {displayedOrders.map((order, index) => (
              <div className={`p-2 ${styles.recordRow}`} key={index}>
                <div className='row justify-content-center'>
                  <div className='col-12 col-md-4 col-lg-3 px-3 p-md-3'>
                    <div className='purchaseDate'><p className='text-primary'>{order.order.created_at}</p></div>
                    <div className='purchaseNo'><p className='text-primary fs-small'>訂單編號：{order.order.id}</p></div>
                    <div className='purchaseNo'>
                      <p className='text-primary fs-small'>狀態：
                        <span className={`px-1 fs-small ${order.order.status === '付款完成' ? 'text-bg-primary' : 'text-bg-secondary'}`}>{order.order.status}</span>
                        <Link className="px-1 fs-small link" href='#/' onClick={(e) => { e.preventDefault(); handleRechargeOnly(order.order); }}>{order.order.status === '尚未付款' ? `(付款去)` : null}</Link>
                      </p>
                    </div>

                  </div>
                  <div className='row col-12 col-md col-lg-9 justify-content-md-start justify-content-md-end mt-3'>
                    {/* --------- 訂單內品項 --------- */}
                    {order.items.map((item, idx) => (
                      <div className="col-12 d-flex" key={idx}>
                        <div className="col-12 col-md">
                          <div className={`ps-0 row ${styles.wishListItems}`}>
                            <div className="ps-0 col-12 col-md-7">
                              <h4 className='fs-regular mb-0 fw-300'>
                                <Link href="/shop/recharge" className={`text-light link ${styles.productLink}`}>
                                  {item.product_name}
                                </Link>
                              </h4>
                            </div>
                            <div className='col-12 col-md-3 float-start float-md-end  h-100 d-flex align-items-flex-end align-items-md-center flex-column'>
                              <p className='text-primary'>NT$ {formatAmount(item.price)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))} {/* --------- 訂單內每個品項 ----- */}
                    <div className='p-0 col-12 col-lg-4 d-flex justify-content-start justify-content-md-center align-items-center mt-2'><p className='col-12 px-2 py-1 text-bg-dark text-center'>總計NTD {formatAmount(order.order.amount)}</p></div>
                  </div>

                </div>
              </div>
            ))} {/* ------- 每筆訂單資料 end -------- */}
          </div>
        </>
      ) : (
        <div className="p-5 text-center">
          <p className='text-light'>尚無購物記錄</p>
        </div>
      )}

      <AutoCloseModal show={isAutoModal} onClose={closeAutoModal} message={message} />


    </>
  );
};

export default RechargeHistory;
