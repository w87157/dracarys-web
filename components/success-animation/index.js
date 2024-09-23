import React from 'react'
import styles from './style.module.css'

const SeccessAnimationIndex = () => {
  return (
    <>
      <div className={styles["main-container"]}>
        <div className={styles["check-container"]}>
          <div className={styles["check-background"]}>
            <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 25L27.3077 44L58.5 7" stroke="white" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="check-shadow"></div>
        </div>
        <div className={`text-primary ${styles["text-animation"]}`}>儲值成功</div>
      </div>
    </>
  )
}

export default SeccessAnimationIndex
