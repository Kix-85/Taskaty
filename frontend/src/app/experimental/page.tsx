"use client";

import Kanban from "@/components/Kanban/Kanban";
import List from "@/components/ListView/List";
import Calendar from "@/components/Calendar/Calendar";
import { TbLayoutKanban } from "react-icons/tb";
import { HiOutlineQueueList } from "react-icons/hi2";
import { FaCalendarDays } from "react-icons/fa6";
import style from "./page.module.css"

import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export default function MyTasks() {

  const [selectedView, setSelectedView] = useState('Calendar');
  const handleTabChange = (event: React.MouseEvent<HTMLElement>, view: string) => {
    setSelectedView(view);
  };

  return (
    <div className={style.myTask}>
      <div className="w-full flex items-center justify-center">
        <ToggleButtonGroup
          color="primary"
          value={selectedView}
          exclusive
          onChange={handleTabChange}
          aria-label="view"
        >
          <ToggleButton value="Kanban"><TbLayoutKanban color="white" /></ToggleButton>
          <ToggleButton value="List"><HiOutlineQueueList color="white" /></ToggleButton>
          <ToggleButton value="Calendar"><FaCalendarDays color="white" /></ToggleButton>
        </ToggleButtonGroup>
      </div>

      {selectedView === 'Kanban' && (
        <div className="w-full">
          <Kanban></Kanban>
        </div>
      )}

      {selectedView === 'List' && (
        <div className="w-full">
          <List></List>
        </div>
      )}

      {selectedView === 'Calendar' && (
        <div className="w-full">
          <Calendar></Calendar>
        </div>
      )}

    </div>
  );
}