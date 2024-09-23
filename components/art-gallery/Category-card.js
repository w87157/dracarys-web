import React from 'react'
import Link from 'next/link'
import ImageComponent from '@/components/art-gallery/Image-component.js'
import Image from 'next/image'


const data = [
  {
    category: 'AI生成',
    img: "/art-gallery/ai.jpg",
  },
  {
    category: '2D動漫',
    img: "/art-gallery/2D.jpg",
  },
  {
    category: '遊戲截圖',
    img: "/art-gallery/screenshot.jpg",
  },

]

const CategoryCard = () => {
  return (
    <>
      {
        data.map((v, i) => {
          return (
            <Link href="/art-gallery/artwork" key={v.category} className=" col-12 col-md-3 text-decoration-none" style={{ height: "350px", zIndex: "1" }}>
              <div className="title d-flex flex-column justify-content-evenly px-3 " >
                <h4 className="text-center text-primary pb-0">{v.category}</h4>
              </div>
              <div className="img-wrapper mb-3 " >
                <div className='img' style={{ maxWidth: "100%" }}>
                  <Image
                    src={v.img}
                    alt="category"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <style jsx>{`
              .img-wrapper {
                width: 100%;
                height: 80%;
                border:1px solid #BBAF74;
                transition: all 0.5s;
                position: relative;
                overflow: hidden;
              }

              .img{
                width: 100%;
                height: 100%;
                object-fit: cover ;
                transition: all 0.5s;
                position: relative;
              }

              .img:hover {
                transform: scale(1.1);
              }

              .title {
                  height:15%;

              }
              p{
                text-align: justify;
                line-height: 18px;
              }
   
               `}</style>
            </Link>

          )
        })
      }
    </>
  )
}

export default CategoryCard