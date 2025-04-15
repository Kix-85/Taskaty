"use client";

import Card from "@/components/Card/Card";
import style from "./page.module.css"
import Kanban from "@/components/Kanban/Kanban";
// import { DragDropContext, Draggable, DropResult } from "@hello-pangea/dnd";

export default function myTasks() {

  const backLog = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const toDo = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const inProgress = ["Hello Task how were you yesterday", "Hello Task how were you yesterday", "Hello Task how were you yesterday"]
  const makeCards = (array: Array<string>) => {
    return (array.map((text, index) => (<Card type={3} key={index} title={text} status={"low"} id="hi" subscribes={10-index} ></Card>)))
  }
  return (
    <div className={style.screen}>
      <div className={style.board}>
        <div className={style.listGroup}>
            <h3>BackLog {backLog.length}</h3>
          {makeCards(backLog)}
        </div>
        <div className={style.listGroup}>
            <h3>ToDo  {toDo.length}</h3>
          {makeCards(toDo)}
        </div>
        <div className={style.listGroup}>
            <h3>In Progress {inProgress.length}</h3>
          {makeCards(inProgress)}
        </div>
      </div>
      <Kanban></Kanban>
    </div>
  );
}