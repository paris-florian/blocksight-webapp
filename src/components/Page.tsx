import { Header } from "./Header";
import styles from "./Page.module.css";

export const Page = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.page}>
        <Header />
        <div className={styles.pageContent}>
            {children}
        </div>
    </div>
}