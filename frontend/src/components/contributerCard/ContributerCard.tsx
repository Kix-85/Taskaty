"use client";
import { HiDotsHorizontal } from "react-icons/hi";
import Image from "next/image";
import contributer from "../../../public/assets/imgs/contributer.png";
import styles from "./projectCard.module.css";

type ProjectCardProps = {
  conName: string;
  conEmail: string;
};

function ProjectCard( { conName, conEmail }: ProjectCardProps) {
  return (
    <div
      className="flex items-center justify-between w-[90%] h-[60px] p-[6px] bg-[#121638] m-[8px] rounded-[10px]"
    >
      {/* Left Section: Icon/Image */}
      <div className="flex items-center space-x-4">
        <Image
          src={contributer}
          alt="Project Icon"
          className="w-[40px] h-[40px] rounded-[10px]"
        />
        <div>
          <p className="text-white font-bold">{conName}</p>
          <p className="text-[#95accb]">{conEmail}</p>
        </div>
      </div>

      <HiDotsHorizontal className="text-gray-400 cursor-pointer" />
    </div>
  );
}

export default ProjectCard;