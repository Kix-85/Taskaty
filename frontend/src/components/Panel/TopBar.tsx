import { IconType } from "react-icons";
import React from "react";
import { Button } from "@mui/material";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { RiSearchLine } from "react-icons/ri";

interface TopBarProps{
    title:string,
    Icon:IconType
}

const SearchInput=()=>{
    return(
        <div className="flex items-center border-b-blue-100 w-60 bg-[rgba(58,81,255,0.2)] rounded-2xl p-2">
            <RiSearchLine size={25} color="lightcyan"/>
        <input type="search" name="" id="" placeholder="search.." className="h-full w-full border-0 ml-1 text-xl focus:border-none focus:outline-none text-cyan-50" />

        </div>
    )
}

const TopBar:React.FC<TopBarProps>= ({title,Icon})=>{
    return(
        <div className="h-1/12 w-full items-center p-3 flex justify-between mx-4">
            <div className="flex items-center text-2xl">
                <Icon color="white"/>
                <h2 className="ml-1 text-white">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
                <SearchInput />
                <Button startIcon={<BsFillPlusCircleFill size={20} color="white" />}variant="contained" sx={{borderRadius:"10px",padding:"10px",paddingLeft:"20px",paddingRight:"20px",display:"flex"}}>New Task</Button>
            </div>
        </div>
    )
}
export default TopBar;