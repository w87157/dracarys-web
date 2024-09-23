import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useAuth } from "@/hooks/use-auth";
import { useSave } from '@/hooks/use-save';
import { useLike } from '@/hooks/use-like';
import Link from 'next/link'
import AutoCloseModal from '@/components/AutoCloseModalComponent';
import Savevicon from '@/components/art-gallery/saveicon'
import Favicon from '@/components/art-gallery/favicon'
import 'bootstrap-icons/font/bootstrap-icons.css';
import DownloadModal from '@/components/DownloadModal'
import LoginForm from "@/components/member/login-form";


export default function ArtworkDetail({ }) {
  const { saves, setSaves } = useSave()
  const { likes, setLikes } = useLike()
  const router = useRouter();
  const [detail, setDetail] = useState({
    success: false,
    rows: {}
  })
  const { auth } = useAuth();

  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);


  const { id } = router.query;
  useEffect(() => {
    fetch(`http://127.0.0.1:8080/art-gallery/detail/${id}`)
      .then(r => r.json())
      .then(myData => {
        // console.log(myData)
        if (myData.success) {
          const newDetail = { ...detail, success: myData.success, rows: myData.rows }
          setDetail(newDetail)
          // console.log(detail.rows.createdAt, 'weee')
        }
      })
      .catch(err => console.error('Fetch operation failed:', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])


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



  // 不讓你點左鍵
  const handleContextMenu = (event) => {
    event.preventDefault();
    setMessage(`
壞壞，不可以亂點喔!
 --請尊重智慧財產權--`);
    setModalVisible(true);
  };

  // 圖片下載 及 下載次數遞增
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(''); // 新增狀態


  const handleDownload = async (apiUrl) => {
    setIsDownloading(true);
    setDownloadStatus('下載中...');

    try {
      // 調用增加下載次數的API
      const incrementResponse = await fetch(`http://127.0.0.1:8080/art-gallery/increment-download/${id}`, {
        method: 'POST',
      });
      const incrementData = await incrementResponse.json();
      if (!incrementData.success) {
        throw new Error('增加下載次數失敗');
      }

      // 下載
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'dragonfire_and_sorcery.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setDownloadStatus('下載完成');

      // 更新組件中的下載次數
      setDetail(prevDetail => ({
        ...prevDetail,
        rows: {
          ...prevDetail.rows,
          download_count: incrementData.newDownloadCount
        }
      }));

      // 自動關閉modal
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadStatus('');
      }, 1000);

    } catch (error) {
      console.error('Error downloading image:', error);
      setDownloadStatus('下載失敗，請再試一次。');

      // 錯誤訊息也會自動關閉
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadStatus('');
      }, 1500);
    }
  }



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
      <article className="container-fluid py-5 mt-5">
        <Link href="/art-gallery/artwork" className='position-fixed' style={{ textDecoration: "none", zIndex: "1" }}>
          <p style={{ color: "#BBAF74", fontWeight: "300", fontSize: "0.8rem" }}>
            <i className="bi bi-chevron-double-left"></i>回歷屆作品
          </p>
        </Link>
        <section className="container row mx-auto p-3 d-flex flex-column flex-md-row upper-wrapper" onContextMenu={handleContextMenu} >
          {/* 作品本人 */}
          <div className="col-12 col-md-8 p-0 img-wrapper">
            <img className="artwork" src={router.isReady ? detail.rows.img : ''} loading="lazy" />
            <div className="zoom-in">
              {
                !!auth.login ?
                  <a href={detail.rows.img} target="_blank" onClick={() => handleZoom()}>
                    <i className="bi bi-plus-circle"></i>
                  </a>
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
          <div className="side-wrapper col-12 col-md-4 ps-4  h-100 " >
            <div className=" title d-flex flex-column" >
              <h4 className='text-primary mb-0'>{router.isReady ? detail.rows.title : 111}</h4>
              <p className='sub-title'><span>作者：</span>{router.isReady ? detail.rows.user_account : ''}</p>
              <div className='desc-wrapper my-2' style={{ paddingRight: "10px" }}>
                <p className='desc mb-4 mt-3 me-3' style={{ lineHeight: '18px' }}>{router.isReady ? detail.rows.desc : ''}</p>
              </div>
              <div className="icon-wrapper d-flex justify-content-start mb-3 mb-md-0" style={{ gap: "25px" }}>
                <Favicon artwork={detail.rows} likes={likes} setLikes={setLikes} showModal={showModal} />
                <Savevicon artwork={detail.rows} saves={saves} setSaves={setSaves} showModal={showModal} />
                {/* 圖片下載 */}
                <div className='box'>
                  <i className="bi bi-download " onClick={() => handleDownload(detail.rows.img)}></i>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 作品相關統計 */}
        <section className="container row mx-auto p-3  d-flex flex-column flex-md-row py-2" >
          <div className='col-12  px-4 order-1 order-md-2 mb-3 mb-md-0' >
            <ul className="row d-flex text-center text-light h-50" >
              <li className="col-3 mb-5 p-0">
                <p className="text-primary mb-1">觀看次數</p>
                <p>{router.isReady ? detail.rows.view_count : ''}</p>
              </li>
              <li className="col-3  mb-5 p-0">
                <p className="text-primary mb-1">檢視次數</p>
                <p>{router.isReady ? detail.rows.like_count : ''}</p>
              </li>
              <li className="col-3  mb-5 p-0">
                <p className="text-primary mb-1">下載次數</p>
                <p>{router.isReady ? detail.rows.download_count : ''}</p>
              </li>
              <li className="col-3  mb-5 p-0">
                <p className="text-primary mb-1" >發表日期</p>
                <p >{router.isReady ? detail.rows.createdAt : ''}</p>
              </li>
            </ul>
          </div>
        </section>
      </article>
      {/* Add To List Modal */}
      <AutoCloseModal show={isModalVisible} onClose={closeModal} message={message} />
      {/* Download Modal */}
      <DownloadModal
        show={isDownloading || downloadStatus === '下載完成'}
        status={downloadStatus}
      />
      {/* 登入 */}
      <LoginForm
        show={isLoginModal}
        onClose={closeLoginModal}
        showAutoModal={showAutoModal}
      />
      <style jsx>{`
        article {
          background-image: url('/art-gallery/rocky-wall.png');  
          background-repeat: repeat;  
        }

        .artwork{
          height:100%;
          width: 100%;
          object-fit: cover;
          border: 1px solid #BBAF74;
        }

        .container {
           background: hsla(0,100%, 0%, .65);
          -webkit-backdrop-filter: blur(5px);    
          backdrop-filter: blur(5px);
        }


        .upper-wrapper {
          height: 90vh;
        }


        .img-wrapper {
          position: relative;
          height: 100%;
        }


        .zoom-in{
          color: #BBAF74;
          position:absolute;
          bottom: 10px  ;
          right:10px;
        }


                
        .side-wrapper {
          height: 100%;
        }

        .title {
           height: 100%;
        }


        i {
          cursor: pointer;
        }

        button {
          background-color: transparent;
          color: #BBAF74;
          padding: 8px 20px;
          margin-top: auto;
        }


        .desc-wrapper {
          text-align: justify;
          overflow: auto;
          max-height: 60%;
        }


        .sub-title {
          color: #BBAF74;
        }


        
        textarea {
          background-color: transparent;
          outline: 1px solid #BBAF74;
          opacity: 0.7;
          border: none;
          resize: none;
          height: 130px;
        }

        textarea:focus {
          border: none;
          box-shadow: 0 0 10px #BBAF74;
        }

        .box{
          position:relative;
        }


        .box::before {
          content: '下載';
          position: absolute;
          top: 25px;
          left: 0;
          color:black;
          font-size: .6em;
          background: #BBAF74;
          padding: 0.3rem;
          border-radius: 2px;
          width: 3vw;
          text-align: center;
          opacity: 0; 
          transform: translateY(-5px); 
          transition: opacity 0.3s ease, transform 0.3s ease; 
        }

        .box:hover::before {
          opacity: 1; 
          transform: translateY(0); 
        }

          @media screen and  (max-width:600px){
        .upper-wrapper {
          height: auto;
        }
  }
        
        `}</style>
    </>
  )
}