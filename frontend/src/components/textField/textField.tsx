"use client";
import "../../app/globals.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./textField.module.css";
import React, { useState } from "react";

type TextFieldProps = {
  placeholder: string;
};

function TextField({ placeholder }: TextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <div className={styles.textField}>
      {inputValue !== "" && (
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={clearInput}
          className="w-[20px] text-[#95accb] absolute top-1/2 right-[5px] -translate-y-1/2 cursor-pointer z-10"
          aria-label="Clear input"
        />
      )}
      <input
        value={inputValue}
        onChange={handleInputChange}
        className="bg-[#050925] w-[320px] p-[18px] pr-[28px] h-[48px] outline-[#85a5ff] border-0 text-gray-50 rounded-[12px]"
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

function SearchField({ placeholder }: TextFieldProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <div className={styles.searchField}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="w-[20px] text-[#95accb] absolute top-1/2 left-[5px] -translate-y-1/2 cursor-pointer z-10"
        aria-label="Search"
      />
      <input
        value={inputValue}
        onChange={handleInputChange}
        className="bg-[#050925] w-[320px] p-[18px] pl-[36px] pr-[28px] h-[48px] outline-[#85a5ff] border-0 text-gray-50 rounded-[12px]"
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {inputValue !== "" && (
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={clearInput}
          className="w-[20px] text-[#95accb] absolute top-1/2 right-[5px] -translate-y-1/2 cursor-pointer z-10"
          aria-label="Clear input"
        />
      )}
    </div>
  );
}

export default TextField;
export { SearchField };