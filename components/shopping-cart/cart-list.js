import { useState, useEffect } from "react"
import styles from "@/styles/Shop.module.css"
import { triangleUpIcon, triangleDownIcon } from "@/asset/icon"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import { FaPlus, FaMinus } from "react-icons/fa6"
import Link from "next/link"

const CartList = function CartList ({ animatingItems }) {
  const { items, increaseItem, decreaseItem, removeItem } = useCart();
  const [removingProductId, setRemovingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 數量遞增
  const handleIncrease = (id) => {
    increaseItem(id);
  }

  const handleDecrease = (product) => {
    if (product.qty - 1 < 1) {
      setSelectedProduct(product);
    } else {
      decreaseItem(product.id);
    }
  }

  const handleRemove = () => {
    if (selectedProduct) {
      setRemovingProductId(selectedProduct.id);
      setTimeout(() => {
        removeItem(selectedProduct.id);
        setRemovingProductId(null);
        setSelectedProduct(null);
      }, 500);
    }
  }

  const closeModal = () => {
    setSelectedProduct(null);
  }

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  return (
    <>
      <tbody className="border-top">
        {items.length !== 0 ? (
          items.map((product) => (
            <tr
              key={product.id}

              className={`border-bottom ${styles["product-row"]} ${animatingItems.includes(product.id) || removingProductId === product.id ? styles["product-row-exit"] : ""
                }`}
            >
              <th className="text-center col-3 col-md-2" scope="row">
                <Image
                  src={product.image}
                  alt=""
                  width={150}
                  height={150}
                  className={`${styles["pic"]} ${styles["product-gradient"]}`}
                />
              </th>
              <td className="align-middle col-10 col-md-4">
                <h5 className="text-light fw-normal mb-0">
                  <Link className={`link-light link-opacity-75-hover ${styles.productLink}`} href={`/shop/product/${product.id}`}>{product.product_name}</Link>
                </h5>
                <div className="forSP-flex align-items-center">
                  <p className="text-primary fs-small col-7 justify-content-between">
                    鑽石 {formatAmount(product.price)}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      href="#/"
                      role="button"
                      onClick={() => handleDecrease(product)}
                      className={`text-primary fw-bold ${styles.productCard}`}
                    >
                      <FaMinus />
                    </Link>
                    <input
                      type="number"
                      className={`form-control ${styles.productQuantity}`}
                      id="inputQuantity"
                      value={product.qty}
                      onChange={(e) =>
                        handleQuantityChange(product.id, e.target.value)
                      }
                    ></input>
                    <Link
                      href="#/"
                      role="button"
                      onClick={() => {
                        handleIncrease(product.id);
                      }}
                      className={`text-primary fw-bold ${styles.productCard}`}
                    >
                      <FaPlus />
                    </Link>
                  </div>
                </div>
              </td>
              <td className="text-center align-middle fs-large forPC-revert">
                鑽石 {formatAmount(product.price)}
              </td>
              <td className="text-center align-middle forPC-revert">
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    type="number"
                    className={`form-control fs-large text-light ${styles.productQuantity}`}
                    id="inputQuantity"
                    value={product.qty}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                  ></input>
                  <div
                    className={`d-flex flex-column pointer-events align-items-between justify-content-between forPC-flex ${styles.spinButton}`}
                  >
                    <Link
                      href="#/"
                      role="button"
                      onClick={() => {
                        handleIncrease(product.id);
                      }}
                    >
                      <Image
                        src={triangleUpIcon}
                        alt=""
                        className="text-primary"
                        style={{ width: "auto" }}
                      />
                    </Link>
                    <Link href="#/" role="button" onClick={() => handleDecrease(product)}>
                      <Image
                        src={triangleDownIcon}
                        alt=""
                        className="text-primary"
                        style={{ width: "auto" }}
                      />
                    </Link>
                  </div>
                </div>
              </td>
              <td className="text-center align-middle fs-large forPC-revert">
                鑽石 {formatAmount(product.price * product.qty)}
              </td>
            </tr>
          ))
        ) : (
          <tr className="border-bottom">
            <th colSpan="5" className="p-5 text-center text-light">
              您的購物車內沒有商品，請添加商品後再結帳。
            </th>
          </tr>
        )}
      </tbody>

      {/* Delete Confirm Modal */}
      {selectedProduct && (
        <div
          className="modal fade show"
          id="deleteConfirmModal"
          tabIndex={-1}
          aria-labelledby="deleteConfirmModalLabel"
          aria-hidden="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-3 border-primary rounded-0 p-0">
              <div className="modal-header text-bg-primary border-0 rounded-0">
                <h1
                  className="modal-title fs-5 text-dark"
                  id="deleteConfirmModalLabel"
                >
                  移除商品
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                />
              </div>

              <div className="modal-body text-bg-dark text-primary">
                <div className="row mt-4">
                  <div className="col-10 m-auto fw-bold text-center">
                    確定要從購物車刪除
                    <span className="text-light p-2">
                      {selectedProduct.product_name}
                    </span>
                    嗎?
                  </div>
                </div>
              </div>

              <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-secondary"
                    onClick={closeModal}
                  >
                    移入最愛清單
                  </button>
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-primary"
                    onClick={() => {
                      handleRemove();
                      closeModal();
                    }}
                  >
                    刪除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CartList
