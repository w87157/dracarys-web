import React, { useState } from 'react';
import Image from 'next/image';
import searchIcon from "@/asset/icon/search.svg";
import styles from '@/components/search-component/style.module.css'


const ContentSearch = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('關鍵字'); // 初始值為關鍵字
  const [keyword, setKeyword] = useState('');

  const handleSelectSearchType = (type) => {
    setSearchType(type);
  };

  const handleSearch = () => {
    if (searchType === '關鍵字') {
      onSearch({ type: 'article_title', value: keyword });
    }
  };

  return (
    <div className={`d-flex justify-content-center input-group input-group-sm ps-0 px-0 ${styles.search_bar}`} >
      <div className="btn text-primary border d-flex align-items-center" >
        {searchType}
      </div>

      {/* 關鍵字搜尋模組 */}
      {searchType === '關鍵字' && (
        <div className="col-sm " >
          <input
            type="search"
            className="form-control border text-primary"
            placeholder="Search......"
            aria-label="Search"
            aria-describedby="button-addon2"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          // onKeyPress={handleKeyPress}
          />
        </div>
      )}


      <button
        className="btn btn-outline-dark border d-flex align-items-center"
        type="button"
        id="button-addon2"
        onClick={handleSearch}
      >
        <Image src={searchIcon} alt="Search" />
      </button>

    </div>
  );
};

export default ContentSearch;
