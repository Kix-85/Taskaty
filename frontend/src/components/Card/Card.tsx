"use client";
import { useState, useEffect } from "react";
import Badge from "../Badge/Badge";
import styles from "./Card.module.css";
import Image from "next/image";

type CardProps = {
    type: number;
    title: string;
    status: "low" | "medium" | "high" | string;
    id: string;
    subscribes: number;
}

export default function Card({type, title, status, id, subscribes}: CardProps) {
    // Put the date logic with useEffect to prevent hydration mismatch error
    const [date, setDate] = useState('');
    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toLocaleString("en-US", {
            month: "short", 
            day: "2-digit", 
        }); 
        setDate(formattedDate);
    }, [])

    // For Client side rendering
    if (!date) return null;

    return (
        <>
            {/* Each conditional block must return only one JSX element */}
            {/* first type */}
            {type === 1 && (
                <div className={styles.card}>

                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.inline}>
                        <Badge status={status} />
                        <div className={styles.id}>#{id}</div>
                    </div>
                    <div className={styles.space}>
                        <div className={styles.id}>{subscribes}</div>
                        <p className={styles.date}>{date}</p>
                    </div>
                </div>
            )}

            {/* second type */}
            {type === 2 && (
                <div className={`${styles.card} ${styles.card2}`}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.space}>
                        <div className={styles.id}>{subscribes}</div>
                        <div className={styles.id}>#{id}</div>
                    </div>
                </div>
            )}

            {/* third type */}
            {type === 3 && (
                <div className={styles.card3}>
                    <div className={styles.content}>
                        <Image 
                            className={styles.image}
                            src="/assets/imgs/dragHandle.png"
                            width={10}
                            height={10}
                            alt="drag handle icon"
                        />
                        <div className={styles.title}>{title}</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.id}>{subscribes}</div>
                        |
                        <p className={styles.date}>{date}</p>
                        |
                        <div className={styles.id}>#{id}</div>
                        |
                        <Badge status={status} />
                    </div>
                </div>
            )}

        </>
    );
}
