import React, { useState, useEffect, useRef } from "react";
import styles from "./Forum-Index.module.css";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
// import Lottie from "lottie-react";
// import animationData1 from '@/components/top-page/ForumAnimation-1.json';
// import animationData2 from '@/components/top-page/ForumAnimation-2.json'
import "aos/dist/aos.css"; // Animate On Scroll
import AOS from "aos"; // Animate On Scroll

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const animationData1 = require('@/components/top-page/ForumAnimation-1.json')
const animationData2 = require('@/components/top-page/ForumAnimation-2.json')

export default function ForumIndex() {


  return (
    <>
      <section className={`container-fluid flex-column ${styles.forum}`}>

        <div className={styles.lottieLeft} data-aos="fade-right">
          <Lottie animationData={animationData1} loop={false} />
        </div>
        <div className={styles.lottieRight} data-aos="fade-left">
          <Lottie animationData={animationData2} loop={false} />
        </div>

        <h2
          className={`mt-3 ${styles.cardHeading}`}
          style={{ color: "#bbaf74" }}
        >
          Forum
        </h2>

        <div>
          <div className={`container ${styles.forumContainer}`}>
            <div className={`row d-flex ${styles.forumRow}`}>

              {/* 1st card */}
              <div className={`col-12 col-md-4 ${styles.forumCard}`}>

                <h4 className={styles.cardHeading} style={{ color: "#bbaf74" }}>
                  Official / News
                </h4>

                <div className={`col-12 col-md-4" ${styles.cardContent}`}>
                  <div className={styles.card}>
                    <figure>
                      <Image
                        className={styles.cardImg}
                        src="/forum/person-6.jpg"
                        alt="Latest Event"
                        width={400}
                        height={400}
                        styles={{ width: 'auto', height: '100%' }}
                      />
                    </figure>

                    <div className={styles.cardBack}>
                      <Link className={styles.cardLink} href="/forum/news">
                        <h4 style={{ color: "#ffffff" }}>Headline News</h4>Read
                        More
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              {/* 2nd card */}
              <div className={`col-12 col-md-4 ${styles.forumCard}`}>

                <h4 className={styles.cardHeading} style={{ color: "#bbaf74" }}>
                  Forum Area
                </h4>

                <div className={`col-12 col-md-4" ${styles.cardContent}`}>
                  <div className={styles.card}>
                    <figure>
                      <Image
                        className={styles.cardImg}
                        src="/forum/dragon-8.jpg"
                        alt="Popular 1"
                        width={400}
                        height={400}
                        styles={{ width: 'auto', height: '100%' }}
                      />
                    </figure>

                    <div className={styles.cardBack}>
                      <Link className={styles.cardLink} href="/forum/forumarea">
                        <h4 style={{ color: "#ffffff" }}>Popular</h4>Read More
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              {/* 3rd card */}
              <div className={`col-12 col-md-4 ${styles.forumCard}`}>

                <h4 className={styles.cardHeading} style={{ color: "#bbaf74" }}>
                  FeaturedVideo
                </h4>

                <div className={`col-12 col-md-4" ${styles.cardContent}`}>
                  <div className={styles.card}>
                    <figure>
                      <Image
                        className={styles.cardImg}
                        src="/forum/dragon-6.jpg"
                        alt="Livestream"
                        width={400}
                        height={400}
                        styles={{ width: 'auto', height: '100%' }}
                      />
                    </figure>

                    <div className={styles.cardBack}>
                      <Link
                        className={styles.cardLink}
                        href="/forum/livestream"
                      >
                        <h4 style={{ color: "#ffffff" }}>Enter</h4>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
