"use client";

import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { BsPaypal, BsVimeo, BsQuora, BsPinterest, BsFillPlusCircleFill } from "react-icons/bs";



const SideBarProjects = () => {

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
                <h3 className="text-gray-400 text-xl">Projects</h3> <IconButton aria-label="delete" color="default"><BsFillPlusCircleFill color="lightgrey" /></IconButton>
            </div>
            <ToggleButtonGroup
                orientation="vertical"
                value={selectedProject}
                exclusive
                onChange={handleChange}
                sx={{ width: "100%" }}
            >
                <ToggleButton sx={{ width: "100%" }} value="Vimeo" aria-label="Vimeo">
                    <div className="flex flex-row items-center justify-start w-full">
                        <BsVimeo color="yellow" /> <span className="ml-1 text-white">Vimeo</span>
                    </div>

                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Paypal" aria-label="Paypal">
                    <div className="flex flex-row items-center justify-start w-full">
                        <BsPaypal color="blue" /> <span className="ml-1 text-white">Paypal</span>
                    </div>
                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Pinterest" aria-label="Pinterest">
                    <div className="flex flex-row items-center justify-start w-full">
                        <BsPinterest color="red" /> <span className="ml-1 text-white">Pinterest</span>
                    </div>
                </ToggleButton>
                <ToggleButton sx={{ width: "100%" }} value="Quora" aria-label="Quora">
                    <div className="flex flex-row items-center justify-start w-full">
                        <BsQuora color="red" /> <span className="ml-1 text-white">Quora</span>
                    </div>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    )
}

export default SideBarProjects;