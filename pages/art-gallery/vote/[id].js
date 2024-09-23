import React, { use, useEffect, useState } from "react";
import { useLike } from "@/hooks/use-like";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/router";
import { useSave } from "@/hooks/use-save";
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import AutoCloseModal from "@/components/AutoCloseModalComponent";
import Savevicon from "@/components/art-gallery/saveicon";
import Favicon from "@/components/art-gallery/favicon";
import { useVote } from "@/hooks/use-vote";
import Image from "next/image";
import LoginForm from "@/components/member/login-form";

export default function ArtworkDetail() {
  const router = useRouter();
  const { saves, setSaves } = useSave();
  const { likes, setLikes } = useLike();
  const { votedArtwork, handleVote, hasVoted, getVotedArtwork } = useVote();
  const [detail, setDetail] = useState({
    success: false,
    rows: {},
  });
  const { id } = router.query;
  // 登入狀態
  const { auth } = useAuth();
  // 追踪投票數
  const [voteCount, setVoteCount] = useState(0);
  const [imageUrl, setImageUrl] = useState('');


  useEffect(() => {
    if (detail?.rows?.img) {
      setImageUrl(detail.rows.img);
    }
  }, [detail?.rows?.img]);




  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);


  // vote handler
  const vote = () => {
    if (hasVoted()) {
      showModal("您已經投過票了!");
      return;
    }

    fetch(`http://127.0.0.1:8080/art-gallery/vote/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          handleVote(data.artwork); // 使用返回的artwork數據
          setDetail(prev => ({
            ...prev,
            rows: data.artwork // 直接使用返回的artwork數據
          }));
          setVoteCount(data.artwork.vote_count); // 更新voteCount
          showModal("投票成功!");
          closeConfirmModal();
        } else {
          showModal("投票失敗,請稍後再試.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showModal("發生錯誤,請稍後再試.");
      });
  };

  // detail.rows
  //   {
  //     "success": true,
  //     "rows": {
  //         "id": 2,
  //         "title": "王座之爭",
  //         "desc": "五大王國陷入戰亂，各自宣稱擁有正統的統治權。玩家將選擇一個陣營，通過策略和戰鬥，在血腥的戰場上奪取王位，並平衡權力與正義。",  //https://loremflickr.com/800/1000/sunset?lock=4775031257169920
  //         "img": "http://localhost:8080/img/r1.jpg",
  //         "view_count": 16604,
  //         "download_count": 2501,
  //         "like_count": 265,
  //         "vote_count": 265,
  //         "artwork_type_id": 1,
  //         "user_account": "andy0404",
  //         "createdAt": "2024-07-16 22:47:16",
  //         "updatedAt": "2024-07-16 22:47:16"
  //     }
  // }


  // 向伺服器要資料
  useEffect(() => {
    if (router.isReady && id) {
      fetch(`http://127.0.0.1:8080/art-gallery/detail/${id}`)
        .then((r) => r.json())
        .then((myData) => {
          if (myData.success) {
            setDetail({
              success: myData.success,
              rows: myData.rows,
            });

            // 檢查是否已經投票過這個作品
            const votedArtwork = getVotedArtwork();
            if (votedArtwork && votedArtwork.id === myData.rows.id) {
              // 如果已經投票過,更新 UI
              setDetail(prev => ({
                ...prev,
                rows: {
                  ...prev.rows,
                  hasVoted: true
                }
              }));
            }
          }
        })
        .catch((err) => console.error("Fetch operation failed:", err));
    }
  }, [id, router.isReady, getVotedArtwork]);


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



  // confirm Modal start
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const closeConfirmModal = () => setShowConfirmModal(false);
  // confirm modal end


  // 不讓你點左鍵
  const handleContextMenu = (event) => {
    event.preventDefault();
    setMessage(`
壞壞，不可以亂點喔!
 --請尊重智慧財產權--`);
    setModalVisible(true);
  };


  // 檢視加一
  const handleZoom = async () => {
    try {
      const incrementResponse = await fetch(`http://127.0.0.1:8080/art-gallery/increment-like/${id}`, {
        method: 'POST',
      });
      const incrementData = await incrementResponse.json();

      if (!incrementData.success) {
        throw new Error('增加檢視次數失敗');
      }
      // 更新次數
      setDetail(prevDetail => ({
        ...prevDetail,
        rows: {
          ...prevDetail.rows,
          like_count: incrementData.newDownloadCount
        }
      }));
    } catch (error) {
      console.error('Error downloading image:', error);
    }

  }


  // 登入相關
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isAutoModal, setIsAutoModal] = useState(false);

  const closeLoginModal = () => {
    setIsLoginModal(false);
  };

  const showAutoModal = (message) => {
    setMessage(message);
    setIsAutoModal(true);
  };



  if (!id) return <></>;

  return (
    <>
      <article className="container-fluid py-5 ">
        <Link
          href="/art-gallery/vote"
          className="position-fixed"
          style={{ textDecoration: "none", zIndex: "1" }}
        >
          <p style={{ color: "#BBAF74", fontWeight: "300", fontSize: "0.8rem" }}>
            <i className="bi bi-chevron-double-left"></i> 回投票專區
          </p>
        </Link>
        <section className="container row mx-auto p-3 d-flex flex-column flex-md-row upper-wrapper" onContextMenu={handleContextMenu} >
          {/* 作品本人 */}
          <div className="col-12 col-md-8 p-0 img-wrapper1" >
            {router.isReady && imageUrl && (
              <img
                src={imageUrl}
                alt="artwork"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                key={imageUrl} // 添加 key 屬性
                loading="lazy"
              />
            )}
            <div className="zoom-in">
              {
                !!auth.login ?
                  <Link href={imageUrl} target="_blank" onClick={() => handleZoom()}>
                    <i className="bi bi-plus-circle"></i>
                  </Link>
                  :
                  <a
                    // data-bs-toggle="modal"
                    // data-bs-target="#memberModal"
                    onClick={() => setIsLoginModal(true)}
                  >
                    <i className="bi bi-plus-circle"></i>
                  </a>
              }
            </div>
          </div>
          {/* 作品簡介、珍藏及投票 */}
          <div className="side-wrapper col-12 col-md-4 ps-4 h-100 " style={{ height: "100%" }}>
            <div className=" title d-flex flex-column">
              <h4 className="text-primary mb-0">
                {router.isReady ? detail.rows.title : 111}
              </h4>
              <p className="sub-title">
                <span>作者：</span>
                {router.isReady ? detail.rows.user_account : ""}
              </p>
              <div className="desc-wrapper" style={{ paddingRight: "10px" }}>
                <p className="desc mb-4 mt-3 " style={{ lineHeight: "18px", lineHeight: "1.3rem", paddingRight: "10px", height: "20vh" }}>
                  {router.isReady ? detail.rows.desc : ""}
                </p>
              </div>
              <div
                className="icon-wrapper d-flex justify-content-start mb-5 mb-md-5 "
                style={{ gap: "25px" }}
              >
                <Favicon
                  artwork={detail.rows}
                  likes={likes}
                  setLikes={setLikes}
                  showModal={showModal}
                />
                <Savevicon
                  artwork={detail.rows}
                  saves={saves}
                  setSaves={setSaves}
                  showModal={showModal}
                />

              </div>
              {
                auth.login ? (
                  <button
                    // className="btn btn-primary mt-5"
                    className={hasVoted() ? 'btn btn-primary mt-5' : 'btn btn-outline mt-5'}
                    onClick={() => {
                      openConfirmModal();
                    }}
                    disabled={hasVoted()}
                  >
                    {hasVoted() ? "已投票" : "一鍵投票"}
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                ) : (
                  <button
                    className="btn btn-outline align-self-start mt-5"
                    // data-bs-toggle="modal"
                    // data-bs-target="#memberModal"
                    onClick={() => setIsLoginModal(true)}
                  >
                    一鍵投票
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                )
              }
            </div>
          </div>
        </section>
        {/* 留言區 */}
        <section className="container row mx-auto p-3 d-flex flex-column flex-md-row " >
          {/* 作品相關統計 */}
          <div className="col-12 p-0 img-wrapper" >
            <ul className="row d-flex flex-column flex-md-row text-center text-light justify-content-evenly px-3"  >
              <li className="col-12 col-md-8 p-0 d-flex align-items-center">
                <ul className="col-12 d-flex" >
                  <li className="col p-0 " style={{ borderRight: "1.6px solid #bbaf74" }}>
                    <p className="text-primary mb-1"  >觀看次數</p>
                    <p>{router.isReady ? detail.rows.view_count : ""}</p>
                  </li>
                  <li className="col  p-0" style={{ borderRight: "1.6px solid #bbaf74" }}>
                    <p className="text-primary mb-1">檢視次數</p>
                    <p>{router.isReady ? detail.rows.like_count : ""}</p>
                  </li>
                  <li className="col p-0" >
                    <p className="text-primary mb-1">發表日期</p>
                    <p>{router.isReady ? detail.rows.createdAt : ""}</p>
                  </li>
                </ul>
              </li>
              {/* 人氣投票 */}
              <li className="col-12 col-md-4 p-0 p-2 " >
                <ul className="px-4" >
                  <li className="w-100 h-100 p-2  vote-wrapper">
                    <p className="text-primary mb-1" style={{ textShadow: "0 0 5px black", fontWeight: "500" }}>人氣投票</p>
                    <h1 className="heart-beat ">{router.isReady ? detail.rows.vote_count : ""}</h1>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </section>
      </article>
      {/* Add To List Modal */}
      <AutoCloseModal
        show={isModalVisible}
        onClose={closeModal}
        message={message}
      />
      {/* 確定要投票Modal */}
      {
        !!showConfirmModal &&
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
                  馬上投票
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
                    確定要投票給 <span className="text-light p-2">{detail.rows.user_account}</span>的作品
                    <span className="text-light p-2 ">
                      {detail.rows.title}
                    </span>
                    嗎?
                  </div>
                  <div className="col-10 m-auto fw-bold text-center mb-2" style={{ fontSize: "0.8rem" }}> 注意！一經投票不得再次投票 </div>
                  <div className="col-10 m-auto" style={{ height: "35vh", maxWidth: "100%", maxHeight: "100%", position: "relative" }}>
                    <div style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}>
                      <Image src={detail?.rows?.img} alt="candidate" fill style={{ objectFit: "cover" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-primary"
                    onClick={vote}
                  >
                    確定投票
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-secondary"
                    onClick={closeConfirmModal}
                  >
                    放棄重選
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* 登入 */}
      <LoginForm
        show={isLoginModal}
        onClose={closeLoginModal}
        showAutoModal={showAutoModal}
      />
      <style jsx>{`
        article {
          background-image: url("/art-gallery/rocky-wall.png");
          background-repeat: repeat;
          background-attachment: fixed;
        }

        .artwork {
          height: 100%;
          width: 100%;
          object-fit: cover;
          border: 1px solid #bbaf74;
        }

        .container {
          background: hsla(0, 100%, 0%, 0.65);
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
        }

        {/* .upper-wrapper {
          height: 80vh;
        } */}

        .img-wrapper1 {
          position: relative;
          height: 70vh;
          border: 1px solid #BBAF74;
          overflow  : hidden;
          {/* height: 100%; */}
        }
        .img-wrapper {
          position: relative;
          height: 100%;
        }

        .zoom-in {
          color: #bbaf74;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        i {
          cursor: pointer;
        }

        .side-wrapper {
          height: 100%;
        }

        .title {
          height: 100%;
        }

        {/* button {
          background-color: transparent;
          color: #bbaf74;
          padding: 8px 20px;
          margin-top: auto;
        } */}

        .desc-wrapper {
          text-align: justify;
          overflow: auto;
          max-height: 60%;
        }


        .desc {
          line-height: 18px; 
          line-height: 1.3rem; 
          padding-right: 0.1rem ;
        }
        .sub-title {
          color: #bbaf74;
        }

        textarea {
          background-color: transparent;
          outline: 1px solid #bbaf74;
          opacity: 0.7;
          border: none;
          resize: none;
          height: 130px;
        }

        textarea:focus {
          border: none;
          box-shadow: 0 0 10px #bbaf74;
        }

        .vote-wrapper {
          background-image: url('/art-gallery/register.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          height: 100%;
          border-radius:40rem;
          box-shadow: inset 0 0 20px #bbaf74;
        }

        .heart-beat {
          animation: heart-beat 1s  infinite;
          border-top-left-radius: 20px;
          border-bottom-right-radius: 20px;
          opacity:0.9;
        }

        .float:hover::before{
            position: absolute;
            top: -45px;
            left: 0;
            color: #fff;
            font-size: .8em;
            background: #346e7a;
            padding: 5px;
            border-radius: 5px;
            content: '你看到我啦(・ω・)ノ';
          }

        @media screen and (max-width: 600px) {
          .upper-wrapper {
            height: auto;
          }
        }

        @keyframes heart-beat {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.06);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
