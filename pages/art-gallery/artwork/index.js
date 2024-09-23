import { useEffect, useState } from "react";
import ListCard from "@/components/art-gallery/List-card.js";
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import { CircleLoader } from "react-spinners";
import "bootstrap-icons/font/bootstrap-icons.css";
import Image from "next/image";
// import SelectComponent from "@/components/SelectComponent-dev.js"
// import ListFilter from "@/components/art-gallery/List-filter.js";
// import InfiniteScroll from "react-infinite-scroll-component";

export default function Index() {
  // 再加isLoading控制第一次不需要資料
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([])

  // 篩選相關
  const options = [
    { value: "0", label: "(排序依據)" },
    { value: "1", label: "追蹤日期：由遠到近" },
    { value: "2", label: "追蹤日期：由近到遠" },
  ];

  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);



  // 後端要資料
  const fetchData = () => {
    fetch(`http://127.0.0.1:8080/art-gallery/artwork-list`)
      .then((r) => r.json())
      .then((myData) => {
        setData(myData.artworks);
        setFilter(myData.artworks)
        setIsLoading(false)
      })
      .catch((ex) => console.error(ex));
  };


  useEffect(() => {
    fetchData();
  }, []);


  // 資料篩選
  const Filter = (e) => {
    setFilter(data.filter((v) => v.title.toLowerCase().includes(e.target.value) || v.user_account.toLowerCase().includes(e.target.value)))
  }

  // Auto Close Modal start
  const [isModalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const showModal = (message) => {
    setMessage(message);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  // Auto Close Modal over

  return (
    <div className="bg pb-5">
      <div className="container-fluid">
        <div className="row container mx-auto p-0 px-3 px-md-5" >
          {/* <ListFilter /> */}
          {/* 工具列 */}
          <div className="row p-0 px-md-5 mx-auto p-0 pt-3" >
            <div className="list-sec col-12 mx-auto d-flex justify-content-end gap-3 px-0 position-relative"  >
              {/* 搜尋 */}
              <input type="text" className="form-control " placeholder="快速搜尋" autoComplete="off" onChange={Filter} />
              <i className="bi bi-search position-absolute top-50 icon" style={{ fontSize: "1rem", transform: "translateY(-50%)", right: "0.3rem" }}></i>
              {/* 排序 */}
              {/* <div className="select-component" >
                <SelectComponent options={options} />
              </div> */}
            </div>
          </div>
          <div className="list-sec col-12  mx-auto p-0 mt-3 " >
            {
              filter.length === 0 ?
                isLoading ?
                  <div className="loader-container">
                    <CircleLoader color="#BBAF74" loading={true} size={60} />
                    <p
                      className="mt-3"
                      style={{ color: "#BBAF74", fontSize: "0.8rem" }}
                    >
                      加載中
                    </p>
                  </div>
                  :
                  <div className=" d-flex gap-3 justify-content-center align-items-center" style={{ height: "30vh" }}>
                    <Image src="/art-gallery/no.png" alt="" style={{ width: "150px" }} width="150" height="140" />
                    <div className="d-flex flex-column justify-content-center" >
                      <p className="text-primary" >找不到符合條件的作品 </p>
                      <p className="text-primary" >請嘗試其他搜尋條件或類別</p>
                    </div>
                  </div>
                :
                <ListCard data={filter} showModal={showModal} />
            }

          </div>
        </div>
      </div>
      {/* Add To List Modal */}
      <AutoCloseModal
        show={isModalVisible}
        onClose={closeModal}
        message={message}
      />
      <style jsx>{`

        .bg {
          background-image: url("/art-gallery/rocky-wall.png");
          background-repeat: repeat;
          background-attachment: fixed;
        }
        form {
          background-color: #160c0c;
          opacity: 0.85;
        }

       .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 20px 0;
          margin-top: 30px;
          flex-direction: column;
        }

        .filter {
          height: 10vh;
          z-index: 1;
          width: 80%;
          transform: translate(-50%);
          top: 0;
          left: 50%;
          border-radius: 5px;
          box-shadow: 0 0 5px #bbaf74;
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

        .form-control{
          height: 7vh;
          width: 20%; 
          font-size: 14px;
          border-radius: 2px;
        }


        .select-component{
          width: 12vw; 
          height: 7vh;
        }

        @media screen and (max-width: 700px) {
          .filter {
            width: 95%;
          }
          .form-control {
            width: 100%; 
        }

          .select-component{
          width: 40%; 
          height: 7vh;
        }


        }
      `}</style>
    </div>
  );
}
