import React, { useState } from 'react';
import Image from 'next/image';
import searchIcon from "@/asset/icon/search.svg";
import styles from "./style.module.css";
import Link from 'next/link';

const SearchComponent = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('關鍵字');
  const [keyword, setKeyword] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleSelectSearchType = (type) => {
    setSearchType(type);
    // 清空搜尋值並通知父元件
    if (type === '關鍵字') {
      setKeyword('');
    } else if (type === '價格') {
      setPriceRange({ min: '', max: '' });
    }
    onSearch({ type: null, value: null, reset: true });
  };

  const handleSearch = () => {
    if (searchType === '關鍵字') {
      onSearch({ type: 'name', value: keyword, reset: false });
    } else if (searchType === '價格') {
      // if (priceRange.min && priceRange.max) {
      // onSearch({ type: 'price', value: priceRange, reset: false });
      const minPrice = priceRange.min === '' ? 0 : parseFloat(priceRange.min);
      const maxPrice = priceRange.max === '' ? Infinity : parseFloat(priceRange.max);
      onSearch({ type: 'price', value: { min: minPrice, max: maxPrice }, reset: false });
      // }
    }
  };

  const handleKeywordChange = (e) => {
    const newValue = e.target.value;
    setKeyword(newValue);
    if (newValue === '') {
      onSearch({ type: 'name', value: '', reset: true });
    }
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    // 確保值為數字或空字符串
    const newValue = value === '' ? '' : value;
    setPriceRange(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 防止表單提交
      handleSearch();
    }
  };


  return (
    <>
      <div className={`input-group input-group-sm border ${styles.search_bar}`}>
        <button
          className="btn dropdown-toggle text-primary border-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {searchType}
        </button>
        <ul className="dropdown-menu border py-0 mt-0">
          <li>
            <Link
              className="dropdown-item fs-small"
              href="#"
              onClick={() => handleSelectSearchType('關鍵字')}
            >
              關鍵字
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item fs-small"
              href="#"
              onClick={() => handleSelectSearchType('價格')}
            >
              價格
            </Link>
          </li>
        </ul>

        {searchType === '關鍵字' && (
          <div className="col-sm">
            <input
              type="search"
              className="form-control border-0 text-primary"
              // placeholder="Search..."
              aria-label="Search"
              aria-describedby="button-addon2"
              value={keyword}
              // onChange={(e) => setKeyword(e.target.value)}
              onChange={handleKeywordChange}
              onKeyDown={handleKeyPress}
            />
          </div>
        )}

        {searchType === '價格' && (
          <>
            <div className="col-sm">
              <input
                type="number"
                name='min'
                className="form-control border-0 text-center"
                // placeholder="Min"
                aria-label="Min Price"
                value={priceRange.min}
                // onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                onChange={handlePriceRangeChange}
                onKeyDown={handleKeyPress}
              />
            </div>
            <p className="row px-2 m-0 align-items-center text-center text-primary">～</p>
            <div className="col-sm">
              <input
                type="number"
                name='max'
                className="form-control border-0 text-center"
                // placeholder="Max"
                aria-label="Max Price"
                value={priceRange.max}
                // onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                onChange={handlePriceRangeChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </>
        )}

        <button
          className="btn btn-outline-dark border-0 border-start border-primary d-flex align-items-center"
          type="button"
          id="button-addon2"
          onClick={handleSearch}
        >
          <Image src={searchIcon} alt="Search" />
        </button>
      </div>
    </>
  );
};
export default SearchComponent;
