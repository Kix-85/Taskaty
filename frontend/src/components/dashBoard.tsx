import profileIcon from "../../public/assets/imgs/profileIcon.png"
import homeIcon from "../../public/assets/imgs/homeIcon.png";
import tasksIcon from "../../public/assets/imgs/tasksIcon.png";
import projectsIcon from "../../public/assets/imgs/projectsIcon.png";
import messageIcon from "../../public/assets/imgs/messageIcon.png";
import settingsIcon from "../../public/assets/imgs/settingsIcon.png";
import add from "../../public/assets/imgs/add.png";
import sleekPay from "../../public/assets/imgs/sleekPay.png";
import paypal from "../../public/assets/imgs/paypal.png";
import dribblePosts from "../../public/assets/imgs/dribblePosts.png";
import youtube from "../../public/assets/imgs/youtube.png";
import starStick from "../../public/assets/imgs/starStick.png";
import Image from "next/image";
import styles from "./DashBoard.module.css";
import "../app/styles/global.css";



function DashBoard() {
    return (
        <div className="home">
            <div className={styles.dashboard}>
                <div className={styles.title}>
                    <Image 
                        className={styles.profileIcon} 
                        src={profileIcon} 
                        alt="profile icon"
                        width={60}
                        height={60}
                    />
                    <div className={styles.content}>
                        <h3>Yousef Ebada</h3>
                        <p>Frontend Developer</p>
                    </div>
                </div>
                <span></span>
                <nav>
                    <p className={styles.mm}>MAIN</p>
                    <ul className={styles.navList}>
                        <div></div>
                        <div className={styles.navElementContainer} style={{display: "flex", alignItems: "center"}}> 
                            <Image 
                                className={styles.dashIcon}
                                src={homeIcon}
                                alt="Dashboard Icon"
                                height={40}
                                width={40}
                            /><li><a href="#">Home</a></li>
                        </div>
                        <div className={styles.navElementContainer} style={{display: "flex", alignItems: "center"}}> 
                            <Image 
                                className={styles.dashIcon}
                                src={tasksIcon}
                                alt="Dashboard Icon"
                                height={40}
                                width={40}
                            /><li><a href="#">My Tasks</a></li>
                        </div>
                        <div className={styles.navElementContainer} style={{display: "flex", alignItems: "center"}}>
                            <Image 
                                className={styles.dashIcon}
                                src={projectsIcon}
                                alt="Dashboard Icon"
                                height={40}
                                width={40}
                                style={{display: "inline"}}
                            /><li><a href="#">Projects</a></li>                            
                        </div>
                        <div className={styles.navElementContainer} style={{display: "flex", alignItems: "center"}}>
                            <Image 
                                className={styles.dashIcon}
                                src={messageIcon}
                                alt="Dashboard Icon"
                                height={40}
                                width={40}
                            /><li><a href="#">Message</a></li>
                        </div>
                        <div className={styles.navElementContainer} style={{display: "flex", alignItems: "center"}}>
                            <Image 
                                className={styles.dashIcon}
                                src={settingsIcon}
                                alt="Dashboard Icon"
                                height={40}
                                width={40}
                            /><li><a href="#">Settings</a></li>
                        </div>
                    </ul>
                </nav>
                <div className={styles.projects}>
                    <div className={styles.projectsHead}>
                        <p>Projects</p>
                        <Image 
                            className={styles.addIcon}
                            src={add}
                            alt="Add Icon"
                            height={20}
                            width={20}
                        />
                    </div>
                    <div className={styles.projectsElementContainer} style={{display: "flex", alignItems: "center"}}>
                        <Image 
                            className={styles.payIcon}
                            src={sleekPay}
                            alt="Dashboard Icon"
                            height={38}
                            width={38}
                        />
                        <h3>Sleekpay App</h3>
                    </div>
                    <div className={styles.projectsElementContainer} style={{display: "flex", alignItems: "center"}}>
                        <Image 
                            className={styles.payIcon}
                            src={paypal}
                            alt="Dashboard Icon"
                            height={38}
                            width={38}
                        />
                        <h3>PayPal App</h3>
                    </div>
                    <div className={styles.projectsElementContainer} style={{display: "flex", alignItems: "center"}}>
                        <Image 
                            className={styles.payIcon}
                            src={dribblePosts}
                            alt="Dashboard Icon"
                            height={38}
                            width={38}
                        />
                        <h3>Dribble Posts</h3>
                    </div>
                    <div className={styles.projectsElementContainer} style={{display: "flex", alignItems: "center"}}>
                        <Image 
                            className={styles.payIcon}
                            src={youtube}
                            alt="Dashboard Icon"
                            height={38}
                            width={38}
                        />
                        <h3>Youtube</h3>
                    </div>
                    <div className={styles.card}>
                        <h3>Let's start!</h3>
                        <p>Creating or adding new tasks couldn't be easier</p>
                        <button className={styles.button}><Image 
                            className={styles.starStick}
                            src={starStick}
                            alt="Dashboard Icon"
                            height={20}
                            width={20}
                        />Improvements</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DashBoard;





