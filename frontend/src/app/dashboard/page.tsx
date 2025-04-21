"use client";
import DashBoard from "../../components/dashBoard";
import Image from "next/image";
import homeIcon from "@assets/imgs/homeIcon.png";
import styles from "./page.module.css";
import addTask from "../../../public/assets/imgs/addTask.png";
import {SearchField} from "../../components/textFieldalt";
import TotalThing from "../../components/total/totalThing";


export default function Home() {
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
            <div className={styles.mmContainer}>
                <TotalThing title="Total Tasks" count={2} rate={-7}/>
                <TotalThing title="Completed Tasks" count={1} rate={5}/>
                <TotalThing title="Pending Tasks" count={1} rate={-2}/>
                <TotalThing title="Overdue Tasks" count={14} rate={12}/>
                <TotalThing title="In Progress Tasks" count={2} rate={3}/>
            </div>
        </main>
        </span>
    );
}
