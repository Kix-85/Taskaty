// components/MenuPreview.tsx
import styles from '../styles/MenuPreview.module.css';

export default function MenuPreview() {
  return (
    <div className={styles.preview}>
      <div className={styles.row}>
        <button className={styles.menuItem}>1st menu item</button>
        <button className={styles.tag}>LOW</button>
      </div>
      <div className={styles.row}>
        <span>1st menu item</span>
        <button className={styles.tag}>LOW</button>
      </div>
    </div>
  );
}
