// components/Dropdown.tsx
'use client';
import { useState } from 'react';
import styles from '../styles/Dropdown.module.css';

interface DropdownProps {
  label: string;
  options: string[];
  filled?: boolean;
}

export default function Dropdown({ label, options, filled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(filled ? options[0] : '');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button className={styles.toggle} onClick={toggleDropdown}>
        {selected || label}
        <span className={styles.arrow}>▾</span>
      </button>
      {isOpen && (
        <ul className={styles.menu}>
          {options.map((opt, i) => (
            <li key={i} onClick={() => handleSelect(opt)} className={styles.item}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
