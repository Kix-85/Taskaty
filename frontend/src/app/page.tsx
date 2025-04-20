"use client";

import "./globals.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHeart, faCircleXmark } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import {SearchField} from "@/components/textField/textField"
import TextField from "@/components/textField/textField";
import HomePage from "@/components/homepage/home"
import ProjectCard from "@/components/projectCard/projectCard"

export default function Home() {
  return (
    <>
      <HomePage/>
    </>
  );
}
