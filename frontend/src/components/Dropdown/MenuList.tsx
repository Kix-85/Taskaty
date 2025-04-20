// components/MenuList.tsx
import styles from '../styles/MenuList.module.css';

export default function MenuList() {
  return (
    <div className={styles.menuBox}>
      <div className={styles.itemRow}>
        <button className={styles.menuBtn}>1st menu item</button>
        <button className={styles.tag}>LOW</button>
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div className={styles.itemRow} key={i}>
          <span>{i + 2}st menu item</span>
          <button className={styles.tag}>LOW</button>
        </div>
      ))}
    </div>
  );
}
