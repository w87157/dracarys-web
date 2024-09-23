import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function ListFilter() {
  const [showNav, setShowNav] = useState(false)
  const [isShow, setIsShow] = useState(true)
  const handleToggle = () => {
    setShowNav(!showNav)
    setIsShow(!isShow)
  }

  return (
    <div className={showNav ? "sideNav active" : "sideNav"} >
      {/* {
        isShow ?
          <i className="bi bi-chevron-right toggle-icon" onClick={handleToggle}></i> :
          <i className="bi bi-chevron-down toggle-icon" onClick={handleToggle}></i>
      } */}
      <div className="icon-container">
        <i className={`bi bi-chevron-right toggle-icon ${isShow ? '' : 'rotated'}`} onClick={handleToggle}></i>
      </div>
      <form className="d-flex flex-column mt-4" method="" action="">
        {/* 類別 */}
        <fieldset className='d-flex flex-column gap-1' >
          <legend >類別</legend>
          {/* test */}
          <div className="radio-container">
            <input className="custom-radio" name="category" id="ai" value="" type="radio" />
            <label htmlFor="ai">AI生成</label>
          </div>
          {/*  */}
          <div className="radio-container">
            <input className="custom-radio" name="category" id="comic" value="" type="radio" />
            <label htmlFor='comic'>2D漫畫</label>
          </div>
          <div className="radio-container">
            <input className="custom-radio" name="category" id="screenshot" value="" type="radio" />
            <label htmlFor='screenshot'>遊戲截圖</label>
          </div>
        </fieldset>
        {/* 排序 */}
        {/* <fieldset>
          <legend>日期排序</legend>
          <div>
            <input className="custom-radio me-1" name="priority" id="far" type="radio" />
            <label htmlFor='far'>遠到近</label>
          </div>
          <div>
            <input className="custom-radio me-1" name="priority" id="near" type="radio" />
            <label htmlFor='near'>近到遠</label>
          </div>
        </fieldset> */}

        {/* 時間區隔 */}
        <fieldset>
          <legend>時間區隔</legend>
          <div >
            <label className="me-1" for="">開始時間
            </label>
            <input type="date" name="startTime" id="startTime" className="form-control" />
          </div>
          <div>
            <label className="me-1" for="">結束時間
            </label>
            <input type="date" name="endTime" id="endTime" className="form-control" />
          </div>
        </fieldset>
        {/* 熱門選項 */}
        <fieldset className='d-flex flex-column gap-1'>
          <legend>熱門選項</legend>
          <div className="radio-container">
            <input className="me-1 custom-radio" name="hit" id="popular" value="" type="radio" />
            <label htmlFor='popular'>受歡迎程度(高-低)</label>
          </div>
          <div className="radio-container">
            <input className="me-1 custom-radio" name="hit" id="download" value="" type="radio" />
            <label htmlFor='download'>下載次數(高-低)</label>
          </div>
          <div className="radio-container">
            <input className="me-1 custom-radio" name="hit" id="view" value="" type="radio" />
            <label htmlFor='view'>觀看次數(高-低)</label>
          </div>
          {/* <div>
            <input className="me-1" name="hit" id="win" value="" type="radio" />
            <label htmlFor='win'>作者得獎次數(高-低)</label>
          </div> */}
        </fieldset>
        {/* 搜尋欄 */}
        {/* <input type="text" className="form-control" name="keyword" placeholder="搜尋字串" style={{ height: "5vh" }} autoComplete="off"></input> */}
        {/* 送出按鈕 */}
        <input type="submit" value="搜尋"></input>
      </form>
      <style jsx>
        {`
          *{
            font-family: "DM Serif Display", "Noto Sans TC", serif;
          }
          .sideNav {
            width: 220px;
            height: 100vh;
            background-color: #160C0C;
            opacity: 0.9;
            position: fixed;
            transition: all 0.9s;
            left: -199px;
            position: fixed;
            box-shadow: 0 0 10px #BBAF74;
            z-index: 2;
            padding: 0 30px 0 20px;
            border-radius: 3px;
          }

          .sideNav.active {
            left: 0;
          }
          .toggle-icon {
            position:absolute;
            top: 5px;
            right: 2px;
            cursor: pointer;
            font-size: 14px;
            transition: transform 0.5s ease;
          }

          legend {
            color:#BBAF74;
            font-family:"Noto Sans TC", sans-serif;
            font-size:14px;
          }

          label {
            font-size:12px;
          }
          fieldset{
            margin-bottom: 30px;
          }

          input {
            background-color: black;
            border: 1px solid #BBAF74;
            color: #BBAF74;
            font-family:"Noto Sans TC", sans-serif;
            font-size:12px;
          }

          form {
            padding-top:20px;
          }

          form input[type=submit]{
            padding: 5px 20px;
            margin-top:20px;
            height: 30px;
          }

          .rotated {
            transform: rotate(90deg);
          }

          .radio-container {
            display: flex;
            align-items: center;
          }

          .custom-radio {
            appearance: none;
            width: 15px;
            height: 15px;
            border: 1.6px solid #BBAF74;
            border-radius: 50%;
            outline: none;
            margin-right: 5px;
            position: relative;
            cursor: pointer;
          }

          .custom-radio:before {
            content: '';
            position: absolute;
            width: 80%;
            height: 80%;
            background-color: #BBAF74;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);

          }

          .custom-radio:checked:before {
            transform: translate(-50%, -50%) scale(1);
          }

          .radio-container label {
            cursor: pointer;
          }

        `}</style>
    </div>
  )
}
