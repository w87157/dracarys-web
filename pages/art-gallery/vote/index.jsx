import React, { useState, useEffect } from "react";
import ListCardVote from "@/components/art-gallery/List-card-vote.js"
import AutoCloseModal from "@/components/AutoCloseModalComponent"
import { CircleLoader } from "react-spinners";
import SelectComponentArt from "@/components/art-gallery/SelectComponent-art.js"
import Image from "next/image";

export default function Index() {
  const [data, setData] = useState([])
  // #1 需告被選取的選項和過濾後的樹續
  const [selectedOption, setSelectedOption] = useState({ value: "0", label: "全部作品" });
  const [filteredData, setFilteredData] = useState(data); //預設值放入原始data

  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);



  useEffect(() => {
    fetch("http://localhost:8080/art-gallery/vote-list")
      .then(r => r.json())
      .then(myData => {
        // console.log(myData, 'weee')
        setTimeout(() => { setData(myData) }, 450)
      })
      .catch(ex => console.log(ex))
  }, [])



  // Auto Close Modal start
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('')
  const showModal = (message) => {
    setMessage(message)
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  // Auto Close Modal over


  //// 資料篩選
  // 下拉式選項
  const options = [
    { value: "0", label: "全部作品" },
    { value: "1", label: "AI生成" },
    { value: "2", label: "2D動漫" },
    { value: "3", label: "遊戲截圖" },
  ];
  //宣告搜尋狀態
  const [searchTerm, setSearchTerm] = useState('');
  // 是否有找到結果
  const [noResults, setNoResults] = useState(false);

  // #2 回調函数，以使父组件能獲取被選擇的選項
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);  // 儲存所選選項
    console.log(selectedOption, 'weeee');
  };


  // 搜尋與依類別篩選同時實現
  useEffect(() => {
    if (data.length > 0) {
      const filtered = data.filter((item) => {
        // 檢查是否符合類別條件
        const matchesCategory = selectedOption.value === "0" || item.artwork_type_id.toString() === selectedOption.value;

        // 檢查是否符合搜尋條件
        const matchesSearch = !searchTerm ||
          item.user_account.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase());

        // 同時滿足兩個條件
        return matchesCategory && matchesSearch;
      });

      setFilteredData(filtered);
      setNoResults(filtered.length === 0);  //沒找到結果
    }
  }, [selectedOption, data, searchTerm]);



  return (
    <>
      <div className="bg pb-5 p-0"  >
        <div className="container-fluid overflow-hidden" >
          {/*BANNER */}
          <div className="row hero" >
            <div className="col-12 position-relative d-flex flex-column justify-content-center align-items-center"  >
              {/* 篩選 */}
              <div className="list-sec col-12 mx-auto d-flex flex-column justify-content-end gap-3 px-0 position-relative mt-2" >
                <h4 className="text-center text-primary" style={{ textShadow: "0 0 4px black" }} >各路人馬集結中 | 盛夏最終局的熱血出征</h4>
                <div className="row d-flex justify-content-center w-100 " style={{ margin: "auto" }} >
                  <div className="col-4 col-md-2 p-0" >
                    {/* 下拉式選單 */}
                    <SelectComponentArt
                      options={options}
                      onChange={handleSelectChange}
                    />
                  </div>
                  {/* 搜尋 */}
                  <div className="col-8 col-md-7 p-0" >
                    <input
                      type="text"
                      className="form-control h-100 w-100"
                      placeholder="作品搜尋"
                      autoComplete="off"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 票數排行 */}
          <div className="slider p-0"  >
            <div className="slide-track p-0">
              {
                data?.slice(0, 14).map((v, i) => {
                  return (
                    <div key={v.id} className="slide text-center">
                      <p className="text-primary">{v.user_account}</p>
                      <p className="text-primary" style={{ fontSize: "0.8rem" }}>{v.vote_count}票</p>
                    </div>
                  )
                })
              }

            </div>
          </div>
          {/* 作品渲染 */}
          <div className="row container mx-auto p-0 pt-3 d-flex" >
            <div className="list-sec col-12  mx-auto " >
              {
                filteredData?.length === 0 && !noResults ?
                  <div className="loader-container">
                    <CircleLoader color="#BBAF74" loading={true} size={50} />
                    <p className="mt-3" style={{ color: "#BBAF74", fontSize: "13px" }}>加載中</p>
                  </div>
                  : noResults ?
                    <div className=" d-flex gap-3 justify-content-center align-items-center" style={{ height: "30vh" }}>
                      <Image src="/art-gallery/no.png" alt="" style={{ width: "150px" }} width="150" height="140" />
                      <div className="d-flex flex-column justify-content-center ms-2" >
                        <p className="text-primary" >找不到符合條件的作品 </p>
                        <p className="text-primary" >請嘗試其他搜尋條件或類別</p>
                      </div>
                    </div>
                    :
                    <ListCardVote data={filteredData} showModal={showModal} />
              }
            </div>
          </div>
        </div>
        <style jsx>{`
          .bg{
              background-image: url('/art-gallery/rocky-wall.png');
              background-repeat: repeat;
              background-attachment: fixed;
          }

          .hero {
           height: 80vh;  
           overflow: hidden;
           background-image:url('/art-gallery/vote_hero.jpg');
           background-size:cover;
           background-position: center -90px;
           background-repeat: no-repeat;
          }

         .form-control {
            border-radius: 3px; 
            height: 8vh;
            width: 60%;
            background: hsla(0, 20%, 0%, .25);
            -webkit-backdrop-filter: blur(5px);    
            backdrop-filter: blur(5px);
         }

          {/* 票數排行 related */}

        .slider {
          background: rgba(0, 0, 0, .43);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .125);
          height: 10vh; 
          margin: auto;
          overflow: hidden;
          position: relative;
          width: 100vw;
          translate: -14px 0 ;
        }

        .slider::before,
        .slider::after {
          background: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
          content: "";
          height: 100px;
          position: absolute;
          width: 200px;
          z-index: 2;
      
        }

        .slider::after {
          right: 0;
          top: 0;
          transform: rotateZ(180deg);
        }

        .slider::before {
          left: 0;
          top: 0;
        }

        .slide-track {
          animation: scroll 40s linear infinite;
          display: flex;
          width: calc(250px * 14);
          height: 100%;
        }

        .slide {
          height: 100px;
          width: 250px;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-250px * 7)); }
        }

        {/*  */}

        form {
          background-color: #160C0C;
          opacity: 0.85;
        }

        .filter {
          height: 10vh;
          z-index:1;
          width:80%;
          transform: translate(-50%); 
          top:0;
          left: 50%;
          border-radius: 5px;
          box-shadow: 0 0 5px #BBAF74 ;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter input {
          display: inline-block;
          width: 20px;
          height: 40%;
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 30vh;
          padding: 20px 0;
          margin-top: 30px;
          flex-direction: column;
        }

        @media screen and (max-width: 700px){ 
          .filter {
            width:95%;
          }
          .hero {
            height:45vh;
           background-position: center ;
          }

          .bg {
            padding: 2rem;
          }

        }
      `}</style>
      </div>
      {/* Add To List Modal */}
      < AutoCloseModal show={isModalVisible} onClose={closeModal} message={message} />
    </>
  )
}   