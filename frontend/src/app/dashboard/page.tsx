"use client";
import DashBoard from "../../components/dashBoard";
import Image from "next/image";
import homeIcon from "../../../public/assets/imgs/homeIcon.png";
import styles from "./page.module.css";
import addTask from "../../../public/assets/imgs/addTask.png";
import {SearchField} from "../../components/textField";
import "../styles/global.css";

function Home() {
    return (
        <span className={styles.home}>
        <DashBoard />
        <main className={styles.main}>
            <header>
                <div className={styles.leftHeaderPart}>
                    <Image src={homeIcon} alt="homeIcon" className={styles.dashHomeIcon}/>
                    <h2>Dashboard</h2>
                </div>
                <div className={styles.rightHeaderPart}>
                    <SearchField/>
                    <button><Image src={addTask} alt="addTask" className={styles.addTaskIcon} width={17}/>New Task</button>
                </div>
            </header>
        </main>
        </span>
    );
}

export default Home;