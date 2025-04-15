"use client";
import TextField from "@/components/textField";
// import {SearchField} from "@/components/textField";
import styles from "./page.module.css";
import myLogo from "../../public/assets/imgs/logo.png";
import userAccount from "../../public/assets/imgs/userAccount.png";
import downArrow from "../../public/assets/imgs/downArrow.png";
import googleIcon from "../../public/assets/imgs/googleIcon.png";
import Image from "next/image";
import "./styles/global.css";
import { useState } from "react";
// import DashBoard from "../components/dashBoard";
import Card from "../components/Card/Card";

// Sign In To Your Account

export default function Home() {

  const [isRegistered, setIsRegistered] = useState(false); // State to track registration status
  const handleRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("Register button clicked");
    console.log(isRegistered);
    setIsRegistered((prev) => !prev); // Toggle the registration status
  };
  return (
    <>
      <div className={styles.registerPage}>
        <div className={styles.imageContainer}>
          {/* <Image 
                className="myImage" 
                src={myImage} 
                alt="clear input"
                width={500}     
            /> */}
        </div>
        <header>
          <div className={styles.leftHeaderPart}>
            <div className="logo"><Image 
                    className="myLogo" 
                    src={myLogo} 
                    alt="clear input"
                    width={118.2}     
                />
            </div>
            <ul className={styles.headerList}>
              <li><a href="#">overview</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
          <div className={styles.rightHeaderPart}>
            <div className={styles.userLogo}><Image 
                    className="userAccount" 
                    src={userAccount} 
                    alt="clear input"
                    width={22}
                />
            </div>
            {/* Yousef Ebada */}
            <h4>Account</h4>
            <div className={styles.downArrow}>
              <Image 
                    className="downArrow" 
                    src={downArrow} 
                    alt="clear input"
                    width={22}
                />
            </div>
          </div>
        </header>
        <main>
          <div className={styles.mainContainer}>
            <div className={styles.leftMainPart}>
              <div className={styles.content}>
              <h1>
                {isRegistered ? "Welcome Back" : "Join Over 2568+"}  
                <br></br>  
                <span>{isRegistered ? "Dear Friend" : "Expert Designers"}</span>
              </h1>
                <p>We take pride in offering unparalleled customer support to ensure your experience with our platforms</p>
              </div>
              <div className="card">

              </div>
            </div>
            <div className={styles.rightMainPart}>
            <h2>{isRegistered ? "Sign In To Your Account" : "Register Your Account"}</h2>
              <form>
                {!isRegistered && (
                <div className={styles.labelContainer}>
                  <label className={styles.label}>First Name:
                    <TextField placeholder={"Enter your First Name"}/>
                  </label>
                </div>
                )}
                {!isRegistered && (
                <div className={styles.labelContainer}>
                  <label className={styles.label}>Last Name:
                    <TextField placeholder={"Enter your Last Name"}/>
                  </label>
                </div>
                )}
                <div className={styles.labelContainer}>
                  <label className={styles.label}>Email:
                    <TextField placeholder={"Enter your Email"}/>
                  </label>
                </div>
                
                <div className={styles.labelContainer}>
                  <label className={styles.label}>Password:
                    <TextField placeholder={"Enter your Password"}/>
                  </label>
                </div>
              
                <button className={styles.registerButton}>
                  {isRegistered ? "Login" : "Register"}
                </button>
                <p>{isRegistered ? "You don't have an account - ":"Already Have An Account - "}<button onClick={handleRegister}>{isRegistered ? "Register Here" : "Sign In Here"}</button></p>
                <button className={styles.googleRegisterButton}><Image 
                    className="googleIcon" 
                    src={googleIcon} 
                    alt="clear input"
                    width={20}
                    height={20}
                />SignUp With Google Account
                </button>
              </form>
            </div>
          </div>
        </main>
        {/* <TextField/>
        <SearchField /> */}
      </div>
      {/* <Card type={0} title={"card1"} status={"test"} id={0} subscribes={0} /> */}
    </>
  );
}
