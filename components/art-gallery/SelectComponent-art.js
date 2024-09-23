
import React, { useState } from 'react';

const SelectComponentArt = ({ options, onChange, disabled = false }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);


  const handleSelectOption = (option) => {
    if (!disabled) {
      setSelectedOption(option);  //存入狀態
      onChange(option); //傳所選選項給父層
      setIsOpen(false);
    }
  };

  const toggleOptions = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`customSelect ${disabled ? 'disabled' : ''}`} onClick={toggleOptions}>
      <div className="selectedOption">
        {selectedOption.label}
      </div>
      {
        isOpen && !disabled && (
          <div className="options">
            {options.map((option) => (
              <div
                key={option.value}
                className="option"
                onClick={() => handleSelectOption(option)}  //依照我設定的options產生option {}
              >
                {option.label}
              </div>
            ))}
          </div>
        )
      }
      <style jsx>{`
      /* 自定義樣式 select 選單 */
      .customSelect {
        position: relative;
        width: 100%;
        height: 100%;
        border: #BBAF74 1px solid;
        background: hsla(0, 20%, 0%, .25);
        -webkit-backdrop-filter: blur(5px);    
        backdrop-filter: blur(5px);
        padding: 15px 15px;
        color: #BBAF74;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-radius: 3px;
      }
      .customSelect.disabled {
        cursor: default;
        opacity: 0.7;
      }
      .customSelect::before {
        content: "〉";
        position: absolute;
        width: 15px;
        height: 15px;
        z-index: 20;
        right: 10px;
        text-decoration: none;
        margin-bottom: 8px;
      }
      .customSelect.disabled::before {
        display: none;
      }
      .selectedOption {
        color: #BBAF74;
      }
      .options {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        border: #BBAF74 1px solid;
        background: hsla(80, 20%, 0%, .35);
        -webkit-backdrop-filter: blur(5px);    
        backdrop-filter: blur(5px);
        z-index: 10;
        text-shadow: 0 0 10px black;
      }
      .option {
        padding: 10px 10px 10px 25px;
      }
      .option:hover {
        background-color: #BBAF74;
        color: white;
      }
    `}</style>
    </div>
  );
};

export default SelectComponentArt;