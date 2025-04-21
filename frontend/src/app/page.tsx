"use client";

import SideBar from "@/components/SideBar/SideBar";
import "./globals.css"
<<<<<<< HEAD
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHeart, faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
// import {SearchField} from "@/components/textField/textField"
// import TextField from "@/components/textField/textField";
=======
>>>>>>> fbd7e5d3a69b8ddf1405324362846369642f2365
import HomePage from "@/components/homepage/home"

export default function Home() {
  return (
    <div className="bg-black p-3 h-screen flex">
    <SideBar/>
    <Panel title={"Hello"} Icon={BsFillPlusCircleFill}/>
      {/* <HomePage/> */}
    </div>
  );
}
