import React from 'react'

const data = [
  {
    name: "包月方案",
    sub: "適合製作單次專案的創作者",
    limitTitle: "一年內下載量(張)",
    limit: [
      {
        "id": 1,
        "downloads": 2,
        "price": 29
      },
      {
        "id": 2,
        "downloads": 5,
        "price": 49
      },
      {
        "id": 3,
        "downloads": 25,
        "price": 229
      }
    ],
    others: '會自動續訂，可另外取消'
  },
  {
    name: "年度方案",
    sub: "適合定期需要圖片的創作者(張)",
    limitTitle: "每月下載量",
    limit: [
      {
        "id": 1,
        "downloads": 10,
        "price": 29
      },
      {
        "id": 2,
        "downloads": 50,
        "price": 99
      },
      {
        "id": 3,
        "downloads": 350,
        "price": 169
      },
      {
        "id": 7,
        "downloads": 750,
        "price": 199
      }
    ],
    others: '如取消需支付解約費'
  }
]

export default function PackageCard() {
  return (
    <>
      {
        data.map((v, i) => {
          return (
            <div key={v.name} className="pCard col-12 col-md-5 p-4 d-flex flex-column justify-content-between mt-5" >
              <div className="title ">
                <h3 className='mb-0'>{v.name}</h3>
                <p>{v.sub}</p>
              </div>
              <div className="limit">
                <div className="price" >
                  <p className='mb-2'>{v.limitTitle}</p>
                  <div className='d-flex'>
                    {
                      v.limit.map((vv, ii) => {
                        return (
                          <>
                            <input key={vv.id} id={vv.id} type="radio" className="radio me-1" name="limit" value={vv.price} />
                            <label className="me-4" for={vv.id}>{vv.downloads}</label>
                          </>
                        )
                      })
                    }
                  </div>
                </div>

              </div>
              <h4 className="display">${ }元</h4>
              <div className="submit">
                <button className='mb-2'>立即購買</button>
                <p>* {v.others}</p>
              </div>
              <style jsx>{`
        .pCard {
          border-radius: 2px;
          background: hsla(0, 100%, 0%, .2);
          -webkit-backdrop-filter: blur(10px);    
          backdrop-filter: blur(10px);
          border: 1px solid  #BBAF74;
          height:55vh;
        }
        
        .title {
          color:#BBAF74;
        }
    
        h4, p, label{
          color: white;
        }

       

        button {
          border:1px solid #BBAF74;
          color: #BBAF74;
          padding: 10px 20px;
           background: transparent;
        }

        
        `}</style>
            </div>
          )
        })
      }
    </>
  )
}
