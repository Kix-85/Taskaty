"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { } from "react-icons/bs";
import { PiHouseSimple } from "react-icons/pi";
import { FaTasks } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { TbMessageDots } from "react-icons/tb";
import { RiSettingsLine } from "react-icons/ri";




const SideBarMain = () => {

    // const initialData = {
    //     vimeo: [{ id: "1", content: "Task 1", status: "low" }, { id: "2", content: "Task 2", status: "high" }],
    //     payPal: [{ id: "3", content: "Task 3", status: "low" }],
    //     quora: [{ id: "5", content: "task 5", status: "low" }, { id: "6", content: "task 6", status: "high" }],
    //     pinterest: [{ id: "4", content: "Task 4", status: "medium" }],
    // };

    const [selectedProject, setSelectedProject] = useState("")
    const handleChange = (event: React.MouseEvent<HTMLElement>, project: string) => {
        setSelectedProject(project);
    };
    return (
        <div className=" p-3 flex gap-0.5 flex-col">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-gray-400 text-xl">Main</h3>
            </div>
            <ToggleButtonGroup
                orientation="vertical"
                value={selectedProject}
                exclusive
                onChange={handleChange}
                sx={{ width: "100%" }}
            >
                <ToggleButton sx={{ width: "100%" }} value="Home" aria-label="Home">
                    <div className="flex flex-row items-center justify-start w-full">
                        <PiHouseSimple color="lightgrey" size={24}/>
                        <span className="ml-1 text-white">Home</span>
                    </div>

                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="myTasks" aria-label="myTasks">
                    <div className="flex flex-row items-center justify-start w-full">
                        <FaTasks color="lightgrey" size={20}/>
                        <span className="ml-1 text-white">My Tasks</span>
                    </div>
                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Projects" aria-label="Projects">
                    <div className="flex flex-row items-center justify-start w-full">
                        <GrProjects color="lightgrey" size={20}/>
                        <span className="ml-1 text-white">Projects</span>
                    </div>
                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Message" aria-label="Message">
                    <div className="flex flex-row items-center justify-start w-full">
                        <TbMessageDots color="lightgrey" size={24}/>
                        <span className="ml-1 text-white">Message</span>
                    </div>
                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Settings" aria-label="Settings">
                    <div className="flex flex-row items-center justify-start w-full">
                        <RiSettingsLine color="lightgrey" size={24}/>
                        <span className="ml-1 text-white">Settings</span>
                    </div>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default SideBarMain;