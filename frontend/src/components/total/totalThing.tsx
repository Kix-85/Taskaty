import styles from "./totalThing.module.css";
import Image from "next/image";
import arrowUp from "../../../public/assets/imgs/Up.png";
import arrowDown from "../../../public/assets/imgs/down.png";


type TotalThingProps = {
   title: string;
   count: number;
   rate: number;
};

function TotalThing(props: TotalThingProps) {
  const { title, count, rate} = props;
  return (
    <div className={styles.total_thing}>
      <div className={styles.titleContainer}>
        <h4 className={styles.title}>{title}</h4>
        {
            rate >= 0 ? (
              <div className={styles.rateStatus}>
                <p className={styles.positive}>
                <Image 
                    src={arrowUp}
                    alt="arrowUp"
                />
                +<span>{rate}</span>
                </p>
              </div>
            ) : (
              <div className={styles.rateStatus}>
                <p className={styles.negative}>
                <Image 
                    src={arrowDown}
                    alt="arrowDown"
                />
                -<span>{Math.abs(rate)}</span>
                </p>

              </div>
            )
        }
      </div>
      <h2 className={styles.count}>{String(count).padStart(2, '0')}</h2>
    </div>
  );
}






export default TotalThing;






