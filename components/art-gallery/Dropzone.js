import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Dropzone({ previewURL, dndStyle, setArtwork }) {
  // 上傳檔案抓取
  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles)
    // 預覽功能 [!]使用()包住{}→要讓js知道這是一個obj not a function from an arrow function
    if (acceptedFiles && acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setArtwork(uploadedFile)
    }
  }, [])

  // 開啟相關functions
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <>
      <div {...getRootProps({
        style: dndStyle,
      })}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>把作品拖曳到此 ...</p> :
            <div style={{ display: "grid", placeItems: "center" }}>
              <i className="bi bi-cloud-arrow-up" style={{ fontSize: "50px" }}></i>
              <p>請拖曳您的作品到此區等待上傳 </p>
              <p className='my-1'>或</p>
              <p>點擊以選擇上傳作品</p>
            </div>
        }
      </div>
      <style jsx>{`
        p{
          font-size: 14px;
        }
        .upload-img {
          width: 80%;
          height: 60%;
          object-fit: contain;
          margin-top:4vh;
        }
      `}</style>

    </>
  )
}

