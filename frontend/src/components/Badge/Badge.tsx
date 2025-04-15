import styles from './Badge.module.css';

type Badgeprops = {
    status: 'low' | 'medium' | 'high' | string;
}

const Badge: React.FC<Badgeprops> = ({status}) => {
    return (
        <div className={`${styles.div} ${styles[status]}`}>{status}</div>
    )
}

export default Badge;