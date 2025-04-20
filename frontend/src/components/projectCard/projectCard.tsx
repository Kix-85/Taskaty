"use client";
import { HiDotsHorizontal } from "react-icons/hi";
import Image from "next/image";
import projectCI from "../../../public/assets/imgs/projectCI.png";
import styles from "./projectCard.module.css";

type ProjectCardProps = {
  project: string;
};

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="flex items-center justify-between w-[90%] h-[60px] p-[6px] bg-[#121638] m-[8px] rounded-[10px]"
    >
      {/* Left Section: Icon/Image */}
      <div className="flex items-center space-x-4">
        <Image
          src={projectCI}
          alt="Project Icon"
          className="w-[40px] h-[40px] rounded-[10px]"
        />
        <div>
          <p className="text-white font-bold">{project}</p>
          <p className="text-[#95accb]">7 Tasks</p>
        </div>
      </div>

      {/* Right Section: Dots Horizontal Icon */}
      <HiDotsHorizontal className="text-gray-400 cursor-pointer" />
    </div>
  );
}

export default ProjectCard;