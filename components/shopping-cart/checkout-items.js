import React from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import styles from '@/styles/Shop.module.css';

const CheckoutItems = function CheckoutItems() {
  const { items, totalPrice } = useCart();

  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      return amount;
    }
    return amount.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  };

  return (
    <>
      <div className="row py-4">
        {items.map((v) => (
          <div className="row" key={v.id}>
            <div className="col-3 position-relative">
              <Image
                src={v.image}
                alt=""
                width={150}
                height={150}
                className={`${styles["product-gradient"]} w-100 h-auto`}
              />
              <div
                className={`position-absolute top-0 end-0 pt-1 me-1 text-center text-bg-danger text-primary fw-bold ${styles.cartBadge}`}
              >
                {v.qty}
              </div>
            </div>
            <div className="col-3 m-auto">
              <p className="fs-large text-primary mb-2">{v.product_name}</p>
              <span>{v.c_name}</span>
            </div>
            <div className="col-3 m-auto">
              <p className="text-primary fs-large">鑽石 {formatAmount(v.price)}</p>
            </div>
            <div className="col-3 m-auto">
              <p className="text-primary fs-large">{formatAmount(v.qty * v.price)}</p>
            </div>
          </div>


        ))}
      </div>
    </>
  )
}

export default CheckoutItems;