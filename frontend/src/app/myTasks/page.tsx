"use client";

import Card from "@/components/Card/Card";
import style from "./page.module.css"
export default function Home() {

  const backLog = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const toDo = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const inProgress = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const makeCards = (array: Array<string>) => {
    return (array.map((text, index) => (<Card type={3} key={index} title={text} status={"low"} id={index} subscribes={2}></Card>)))
  }
  return (
    <div className="">
      {/*leave it empty
        use it only for trial
        dont push anything in here
        ok?!!!!!!!!
        Read fools
    */}
      <div className={style.board}>
        <div className="listGroup">
          {makeCards(backLog)}
        </div>
        <div className={style.listGroup}>
          {makeCards(toDo)}
        </div>
        <div className={style.listGroup}>
          {makeCards(inProgress)}
        </div>
      </div>
    </div>
  );
}