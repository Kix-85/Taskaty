import Badge from "../Badge/Badge";
import styles from "./Card.module.css";

type CardProps = {
    type: number;
    title: string;
    status: 'low' | 'medium' | 'high';
    id: number;
    subscribes: number;
}

export default function Card({type, title, status, id, subscribes}: CardProps) {
    const date = new Date();
    console.log(type)
    console.log(subscribes)
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", 
      day: "2-digit", 
    }); 

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.inline}>
                <Badge status={status}/>
                <div className={styles.id}>#{id}</div>
            </div>
            <div className={styles.space}>
                <div className={styles.id}>{subscribes}</div>
                <p className={styles.date}>{formattedDate}</p>
            </div>
        </div>
    );
}
