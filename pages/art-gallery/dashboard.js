import { useEffect, useState } from "react";
import { useSave } from "@/hooks/use-save";
import { useRouter } from 'next/router';
import { useVote } from "@/hooks/use-vote";
import Slider from "react-slick";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [formStyle, setformStyle] = useState(false)
  const { saves, setSaves } = useSave();
  const { votedArtwork, isLoading } = useVote();

  // btn toggle
  const handleStyle = () => {
    setformStyle(!formStyle)
  }

  // 自定義slider箭頭
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "20px", zIndex: 1, opacity: 0.4 }}
        onClick={onClick}
      >
        <i className="fa fa-arrow-right" style={{ color: "#BBAF74" }}></i>
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "20px", zIndex: 1, opacity: 0.4 }}
        onClick={onClick}
      >
        <i className="fa fa-arrow-left" style={{ color: "#BBAF74" }}></i>
      </div>
    );
  };

  // 自定義slider參數
  const settings = {
    dots: false,
    infinite: true,
    speed: 2500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };


  // 從LS取得珍藏作品並存回useSave()狀態中供後用
  useEffect(() => {
    try {
      const savedArt = JSON.parse(localStorage.getItem("DNS_art_save")) || [];
      setSaves(savedArt);
    } catch (error) {
      console.error("Error loading saved art from localStorage:", error);
      setSaves([]);
    }
  }, []);


  // handleClick
  const handleClick = (id) => {
    console.log(id); // id有傳入
    let target = ''  //作品上傳時間
    try {
      const storedData = localStorage.getItem('DNS_art_save');

      if (!storedData) {
        console.log('No data found in localStorage');
        return;
      }

      const parsedData = JSON.parse(storedData);   //LS抓出來是string，要記得parse

      if (!Array.isArray(parsedData)) {
        console.log('Stored data is not an array');
        return;
      }

      target = parsedData.find((v) => v.id === id).createdAt.split('T')[0];

      if (target) {
        console.log('Found target:', target); //target.createdAt:string
      } else {
        console.log('No matching item found for id:', id);
      }
    } catch (error) {
      console.error('Error processing localStorage data:', error);
    }

    const d1 = new Date(target)  //上傳時間
    // if (d1 >= new Date('2024-06-01')) router.push(`/art-gallery/vote/${id}`)
    // else router.push(`/art-gallery/artwork/${id}`)
    if (d1 >= new Date('2024-06-01')) {
      window.open(`/art-gallery/vote/${id}`, '_blank');  //新視窗開啟
    } else {
      window.open(`/art-gallery/artwork/${id}`, '_blank');
    }

  };

  // handle CLick for vote
  const handleClickVote = (id) => {
    // console.log(id); // id有傳入
    let target = ''  //作品
    try {
      const storedData = localStorage.getItem('DNS_art_vote');

      if (!storedData) {
        console.log('No data found in localStorage');
        return;
      }

      target = JSON.parse(storedData);   //LS抓出來是string，要記得parse

      if (typeof target !== 'object' && Array.isArray(target) && target === null) {
        console.log('Stored data is not an object');
        return;
      }

    } catch (error) {
      console.error('Error processing localStorage data:', error);
    }

    const d1 = new Date(target.createdAt.split('T')[0])  //上傳時間
    console.log(d1)

    if (d1 >= new Date('2024-06-01')) window.open(`/art-gallery/vote/${id}`, '_blank');   //新視窗開啟
    else window.open(`/art-gallery/artwork/${id}`, '_blank');

  };


  // 排序toggle
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';    //顯示控制
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    setSaves(prevSaves => [...prevSaves].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  //刪除流程控制：個別和全部
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    deleteId: null,   //透過這裡攜帶刪除作品的id
    isDeleteAll: false
  });

  const openConfirmModal = (id = null, isDeleteAll = false) => {
    setConfirmModal({ show: true, deleteId: id, isDeleteAll });  //設定作品id
  };

  const closeConfirmModal = () => {
    setConfirmModal({ show: false, deleteId: null });
  };

  const handleDelete = () => {
    const { deleteId, isDeleteAll } = confirmModal;   //透過這裡帶進來被刪除作品的id
    if (isDeleteAll) {
      setSaves([]);
      localStorage.setItem('DNS_art_save', JSON.stringify([]));
    } else if (deleteId) {
      const updatedSaves = saves.filter(item => item.id !== deleteId);
      localStorage.setItem("DNS_art_save", JSON.stringify(updatedSaves));
      setSaves(updatedSaves);
    }
    closeConfirmModal();
  };


  return (
    <div className="container-fluid" style={{ paddingTop: "5vh", paddingBottom: "15vh" }}>
      <div className="container">
        <div className="row">
          {/* vote 開始*/}
          <div className="col-10 m-auto" >
            <p className="text-primary">本次首選</p>
            {isLoading ? (
              <div className="vote-wrapper">Loading...</div>
            ) : votedArtwork ? (
              <div className="vote-wrapper">
                <Image
                  src={votedArtwork.img}
                  alt="vote-choice"
                  className="you-choice"
                  onClick={() => handleClickVote(votedArtwork.id)}
                  fill
                  style={{ objectFit: "cover", cursor: "pointer" }}
                />
                <div className="vote-overlay">
                  <h2>{votedArtwork.title}</h2>
                  <p className="text-primary ">作者 | {votedArtwork.user_account}</p>
                  <button
                    className="btn btn-outline"
                    onClick={() => handleClickVote(votedArtwork.id)}
                    style={{ marginTop: "5vh" }}
                  >
                    查閱
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="vote-wrapper" >
                <p>您尚未投票</p>
                <button
                  className="btn btn-outline mt-3"
                  onClick={() => router.push('/art-gallery/vote')}
                >
                  即刻前往投票
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div>
                </button>
              </div>
            )}
          </div>
          {/* vote結束 */}

          {/* toggleStyle */}
          <div className="col-10 m-auto mt-5 mb-2" >
            <button className="btn-style-toggle" onClick={handleStyle}>
              {formStyle ?
                <i className="bi bi-ui-checks-grid"> 觀賞模式</i>
                :
                <i className="bi bi-card-list"> 一般模式</i>}
            </button>
          </div>

          {/* table start*/}
          {
            formStyle ?
              <>
                {/* 表格模式 */}
                <div className="col-12 mt-4">
                  <table className="table table-striped " style={{ borderBottom: "1.2px solid #BBAF74" }}>
                    {/* 表頭 */}
                    <thead>
                      <tr style={{ borderBottom: "1.2px solid #BBAF74" }}>
                        <th scope="col" className="text-primary">作品預覽</th>
                        <th scope="col" className="text-primary" onClick={() => handleSort('title')}>
                          作品名稱
                          <i className={`bi bi-arrow-${sortConfig.key === 'title' ?
                            (sortConfig.direction === 'asc' ? 'down' : 'up') : 'down-up'}`}></i>
                        </th>
                        <th scope="col" className="text-primary" onClick={() => handleSort('user_account')}>
                          作者
                          <i className={`bi bi-arrow-${sortConfig.key === 'user_account' ?
                            (sortConfig.direction === 'asc' ? 'down' : 'up') : 'down-up'}`}></i>
                        </th>
                        <th scope="col" className="text-primary" onClick={() => handleSort('vote_count')}>
                          人氣投票
                          <i className={`bi bi-arrow-${sortConfig.key === 'vote_count' ?
                            (sortConfig.direction === 'asc' ? 'down' : 'up') : 'down-up'}`}></i>
                        </th>
                        <th
                          scope="col"
                          className="text-primary text-center"
                          onClick={() => openConfirmModal(null, true)}
                          style={{ cursor: "pointer" }}
                        >全部刪除</th>
                      </tr>
                    </thead>
                    {/* 表身 */}
                    <tbody>
                      {
                        saves.length !== 0 ?
                          saves.map(({ id, img, title, user_account, vote_count }, i) => {
                            return (
                              <tr key={id} className="row-effect">
                                <td className="img-wrapper">
                                  <Image
                                    className="img-art"
                                    onClick={() => handleClick(id)}
                                    src={img}
                                    alt="artwork"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: "100%", height: "120px", objectFit: "cover", cursor: "pointer", borderRadius: "2px" }}
                                  />
                                </td>
                                <td className="align-middle">{title}</td>
                                <td className="align-middle">{user_account}</td>
                                <td className="align-middle ">{vote_count}</td>
                                <td className="align-middle text-center">
                                  <i
                                    className="bi bi-bookmark-x-fill"
                                    onClick={() => openConfirmModal(id, false)}
                                  >
                                  </i>
                                </td>
                              </tr>
                            )
                          })
                          :
                          <tr>
                            <td className="text-center text-primary " colSpan={5} style={{ paddingBlock: "2rem" }}>目前沒有珍藏的作品</td>
                          </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </>
              :
              <>
                {/* 觀賞模式*/}
                <div className='col-12 col-md-10 mx-auto my-5'  >
                  <div className="mt-20 slider-container" >
                    {saves.length > 1 ? (
                      <Slider {...settings} style={{ marginTop: '-60px' }}>
                        {saves.map(({ id, img, title }) => (
                          <div key={id} className="img-con">
                            <img src={img} className="card-img-top" alt={title} loading="lazy" />
                          </div>
                        ))}
                      </Slider>
                    ) : saves.length === 1 ? (
                      <div className="img-con">
                        <img src={saves[0].img} className="card-img-top" alt={saves[0].title} style={{ height: "70vh", pointer: "cursor" }} loading="lazy" />
                      </div>
                    ) : (
                      <div className="no-saves-message" style={{ borderTop: "1.2px solid #BBAF74", borderBottom: "1.2px solid #BBAF74", paddingBlock: "2rem" }}>
                        <p className="text-primary text-center" >目前沒有珍藏的作品</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
          }
        </div>
      </div>
      {/* 確定要投票Modal */}
      {confirmModal.show && (
        <div
          className="modal fade show"
          id="voteConfirmModal"
          tabIndex={-1}
          aria-labelledby="voteConfirmModalLabel"
          aria-hidden="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-3 border-primary rounded-0 p-0">
              <div className="modal-header text-bg-primary border-0 rounded-0">
                <h1
                  className="modal-title fs-5 text-dark"
                  id="voteConfirmModalLabel"
                >
                  刪除珍藏
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeConfirmModal}
                />
              </div>
              <div className="modal-body text-bg-dark text-primary">
                <div className="row mt-4">
                  <div className="col-12 m-auto fw-bold text-center">
                    {confirmModal.isDeleteAll
                      ? "確定要刪除所有珍藏的作品嗎？"
                      : "確定要刪除這個珍藏嗎？"}
                  </div>
                </div>
              </div>
              <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-primary"
                    onClick={handleDelete}
                  >
                    確定刪除
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-secondary"
                    onClick={closeConfirmModal}
                  >
                    返回列表
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>
        {`

        .btn-style-toggle {
          background-color: transparent;
          border: none;
        }

        .img-con {
          width: 100%;
          height: 55vh;
          display: inline-block;
          position: relative;
          float: left;
        }

        .img-con>img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          object-fit: cover;
          border-radius: 1px;
          transition:all  0.6s;
        }

        .img-con>img:not(:hover) {
           transform: scale(0.92);
           filter: grayscale(100%);
        }

        .img-con:before {
          content: '';
          width: 100%;
          height: 100%;
          padding-bottom: 64%;
          display: block;
        }

        .slick-arrow{
          border: 1px solid red;
        } 
        .slick-next{
          border: 1px solid red;
        }
        .bi-arrow-down-up {
          font-size: 0.8rem;
          padding-left: 0.2rem;
          cursor: pointer;
        }

        .img-wrapper {
          width: 200px;
          height: 120px;
          overflow: hidden;
        }

        .img-art {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          border-radius: 2px;
        }

        tbody td {
          color: white;
        }
  
        .row-effect {
          transition: 0.7s;
          background-color: transparent;
          margin-bottom: 1.2px;
          margin-top: 1.2px;
          border: 1px solid transparent;
        }

        .row-effect:hover {
          transform: scale(1.02);
          border-bottom: 1.2px solid #BBAF74;
          border-top: 1.2px solid #BBAF74;
        }
        .vote-wrapper {
          width:96%;
          height: 75vh;
          margin: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

          .vote-overlay{
            position: absolute;
            bottom:-10%;
            right: 50%;
            transform: translate(50%,0);
            z-index: 2;
            opacity: 0;
            color: #BBAF74;
            text-shadow: 0 0 8px black;
            place-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transition: all 0.8s ease;
          }

          .vote-wrapper:hover .vote-overlay {
            bottom: 10%;
            transform: translate(50%,0);
            opacity: 1;
          }

        .you-choice {
          height: 100%;
          width: 100%;
          object-fit: cover;
          cursor: pointer;
        }
        i{
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

