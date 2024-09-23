import { useState } from "react";
import styles from "@/styles/Forum.module.css";


export default function ForumCarousel() {
  // const data = []

  return (
    <>
      {/* 置頂輪播 */}
      <div className={`container d-flex mb-5 w-100 ${styles.forumContainer}`}>
        <div
          id="carouselExampleIndicators"
          className={`container col-12 carousel slide`}
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="3"
              aria-label="Slide 4"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="4"
              aria-label="Slide 5"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/forum/world-1.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-flex align-items-center justify-content-center">
                <h2>Forum Area</h2>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/forum/world-2.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-flex align-items-center justify-content-center">
                <h2>Forum Area</h2>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/forum/world-3.jpg"
                className="d-block w-100"
                alt="..."
                loading="lazy"
              />
              <div className="carousel-caption d-flex align-items-center justify-content-center">
                <h2>Forum Area</h2>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/forum/world-6.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-flex align-items-center justify-content-center">
                <h2>Forum Area</h2>
              </div>
            </div>
            <div className="carousel-item">
              <img
                src="/forum/world-8.jpg"
                className="d-block w-100"
                alt="..."
              />
              <div className="carousel-caption d-flex align-items-center justify-content-center">
                <h2>Forum Area</h2>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}
