import React from 'react'
import styles from '@/components/layout/default-layout/Footer.module.css'; // 引入模組化 CSS 檔案
import Link from 'next/link';
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md"
import { FiArrowUpLeft } from "react-icons/fi";
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.compat.css"

export default function Footer() {
  return (
    <>
      <ScrollAnimation animateIn='fadeIn'
        animateOut='fadeOut'
        delay={250}
        className="position-relative"
      >

        <footer id={styles.footer} className={`${styles.pulse}`}>
          <div>
            <Link href="#/" className='icon-link icon-link-hover'>TERMS & CONDITIONS
              <svg className="bi" aria-hidden="true">
                <MdOutlineKeyboardDoubleArrowRight />
              </svg>
            </Link>
          </div>
          <div>
            <ul>
              <li>
                <Link href="#/">
                  <span className={styles.linkIcon}><FiArrowUpLeft /></span>
                  <span>X</span>
                </Link>
              </li>
              <li><Link href="#/"><span className={styles.linkIcon}><FiArrowUpLeft /></span><span>FACEBOOK</span></Link></li>
              <li><Link href="#/"><span className={styles.linkIcon}><FiArrowUpLeft /></span><span>INSTAGRAM</span></Link></li>
              <li><Link href="#/"><span className={styles.linkIcon}><FiArrowUpLeft /></span><span>CONTACT US</span></Link></li>
            </ul>
          </div>
          <div>
            <p>COPYRIGHT DRAGONFIRE AND SORCERY 2024</p>
            <p>本網站僅用於成果發表，無任何營利行為</p>
          </div>
        </footer>
      </ScrollAnimation >
    </>
  )
}