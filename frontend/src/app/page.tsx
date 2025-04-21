"use client";

import SideBar from "@/components/SideBar/SideBar";
import "./globals.css"
import { BsFillPlusCircleFill } from "react-icons/bs";
import Panel from "@/components/Panel/Panel";
// import HomePage from "@/components/homepage/home"

export default function Home() {
  return (
    <div className="bg-black p-3 h-screen flex">
    <SideBar/>
    <Panel title={"Hello"} Icon={BsFillPlusCircleFill}/>
      {/* <HomePage/> */}
    </div>
  );
}
