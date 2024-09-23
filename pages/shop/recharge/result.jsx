import React, { useEffect } from 'react'
import ShopLayout from '@/components/layout/shop-layout'
import SeccessAnimationIndex from '@/components/success-animation'
import styles from "@/styles/animation.module.css"
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';

const RechargeResult = () => {
  const router = useRouter();
  const { auth } = useAuth()

  // useEffect(() => {
  //   if (!auth.login) {
  //     router.push('/')
  //   }
  // })

  useEffect(() => {
    document.title = '儲值結果 | Dragonfire & Sorcery'
  }, []);

  return (
    <>
      <div className='container'>
        <div className='row'>
          <SeccessAnimationIndex />
        </div>
        <div className={`row justify-content-center ${styles["slide-in-bottom"]}`}>
          <div className="col-2 d-flex justify-content-center">
            <button type="button" className="btn btn-primary w-100"
              onClick={() => { router.push('/shop/shopping-cart') }}
            >前往購物車
              <div className="button__horizontal"></div>
              <div className="button__vertical"></div>
            </button>
          </div>
          <div className="col-2 d-flex justify-content-center">
            <button type="button" className="btn btn-outline w-100"
              onClick={() => { router.push('/shop/record/#rechargeHistory') }}
            >查看儲值記錄
              <div className="button__horizontal"></div>
              <div className="button__vertical"></div>
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

RechargeResult.getLayout = function (page) {
  return <ShopLayout>{page}</ShopLayout>
}
export default RechargeResult