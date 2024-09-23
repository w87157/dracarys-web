// CustomSelect.js
import React, { useState } from 'react';
import selectStyles from '@/styles/Select.module.css';

const CustomSelect = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={selectStyles.customSelect} onClick={toggleOptions}>
      <div className={selectStyles.selectedOption}>
        {selectedOption.label}
      </div>
      {isOpen && (
        <div className={selectStyles.options}>
          {options.map((option) => (
            <div
              key={option.value}
              className={selectStyles.option}
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;