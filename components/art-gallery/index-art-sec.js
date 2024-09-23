import React from 'react'
import '@/node_modules/bootstrap-icons/font/bootstrap-icons.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function IndexArtSec() {
  const router = useRouter();
  return (
    <div className="container-fluid justify-content-center" >
      <main
        style={{
          overflow: 'hidden',
          margin: "auto",
        }}
        className='container d-flex flex-column flex-md-row align-items-center' >
        {/*主題  */}
        <div
          className='title mt-5 mt-md-1'
        >
          <h2
            className="text-primary text-center"
          >artgallery</h2>
          <Image
            src="/art-gallery/line.png"
            alt=""
            width="300"
            height="10"
            style={{ width: "300px" }}
            className='my-3'
          />
          <h4 className='text-white '>藝術走廊</h4>
        </div>
        {/* 風琴 */}
        <div className="wrapper" >
          {/*  */}
          <div className="container" >
            <input type="radio" name="slide" id="c1" defaultChecked />
            <label htmlFor="c1" className="card d-flex justify-content-center align-items-center ">
              <div className="row mt-5" >
                <div className="col-11 description" >
                  <h5 className="text-h5rimary" style={{ fontWeight: "300" }} onClick={() => router.push('/art-gallery')}>人氣排行</h5>
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c2" />
            <label htmlFor="c2" className="card d-flex justify-content-center align-items-center">
              <div className="row  mt-5" >
                <div className="col-11 description">
                  <h5 className="text-primary" style={{ fontWeight: "300" }} onClick={() => router.push('/art-gallery/vote')}>即時投票</h5>
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c3" />
            <label htmlFor="c3" className="card d-flex justify-content-center align-items-center">
              <div className="row  mt-5" >
                <div className="col-11 description">
                  <h5 className="text-primary" style={{ fontWeight: "300" }} onClick={() => router.push('/art-gallery/register')}>上傳作品</h5>
                </div>
              </div>
            </label>
            <input type="radio" name="slide" id="c4" />
            <label htmlFor="c4" className="card d-flex justify-content-center align-items-center">
              <div className="row  mt-5" >
                <div className="col-11 description">
                  <h5 className="text-primary" style={{ fontWeight: "300" }} onClick={() => router.push('/art-gallery/artwork')}>下載珍藏</h5>
                </div>
              </div>
            </label>
          </div>
          {/*  */}
        </div>
      </main>
      <style jsx>{`
          * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }


    body {
      background-color: black;
      padding-inline: 50px;
    }

    .title {
        position: relative;
        z-index: 5;
        background-color: #160c0c;
        width: 40vw;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-inline: 20px;
    }

    main {
      display: flex;
    }

    .wrapper {
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: start;

    }

    .container {
      width: 100%;
      height: 80%;
      display: flex;
      flex-wrap: nowrap;
    }

    .card {
      width: 100px;
      background-size: cover;
      cursor: pointer;
      overflow: hidden;
      margin-right: -10px;
      transition: .6s cubic-bezier(.28, -0.03, 0, .99);
      box-shadow: 0px 10px 25px rgba(0, 0, 0);
      position: relative;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card>.row {
      color: white;
      display: flex;
      flex-wrap: nowrap;
    }

    .card>.row>.icon {
      background: black;
      color: white;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 15px;
    }

    .card>.row>.description {
      display: flex;
      justify-content: center;
      text-align: center;
      flex-direction: column;

      opacity: 0;
      color: #BBAF74;
      border: 1.6px solid  #BBAF74;
      border-radius: 3px;
      transform: translateX(75px);
      transition-delay: 0.3s;
      transition: all 0.5s linear;
      background: hsla(30, 100%, 0%, .2);
      -webkit-backdrop-filter: blur(10px);    
      backdrop-filter: blur(10px);
      box-shadow: 0px 10px 25px rgba(0, 0, 0,0.8);
      height: 60px;
      width: 200px;
    }

    .description h5 {
      text-shadow: 0 0 10px black;
    }
    .description h4 {
      text-transform: uppercase;
    }

    input {
      display: none;
    }

    input:checked+label {
      width: 500px;
    }

    input:checked+label .description {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    .card[for="c1"] {
      background-image: url("https://img.freepik.com/premium-photo/magical-forest-path-with-glowing-fireflies-night-magical-fantasy-forest-forest-landscape_372999-8754.jpg");
      z-index: 4;
      background-position: center;
    }

    .card[for="c2"] {
      background-image: url("https://img.freepik.com/free-photo/international-day-education-scene-with-fantasy-style_23-2151040336.jpg");
      z-index: 3;
      background-position: center;
    }

    .card[for="c3"] {
      background-image: url("https://img.freepik.com/free-photo/digital-art-magical-fairy_23-2151589521.jpg");
      z-index: 2;
      background-position: center;
    }

    .card[for="c4"] {
      background-image: url("https://img.freepik.com/free-photo/dragons-fantasy-artificial-intelligence-image_23-2150400885.jpg");
      z-index: 1;
      background-position: center;
      background-size: cover;
    }
      `}</style>
    </div>
  )
}