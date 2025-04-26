// "use client";
// import Image from "next/image";
// import homeIcon from "@assets/imgs/homeIcon.png";
// import styles from "./page.module.css";
// // import addTask from "../../../public/assets/imgs/addTask.png";
// // import {SearchField} from "../../components/textField";
// import TotalThing from "../../components/total/totalThing";
// import { SearchField } from "@/components/textFieldalt/yousefTextField";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";


// export default function Home() {
//     return (
//         <span className={styles.home}>
        
//             <main className={styles.main}>
//                 <header>
//                     <div className={styles.leftHeaderPart}>
//                         <FontAwesomeIcon icon="home" />
//                         <h2>Dashboard</h2>
//                     </div>
//                     <div className={styles.rightHeaderPart}>
//                         <FontAwesomeIcon icon={faPlus} />
//                     </div>
//                 </header>
//                 <div className={styles.mmContainer}>
//                     <TotalThing title="Total Tasks" count={2} rate={-7}/>
//                     <TotalThing title="Completed Tasks" count={1} rate={5}/>
//                     <TotalThing title="Pending Tasks" count={1} rate={-2}/>
//                     <TotalThing title="Overdue Tasks" count={14} rate={12}/>
//                     <TotalThing title="In Progress Tasks" count={2} rate={3}/>
//                 </div>
//             </main>
//         </span>
//     );
// }



"use client";
// import DashBoard from "../../components/dashBoard";
import Image from "next/image";
// import homeIcon from "@assets/imgs/homeIcon.png";
import styles from "./page.module.css";
// import addTask from "../../../public/assets/imgs/addTask.png";
import { SearchField } from "../../components/textFieldalt/yousefTextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faHouse } from "@fortawesome/free-solid-svg-icons";
import TotalThing from "../../components/total/totalThing";
import HomePage from "@/components/homepage/home";
import "../../app/globals.css";
import Sidebar from "@/components/SideBar/SideBar";

export default function Home() {
  return (
    <span className={`${styles.myHome} h-full lg:overflow-y-hidden`}>
      {/* <Sidebar /> */}
      {/* <DashBoard /> */}
      <main className="bg-[#0e0d16] w-full lg:overflow-y-hidden">
        {/* Header
        <header className="flex justify-between items-center px-10 py-5 bg-[#0e0d16]">
          Left Header Part */}
          {/* <div className="flex items-center space-x-2 ml-4">
            <FontAwesomeIcon icon={faHouse} className="text-[#fff] text-[25px]" />
            <h2 className="text-white text-[25px]">Dashboard</h2>
          </div> */}

          {/* Right Header Part
          <div className="flex items-center space-x-4 mr-4">
            <SearchField placeholder="Search" />
            <button className="bg-[#1d39c4] px-6 py-3 rounded-[12px] text-white text-[14px] flex items-center justify-center space-x-2 cursor-pointer">
              <FontAwesomeIcon icon={faPlus} className="text-[20px]" />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {/* MM Container */}
        <div className={`${styles.mmContainer}`}>
          <TotalThing title="Total Tasks" count={2} rate={-7} />
          <TotalThing title="Completed Tasks" count={1} rate={5} />
          <TotalThing title="Pending Tasks" count={1} rate={-2} />
          <TotalThing title="Overdue Tasks" count={14} rate={12} />
          <TotalThing title="In Progress Tasks" count={2} rate={3} />
        </div>

        {/* Home Main Container */}
        <div className="homeMainContainer">
          <HomePage />
        </div>
      </main>
    </span>
  );
}