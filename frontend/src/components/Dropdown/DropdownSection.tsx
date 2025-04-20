import styles from '../styles/DropdownSection.module.css';
import Dropdown from './Dropdown';

export default function DropdownSection() {
  const sampleOptions = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dropdown & Select <span>Standard</span></h2>
      <div className={styles.states}>
        <div>
          <h4>Standard</h4>
          <Dropdown label="Select data" options={sampleOptions} />
        </div>
        <div>
          <h4>Active</h4>
          <Dropdown label="Select data" options={sampleOptions} />
        </div>
        <div>
          <h4>Filled</h4>
          <Dropdown label="Select data" options={sampleOptions} filled />
        </div>
      </div>
    </div>
  );
}
