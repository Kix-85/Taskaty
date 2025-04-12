"use client";
import styles from "./Card.module.css";
import { useState } from "react";

type CardProps = {
    type: number;
    title: string;
    status: string;
    id: number;
    subscribes: number;
}

export default function Card({type, title, status, id, subscribes}: CardProps) {
    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", 
      day: "2-digit", 
    }).toUpperCase(); 

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <button className={styles.cardButton}>{status}</button>
            <button className={styles.cardButton}>{id}</button>
            <button className={styles.cardButton}>{subscribes}</button>
            <p className={styles.date}>{formattedDate}</p>
        </div>
    );
}
