"use client";
import "./textField.css";
import Image from "next/image";
import { useState } from "react";
import crossIcon from "../../public/textFieldassets/close_circle.png";
import searchIcon from "../../public/textFieldassets/search_normal.png";
type TextFieldProps = {
    placeholder: string;
};

function TextField(props: TextFieldProps){
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }
    
    function handleClear() {
        setInputValue("");
    }
    const [inputValue, setInputValue] = useState("");


    return (
        <div className="crossParent">
            <input 
                onChange={handleChange} 
                type="text" 
                className="textInput" 
                placeholder={props.placeholder} 
                value={inputValue}
            />
            {inputValue && (
                <Image 
                    className="mycross" 
                    src={crossIcon} 
                    alt="clear input"
                    onClick={handleClear}
                    width={20}
                    height={20}
                />
            )}
        </div>
    );
}

export function SearchField() {
    const [inputValue, setInputValue] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    function handleClear() {
        setInputValue("");
    }

    return (
        <div className="crossParent">
            <Image 
                className="searchIcon" 
                src={searchIcon} 
                alt="search icon"
                width={20}
                height={20}
            />
            <input 
                onChange={handleChange} 
                type="text" 
                className="searchInput" 
                placeholder="search"
                value={inputValue}
            />/
            {inputValue && (
                <Image 
                    className="mycross" 
                    src={crossIcon} 
                    alt="clear input"
                    onClick={handleClear}
                    width={20}
                    height={20}
                />
            )}
        </div>
    );
}

export default TextField;