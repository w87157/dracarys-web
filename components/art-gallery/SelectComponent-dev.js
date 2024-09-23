// CustomSelect.js
import React, { useState } from 'react';
import selectStyles from '@/styles/Select.module.css';

const CustomSelectDev = ({ handleChange, options }) => {

  return (
    <select name="artwork_type_id" className={`${selectStyles.customSelect}`} onChange={handleChange}>
      {
        options.map((option, i) => (
          <option
            key={option.value}
            hidden={i === 0} //index===0禁用
            value={option.value}
          >
            {option.label}
          </option>
        ))
      }
      <style jsx>{`
      select {
        height: 7vh;
        padding: 5px;
        border-radius: 2px;
      }
      select,option {
        background-color: #bbaf74;
        font-size:14px;
        color: black; 
      }

      select option {
        background-color: #bbaf74;
        color: black; 
        font-family: "DM Serif Display", "Noto Sans TC", serif;
        border-radius: 2px;
      }
      select.decorated option:hover {
        box-shadow: 0 0 10px 100px #1882A8 inset;
      }

    `}</style>
    </select>
  );
};

export default CustomSelectDev;
