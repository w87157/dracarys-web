import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";
import CircleLoader from 'react-spinners/CircleLoader'
import SelectComponentArt from "@/components/art-gallery/SelectComponent-art";
import Image from "next/image";
import Dropzone from "@/components/art-gallery/Dropzone";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function RegisterDev() {
  const router = useRouter();
  // 下拉選單的選項
  const options = [
    { value: "1", label: "AI生成" },
    { value: "2", label: "2D動漫" },
    { value: "3", label: "遊戲截圖" },
  ];
  // 登入狀態
  const { auth, isAuthReady } = useAuth();
  // const [loading, setLoading] = useState(true); // 新增的狀態來管理加載狀態


  useEffect(() => {
    document.title = '藝術走廊 | Dragonfire & Sorcery';
  }, []);



  // 驗證


  // 未登入跳轉至登入頁
  useEffect(() => {
    setTimeout(() => {
      if (!auth.login && isAuthReady) {
        router.push("/art-gallery");
      }
    }, 1500)
  }, [auth.login, router]);



  // 設定文字及上傳圖片欄位原始值
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    vote_count: 0, //重要!
    artwork_type_id: 1,
    user_account: auth.login || "ileneh889",
  });
  const [artwork, setArtwork] = useState(null);
  // 預覽原始值
  const [previewURL, setPreviewURL] = useState("");

  // formData tester
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // 文字欄位listener and handler
  const handleChange = (e) => {
    if (e.target) {
      // 處理一般的 input 和 textarea
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      // 處理 SelectComponentArt
      setFormData((prevState) => ({
        ...prevState,
        artwork_type_id: e.value,
      }));
    }
  };

  // 圖片上傳欄位的listener and handler
  const handleFileChange = (e) => {
    setArtwork(e.target.files[0]); //抓到上傳的圖片
    console.log(e.target.files[0]);
  };

  // 將上傳圖檔轉化成URL以做預覽
  useEffect(() => {
    console.log(artwork);
    if (artwork) {
      const objectUrl = URL.createObjectURL(artwork);
      setPreviewURL(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [artwork]);

  //表單數據的處理和 API 調用
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (artwork) {
      formDataToSend.append("artwork", artwork);
    }

    const response = await fetch("http://localhost:8080/art-gallery/upload", {
      method: "POST",
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Artwork uploaded successfully:", data);
    return data; // 返回上傳結果
  };

  // 用戶界面邏輯
  const handleFinalSubmit = async () => {
    try {
      await handleSubmit(new Event('submit')); // 使用原有的 handleSubmit 函數
      closeConfirmModal();
      router.push('/art-gallery');
    } catch (error) {
      console.error("Error submitting form:", error);
      // 處理錯誤，例如顯示錯誤消息給用戶
    }
  };

  // DnD樣式設定
  const dndStyle = {
    border: "1.4px dashed #bbaf74",
    borderRadius: "3px",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };


  // confirm Modal start
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openConfirmModal = () => setShowConfirmModal(!showConfirmModal);
  const closeConfirmModal = () => setShowConfirmModal(false);
  // confirm modal end

  // 未登入的畫面顯示
  if (!auth.login && isAuthReady)
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center mt-5"
        style={{ height: "80vh" }}
      >
        <p className="text-primary ">請先登入才能報名喔</p>
        <p className="text-primary mb-3">即刻幫您跳轉回活動首頁</p>
        <CircleLoader color="#BBAF74" loading={true} size={50} />
      </div>
    );

  return (
    <div
      className="container-fluid py-4  pb-5"
      style={{
        backgroundImage: `url('${!!previewURL ? previewURL : "/art-gallery/register.jpg"
          }')`,
      }}
    >
      <div className="container px-md-5 mt-4">
        <div className="row d-flex flex-column">
          {/* 標題 */}
          <div className="col-12 title d-flex flex-column mb-2">
            <h4 className="text-light text-center">報名參加</h4>
            <Image
              src="/art-gallery/line.png"
              alt=""
              width="300"
              height="10"
              style={{ width: "300px", margin: "auto" }}
            />
          </div>
          {!!previewURL ? <div className="display"></div> : <></>}
          <form
            name="form1"
            action="post"
            onSubmit={handleSubmit}
            className="py-3"
          >
            <div className="d-flex flex-column flex-md-row ">
              {/* form string start */}
              <fieldset
                className="col-12 col-md-6 px-3 py-3 order-2 order-md-1 "
                id="border"
              >
                {/* 作品名稱 */}
                <div className="mb-3">
                  <label htmlFor="title" >
                    作品名稱<span>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="(請輸入100字以內)"
                  />

                </div>
                {/* 作品類別 */}
                <div className="mb-3">
                  <label htmlFor="title">
                    作品類別<span>* </span>
                  </label>
                  <div style={{ height: "6vh", fontSize: "1rem", zIndex: "99999" }}>
                    <SelectComponentArt
                      options={options}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* 創作理念 */}
                <div className="mb-3">
                  <label htmlFor="title"  >
                    創作理念
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="desc"
                    name="desc"
                    value={formData.desc}
                    onChange={handleChange}
                    style={{ resize: "none" }}
                    placeholder="(請輸入500字以內)"
                  />
                </div>

                <button type="button" className="btn btn-primary" onClick={openConfirmModal} style={{ width: "100%" }}>
                  現在報名
                  <div className="button__horizontal"></div>
                  <div className="button__vertical"></div>
                </button>
              </fieldset>
              {/* form string end */}
              {/* form file start */}
              <fieldset className="col-12 col-md-6 px-3 py-3 order-1 order-md-2">
                {!!previewURL ? (
                  <div className="wrapper" >
                    <i
                      className="bi bi-x-circle-fill"
                      onClick={() => setPreviewURL("")}
                      style={{ zIndex: "999" }}
                    ></i>
                    <div className="img-wrapper">
                      <Image src={previewURL} alt="upload" className="upload-img" style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} fill />
                    </div>
                  </div>
                ) : (
                  <Dropzone
                    dndStyle={dndStyle}
                    artwork={artwork}
                    setArtwork={setArtwork}
                    previewURL={previewURL}
                  />
                )}
              </fieldset>
              {/* form file end */}
            </div>
          </form>
        </div>
      </div>
      {showConfirmModal && (
        <div
          className="modal modal-lg fade show"
          id="voteConfirmModal"
          tabIndex={-1}
          aria-labelledby="voteConfirmModalLabel"
          aria-hidden="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: "999999" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-3 border-primary rounded-0 p-0">
              <div className="modal-header text-bg-primary border-0 rounded-0">
                <h1
                  className="modal-title fs-5 text-dark"
                  id="voteConfirmModalLabel"
                >
                  上傳預覽
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeConfirmModal}
                />
              </div>
              <div className="modal-body text-bg-dark text-primary">
                <div className="row mt-1">
                  <div className="col-12 m-auto fw-bold">
                    <div className="row">
                      <div className="img-wrapper px-5">
                        <Image src={previewURL} alt="photo" className="col-9 m-auto mb-3 send-preview" style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} fill />
                      </div>
                      <p className="text-primary" style={{ fontSize: "0.9rem" }} >作品名稱：{formData.title}</p>
                      {/* <p className="text-primary" style={{ fontSize: "0.9rem" }} >作品名稱：{formData.desc}</p> */}
                    </div>
                  </div>
                  <div className="col-12 m-auto fw-bold text-center my-2" style={{ fontSize: "0.6rem" }}> 注意！每人一賽季只能報名一次 </div>
                </div>
              </div>
              <div className="modal-footer flex-column text-bg-dark border-0 rounded-0">
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-primary"
                    onClick={handleFinalSubmit}
                    style={{ width: "10rem" }}
                  >
                    確定報名
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                  <button
                    type="button"
                    className="col-8 m-3 btn btn-secondary"
                    onClick={closeConfirmModal}
                    style={{ width: "10rem" }}
                  >
                    放棄重改
                    <div className="button__horizontal"></div>
                    <div className="button__vertical"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
      }
      <style jsx>{`
        .container-fluid {
          background-position: top;
          background-size: cover;
          background-attachment: fixed;
        }

        .img-wrapper {
          position: relative; /* 這是必須的，用於配合 next/image 的 fill 佈局 */
          width: 100%;
          height: 50vh;
          overflow:hidden;
         
        }

        span {
          color: #bbaf74;
          font-size: 0.9rem;
          vertical-align: text-top;
          margin-left: 2px;
          vertical-align: top;
        }

        input {
          background-color: rgba(0, 0, 0, 0.3);
        }

        textarea {
          height: 15vh;
          background-color: rgba(0, 0, 0, 0.3);
        }

        label {
          font-size:0.8rem;
        }

        fieldset {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 65vh;
        }

        fieldset:first-of-type {
          border-right: 1.6px solid #bbaf74;
        }

        .wrapper {
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        form {
          border-radius: 4px;
          background: hsla(0, 0%, 0%, 0.2);
          -webkit-backdrop-filter: blur(1px);
          backdrop-filter: blur(7px);
        }

        input,
        textarea,
        option,
        select {
          border-radius: 4px;
          font-size: 14px;
        }

        textarea {
          margin-top: 5px;
        }
        .upload-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .button1 {
          border: 1px solid #bbaf74;
          color: black;
          background-color: #bbaf74;
          padding: 10px 70px;
          border-radius: 2px;
        }

        .wrapper {
          position: relative;
        }

        .bi-x-circle-fill {
          position: absolute;
          top: 0;
          right: 10px;
          cursor: pointer;
          filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.7));
        }

        .loading {
          height: 100vh;
        }

        .send-preview{
          width: 100%;
          height: 40vh;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
